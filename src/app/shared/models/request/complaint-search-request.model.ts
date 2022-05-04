import { IBaseRequestModel } from '@shared/models/request/base-request.model';

export interface IComplaintSearchRequest extends IBaseRequestModel {
  buildingIds?: string[];
  complaintType?: string;
  startCreatedAt?: number;
  endCreatedAt?: number;
  floorIds?: string[];
  status?: string;
  satisfiedComplaint?: boolean;

}

export class ComplaintSearchRequest implements IComplaintSearchRequest {
  constructor(
    public buildingIds?: string[],
    public complaintType?: string,
    public startCreatedAt?: number,
    public endCreatedAt?: number,
    public status?: string,
    public satisfiedComplaint?: boolean,
    public keyword?: string,
    public pageIndex?: number,
    public pageSize?: number,
    public sortBy?: string,
    public hasPageable?: boolean
  ) {
    this.buildingIds = buildingIds;
    this.complaintType = complaintType;
    this.startCreatedAt = startCreatedAt;
    this.endCreatedAt = endCreatedAt;
    this.status = status;
    this.satisfiedComplaint = satisfiedComplaint;
    this.keyword = keyword;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.sortBy = sortBy;
    this.hasPageable = hasPageable;
  }
}
