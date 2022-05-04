export interface IBuildingRequest {
  keyword?: string;
  buildingIds?: Array<string>;
  pageIndex?: number;
  pageSize?: number;
  hasPageable?: boolean;
  sortBy?: string;
}

export class BuildingRequest implements IBuildingRequest {
  constructor(
    public keyword?: string,
    public provinceCode?: string,
    public pageIndex?: number,
    public buildingIds?: Array<string>,
    public pageSize?: number,
    public hasPageable?: boolean,
    public sortBy?: string
  ) {
    this.keyword = keyword;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.hasPageable = hasPageable;
    this.sortBy = sortBy;
    this.buildingIds = buildingIds;
  }
}
