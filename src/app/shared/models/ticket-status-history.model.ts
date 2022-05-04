export interface ITicketStatusHistory {
  id?: string;
  status?: number;
  ticketId?: string;
}

export class TicketStatusHistory implements ITicketStatusHistory {
  constructor(
    public id?: string,
    public status?: number,
    public ticketId?: string
  ) {
    this.id = id;
    this.status = status;
    this.ticketId = ticketId;
  }
}
