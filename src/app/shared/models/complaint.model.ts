import { ITicket } from '@shared/models/ticket.model';
import { IFile } from './file.model';

export interface IComplaint {
  id?: string;
  code?: string;
  createdAt?: string;
  customerName?: string;
  title?: string;
  content?: string;
  phoneNumber?: string;
  receivedUserId?: string;
  closedUserId?: string;
  receivedUserName?: string;
  closedUserName?: string;
  status?: string;
  complaintType?: string;
  buildingId?: string;
  floorId?: string;
  buildingName?: string;
  buildingCode?: string;
  floorName?: string;
  deleted?: boolean;
  complaintFiles?: IFile[];
  fullName?: string;
  complaintFileIds?: IFile[];
  feedback?: string;
  complaintTemplateId?: string;
  ticketId?: string;
  invalidReason?: string;
  ticket?: ITicket;
  satisfied?: boolean;
  email?: string;
  closedNote?: string;
}


export class Complaint implements IComplaint {
  constructor(
    public id?: string,
    public code?: string,
    public createdAt?: string,
    public customerName?: string,
    public title?: string,
    public content?: string,
    public phoneNumber?: string,
    public receivedUserId?: string,
    public closedUserId?: string,
    public receivedUserName?: string,
    public closedUserName?: string,
    public status?: string,
    public complaintType?: string,
    public buildingId?: string,
    public floorId?: string,
    public buildingName?: string,
    public buildingCode?: string,
    public floorName?: string,
    public deleted?: boolean,
    public complaintFiles?: IFile[],
    public fullName?: string,
    public complaintFileIds?: IFile[],
    public feedback?: string,
    public complaintTemplateId?: string,
    public ticketId?: string,
    public ticket?: ITicket,
    public invalidReason?: string,
    public satisfied?: boolean,
    public email?: string,
    public closedNote?: string,
  ) {
    this.id = id;
    this.code = code;
    this.createdAt = createdAt;
    this.customerName = customerName;
    this.title = title;
    this.content = content;
    this.phoneNumber = phoneNumber;
    this.receivedUserId = receivedUserId;
    this.closedUserId = closedUserId;
    this.receivedUserName = receivedUserName;
    this.closedUserName = closedUserName;
    this.status = status;
    this.complaintType = complaintType;
    this.satisfied = satisfied;
    this.buildingId = buildingId;
    this.floorId = floorId;
    this.buildingName = buildingName;
    this.buildingCode = buildingCode;
    this.floorName = floorName;
    this.deleted = deleted;
    this.complaintFiles = complaintFiles;
    this.fullName = fullName;
    this.complaintFileIds = complaintFileIds;
    this.feedback = feedback;
    this.complaintTemplateId = complaintTemplateId;
    this.ticketId = ticketId;
    this.ticket = ticket;
    this.invalidReason = invalidReason;
    this.satisfied = satisfied;
    this.email = email;
    this.closedNote = closedNote;
  }
}
