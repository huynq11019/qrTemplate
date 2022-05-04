import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import {
  AbstractService,
  EntityResponseType,
} from '@shared/services/common/abstract.service';
import { Observable } from 'rxjs';
import { RoleRequest } from '../models/request/role-request.model';
import { IRole, Role } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends AbstractService {
  public resourceUrl = SERVICE.IAM + '/roles';

  constructor(protected http: HttpClient) {
    super(http);
  }

  // findAll(loading = false): Observable<EntityResponseType<IRole>> {
  //   return super.get<IRole>(`${this.resourceUrl}`, {loading});
  // }

  // findCachedAll(loading = false): Observable<EntityResponseType<IRole>> {
  //   return super.get<IRole>(`${this.resourceUrl}/cached`, {loading});
  // }

  create(role: Role, loading = false): Observable<EntityResponseType<IRole>> {
    return super.post<IRole>(`${this.resourceUrl}`, role, { loading });
  }

  update(
    role: Role,
    id: any,
    loading = false
  ): Observable<EntityResponseType<IRole>> {
    return super.post<IRole>(`${this.resourceUrl}/${id}/update`, role, {
      loading,
    });
  }

  delete(id: any, loading = false): Observable<EntityResponseType<IRole>> {
    return super.post<IRole>(
      `${this.resourceUrl}/${id}/delete`,
      {},
      { loading }
    );
  }

  findById(id: any, loading = false): Observable<EntityResponseType<IRole>> {
    return super.get<IRole>(`${this.resourceUrl}/${id}`, { loading });
  }

  active(
    roleId: any,
    loading = false
  ): Observable<EntityResponseType<boolean>> {
    return super.post<boolean>(
      `${this.resourceUrl}/${roleId}/active`,
      {},
      { loading }
    );
  }

  inactive(
    roleId: any,
    loading = false
  ): Observable<EntityResponseType<boolean>> {
    return super.post<boolean>(
      `${this.resourceUrl}/${roleId}/inactive`,
      {},
      { loading }
    );
  }

  // Api lấy hết list role
  search(
    params?: RoleRequest,
    loading = false
  ): Observable<EntityResponseType<IRole[]>> {
    return super.get<IRole[]>(`${this.resourceUrl}`, { params, loading });
  }

  searchAutoComplete(
    params?: RoleRequest,
    loading = false
  ): Observable<EntityResponseType<IRole[]>> {
    return super.get<IRole[]>(`${this.resourceUrl}/auto-complete`, {
      params,
      loading,
    });
  }
}
