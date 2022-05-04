import {IFeedBackIStatistical} from '@shared/models/feedBackIStatistical.model';

export interface IComplaintReport {
  buildingId?: string;
  statistical?: IFeedBackIStatistical;
  // chartOptions?: any;
  classifySatisfiedChart?: any;
  satisfiedStatusChart?: any;
  needToImproveChart?: any;
  buildingName?: string;
  checked?: boolean;
}

export class ComplaintReport implements IComplaintReport {
  buildingId?: string;
  statistical?: IFeedBackIStatistical;
  classifySatisfiedChart?: any;
  satisfiedStatusChart?: any;
  needToImproveChart?: any;
  buildingName?: string;
  checked?: boolean;

  constructor(complaintReport?: IComplaintReport) {
    if (complaintReport) {
      Object.assign(this, complaintReport);
    }
  }

  public initChart(chart: any, data: any, title: string) {
    chart.setOption({
      title: {
        text: title,
        x: 'center',
        y: 'top',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: data.map((item: any) => item.name)
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    });
  }
}
