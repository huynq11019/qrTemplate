import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PAGINATION } from '@shared/constants/pagination.constants';
import {
  CLOSED,
  IN_PROGRESS,
  OPEN,
  OVER_DUE,
  RECEIVED,
  TOTAL,
} from '@shared/constants/system-report.constant';
import { chartOption } from '@shared/constants/ticket.constant';
import { IBuilding } from '@shared/models/building.model';
import { IStatistical } from '@shared/models/statistical';
import { ITicketReport } from '@shared/models/ticket-report.model';
import { BuildingService } from '@shared/services/building.service';
import { TicketService } from '@shared/services/ticket.service';
import CommonUtil from '@shared/utils/common-utils';
import * as _ from 'lodash';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AdvancedSearchReportComponent } from './advanced-search-report/advanced-search-report.component';

@Component({
  selector: 'app-system-report',
  templateUrl: './system-report.component.html',
  styleUrls: ['./system-report.component.scss'],
})
export class SystemReportComponent implements OnInit {
  buildings: Array<ITicketReport> = [];
  public translatePath = 'model.report.';
  echartsInstance: any;
  type = 'bar';
  startDate: Date = this.getTopDayOfMonth();
  endDate: Date = new Date();
  buildingSearchRequest = {
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    keyword: '',
    total: 0,
    sortBy: 'name.asc',
    buildingIds: [''],
  };
  filterRequest = {
    ticketType: '',
    buildingIds: [''],
  };
  startAt?: number;
  endAt?: number;
  expectedStartAt?: number;
  expectedEndAt?: number;
  dateFormat = 'dd/MM/yyyy';
  RECEIVED = RECEIVED;
  CLOSED = CLOSED;
  OPEN = OPEN;
  IN_PROGRESS = IN_PROGRESS;
  TOTAL = TOTAL;
  OVER_DUE = OVER_DUE;

  @ViewChild('startDatePicker') startDatePicker!: NzDatePickerComponent;
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  constructor(
    private translate: TranslateService,
    private buildingService: BuildingService,
    private ticketService: TicketService,
    private router: Router,
    private modalService: NzModalService
  ) {
    this.startAt = CommonUtil.getStartOfDay(this.startDate.getTime());
    this.endAt = CommonUtil.getEndOfDay(this.endDate.getTime());
  }

  ngOnInit(): void {
    this.loadBuilding();
  }

  loadBuilding(): void {
    // search building
    this.buildingService
      .simpleSearch(this.buildingSearchRequest, true)
      .subscribe((res) => {
        if (res.body?.data) {
          const buildings = res.body.data as Array<IBuilding>;
          this.buildingSearchRequest.total = res.body.page?.total || 0;
          this.buildings = buildings.map((building) => {
            return {
              buildingId: building.id,
              buildingName: building.name,
              checked: false,
            };
          });
          if (!!buildings) {
            const buildingIds: Array<string> = this.buildings.map(
              (b) => b.buildingId || ''
            );
            this.loadDataChart(
              buildingIds,
              this.startDate
                ? CommonUtil.getStartOfDay(this.startDate.getTime())
                : undefined,
              this.endDate
                ? CommonUtil.getEndOfDay(this.endDate.getTime())
                : undefined,
              this.filterRequest.ticketType
            );
          }
        }
      });
  }

  loadDataChart(
    buildingIds: string[],
    startAt?: number,
    endAt?: number,
    ticketType?: string
  ): void {
    this.ticketService
      .getStatistical({ buildingIds, startAt, endAt, ticketType })
      .subscribe((res) => {
        if (res.body) {
          const data = res.body.data as Array<IStatistical>;
          // mapping data to chart
          data.forEach((item) => {
            const building = this.buildings.find(
              (b) => b.buildingId === item.buildingId
            );
            if (building) {
              building.statistical = item;
              building.chartOptions = this.initChartOption(item);
            }
          });
        }
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {}

  chartInit(ec: any): void {
    this.echartsInstance = ec;
  }

  resizeChart(): void {
    if (this.echartsInstance) {
      this.echartsInstance.resize();
    }
  }

  public getTranslate(key: string): string {
    return this.translate.instant(this.translatePath + key);
  }

  public onStartDateChange(result: Date): void {
    if (result) {
      this.startAt = CommonUtil.getStartOfDay(new Date(result).getTime());
    } else {
      this.startAt = result;
    }
    this.loadDataChart(
      this.buildings.map((b) => b.buildingId || ''),
      this.startAt,
      this.endAt
    );
  }

  public onEndDateChange(result: Date): void {
    if (result) {
      this.endAt = CommonUtil.getEndOfDay(new Date(result).getTime());
    } else {
      this.endAt = result;
    }
    this.loadDataChart(
      this.buildings.map((b) => b.buildingId || ''),
      this.startAt,
      this.endAt
    );
  }

  public openChart(item?: ITicketReport): void {
    if (item) {
      item.checked = !item.checked;
    }
  }

  onQuerySearchBuilding(params: any): void {
    const { pageIndex, pageSize } = params;
    this.buildingSearchRequest.pageIndex = pageIndex;
    this.buildingSearchRequest.pageSize = pageSize;
    this.loadBuilding();
  }

  private initChartOption(ticketReport?: IStatistical): any {
    if (ticketReport) {
      const chart = _.cloneDeep(chartOption);
      chart.series[0].label.formatter = (params) => {
        if (params?.percent < 1) {
          return '';
        }
        return this.getRatio(params.value, ticketReport.totalTicket || 0);
      };
      chart.series[0].data = [
        {
          value: ticketReport?.totalOpenTicket || 0,
          name: this.getTranslate('requestWaiting'),
        },
        {
          value: ticketReport?.totalReceivedTicket || 0,
          name: this.getTranslate('requestAccepted'),
        },
        {
          value: ticketReport?.totalInProgressTicket || 0,
          name: this.getTranslate('requestProcessing'),
        },
        {
          value: ticketReport?.totalOverdueTicket || 0,
          name: this.getTranslate('expiredTicket'),
        },
        {
          value: ticketReport?.totalCloseTicket || 0,
          name: this.getTranslate('requestProcessed'),
        },
      ];
      return chart;
    }
  }

  getIndex(index: number): number {
    return CommonUtil.getIndex(
      index,
      this.buildingSearchRequest.pageIndex,
      this.buildingSearchRequest.pageSize
    );
  }

  limitText(textInput = '', lenth = 25): string {
    return CommonUtil.getLimitLength(textInput, lenth);
  }

  getRatio(value: number, total: number): string {
    if (value === 0 || total === 0) {
      return '0%';
    }
    return ((value / total) * 100).toFixed(1) + '%';
  }

  getDetailReport(status: string, item: ITicketReport, action?: string): void {
    // Khi onInit thì gán giá trị cho startAt, endAt (vì chỉ khi nz-date-picker onChange thì startAt,endAt mới đc gán giá trị)
    if (this.startAt === undefined) {
      this.startAt = CommonUtil.getStartOfDay(this.startDate.getTime());
    }
    if (this.endAt === undefined) {
      this.endAt = CommonUtil.getEndOfDay(this.endDate.getTime());
    }
    const dataObject = {
      queryParams: {
        buildingId: item.buildingId,
        status,
        startAt: this.startAt,
        endAt: this.endAt,
        expectedStartAt: this.expectedStartAt,
        expectedEndAt: this.expectedEndAt,
      },
    };
    if (!!action) {
      if (action === OVER_DUE) {
        dataObject.queryParams.expectedStartAt = CommonUtil.getStartOfDay(
          new Date().getTime()
        );
      } else {
        // trừ đi 1 phút để TH: expectedEndAt cùng ngày với ngày dự kiến hoàn thành thì không tính là hết hạn
        dataObject.queryParams.expectedEndAt =
          CommonUtil.getEndOfDay(new Date().getTime()) - 60000;
      }
    }
    this.router.navigate([`ticket`], dataObject);
  }

  enterStartDatePicker(event: any): void {
    const date = event?.target?.value;
    if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
      this.startDatePicker.setModeAndFormat();
      this.startDatePicker.close();
      return;
    }
    if (!!this.endDate) {
      if (this.endDate.getTime() < CommonUtil.newDate(date).getTime()) {
        this.startDatePicker.setModeAndFormat();
        this.startDatePicker.close();
        return;
      }
    }
    if (CommonUtil.newDate(date)) {
      this.startDate = CommonUtil.newDate(date);
    }
  }

  enterEndDatePicker(event: any): void {
    const date = event?.target?.value;
    if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
      this.endDatePicker.setModeAndFormat();
      this.endDatePicker.close();
      return;
    }
    if (!!this.startDate) {
      if (this.startDate.getTime() > CommonUtil.newDate(date).getTime()) {
        this.endDatePicker.setModeAndFormat();
        this.endDatePicker.close();
        return;
      }
    }
    if (CommonUtil.newDate(date)) {
      this.endDate = CommonUtil.newDate(date);
    }
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endDate) {
      return false;
    }
    return startValue.getTime() > this.endDate.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startDate) {
      return false;
    }
    return endValue.getTime() <= this.startDate.getTime();
  };
  // lấy ngày đầu tiên của tháng
  getTopDayOfMonth(): Date {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  }

  // lấy ngày cuối cùng của tháng
  getLastDayOfMonth(): Date {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  }

  openAdvancedSearch(): void {
    const base = CommonUtil.modalBase(
      AdvancedSearchReportComponent,
      {
        reportFilerRequest: this.filterRequest,
      },
      '45%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result?.success) {
        this.filterRequest = result.data;
        this.buildingSearchRequest.buildingIds = this.filterRequest.buildingIds;
        this.loadBuilding();
      }
    });
  }
}
