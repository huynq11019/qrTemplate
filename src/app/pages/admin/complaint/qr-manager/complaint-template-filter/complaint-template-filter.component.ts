import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { QR_STATUS } from '@shared/constants/complaint.constant';
import { USER_EMPLOYEE } from '@shared/constants/user.constant';
import { IBuilding } from '@shared/models/building.model';
import { IFloor } from '@shared/models/floor.model';
import { IComplaintTemplateRequest } from '@shared/models/request/Complaint-template-request.model';
import { IUser } from '@shared/models/user.model';
import { BuildingService } from '@shared/services/building.service';
import { UnitService } from '@shared/services/unit.service';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-complaint-template-filter',
  templateUrl: './complaint-template-filter.component.html',
  styleUrls: ['./complaint-template-filter.component.scss'],
})
export class ComplaintTemplateFilterComponent implements OnInit {
  public translatePath = 'model.qr-manager.filter.';
  @ViewChild('startPicker') startPicker!: NzDatePickerComponent;

  @ViewChild('endPicker') endPicker!: NzDatePickerComponent;
  @Input() filterRequest?: IComplaintTemplateRequest;
  qrTemplateStatus = QR_STATUS;
  users: Array<IUser> = new Array<IUser>();
  buildings: Array<IBuilding> = new Array<IBuilding>();
  floors: Array<IFloor> = new Array<IFloor>();
  form = new FormGroup({});
  startAt = new Date();

  constructor(
    private buildingService: BuildingService,
    private unitService: UnitService,
    private translateService: TranslateService,
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (
      this.filterRequest?.createdUserIds &&
      this.filterRequest?.createdUserIds?.length > 0
    ) {
      this.findByUserIds(this.filterRequest?.createdUserIds);
    } else {
      this.searchUserAutoComplete();
    }
    this.initForm();
    this.onSearchBuilding();
    this.onSearchFloor();
  }

  private initForm(): void {
    this.form = this.fb.group({
      status: [this.filterRequest?.status],
      createdUserIds: [this.filterRequest?.createdUserIds],
      startAt: [this.filterRequest?.startAt],
      endAt: [this.filterRequest?.endAt],
      buildingIds: [this.filterRequest?.buildingIds],
      floorIds: [this.filterRequest?.floorIds],
    });
  }

  public searchUserAutoComplete(keyword?: string): void {
    this.userService
      .searchUsersAutoComplete({
        keyword,
        accountType: USER_EMPLOYEE,
      })
      .subscribe((res) => {
        this.users = res.body?.data as Array<IUser>;
      });
  }

  onSearch(): void {
    if (this.form?.get('startAt')?.value) {
      this.form
        ?.get('startAt')
        ?.setValue(
          CommonUtil.setStartTime(
            new Date(this.form?.get('startAt')?.value).getTime()
          )
        );
    }
    if (this.form?.get('endAt')?.value) {
      this.form
        ?.get('endAt')
        ?.setValue(
          CommonUtil.setEndTime(
            new Date(this.form?.get('endAt')?.value).getTime()
          )
        );
    }
    this.filterRequest = { ...this.form.value };
    this.modalRef.close({
      success: true,
      value: this.filterRequest,
    });
  }

  limitText(text: string, limit = 10): string {
    return CommonUtil.getLimitLength(text, limit);
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
    });
  }

  private findByUserIds(userIds: Array<string>): void {
    this.userService.findByUserIds(userIds).subscribe((res) => {
      this.users = res.body?.data as Array<IUser>;
    });
  }

  public onReset(): void {
    this.form?.reset();
  }

  public getTranslate(key: string): string {
    return this.translateService.instant(`${this.translatePath}${key}`);
  }

  public enterDatePicker(event: any, nameDate: string): void {
    const date = event?.target?.value;
    if (nameDate === 'startAt') {
      if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
        this.form.controls[nameDate].setValue(
          this.form.controls[nameDate].value
        );
        this.startPicker.close();
      } else {
        if (!this.form.controls[nameDate].value) {
          this.form.controls[nameDate].setValue(CommonUtil.newDate(date));
        } else {
          this.form.controls[nameDate].setValue(
            this.form.controls[nameDate].value
          );
        }
        this.startPicker.close();
      }
    } else if (nameDate === 'endAt') {
      if (
        CommonUtil.newDate(date).toString() !== 'Invalid Date' &&
        !this.disabledBeforeStartAt(CommonUtil.newDate(date))
      ) {
        this.form.controls[nameDate].setValue(CommonUtil.newDate(date));
        this.endPicker.close();
      } else {
        this.form.controls[nameDate].setValue(
          this.form.controls[nameDate].value
        );
        this.endPicker.close();
      }
    }
  }

  changeStartAt(): void {
    this.startAt = moment(
      this.form?.get('startAt')?.value,
      'DD/MM/yyyy'
    ).toDate();
    if (
      differenceInCalendarDays(
        this.form.get('endAt')?.value,
        this.form.get('startAt')?.value
      ) < 0
    ) {
      this.form.get('endAt')?.setValue(this.form?.get('startAt')?.value);
    }
  }

  disabledBeforeStartAt(current: Date): boolean {
    const date = document.getElementById('startPicker') as HTMLInputElement;

    return (
      differenceInCalendarDays(
        current,
        moment(date?.value, 'DD/MM/yyyy').toDate()
      ) < 0
    );
  }

  public onSearchBuilding(keyword?: string): void {
    const buildingIds = this.form?.get('buildingIds')?.value;
    this.buildingService
      .searchBuildingAutoComplete({ keyword, sortBy: 'code.asc', buildingIds })
      .subscribe((res) => {
        this.buildings = res.body?.data as Array<IBuilding>;
      });
  }

  public onSearchFloor(keyword?: string): void {
    const buildingIds = this.form.get('buildingIds')?.value as Array<string>;
    if (buildingIds && buildingIds?.length === 1) {
      // this.floorService.searchFloorAutoComplete({keyword, buildingIds}).subscribe(res => {
      //   this.floors = res.body?.data as Array<IFloor>;
      // });
      this.buildingService
        .simpleSearchFloor(buildingIds[0], {
          keyword,
          sortBy: 'floorNumber.asc',
        })
        .subscribe((res) => {
          this.floors = res.body?.data as Array<IFloor>;
        });
    }
  }

  public onChangeBuilding(buildingIds?: string[]): void {
    this.form.controls.floorIds.setValue([]);
    if (buildingIds?.length === 1) {
      this.form.get('floorIds')?.enable();
      // load floor
      this.buildingService
        .simpleSearchFloor(buildingIds[0], { sortBy: 'floorNumber.asc' })
        .subscribe((res) => {
          this.floors = res.body?.data as Array<IFloor>;
        });
    } else {
      this.form.get('floorIds')?.disable();
    }
  }
}
