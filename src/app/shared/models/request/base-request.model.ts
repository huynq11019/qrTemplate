export interface IBaseRequestModel {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  hasPageable?: boolean;
}
