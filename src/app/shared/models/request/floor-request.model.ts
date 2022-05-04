export interface IFloorRequest {
  keyword?: string;
  isAvailable?: boolean;
  code?: string;
  name?: string;
  description?: string;
  pageIndex?: number;
  pageSize?: number;
  hasPageable?: boolean;
  sortBy?: string;
  minArea?: number;
}

export class FloorRequest implements IFloorRequest {
  constructor(
    public keyword?: string,
    public code?: string,
    public name?: string,
    public description?: string,
    public pageIndex?: number,
    public pageSize?: number,
    public hasPageable?: boolean,
    public sortBy?: string,
    public isAvailable?: boolean,
    public minArea?: number
  ) {
    this.keyword = keyword;
    this.code = code;
    this.name = name;
    this.description = description;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.hasPageable = hasPageable;
    this.sortBy = sortBy;
    this.isAvailable = isAvailable;
    this.minArea = minArea;
  }
}
