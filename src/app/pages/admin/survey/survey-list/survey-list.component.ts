import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { STATUS } from '@shared/constants/status.constants';
import { SURVEY_STATUS } from '@shared/constants/survey.constants';
import { Pageable } from '@shared/models/pageable.model';
import { SurveyRequest } from '@shared/models/request/survey-request.model';
import { ISurvey, Survey } from '@shared/models/survey.model';
import { ToastService } from '@shared/services/helpers/toast.service';
import { SurveyService } from '@shared/services/survey.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { SurveyAdvanceSearchComponent } from './survey-advance-search/survey-advance-search.component';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss'],
})
export class SurveyListComponent implements OnInit {
  pageIndex = PAGINATION.PAGE_DEFAULT;
  pageSize = PAGINATION.SIZE_DEFAULT;
  pageSizeOptions = PAGINATION.OPTIONS;
  keyword = '';
  total = 0;
  surveyRequest: SurveyRequest = {};
  surveys: ISurvey[] = [];
  isCallFirstRequest = true;
  pathTranslate = 'model.survey.';
  listBuilding: any[] = [];
  statusList = [...SURVEY_STATUS];
  UNSENT = 'UNSENT';
  PENDING = 'PENDING';
  DONE = 'DONE';
  COMPLETE = 'complete';
  status = '';
  survey: ISurvey = new Survey();
  isVisible = false;
  action = '';
  groupPopup = {
    title: '',
    content: '',
    interpolateParams: {},
    okText: '',
  };
  ACTION_LIST = { delete: 'delete', send: 'send' };

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private toast: ToastService,
    private modalService: NzModalService,
    private surveyService: SurveyService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.loadData(this.pageIndex, this.pageSize);
  }

  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.pageIndex, this.pageSize);
  }

  search(event: any): void {
    this.surveyRequest.keyword = event?.target?.value.trim();
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadData(this.pageIndex, this.pageSize);
  }

  loadData(page: number, size: number, isLoading = true): void {
    this.surveyRequest.pageIndex = page;
    this.surveyRequest.pageSize = size;
    this.surveyRequest.hasPageable = true;

    const query = { ...this.surveyRequest };
    if (!!query.startAt) {
      query.startAt =
        CommonUtil.getStartOfDay(this.surveyRequest.startAt || 0) || undefined;
    }
    if (!!query.endAt) {
      query.endAt =
        CommonUtil.getEndOfDay(this.surveyRequest.endAt || 0) || undefined;
    }
    this.surveyService.search(query, isLoading).subscribe(
      (response: any) => {
        const data = response?.body?.data;
        const pageAble = response?.body?.page as Pageable;
        if (data.length > 0) {
          data.map((survey: Survey): any => (survey.checked = false));
        }
        this.surveys = data;
        this.total = pageAble.total || 0;
      },
      () => {
        this.surveys = [];
        this.total = 0;
      }
    );
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isCallFirstRequest) {
      this.isCallFirstRequest = false;
      return;
    }
    const { sortBy } = CommonUtil.onQueryParam(params);
    this.surveyRequest.sortBy = sortBy;
    this.loadData(this.pageIndex, this.pageSize);
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadData(this.pageIndex, this.pageSize);
  }

  create(): void {
    this.route.navigate(['/survey/create']).then();
  }

  detail(survey: ISurvey): void {
    this.route.navigate([`/survey/${survey.id}/detail`]).then();
  }

  delete(isArray: boolean, survey?: ISurvey): void {
    /** isArray là true => forEach users get những bản ghi có checked = true */
    if (!isArray) {
      this.isVisible = true;
      this.survey = survey || new Survey();
      if (!!this.survey) {
        this.action = this.ACTION_LIST.delete;
        this.groupPopup = {
          title: 'model.survey.deleteSurveyTitle',
          content: 'model.survey.deleteSurveyContent',
          interpolateParams: { name: `<b>${survey?.name || ''}</b>` },
          okText: 'action.delete',
        };
      }
    }
  }

  actionCustom(result: { success: boolean }): void {
    if (!(result && result?.success) || !this.survey) {
      this.isVisible = false;
      return;
    }
    if (this.action === this.ACTION_LIST.delete) {
      this.surveyService.delete(this.survey?.id).subscribe((res) => {
        if (res.status === STATUS.SUCCESS_200) {
          this.toast.success('model.survey.success.delete');
          this.loadData(this.pageIndex, this.pageSize);
        }
      });
      this.isVisible = false;
    } else if (this.action === this.ACTION_LIST.send) {
      this.surveyService
        .sendSurvey(this.survey?.id || '', true)
        .subscribe((response) => {
          if (response?.body?.success) {
            this.toast.success('model.survey.success.sent');
            this.loadData(this.pageIndex, this.pageSize);
          } else {
            this.toast.success('model.survey.error.sent');
          }
        });
      this.isVisible = false;
    }
  }

  getTranslate(s: string): string {
    return this.translateService.instant(this.pathTranslate + '' + s);
  }

  edit(survey: ISurvey): void {
    this.route.navigate([`survey/${survey.id}/update`]).then();
  }

  changeStatus(evt: string): void {
    this.surveyRequest.status = evt;
    this.loadData(this.pageIndex, this.pageSize);
  }

  sendSurvey(survey: ISurvey): void {
    this.isVisible = true;
    this.action = this.ACTION_LIST.send;
    this.survey = survey || new Survey();
    if (!!this.survey) {
      this.groupPopup = {
        title: 'model.survey.send.title',
        content: 'model.survey.send.content',
        interpolateParams: { name: `<b>${survey?.name || ''}</b>` },
        okText: 'action.send',
      };
    }
  }

  showBtnSend(survey: Survey): boolean {
    return survey.status === this.PENDING;
  }

  getLimitLength(str: string, length: number): string {
    return CommonUtil.getLimitLength(str, length);
  }

  getColorByStatus(survey: Survey): string {
    if (this.isExpired(survey)) {
      return 'badge-danger';
    }
    if (survey?.status === this.PENDING) {
      return 'badge-warning';
    } else if (survey?.status === this.DONE) {
      return 'badge-info';
    }
    return '';
  }

  getStatus(survey: Survey): string {
    if (this.isExpired(survey)) {
      return this.getTranslate('expired');
    }
    return this.getTranslate(survey?.status?.toLowerCase() || '');
  }

  isExpired(survey: Survey): boolean {
    return (
      survey?.status === this.PENDING &&
      CommonUtil.getEndOfDay(new Date(survey?.endAt || 0).getTime()) - 60000 <=
        CommonUtil.getStartOfDay(new Date().getTime())
    );
  }

  getStartOfDay(date: number): any {
    if (date === 0) {
      return '';
    }
    return CommonUtil.getStartOfDay(date);
  }

  openAdvancedSearch(): void {
    const base = CommonUtil.modalBase(
      SurveyAdvanceSearchComponent,
      this.surveyRequest,
      '30%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((res) => {
      if (res && res?.success) {
        const result = res?.value;
        this.surveyRequest.status = result?.status;
        if (!!result?.startAt && typeof result?.startAt !== 'number') {
          this.surveyRequest.startAt = (result?.startAt as Date)?.getTime();
        } else if (!result?.startAt) {
          this.surveyRequest.startAt = undefined;
        }
        if (!!result?.endAt && typeof result?.endAt !== 'number') {
          this.surveyRequest.endAt = (result?.endAt as Date)?.getTime();
        } else if (!result?.endAt) {
          this.surveyRequest.endAt = undefined;
        }
        this.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.loadData(this.pageIndex, this.pageSize);
      }
    });
  }
}
