import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PAGINATION } from '@shared/constants/pagination.constants';
import {
  SURVEY_FILENAME_TEMP,
  SURVEY_STATUS_DONE,
} from '@shared/constants/survey.constants';
import { SurveyRequest } from '@shared/models/request/survey-request.model';
import { Survey } from '@shared/models/survey.model';
import { SurveyService } from '@shared/services/survey.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-survey-result-export',
  templateUrl: './survey-result-export.component.html',
  styleUrls: ['./survey-result-export.component.scss'],
})
export class SurveyResultExportComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  surveys: Survey[] = [];
  request: SurveyRequest = {
    keyword: '',
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    status: SURVEY_STATUS_DONE,
    sortBy: 'name.asc',
  };

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private surveyService: SurveyService
  ) {
    this.getSurveys();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      surveyId: [null, [Validators.required]],
    });
  }

  getSurveys(): void {
    this.surveyService
      .searchAutoComplete(this.request, false)
      .subscribe((res: any) => {
        this.surveys = res.body?.data;
      });
  }

  export(): void {
    const surveyId = this.form.controls.surveyId.value;
    const surveyName =
      this.surveys.filter((survey) => survey.id === surveyId)[0]?.name ||
      SURVEY_FILENAME_TEMP;
    this.surveyService.exportAll(surveyId || '', true).subscribe((response) => {
      CommonUtil.downloadFileType(
        response.body,
        response.body.type,
        `${surveyName}.xlsx`
      );
    });
    this.modalRef.close({
      success: true,
      value: {},
    });
  }

  cancel(): void {
    this.modalRef.close({
      success: false,
      value: {},
    });
  }

  searchSurveys(event: any): void {
    this.request.keyword = event.target.value.trim();
    this.getSurveys();
  }
}
