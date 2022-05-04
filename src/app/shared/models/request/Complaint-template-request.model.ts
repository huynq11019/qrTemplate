import {IBaseRequestModel} from '@shared/models/request/base-request.model';

export interface IComplaintTemplateRequest extends IBaseRequestModel {
  floorId?: string;
  createdUserIds?: string[];
  status?: string;
  startAt?: Date | number | undefined;
  endAt?: Date | number |  undefined;
  buildingIds?: string[];
  floorIds?: string[];
}
