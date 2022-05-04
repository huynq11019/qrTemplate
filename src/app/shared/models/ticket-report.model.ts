import {IStatistical} from './statistical';

export interface ITicketReport {
  buildingId?: string;
  buildingName?: string;
  checked?: boolean;
  statistical?: IStatistical;
  chartOptions?: any;
}
export class TicketReport implements ITicketReport {
  buildingId?: string;
  buildingName?: string;
  checked?: boolean;
  statistical?: IStatistical;

  constructor(data?: ITicketReport) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (this as any)[property] = (data as any)[property];
        }
      }
    }
  }
}
