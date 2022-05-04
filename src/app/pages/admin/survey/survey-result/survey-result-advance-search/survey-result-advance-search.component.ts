import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SURVEY_COMPANY } from '@shared/constants/survey.constants';
import { IBuilding } from '@shared/models/building.model';
import { ICustomerContact } from '@shared/models/customer-contact.model';
import { ICustomer } from '@shared/models/customer.model';
import { SurveyResultSearchRequest } from '@shared/models/request/survey-result-search-request.model';
import { AccountService } from '@shared/services/account.service';
import { BuildingService } from '@shared/services/building.service';
import { CustomerService } from '@shared/services/customer.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-survey-result-advance-search',
  templateUrl: './survey-result-advance-search.component.html',
  styleUrls: ['./survey-result-advance-search.component.scss'],
})
export class SurveyResultAdvanceSearchComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  buildings: IBuilding[] = [];
  organizations: ICustomer[] = [];
  customerContacts: ICustomerContact[] = [];
  averageScores: string[] = ['0-1', '1-2', '2-3', '3-4', '4-5'];
  startAt = new Date();
  surveyResultRequest: SurveyResultSearchRequest = {};
  delay: any;

  COMPANY = SURVEY_COMPANY;

  @ViewChild('startPicker') startPicker!: NzDatePickerComponent;

  @ViewChild('endPicker') endPicker!: NzDatePickerComponent;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private toast: ToastService,
    private translateService: TranslateService,
    private buildingService: BuildingService,
    private accountService: AccountService,
    private organizationService: CustomerService
  ) {
    this.initData();
  }

  ngOnInit(): void {
    this.initForm();
    this.valueChangesForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      buildingIds: [this.surveyResultRequest?.buildingIds || null],
      organizationIds: [this.surveyResultRequest?.organizationIds || null],
      averageScore: [this.surveyResultRequest?.averageScore || null],
      representIds: [this.surveyResultRequest?.representIds || null],
      startAt: [this.surveyResultRequest?.startAt || null],
      endAt: [this.surveyResultRequest?.endAt || null],
    });
  }

  resetForm(): void {
    this.form.reset();
  }

  save(): void {
    this.modalRef.close({
      success: true,
      value: this.form.value,
    });
  }

  initData(): void {
    this.surveyResultRequest =
      this.modalRef?.getConfig()?.nzComponentParams || {};
    this.accountService.getBuildings().subscribe((res: any) => {
      this.buildings = res?.body?.data;
    });

    this.organizationService
      .search({ sortBy: 'name.asc' })
      .subscribe((res: any) => {
        this.organizations = res?.body?.data;
        if (!!this?.surveyResultRequest?.organizationIds) {
          const ids = this?.surveyResultRequest?.organizationIds?.filter(
            (item) =>
              !this.organizations
                ?.map((organization) => organization?.id)
                ?.includes(item)
          );
          if (!(!!ids && ids?.length > 0)) {
            return;
          }
          this.organizationService
            .findIds({ ids: ids || [] })
            .subscribe((rs: any) => {
              if (rs?.body?.success && !!rs?.body?.data) {
                this.organizations = [...this.organizations, ...rs?.body?.data];
              }
            });
        }
      });
  }

  searchOrganizations(event: any): void {
    const option = {
      keyword: event?.target?.value?.trim(),
      sortBy: 'name.asc',
    };
    this.organizationService.search(option).subscribe((res: any) => {
      this.organizations = res?.body?.data;
    });
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

  disabledDate = (value: Date) => {
    const form = this.form;
    // Can not select days before today and today
    return value < form.get('startDate')?.value;
  };

  enterDatePicker(event: any, nameDate: string): void {
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

    this.form?.controls.buildingIds?.valueChanges.subscribe((value) => {
      this.form?.get('organizationIds')?.setValue([]);
      if (!!value && value?.length > 0) {
        this.organizationService
          .findCustomers({ ids: value }, true)
          .subscribe((response: any) => {
            if (!!response && response?.body?.success) {
              this.organizations = response?.body?.data;
            }
          });
      } else {
        this.searchOrganizations('');
      }
    });
  }

  getLimitLength(str: string, length: number = 20): string {
    return CommonUtil.getLimitLength(str, length);
  }
}
