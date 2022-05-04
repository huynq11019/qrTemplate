import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  COMPLAINT_RATING_ARR,
  COMPLAINT_STATUS_ARR,
  COMPLAINT_TYPE_ARR,
} from '@shared/constants/complaint.constant';
import { Building } from '@shared/models/building.model';
import {
  ComplaintSearchRequest,
  IComplaintSearchRequest,
} from '@shared/models/request/complaint-search-request.model';
import { User } from '@shared/models/user.model';
import { AccountService } from '@shared/services/account.service';
import CommonUtil from '@shared/utils/common-utils';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-complaint-filter',
  templateUrl: './complaint-filter.component.html',
  styleUrls: ['./complaint-filter.component.scss'],
})
export class ComplaintFilterComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  COMPLAINT_STATUS_ARR = COMPLAINT_STATUS_ARR;
  COMPLAINT_TYPE_ARR = COMPLAINT_TYPE_ARR;
  COMPLAINT_RATING_ARR = COMPLAINT_RATING_ARR;
  buildings: Building[] = [];
  building: Building = {};
  startAt = new Date();
  searchRequest: ComplaintSearchRequest = new ComplaintSearchRequest();
  customers: User[] = [];
  userAutoSearch: User = {};
  @ViewChild('startDatePicker') startPicker!: NzDatePickerComponent;
  @ViewChild('endDatePicker') endPicker!: NzDatePickerComponent;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private accountService: AccountService
  ) {
    this.getBuildings();
  }

  ngOnInit(): void {
    this.searchRequest = this.modalRef?.getConfig()?.nzComponentParams || {};
    this.initForm(this.modalRef?.getConfig()?.nzComponentParams || {});
    this.valueChangesForm();
  }

  initForm(searchRequest: IComplaintSearchRequest): void {
    this.form = this.fb.group({
      status: [this.searchRequest?.status || null],
      startCreatedAt: [
        this.searchRequest?.startCreatedAt
          ? new Date(this.searchRequest?.startCreatedAt)
          : null,
      ],
      endCreatedAt: [
        this.searchRequest?.endCreatedAt
          ? new Date(this.searchRequest?.endCreatedAt)
          : null,
      ],
      complaintType: [this.searchRequest?.complaintType || null],
      satisfiedComplaint: [this.searchRequest?.satisfiedComplaint || null],
      buildingIds: [this.searchRequest?.buildingIds || []],
    });
  }

  getBuildings(): void {
    this.accountService.getBuildings().subscribe((res: any) => {
      this.buildings = res.body?.data as Array<Building>;
    });
  }

  onSearch(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    this.searchRequest = this.form.value;
    this.modalRef.close({
      success: true,
      value: this.searchRequest,
    });
  }

  onReset(): void {
    this.form.reset();
  }

  disabledBeforeStartAt(current: Date): boolean {
    const date = document.getElementById('startDatePicker') as HTMLInputElement;

    return (
      differenceInCalendarDays(
        current,
        moment(date?.value, 'DD/MM/yyyy').toDate()
      ) < 0
    );
  }

  disabledDate = (value: Date) => {
    const form = this.form;
    // Can not select days before today and today
    return value < form.get('startDate')?.value;
  };

  enterDatePicker(event: any, nameDate: string): void {
    const date = event?.target?.value;
    if (nameDate === 'startCreatedAt') {
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
    } else if (nameDate === 'endCreatedAt') {
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
      this.form?.controls?.startAt.value,
      'DD/MM/yyyy'
    ).toDate();
    if (
      differenceInCalendarDays(
        this.form.controls.endAt.value,
        this.form.controls.startAt.value
      ) < 0
    ) {
      this.form.controls.endAt.setValue(this.form.controls.startAt.value);
    }
  }

  valueChangesForm(): void {
    this.form?.controls.startAt?.valueChanges.subscribe((value) => {
      if (!!value) {
        this.changeStartAt();
      }
    });
  }

  getLimitLength(text?: string, length?: number): string {
    return CommonUtil.getLimitLength(text, length);
  }
}
