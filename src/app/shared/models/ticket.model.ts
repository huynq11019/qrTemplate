import { Complaint } from '@shared/models/complaint.model';
import {TicketStatusHistory} from './ticket-status-history.model';
import {IFile} from './file.model';
import * as moment from 'moment';

export interface ITicket {
  receivedUserId?: string;
  receivedUserName?: string;
  assigneeUserName?: string;
  buildingCode?: string;
  buildingId?: string;
  buildingName?: string;
  code?: string;
  content?: string;
  issuedUserName?: string;
  createdAt?: string;
  createdBy?: string;
  issuedUserId?: string;
  deleted?: true;
  expectedFinishAt?: any;
  feedback?: string;
  floorId?: string;
  floorName?: string;
  id?: string;
  note?: string;
  organizationId?: string;
  organizationName?: string;
  serviceType?: string;
  status?: string;
  illustrationsFiles?: IFile[];
  inspectionFiles?: IFile[];
  complaint?: Complaint;
}

export class Ticket implements ITicket {
  constructor(
    public receivedUserId?: string,
    public assigneeUserName?: string,
    public receivedUserName?: string,
    public buildingCode?: string,
    public buildingId?: string,
    public buildingName?: string,
    public code?: string,
    public content?: string,
    public issuedUserName?: string,
    public createdAt?: string,
    public createdBy?: string,
    public issuedUserId?: string,
    public deleted?: true,
    public expectedFinishAt?: any,
    public feedback?: string,
    public floorId?: string,
    public floorName?: string,
    public id?: string,
    public note?: string,
    public organizationId?: string,
    public organizationName?: string,
    public serviceType?: string,
    public status?: string,
    public illustrationsFiles?: IFile[],
    public inspectionFiles?: IFile[],
    public complaint?: Complaint,
  ) {
    this.receivedUserId = receivedUserId;
    this.assigneeUserName = assigneeUserName;
    this.buildingCode = buildingCode;
    this.buildingId = buildingId;
    this.buildingName = buildingName;
    this.code = code;
    this.content = content;
    this.issuedUserName = issuedUserName;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.issuedUserId = issuedUserId;
    this.receivedUserName = receivedUserName;
    this.deleted = deleted;
    this.expectedFinishAt = expectedFinishAt;
    this.feedback = feedback;
    this.floorId = floorId;
    this.floorName = floorName;
    this.id = id;
    this.note = note;
    this.organizationId = organizationId;
    this.organizationName = organizationName;
    this.serviceType = serviceType;
    this.status = status;
    this.illustrationsFiles = illustrationsFiles;
    this.inspectionFiles = inspectionFiles;
    this.complaint = complaint;
  }
}
