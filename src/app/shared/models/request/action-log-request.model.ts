import { IBaseRequestModel } from './base-request.model';

export interface IActionLogRequest extends IBaseRequestModel {
  method?: string;
  module?: string;
  httpCode?: number;
  userIds?: Array<string>;
  uri?: string;
}

export class ActionLogRequest implements IActionLogRequest {
  constructor(
    public method?: string,
    public module?: string,
    public httpCode?: number,
    public userIds?: Array<string>,
    public uri?: string,
    public keyword?: string,
    public pageIndex?: number,
    public pageSize?: number,
    public sortBy?: string,
    public hasPageable?: boolean
  ) {
    this.method = method;
    this.module = module;
    this.httpCode = httpCode;
    this.userIds = userIds;
    this.uri = uri;
    this.keyword = keyword;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.sortBy = sortBy;
    this.hasPageable = hasPageable;
  }
}
