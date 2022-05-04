import { User } from '../user.model';

export interface ISearchTicket {
  ticketType?: string;
  status?: string;
  startAt?: number | null;
  endAt?: number | null;
  serviceType?: string;
  buildingIds?: string[];
  floorIds?: string;
  issuedUserId?: string;
  expectedStartAt?: number | null;
  expectedEndAt?: number | null;
  user?: User;
}

export class SearchTicket implements ISearchTicket {
  constructor(
    public ticketType?: string,
    public status?: string,
    public startAt?: number | null,
    public endAt?: number | null,
    public serviceType?: string,
    public buildingIds?: string[],
    public floorIds?: string,
    public issuedUserId?: string,
    public expectedStartAt?: number | null,
    public expectedEndAt?: number | null,
    public user?: User,
  ) {
    this.ticketType = ticketType;
    this.status = status;
    this.startAt = startAt;
    this.endAt = endAt;
    this.serviceType = serviceType;
    this.buildingIds = buildingIds;
    this.floorIds = floorIds;
    this.issuedUserId = issuedUserId;
    this.expectedStartAt = expectedStartAt;
    this.expectedEndAt = expectedEndAt;
    this.user = user;
  }
}
