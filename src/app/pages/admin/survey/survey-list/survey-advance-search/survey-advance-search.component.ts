import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SURVEY_STATUS } from '@shared/constants/survey.constants';
import { SurveyRequest } from '@shared/models/request/survey-request.model';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-survey-advance-search',
  templateUrl: './survey-advance-search.component.html',
  styleUrls: ['./survey-advance-search.component.scss'],
})
export class SurveyAdvanceSearchComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  statusList = [...SURVEY_STATUS];
  pathTranslate = 'model.survey.';
  startAt = new Date();

  @ViewChild('startPicker') startPicker!: NzDatePickerComponent;

  @ViewChild('endPicker') endPicker!: NzDatePickerComponent;

  surveyRequest: SurveyRequest = {};

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private toast: ToastService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.surveyRequest = this.modalRef?.getConfig()?.nzComponentParams || {};
    this.initForm();
    this.valueChangesForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      status: [this.surveyRequest?.status || null],
      startAt: [this.surveyRequest?.startAt || null],
      endAt: [this.surveyRequest?.endAt || null],
    });
  }

  getTranslate(s: string): string {
    return this.translateService.instant(this.pathTranslate + '' + s);
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
  }
}
