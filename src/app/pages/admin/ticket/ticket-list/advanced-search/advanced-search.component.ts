import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  TICKET_SERVICE,
  TICKET_STATUS,
} from '@shared/constants/ticket.constant';
import { Building } from '@shared/models/building.model';
import { Floor } from '@shared/models/floor.model';
import { SearchTicket } from '@shared/models/request/ticket-search-request.model';
import { User } from '@shared/models/user.model';
import { AccountService } from '@shared/services/account.service';
import { BuildingService } from '@shared/services/building.service';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  TICKET_STATUS = TICKET_STATUS;
  TICKET_SERVICE = TICKET_SERVICE;
  buildings: Building[] = [];
  building: Building = {};
  floors: Floor[] = [] || null;
  startAt = new Date();
  searchRequest: SearchTicket = {};
  customers: User[] = [];
  userAutoSearch: User = {};
  @ViewChild('startDatePicker') startDatePicker!: NzDatePickerComponent;
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private accountService: AccountService,
    private buildingService: BuildingService,
    private userService: UserService
  ) {
    this.getBuildings();
  }

  ngOnInit(): void {
    this.searchRequest =
      this.modalRef?.getConfig()?.nzComponentParams?.searchRequest || {};
    this.initForm();
    if (
      this.searchRequest.buildingIds &&
      this.searchRequest.buildingIds.length > 0 &&
      this.searchRequest.buildingIds.length < 2
    ) {
      this.initDataFromBuilding([this.searchRequest.buildingIds[0]]);
    }
    if (this.searchRequest.user) {
      this.customers = [{ ...this.searchRequest.user }];
      this.form.controls.issuedUserId.setValue(
        this.searchRequest?.issuedUserId
      );
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      status: [this.searchRequest.status || null],
      startAt: [this.searchRequest.startAt || null],
      endAt: [this.searchRequest.endAt || null],
      serviceType: [this.searchRequest.serviceType || null],
      buildingIds: [this.searchRequest.buildingIds || []],
      floorIds: [this.searchRequest.floorIds || []],
      issuedUserId: [this.searchRequest?.issuedUserId || null],
    });
  }

  getBuildings(): void {
    this.accountService.getBuildings().subscribe((res: any) => {
      this.buildings = res.body?.data as Array<Building>;
      this.getCustomersFormBuilding('', 'keyword');
    });
  }

  initDataFromBuilding(ids: string[], modelChange = false): void {
    this.getFloorFromBuilding(ids, modelChange);
    this.getCustomersFormBuilding(ids, 'building', true);
  }

  getFloorFromBuilding(ids: string[], modelChange = false): void {
    if (!!ids) {
      if (ids.length > 0 && ids.length < 2) {
        this.form.get('floorIds')?.enable();
        if (modelChange) {
          this.form.get('floorIds')?.setValue(null);
        }
        const id = ids[0];
        // this.buildingService.getById(id).subscribe((res: any) => {
        //   this.building = res.body?.data as Building;
        //   this.floors = this.building?.floors || [];
        // });
        this.buildingService
          .simpleSearchFloor(id, { sortBy: 'floorNumber' })
          .subscribe((res: any) => {
            this.floors = res.body?.data;
          });
      } else if (ids.length >= 2) {
        this.form.get('floorIds')?.setValue(null);
        this.form.get('floorIds')?.disable();
      } else {
        this.form.get('floorIds')?.setValue(null);
        this.floors = [];
      }
    }
  }

  //
  getUserId(event: any): void {
    this.customers.forEach((item) => {
      if (item.id === event) {
        this.userAutoSearch = item;
      }
    });
  }

  getCustomersFormBuilding(event: any, type: string, isClear = false): void {
    const option = {
      keyword: null,
      buildingIds: [],
    };
    if (type === 'buildings') {
      option.buildingIds = event;
    } else {
      if (this.form.get('buildingIds')?.value) {
        option.buildingIds = this.form.get('buildingIds')?.value;
      }
      option.keyword = event?.target?.value;
    }
    if (isClear) {
      this.form.get('issuedUserId')?.setValue(null);
    }

    this.userService.searchUsersAutoComplete(option).subscribe((res) => {
      this.customers = res.body?.data as Array<User>;
    });
  }

  onSearch(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }

    this.searchRequest = this.form.value;
    this.searchRequest.user = this.userAutoSearch;
    this.modalRef.close({
      success: true,
      value: this.searchRequest,
    });
  }

  onReset(): void {
    this.form.reset();
  }

  enterStartDatePicker(event: any): void {
    const date = event?.target?.value;
    if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
      this.form.controls.startAt.setValue(this.form.controls.startAt.value);
      this.startDatePicker.close();
    } else {
      this.form.controls.startAt.setValue(CommonUtil.newDate(date));
      this.endDatePicker.close();
    }
  }

  enterEndDatePicker(event: any): void {
    const date = event?.target?.value;
    if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
      this.form.controls.endAt.setValue(this.form.controls.endAt.value);
      this.startDatePicker.close();
    } else {
      this.form.controls.endAt.setValue(CommonUtil.newDate(date));
      this.endDatePicker.close();
    }
  }

  disabledBeforeStartDate(current: Date): boolean {
    const date = document.getElementById('startDatePicker') as HTMLInputElement;
    return (
      differenceInCalendarDays(
        current,
        moment(date?.value, 'DD/MM/yyyy').toDate()
      ) < 0
    );
  }
  public limitText(text: string, limit: number): string {
    return CommonUtil.getLimitLength(text, limit);
  }
}
