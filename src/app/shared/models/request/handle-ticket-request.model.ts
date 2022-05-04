export interface IHandle {
  estimateDate?: string;
}
export class Handle implements IHandle {
  constructor(
    public estimateDate?: string,
  ) {
    this.estimateDate = estimateDate;
  }
}
