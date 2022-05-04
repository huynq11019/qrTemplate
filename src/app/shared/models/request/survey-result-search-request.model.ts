export class SurveyResultSearchRequest{
  constructor(
    public keyword?: string,
    public name?: string,
    public buildingIds?: string[],
    public organizationIds?: string[],
    public representIds?: string,
    public startAt?: number,
    public endAt?: number,
    public averageScoreMin?: number,
    public averageScoreMax?: number,
    public averageScore?: string,
    public sortBy?: string,
    public pageIndex?: number,
    public pageSize?: number,
    public hasPageable?: boolean,
    public type?: string
  ) {
    this.keyword = keyword;
    this.name = name;
    this.buildingIds = buildingIds;
    this.organizationIds = organizationIds;
    this.representIds = representIds;
    this.startAt = startAt;
    this.endAt = endAt;
    this.averageScoreMin = averageScoreMin;
    this.averageScoreMax = averageScoreMax;
    this.averageScore = averageScore;
    this.sortBy = sortBy;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.hasPageable = hasPageable;
    this.type = type;
  }
}
