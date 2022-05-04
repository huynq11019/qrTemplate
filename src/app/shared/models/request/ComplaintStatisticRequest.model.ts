import {IBaseRequestModel} from '@shared/models/request/base-request.model';

export interface IComplaintStatisticRequest extends  IBaseRequestModel{
  buildingIds?: string[];
  endAt?: Date | number;
  startAt?: Date | number;
}
