import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PAGINATION } from '@shared/constants/pagination.constants';
import {
  SURVEY_COMPANY,
  SURVEY_STAGE,
} from '@shared/constants/survey.constants';
import {
  USER_LEVEL_CENTER,
  USER_LEVEL_LEADER_MANAGEMENT,
} from '@shared/constants/user.constant';
import {
  BuildingSurvey,
  IBuildingSurvey,
} from '@shared/models/building-survey.model';
import { IBuilding } from '@shared/models/building.model';
import { ChartSurvey } from '@shared/models/chart-survey.model';
import { ICriteria } from '@shared/models/criteria.model';
import { Pageable } from '@shared/models/pageable.model';
import { IQuestion } from '@shared/models/question.model';
import { SurveyResultSearchRequest } from '@shared/models/request/survey-result-search-request.model';
import { SurveyResult } from '@shared/models/survey-result.model';
import { ISurvey } from '@shared/models/survey.model';
import { User } from '@shared/models/user.model';
import { AccountService } from '@shared/services/account.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { BuildingService } from '@shared/services/building.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { QuestionGroupService } from '@shared/services/question-group.service';
import { SurveyService } from '@shared/services/survey.service';
import CommonUtil from '@shared/utils/common-utils';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { SurveyResultAdvanceSearchComponent } from './survey-result-advance-search/survey-result-advance-search.component';
import { SurveyResultExportComponent } from './survey-result-export/survey-result-export.component';

@Component({
  selector: 'app-survey-result',
  templateUrl: './survey-result.component.html',
  styleUrls: ['./survey-result.component.scss'],
})
export class SurveyResultComponent implements OnInit {
  surveys: SurveyResult[] = [];
  companies: SurveyResult[] = [];

  // chart variable
  chartSurvey: ChartSurvey = new ChartSurvey();
  chartSurveyRequest = {
    surveyIds: [],
    buildingIds: [],
    questionIds: [],
    questionGroupIds: [],
  };
  surveyList: ISurvey[] = [];
  buildingList: IBuilding[] = [];
  questionGroupList: ICriteria[] = [];
  questionList: IQuestion[] = [];
  delay: any;

  form: FormGroup = new FormGroup({});

  // End chart variable

  currentUser: User | null = {};
  userLevel = {
    USER_LEVEL_CENTER: false,
    USER_LEVEL_LEADER_MANAGEMENT: false,
  };

  STAGE = SURVEY_STAGE;
  COMPANY = SURVEY_COMPANY;

  surveyResultRequest: SurveyResultSearchRequest = {};

  querySearchStage = {
    keyword: '',
    buildingIds: [],
    startAt: '',
    endAt: '',
    averageScoreMin: '',
    averageScoreMax: '',
    averageScore: '',
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    sortBy: '',
    type: this.STAGE,
    total: 0,
  };

  querySearchCompany = {
    keyword: '',
    buildingIds: [],
    organizationIds: [],
    representIds: [],
    startAt: '',
    endAt: '',
    averageScoreMin: '',
    averageScoreMax: '',
    averageScore: '',
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    sortBy: '',
    type: this.COMPANY,
    total: 0,
  };

  isCallFirstRequest = true;
  isCallSecondRequest = true;
  tabIndex = 0; // First Tab
  tabStage = 0;
  tabCompany = 1;
  colors = ['#0054a5', '#74ABDF', '#c1ddff', '#6574d0'];
  option = {
    width: '80%',
    height: '60%',
    toolbox: {
      show: true,
      feature: {
        // dataZoom: {
        //   show: true,
        //   yAxisIndex: 'none',
        //
        // },
        // magicType: {
        //   type: ['line', 'bar'],
        //   show: true,
        //   title: 'chuyển đổi'
        // },
        restore: {
          title: this.translateService.instant('action.reset'),
        },
        saveAsImage: {
          pixelRatio: 2,
          title: this.translateService.instant('action.save'),
          name: this.translateService.instant(
            'model.survey.results.dashboardResult'
          ),
        },
      },
    },
    legend: {
      bottom: 50,
      textStyle: {
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'Arial, sana-sarif',
        fontColor: '#000',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `<b>${params.seriesName}:</b> <br\> ${params.name}: ${Number(
          params.data[params.componentIndex + 1]
        ).toFixed(2)}`;
      },
    },
    dataset: {
      source: [[]],
    },
    xAxis: {
      name: this.translateService.instant('common.building'),
      type: 'category',
      nameTextStyle: { fontSize: 14 },
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        symbol: ['none', 'arrow'],
      },
      axisLabel: {
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'Arial, sana-sarif',
        fontColor: '#000',
        interval: 0,
        width: 100,
        formatter: (value: any) => {
          return this.getLimitLength(value, 40);
        },
        offset: 100,
        // rotate: 30
      },
    },
    yAxis: {
      type: 'value',
      name: this.translateService.instant('model.survey.results.averageScore'),
      max: 5,
      splitNumber: 10,
      nameTextStyle: { fontSize: 14 },
      axisLine: {
        symbol: ['none', 'arrow'],
      },
      axisLabel: {
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'Arial, sana-sarif',
        fontColor: '#000',
      },
    },
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [
      {
        type: 'bar',
        color: '#0054a5',
      },
      {
        type: 'bar',
        color: '#74ABDF',
      },
      {
        type: 'bar',
        color: '#c1ddff',
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        show: true,
        xAxisIndex: [0],
        startValue: 0,
        endValue: 3,
        maxValueSpan: 3,
      },
      {
        show: true,
        maxWidth: 20,
        rangeMode: 'value',
      },
    ],
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translateService: TranslateService,
    private surveyService: SurveyService,
    private authService: AuthService,
    private toast: ToastService,
    private buildingService: BuildingService,
    private questionGroupService: QuestionGroupService,
    private accountService: AccountService,
    private modalService: NzModalService
  ) {
    const tabIndex =
      this.router?.getCurrentNavigation()?.extras?.state?.tabIndex;
    if (tabIndex) {
      this.tabIndex = tabIndex;
    }
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      if (this.currentUser.userLevel === USER_LEVEL_CENTER) {
        this.userLevel.USER_LEVEL_CENTER = true;
        this.userLevel.USER_LEVEL_LEADER_MANAGEMENT = true;
        this.loadData(this.querySearchStage);
        this.loadData(this.querySearchCompany);
      } else if (this.currentUser.userLevel === USER_LEVEL_LEADER_MANAGEMENT) {
        this.userLevel.USER_LEVEL_CENTER = false;
        this.userLevel.USER_LEVEL_LEADER_MANAGEMENT = true;
        this.loadData(this.querySearchStage);
      }
    } else {
      this.router.navigate([`/`]).then();
    }
    this.initForm();
    this.valueChangesForm();
  }

  getIndex(index: number): number {
    if (this.userLevel.USER_LEVEL_CENTER && this.tabIndex === this.tabStage) {
      return CommonUtil.getIndex(
        index,
        this.querySearchStage.pageIndex,
        this.querySearchStage.pageSize
      );
    }
    return CommonUtil.getIndex(
      index,
      this.querySearchCompany.pageIndex,
      this.querySearchCompany.pageSize
    );
  }

  onChangeTab(tabIndex: number): void {
    this.tabIndex = tabIndex;
    if (this.tabIndex === 2) {
      this.onSearchChartSurvey();
      this.initData();
    }
  }

  search(event: any): void {
    const keyword = event?.target?.value.trim() || '';
    if (this.tabIndex === this.tabStage) {
      this.querySearchStage.keyword = keyword;
      this.querySearchStage.pageIndex = PAGINATION.PAGE_DEFAULT;
      this.loadData(this.querySearchStage);
    } else {
      this.querySearchCompany.keyword = keyword;
      this.querySearchCompany.pageIndex = PAGINATION.PAGE_DEFAULT;
      this.loadData(this.querySearchCompany);
    }
  }

  loadData(request: any): void {
    const param = { ...request };
    if (request.type === this.STAGE) {
      this.onSearchSurveys(CommonUtil.formatParams(param));
    } else {
      this.onSearchCompanies(CommonUtil.formatParams(param));
    }
  }

  onSearchSurveys(options: any): void {
    this.surveyService.searchSummaryBySurvey(options).subscribe(
      (response: any) => {
        const page = response?.body?.page as Pageable;
        this.surveys = response?.body?.data;
        this.querySearchStage.total = page.total || 0;
      },
      () => {
        this.surveys = [];
        this.querySearchStage.total = 0;
      }
    );
  }

  onSearchCompanies(options: any): void {
    this.surveyService.searchSummaryByCustomer(options).subscribe(
      (response: any) => {
        const data = response?.body?.data;
        const page = response?.body?.page as Pageable;
        this.companies = data;
        this.querySearchCompany.total = page.total || 0;
      },
      () => {
        this.companies = [];
        this.querySearchCompany.total = 0;
      }
    );
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isCallFirstRequest) {
      this.isCallFirstRequest = false;
      return;
    }
    if (this.isCallSecondRequest) {
      this.isCallSecondRequest = false;
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
    if (this.userLevel.USER_LEVEL_CENTER && this.tabIndex === this.tabStage) {
      this.querySearchStage.sortBy = sortBy;
      this.loadData(this.querySearchStage);
    } else {
      this.querySearchCompany.sortBy = sortBy;
      this.loadData(this.querySearchCompany);
    }
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    if (this.userLevel.USER_LEVEL_CENTER && this.tabIndex === this.tabStage) {
      this.querySearchStage.pageIndex = pageIndex;
      this.querySearchStage.pageSize = pageSize;
      this.loadData(this.querySearchStage);
    } else {
      this.querySearchCompany.pageIndex = pageIndex;
      this.querySearchCompany.pageSize = pageSize;
      this.loadData(this.querySearchCompany);
    }
  }

  getLimitLength(value: string, length = 20): string {
    length = length > 1 ? length : 1;
    return CommonUtil.getLimitLength(value, length);
  }

  formatDate(date: any): string {
    if (!date) {
      return '-';
    }
    return moment(this.getStartOfDay(date)).format('DD/MM/yyyy');
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

  exportModal(): void {
    const base = CommonUtil.modalBase(SurveyResultExportComponent, {}, '30%');
    this.modalService.create(base);
  }

  detail(item: SurveyResult, screen: string): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        buildingId: item.buildingId,
        organizationId: item.organizationId,
      },
    };
    if (screen === this.STAGE) {
      this.router
        .navigate([`/survey/result/${item.surveyId}/detail/${screen}`])
        .then();
    } else if (screen === this.COMPANY) {
      this.router
        .navigate(
          [`/survey/result/${item.surveyId}/detail/${screen}`],
          navigationExtras
        )
        .then();
    }
  }

  /**
   * @author: huynq
   * @since: 12/14/2021 9:47 PM
   * @description:  khởi tạo biểu đồ đánh giá
   * @param surveyNames: Array<string>
   * @param results : Array<SurveyResult> danh sách kết quả đánh giá
   * @update:
   */
  initDataChart(surveyNames: Array<string>, results: IBuildingSurvey[]): void {
    const dataSource: any[] = [];
    let tg: any[] = [];
    const series: any[] = [];
    if (results?.length <= 0) {
      if (this.form?.get('buildingIds')?.value?.length > 0) {
        results = this.buildingList
          ?.filter((item) =>
            this.form.get('buildingIds')?.value?.includes(item?.id)
          )
          ?.map((item) => new BuildingSurvey(item?.name, [0]));
      } else {
        results = this.buildingList?.map(
          (item) => new BuildingSurvey(item?.name, [0])
        );
      }
      surveyNames = [''];
    }
    tg = tg.concat('Building', [...surveyNames]);
    dataSource.push(tg);
    // dataSource.push([results.])
    let colorIndex = 0;
    for (const re of results) {
      let tmp: any[] = [];
      tmp = tmp.concat(re.title, [...(re.values || [])]);
      dataSource.push(tmp);
    }
    for (const surveyName of surveyNames) {
      series.push({
        // name: re.buildingName,
        type: 'bar',
        color: this.colors[colorIndex],
      });
      if (colorIndex < this.colors.length - 1) {
        colorIndex++;
      } else {
        colorIndex = 0;
      }
    }
    this.option.series = series;
    this.option.dataset.source = dataSource;
    this.option = {
      ...this.option,
    };
  }

  onSearchChartSurvey(): void {
    this.chartSurveyRequest = { ...this.form?.value };
    const param = CommonUtil.formatParams({ ...this.chartSurveyRequest });
    if (!!param?.surveyIds && param?.surveyIds?.length > 0) {
      this.surveyService.getChartSurvey(param).subscribe((res: any) => {
        this.chartSurvey = res?.body?.data;
        this.initDataChart(
          this.chartSurvey?.labels || [],
          this.chartSurvey?.data || []
        );
      });
    }
  }

  reset(): void {
    this.form.reset();
  }

  initData(): void {
    // this.accountService.getBuildings(true).subscribe((res: any) => {
    //   this.buildingList = res?.body?.data as Array<Building>;
    // });

    // this.questionGroupService.getAll(false).subscribe((res: any) => {
    //   this.questionGroupList = res?.body?.data as Array<Criteria>;
    // });

    // this.questionGroupService.getAllQuestionByQuestionGroupIds({}, false).subscribe((res: any) => {
    //   this.questionList = res?.body?.data as Array<Question>;
    // });

    this.surveyService.search({ sortBy: 'name.asc' }).subscribe((res: any) => {
      this.surveyList = res?.body?.data;
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      surveyIds: [[], [Validators.required]],
      buildingIds: [],
      questionGroupIds: [],
      questionIds: [],
    });
  }

  valueChangesForm(): void {
    this.form?.controls.surveyIds?.valueChanges.subscribe((value) => {
      if (!!value) {
        this.surveyService
          .getBuildingsBySurveyIds({ ids: this.form?.get('surveyIds')?.value })
          .subscribe((res: any) => {
            this.buildingList = res?.body?.data;
            this.form.get('buildingIds')?.reset();
          });

        this.questionGroupService
          .getBySurveyIds({ ids: this.form?.get('surveyIds')?.value })
          .subscribe((response: any) => {
            this.questionGroupList = response?.body?.data;
            this.form.get('questionGroupIds')?.reset();
          });
      }
    });
    this.form?.controls.questionGroupIds?.valueChanges.subscribe(() => {
      this.questionGroupService
        .getAllQuestionByQuestionGroupIds({
          ids: this.form?.get('questionGroupIds')?.value,
        })
        .subscribe((response: any) => {
          this.questionList = response?.body?.data;
          this.form.get('questionIds')?.reset();
        });
    });
  }

  openAdvancedSearch(): void {
    if (this.tabIndex === this.tabStage) {
      const base = CommonUtil.modalBase(
        SurveyResultAdvanceSearchComponent,
        this.querySearchStage,
        '40%'
      );
      const modal: NzModalRef = this.modalService.create(base);
      modal.afterClose.subscribe((res) => {
        if (res && res?.success) {
          const result = res?.value;
          this.querySearchStage.buildingIds = result?.buildingIds;
          this.querySearchStage.startAt = result?.startAt;
          this.querySearchStage.endAt = result?.endAt;
          this.querySearchStage.averageScore = result?.averageScore;
          this.querySearchStage.pageIndex = PAGINATION.PAGE_DEFAULT;
          if (!!result?.averageScore) {
            this.querySearchStage.averageScoreMin =
              result?.averageScore.charAt(0);
            this.querySearchStage.averageScoreMax =
              result?.averageScore.charAt(2);
          } else {
            this.querySearchStage.averageScoreMin = '';
            this.querySearchStage.averageScoreMax = '';
          }
          const query = { ...this.querySearchStage };
          query.averageScore = '';
          if (!!result?.startAt) {
            query.startAt =
              CommonUtil.getStartOfDay((result?.startAt as Date)?.getTime()) +
              '';
          } else {
            query.startAt = '';
          }
          if (!!result?.endAt) {
            query.endAt =
              CommonUtil.getEndOfDay((result?.endAt as Date)?.getTime()) + '';
          } else {
            query.endAt = '';
          }
          this.loadData(query);
        }
      });
    } else {
      const base = CommonUtil.modalBase(
        SurveyResultAdvanceSearchComponent,
        this.querySearchCompany,
        '40%'
      );
      const modal: NzModalRef = this.modalService.create(base);
      modal.afterClose.subscribe((res) => {
        if (res && res?.success) {
          const result = res?.value;
          this.querySearchCompany.buildingIds = result?.buildingIds;
          this.querySearchCompany.organizationIds = result?.organizationIds;
          this.querySearchCompany.representIds = result?.representIds;
          this.querySearchCompany.startAt = result?.startAt;
          this.querySearchCompany.endAt = result?.endAt;
          this.querySearchCompany.averageScore = result?.averageScore;
          this.querySearchCompany.averageScoreMin =
            result?.averageScore?.charAt(0);
          this.querySearchCompany.averageScoreMax =
            result?.averageScore?.charAt(2);
          this.querySearchStage.pageIndex = PAGINATION.PAGE_DEFAULT;
          const query = { ...this.querySearchCompany };
          query.averageScore = '';
          if (!!result?.startAt) {
            query.startAt =
              CommonUtil.getStartOfDay((result?.startAt as Date)?.getTime()) +
              '';
          } else {
            query.startAt = '';
          }
          if (!!result?.endAt) {
            query.endAt =
              CommonUtil.getEndOfDay((result?.endAt as Date)?.getTime()) + '';
          } else {
            query.endAt = '';
          }
          this.loadData(query);
        }
      });
    }
  }

  searchSurvey(evt: any): void {
    const option = {
      keyword: evt?.target?.value?.trim(),
      sortBy: 'name.asc',
    };
    this.surveyService.search(option).subscribe((res: any) => {
      this.surveyList = res?.body?.data;
    });
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

  getStartOfDay(date: number): any {
    if (date === 0) {
      return '';
    }
    return CommonUtil.getStartOfDay(date);
  }
}
