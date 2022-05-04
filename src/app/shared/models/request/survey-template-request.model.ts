export class SurveyTemplateRequest {
  constructor(
    public keyword?: string,
    public pageIndex?: number,
    public pageSize?: number,
    public hasPageable?: boolean,
    public sortBy?: string,
  ) {
    this.keyword = keyword;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.hasPageable = hasPageable;
    this.sortBy = sortBy;
  }
}
