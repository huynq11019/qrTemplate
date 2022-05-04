export interface IFeedBackIStatistical {
  buildingId?: string;
  totalComplaint?: number;

  satisfiedTotal?: number;
  satisfiedWait?: number;
  satisfiedProcessing?: number;
  satisfiedProcessed?: number;
  satisfiedSpam?: number;

  unsatisfiedTotal?: number;
  unsatisfiedWait?: number;
  unsatisfiedProcessing?: number;
  unsatisfiedProcessed?: number;
  unsatisfiedSpam?: number;
  totalSpam?: number;
}

export class FeedBackIStatistical implements IFeedBackIStatistical {
  buildingId?: string;
  totalComplaint?: number;

  satisfiedTotal?: number;
  satisfiedWait?: number;
  satisfiedProcessing?: number;
  satisfiedProcessed?: number;
  satisfiedSpam?: number;

  unsatisfiedTotal?: number;
  unsatisfiedWait?: number;
  unsatisfiedProcessing?: number;
  unsatisfiedProcessed?: number;
  unsatisfiedSpam?: number;

  totalSpam?: number;
  constructor(init?: IFeedBackIStatistical) {
    Object.assign(this, init);
  }
}
