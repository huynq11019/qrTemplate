export interface IUnitRequest {
  keyword?: string;
  floorId?: string;
  pageIndex?: number;
  pageSize?: number;
  hasPageable?: boolean;
  sortBy?: string;
  buildingId?: string[];
}

export class UnitRequest implements IUnitRequest {
  constructor(
    public keyword?: string,
    public floorId?: string,
    public pageIndex?: number,
    public pageSize?: number,
    public hasPageable?: boolean,
    public sortBy?: string,
    public buildingId?: string[]
  ) {
    this.keyword = keyword;
    this.floorId = floorId;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.hasPageable = hasPageable;
    this.sortBy = sortBy;
    this.buildingId = buildingId;
  }
}
