import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import {
  AbstractService,
  EntityResponseType,
} from '@shared/services/common/abstract.service';
import { Observable } from 'rxjs';
import { IPermission } from './../models/permission.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionService extends AbstractService {
  public resourceUrl = SERVICE.IAM + '/permissions';

  constructor(protected http: HttpClient) {
    super(http);
  }

  findAll(loading = false): Observable<EntityResponseType<IPermission[]>> {
    return super.get<IPermission[]>(`${this.resourceUrl}`, { loading });
  }
}
