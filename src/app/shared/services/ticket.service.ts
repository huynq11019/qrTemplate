import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { ITicketComplaintRequest } from '@shared/models/request/ticlet-complaint-request.model';
import { IStatistical } from '@shared/models/statistical';
import { Observable } from 'rxjs';

import { ITicket, Ticket } from '../models/ticket.model';
import { AbstractService, EntityResponseType } from './common/abstract.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService extends AbstractService{
  public resourceUrl = SERVICE.TICKET + '/tickets';

  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  search(options?: {}, loading = false): Observable<EntityResponseType<ITicket[]>> {

    return super.get<ITicket[]>(`${this.resourceUrl}`, {params: options, loading});
  }

  create(ticket: Ticket, loading = false): Observable<EntityResponseType<ITicket>> {
    return super.post<ITicket>(`${this.resourceUrl}/issued-by-employee`, ticket, { loading});
  }

  createByComplaint(ticket: ITicketComplaintRequest, loading = false): Observable<EntityResponseType<ITicket>> {
    return super.post<ITicket>(`${this.resourceUrl}/issued-by-complaint`, ticket, { loading});
  }

  update(ticket: Ticket, id: any, loading = false): Observable<EntityResponseType<ITicket>> {

    return super.post<ITicket>(`${this.resourceUrl}/${(id)}/update)`, ticket, { loading});
  }

  delete(id: any, loading = false): Observable<EntityResponseType<ITicket>> {
    return super.post<ITicket>(`${this.resourceUrl}/${id}/delete`, {}, { loading});
  }

  // deleteTickets(ids: any, isLoading = false): Observable<EntityResponseType> {
  //   return this.http
  //     .post<IBaseResponse>(`${this.resourceUrl}/delete-tickets`, ids, {observe: "response", headers: CommonUtil.headers(isLoading)});
  // }

  getById(id: any, loading = false): Observable<EntityResponseType<ITicket>> {
    return super.get<ITicket>(`${this.resourceUrl}/${id}`, {loading});
  }

  handleTicket(id: any, request: any, loading = false): Observable<EntityResponseType<ITicket>> {
    return super.post<ITicket>(`${this.resourceUrl}/${id}/handle`, request, {loading});
  }

  receiveTicket(id: any, request: any, loading = false): Observable<EntityResponseType<ITicket>> {
    return super.post<ITicket>(`${this.resourceUrl}/${id}/receive`, request, {loading});
  }

  completeTicket(id: any, request: any, loading = false): Observable<EntityResponseType<ITicket>> {
    return super.post<ITicket>(`${this.resourceUrl}/${id}/complete`, request, {loading});
  }

  getStatistical(options?: any, loading = false): Observable<EntityResponseType<IStatistical>> {
    return super.post<IStatistical>(`${this.resourceUrl}/statistic`, options, {loading});
  }
}
