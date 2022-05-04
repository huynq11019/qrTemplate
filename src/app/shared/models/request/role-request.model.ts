export interface IRoleRequest {
  keyword?: string;
  userLevel?: string;
  pageIndex?: number;
  pageSize?: number;
  hasPageable?: boolean;
  sortBy?: string;
  isRoot?: boolean;
  roleLevel?: string;
  status?: string;
  startAt?: number;
  endAt?: number;
  createdBy?: Array<string>;

}

export class RoleRequest {
  constructor(
    public keyword?: string,
    public userLevel?: string,
    public pageIndex?: number,
    public pageSize?: number,
    public hasPageable?: boolean,
    public sortBy?: string,
    public isRoot?: boolean,
    public roleLevel?: string,
    public status?: string,
    public startAt?: number,
    public endAt?: number,
    public createdBy?: Array<string>,
  ) {
    this.keyword = keyword;
    this.userLevel = userLevel;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.hasPageable = hasPageable;
    this.sortBy = sortBy;
    this.isRoot = isRoot;
    this.roleLevel = roleLevel;
    this.status = status;
    this.startAt = startAt;
    this.endAt = endAt;
    this.createdBy = createdBy;
  }
}
