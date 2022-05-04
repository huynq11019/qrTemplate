export class SurveyRequest {
  constructor(
    public keyword?: string,
    public status?: string,
    public startAt?: number,
    public endAt?: number,
    public sortBy?: string,
    public pageIndex?: number,
    public pageSize?: number,
    public hasPageable?: boolean,
  ) {
    this.keyword = keyword;
    this.status = status;
    this.startAt = startAt;
    this.endAt = endAt;
    this.sortBy = sortBy;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.hasPageable = hasPageable;
  }
}
