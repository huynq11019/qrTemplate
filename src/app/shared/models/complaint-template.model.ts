import {AuditableModelModel} from '@shared/models/AuditableModel.model';

export interface IComplaintTemplate extends AuditableModelModel{
  id?: string;
  title?: string;
  note?: string;
  buildingId?: string;
  floorId?: string;
  qrUrl?: string;
  status?: string;
  content?: string;
  createdUserId?: string;
  createdUserName?: string;
  buildingName?: string;
  buildingCode?: string;
  floorName?: string;
  reason?: string;
}

export class ComplaintTemplate implements IComplaintTemplate {
  id?: string;
  title?: string;
  note?: string;
  buildingId?: string;
  floorId?: string;
  qrUrl?: string;
  status?: string;
  deleted?: boolean;
  content?: string;
  createdUserName?: string;
  createdUserId?: string;
  buildingName?: string;
  floorName?: string;
  reason?: string;
  buildingCode?: string;

  constructor(data?: IComplaintTemplate) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (this as any)[property] = (data as any)[property];
        }
      }
    }
  }
}
