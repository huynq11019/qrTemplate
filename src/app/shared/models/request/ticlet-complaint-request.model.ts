export interface ITicketComplaintRequest {
  floorId?: string;
  serviceType?: string;
  content?: string;
  note?: string;
  complaintId?: string;
}

export class TicketComplaint implements ITicketComplaintRequest {
  constructor(
    public floorId?: string,
    public serviceType?: string,
    public content?: string,
    public note?: string,
    public complaintId?: string,
  ) {
    this.floorId = floorId;
    this.serviceType = serviceType;
    this.content = content;
    this.note = note;
    this.complaintId = complaintId;
  }
}
