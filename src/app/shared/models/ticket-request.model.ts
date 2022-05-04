export interface ITicketRequest {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
  hasPageable?: boolean;
}

export class TicketRequest implements ITicketRequest {
  constructor(
    public keyword?: string,
    public pageIndex?: number,
    public pageSize?: number,
    public hasPageable?: boolean,
  ) {
    this.keyword = keyword;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.hasPageable = hasPageable;
  }
}
