import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { COMPLAINT_REPORT_CHART } from '@shared/constants/complaint.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { IBuilding } from '@shared/models/building.model';
import { IComplaintReport } from '@shared/models/ComplaintReport.model';
import { IFeedBackIStatistical } from '@shared/models/feedBackIStatistical.model';
import { IComplaintStatisticRequest } from '@shared/models/request/ComplaintStatisticRequest.model';
import { BuildingService } from '@shared/services/building.service';
import { ComplaintService } from '@shared/services/complaint.service';
import { TicketService } from '@shared/services/ticket.service';
import CommonUtil from '@shared/utils/common-utils';
import * as _ from 'lodash';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ComplaintReportFilterComponent } from './complaint-report-filter/complaint-report-filter.component';

@Component({
  selector: 'app-complaint-report',
  templateUrl: './complaint-report.component.html',
  styleUrls: ['./complaint-report.component.scss'],
})
export class ComplaintReportComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private buildingService: BuildingService,
    private ticketService: TicketService,
    private router: Router,
    private modalService: NzModalService,
    private complaintService: ComplaintService
  ) {}

  buildings: Array<IComplaintReport> = new Array<IComplaintReport>();
  public translatePath = 'model.complaint-report.';
  echartsInstance: any;
  date = null;
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
  statisticRequest: IComplaintStatisticRequest = {
    buildingIds: [''],
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    startAt: this.startDate,
    endAt: this.endDate,
  };
  startAt?: number;
  endAt?: number;
  expectedStartAt?: number;
  expectedEndAt?: number;
  dateFormat = 'dd/MM/yyyy';
  @ViewChild('startDatePicker') startDatePicker!: NzDatePickerComponent;
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  ngOnInit(): void {
    this.loadBuilding();
  }

  loadBuilding(): void {
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
            this.statisticRequest.buildingIds = this.buildings.map(
              (b) => b.buildingId || ''
            );
            this.statisticRequest.startAt = this.startDate
              ? CommonUtil.getStartOfDay(this.startDate.getTime())
              : undefined;
            this.statisticRequest.endAt = this.endDate
              ? CommonUtil.getEndOfDay(this.endDate.getTime())
              : undefined;
            this.loadDataChart();
          }
        }
      });
  }

  loadDataChart(): void {
    this.complaintService
      .statisticComplaint(this.statisticRequest, true)
      .subscribe((res) => {
        const data = res.body?.data as Array<IFeedBackIStatistical>;
        this.buildings.forEach((item) => {
          const dataChart = data.find((d) => d.buildingId === item.buildingId);
          if (dataChart) {
            item.statistical = dataChart;
            item.classifySatisfiedChart =
              this.initClassifySatisfiedChart(dataChart);
            item.needToImproveChart = this.initNeedToImproveChart(dataChart);
            item.satisfiedStatusChart =
              this.initSatisfiedStatusChart(dataChart);
          }
        });
      });
  }

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
    this.statisticRequest.startAt = this.startAt;
    this.loadDataChart();
  }

  public onEndDateChange(result: Date): void {
    console.log(result);
    if (result) {
      this.endAt = CommonUtil.getEndOfDay(new Date(result).getTime());
    } else {
      this.endAt = result;
    }
    this.statisticRequest.endAt = this.endAt;
    this.loadDataChart();
  }

  public openChart(item?: IComplaintReport): void {
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

  getRatio(value?: number, total?: number): string {
    if (value === undefined || total === undefined) {
      return 'unknown';
    }
    if (value === 0 || total === 0) {
      return '0%';
    }
    return ((value / total) * 100).toFixed(1) + '%';
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

  onChange(result: Date[]): void {}

  openAdvancedSearch(): void {
    const base = CommonUtil.modalBase(
      ComplaintReportFilterComponent,
      {
        reportFilerRequest: this.buildingSearchRequest,
      },
      '45%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result?.success) {
        this.buildingSearchRequest.buildingIds = result.data?.buildingIds;
        this.loadBuilding();
      }
    });
  }

  initClassifySatisfiedChart(itemReport?: IFeedBackIStatistical): any {
    const chart: any = _.cloneDeep(COMPLAINT_REPORT_CHART);
    chart.title.text = this.getTranslate('classifySatisfiedChart.title');
    chart.series[0].name = this.getTranslate('chart.seriesName');
    chart.series[0].center = ['50%', '50%'];
    chart.series[0].data = [
      {
        name: this.getTranslate('classifySatisfiedChart.improve'),
        value: itemReport?.unsatisfiedTotal || 0,
      },
      {
        name: this.getTranslate('classifySatisfiedChart.satisfied'),
        value: itemReport?.satisfiedTotal || 0,
      },
    ];
    return chart;
  }

  // biểu đồ phân loại góp ý theo phan loại trạng thái hài lòng
  initSatisfiedStatusChart(itemReport?: IFeedBackIStatistical): any {
    const chart: any = _.cloneDeep(COMPLAINT_REPORT_CHART);
    chart.title.text = this.getTranslate('satisfiedStatusChart.title');
    chart.series[0].name = this.getTranslate('chart.seriesName');
    chart.series[0].center = ['50%', '50%'];
    chart.series[0].data = [
      {
        name: this.getTranslate('satisfiedStatusChart.waitForProcess'),
        value: itemReport?.satisfiedWait || 0,
      },
      {
        name: this.getTranslate('satisfiedStatusChart.processing'),
        value: itemReport?.satisfiedProcessing || 0,
      },
      {
        name: this.getTranslate('satisfiedStatusChart.processed'),
        value: itemReport?.satisfiedProcessed || 0,
      },
    ];
    return chart;
  }

  // biểu đồ phân loại trạng thái theo góp ý cần cải thiện
  initNeedToImproveChart(itemReport?: IFeedBackIStatistical): any {
    const chart: any = _.cloneDeep(COMPLAINT_REPORT_CHART);
    chart.title.text = this.getTranslate('needToImproveChart.title');
    chart.series[0].name = this.getTranslate('chart.seriesName');
    chart.series[0].center = ['50%', '50%'];
    chart.series[0].data = [
      {
        name: this.getTranslate('needToImproveChart.waitForProcessed'),
        value: itemReport?.unsatisfiedWait || 0,
      },
      {
        name: this.getTranslate('needToImproveChart.processed'),
        value: itemReport?.unsatisfiedProcessing || 0,
      },
      {
        name: this.getTranslate('needToImproveChart.processing'),
        value: itemReport?.unsatisfiedProcessed || 0,
      },
    ];
    return chart;
  }
}
