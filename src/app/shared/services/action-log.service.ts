import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { IActionLog } from '@shared/models/action-log.model';
import { ActionLogRequest } from '@shared/models/request/action-log-request.model';
import { Observable } from 'rxjs';
import { AbstractService, EntityResponseType } from './common/abstract.service';

@Injectable({
  providedIn: 'root'
})
export class ActionLogService extends AbstractService {
  public resourceUrl = SERVICE.SYSTEM + '/action-logs';

  constructor(protected http: HttpClient) {
    super(http);
  }

  search(
    params?: ActionLogRequest,
    loading = false
  ): Observable<EntityResponseType<IActionLog[]>> {
    return super.get<IActionLog[]>(`${this.resourceUrl}`, { params, loading});
  }

  findById(
    id?: string,
    loading = false
  ): Observable<EntityResponseType<IActionLog>> {
    return super.get<IActionLog>(`${this.resourceUrl}/${id}`, { loading } )
  }

  autocompleteUri(params?: ActionLogRequest , loading = false): Observable<EntityResponseType<string[]>> {
    return super.get<string[]>(`${this.resourceUrl}/uris/auto-complete`, { params, loading})
  }
}
