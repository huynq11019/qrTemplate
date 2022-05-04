import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { IUserLevel } from '@shared/models/user-level.models';
import {
  AbstractService,
  EntityResponseType,
} from '@shared/services/common/abstract.service';
import { Observable } from 'rxjs';
import { IChangePassword } from '../models/request/change-password-request.model';
import { IUserRequest } from '../models/request/user-request.model';
import { IUser, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService extends AbstractService {
  public resourceUrl = SERVICE.IAM + '/users';

  constructor(protected http: HttpClient) {
    super(http);
  }

  // findAll(loading = false): Observable<EntityResponseType> {
  //   return this.http
  //     .get<IBaseResponse>(`${this.resourceUrl}`, {
  //       observe: 'response', headers: CommonUtil.headers(loading)
  //     });
  // }

  search(
    params?: IUserRequest,
    loading = false
  ): Observable<EntityResponseType<IUser[]>> {
    return super.get<IUser[]>(`${this.resourceUrl}/search`, {
      params,
      loading,
    });
  }

  create(user: User, loading = false): Observable<EntityResponseType<IUser>> {
    return super.post<IUser>(`${this.resourceUrl}`, user, { loading });
  }

  createLdap(
    user: User,
    loading = false
  ): Observable<EntityResponseType<IUser>> {
    return super.post<IUser>(`${this.resourceUrl}/customer`, user, { loading });
  }

  createContact(
    user: User,
    loading = false
  ): Observable<EntityResponseType<IUser>> {
    return super.post<IUser>(`${this.resourceUrl}/contact`, user, { loading });
  }

  update(
    user: User,
    id: any,
    loading = false
  ): Observable<EntityResponseType<IUser>> {
    return super.post<IUser>(`${this.resourceUrl}/${id}/update`, user, {
      loading,
    });
  }

  // delete(id: any, loading = false): Observable<EntityResponseType<Void>> {
  //   return super.delete<Void>(`${this.resourceUrl}/${id}`, user, {loading});
  // }

  find(id: any, loading = false): Observable<EntityResponseType<IUser>> {
    return super.get<IUser>(`${this.resourceUrl}/${id}`, { loading });
  }

  // deleteUsers(ids: any, loading = false): Observable<EntityResponseType<Void>> {
  //   return super.post<Void>(`${this.resourceUrl}/delete-by-ids`, ids, {loading});
  // }

  active(
    userId: any,
    loading = false
  ): Observable<EntityResponseType<boolean>> {
    return super.post<boolean>(
      `${this.resourceUrl}/${userId}/active`,
      {},
      { loading }
    );
  }

  inactive(
    userId: any,
    loading = false
  ): Observable<EntityResponseType<boolean>> {
    return super.post<boolean>(
      `${this.resourceUrl}/${userId}/inactive`,
      {},
      { loading }
    );
  }

  changePassword(
    userId: any,
    params: IChangePassword,
    loading = true
  ): Observable<EntityResponseType<IUser>> {
    return super.post<IUser>(
      `${this.resourceUrl}/${userId}/change-password`,
      params,
      { loading }
    );
  }

  searchUsersAutoComplete(
    params?: any,
    loading = false
  ): Observable<EntityResponseType<IUser[]>> {
    return super.get<IUser[]>(`${this.resourceUrl}/auto-complete`, {
      params,
      loading,
    });
  }

  findCustomersByBuildings(
    ids: { ids: string[] },
    loading = false
  ): Observable<EntityResponseType<IUser[]>> {
    return super.post<IUser[]>(
      `${this.resourceUrl}/find-customer-by-building-ids`,
      ids,
      { loading }
    );
  }

  findUserLevel(loading = false): Observable<EntityResponseType<IUserLevel[]>> {
    return super.get<IUserLevel[]>(`${this.resourceUrl}/user-level`, {
      loading,
    });
  }

  findByUserIds(
    ids?: string[],
    loading = false
  ): Observable<EntityResponseType<IUser[]>> {
    return super.post<IUser[]>(
      `${this.resourceUrl}/find-by-ids`,
      { ids },
      { loading }
    );
  }
}
