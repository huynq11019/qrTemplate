import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { SURVEY_RESULT_URL } from '@shared/constants/component-url.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import {
  SURVEY_COMPANY,
  SURVEY_STAGE,
} from '@shared/constants/survey.constants';
import { SurveyResult } from '@shared/models/survey-result.model';
import { ToastService } from '@shared/services/helpers/toast.service';
import { SurveyService } from '@shared/services/survey.service';
import CommonUtil from '@shared/utils/common-utils';
import * as moment from 'moment';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-survey-result-detail',
  templateUrl: './survey-result-detail.component.html',
  styleUrls: ['./survey-result-detail.component.scss'],
})
export class SurveyResultDetailComponent implements OnInit {
  surveyId: string | null = '';
  buildingId: string | null = '';
  organizationId: string | null = '';
  type = '';
  surveys: SurveyResult[] = [];
  companies: SurveyResult = new SurveyResult();

  pageIndex = PAGINATION.PAGE_DEFAULT;
  pageSize = PAGINATION.SIZE_DEFAULT;
  total = 0;
  sortBy = '';
  isCallFirstRequest = false;

  STAGE = SURVEY_STAGE;
  COMPANY = SURVEY_COMPANY;
  SURVEY_RESULT_URL = SURVEY_RESULT_URL;
  navigationExtras: NavigationExtras = {};
  tabIndex = 0;
  beginStage = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private surveyService: SurveyService,
    private toast: ToastService,
    private router: Router
  ) {
    this.activatedRoute.paramMap.subscribe((res) => {
      this.surveyId = res.get('surveyId') || null;
      this.type = res.get('type') || '';
      if (this.type === this.STAGE) {
        this.tabIndex = 0;
        this.beginStage = true;
      } else if (this.type === this.COMPANY) {
        this.tabIndex = 1;
      } else {
        this.tabIndex = 2;
      }
      const navigationExtras: NavigationExtras = {
        state: {
          tabIndex: this.tabIndex,
        },
      };
      this.navigationExtras = navigationExtras;

      if (this.surveyId) {
        if (this.type === this.COMPANY) {
          this.activatedRoute.queryParams.subscribe((params) => {
            const { buildingId, organizationId } = params;
            this.buildingId = buildingId;
            this.organizationId = organizationId;
            this.loadDataCompany(buildingId, organizationId);
          });
        }
      } else {
        window.history.back();
      }
    });
  }

  ngOnInit(): void {}

  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.pageIndex, this.pageSize);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isCallFirstRequest) {
      this.isCallFirstRequest = false;
      return;
    }
    const { sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    let sortBy = '';
    if (sortField && sortOrder) {
      sortBy = `${sortField}.${sortOrder === 'ascend' ? 'asc' : 'desc'}`;
    }
    this.sortBy = sortBy;
    this.loadData();
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadData();
  }

  loadData(): void {
    const param = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
    };

    this.surveyService
      .searchDetailSummaryByCustomer(
        this.surveyId || '',
        CommonUtil.formatParams(param)
      )
      .subscribe((response: any) => {
        const data = response?.body?.data;
        const page = response?.body?.page;
        this.surveys = data;
        this.total = page?.total || 0;
      });
  }

  loadDataCompany(buildingId: string, organizationId: string): void {
    this.surveyService
      .findDetailSummary(this.surveyId || '', {
        buildingId,
        organizationId,
      })
      .subscribe((response: any) => {
        this.companies = response?.body?.data;
      });
  }

  export(item: SurveyResult, screen: string): void {
    if (screen === this.STAGE) {
      this.surveyService
        .export(item?.surveyId || '', {
          buildingId: item?.buildingId,
        })
        .subscribe((response) => {
          CommonUtil.downloadFileType(
            response.body,
            response.body.type,
            `${item.survey?.name}-${item.building?.name}.xlsx`
          );
        });
    } else {
      this.surveyService
        .export(item?.surveyId || '', {
          buildingId: item?.buildingId,
          organizationId: item?.organizationId,
        })
        .subscribe((response) => {
          CommonUtil.downloadFileType(
            response.body,
            response.body.type,
            `${item.survey?.name}-${item.building?.name}-${item.organization?.name}.xlsx`
          );
        });
    }
  }

  detail(item: SurveyResult, screen: string): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        buildingId: item.buildingId,
        organizationId: item.organizationId,
      },
    };
    this.router.navigate(
      [`/survey/result/${item.surveyId}/detail/${screen}`],
      navigationExtras
    );
  }

  formatDate(date: any): string {
    if (!date) {
      return '';
    }
    return moment(date).format('DD/MM/yyyy');
  }

  cancel(): void {
    window.history.back();
    if (this.type === this.COMPANY && !this.beginStage) {
      this.router.navigate([`${this.SURVEY_RESULT_URL}`], {
        state: { tabIndex: this.tabIndex },
      });
    }
  }

  getLimitLength(value: string, length = 20): string {
    if (value) {
      return CommonUtil.getLimitLength(value, length);
    }
    return '';
  }

  getOpinions(opinions: string[]): string {
    let s = '';
    if (!!opinions && opinions?.length > 0) {
      for (const opinion of opinions) {
        s += `<p class="ml-3"><b>-</b> ${opinion} </p>`;
      }
    }
    return s;
  }

  showNote(notes: string[]): string {
    let result = '';
    if (!!notes && notes?.length > 0) {
      const length = notes?.length > 2 ? 2 : notes?.length;
      for (let i = 0; i < length; i++) {
        result += `\t- ${this.getLimitLength(notes[i], 20)}\n`;
      }
    }
    return result;
  }

  showNoteTooltip(notes: string[]): string {
    let result = '';
    if (!!notes && notes?.length > 0) {
      const length = notes?.length > 2 ? 2 : notes?.length;
      for (let i = 0; i < length; i++) {
        result += `\t- ${notes[i]}\n`;
      }
    }
    return result;
  }
}
