import {AuditableModelModel} from '@shared/models/AuditableModel.model';

export declare enum ComplaintTemplateAction {
  UPDATE = 'UPDATE',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface IComplaintTemplateHistory extends AuditableModelModel {
  id?: string;
  complaintTemplateId?: string;
  createdUserId?: string;
  createdUserName?: string;
  reason?: string;
  action?: ComplaintTemplateAction;
}

export class ComplaintTemplateHistory implements IComplaintTemplateHistory {
  id?: string;
  complaintTemplateId?: string;
  createdUserId?: string;
  createdUserName?: string;
  reason?: string;
  action?: ComplaintTemplateAction;
  createdAt?: number;
  lastModifiedAt?: number;
  createdBy?: string;
  lastModifiedBy?: string;
  deleted?: boolean;

  constructor(data?: IComplaintTemplateHistory) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (this as any)[property] = (data as any)[property];
        }
      }
    }
  }
}
