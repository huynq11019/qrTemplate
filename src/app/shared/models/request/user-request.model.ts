export interface IUserRequest {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
  hasPageable?: boolean;
  ids?: string[];
  sortBy?: string;
  status?: string;
  accountType?: string;

}

export class UserRequest {
  constructor(
    public keyword?: string,
    public pageIndex?: number,
    public pageSize?: number,
    public hasPageable?: boolean,
    public ids?: string[],
    public sortBy?: string,
    public status?: string,
    public accountType?: string

  ) {
    this.keyword = keyword;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.hasPageable = hasPageable;
    this.ids = ids;
    this.sortBy = sortBy;
    this.status = status;
    this.accountType = accountType;
  }
}
