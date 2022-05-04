import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBuilding } from '@shared/models/building.model';
import {
  AbstractService,
  EntityResponseType,
} from '@shared/services/common/abstract.service';
import { Observable } from 'rxjs';
import { SERVICE } from '../constants/gateway-routes-api.constant';

@Injectable({
  providedIn: 'root',
})
export class AccountService extends AbstractService {
  public resourceUrl = SERVICE.IAM;

  constructor(protected http: HttpClient) {
    super(http);
  }

  /**
   * Lấy tòa nhà theo người dùng đang đăng nhập
   *
   * @param loading
   * @returns IBuilding
   */
  getBuildings(loading = true): Observable<EntityResponseType<IBuilding[]>> {
    return super.get<IBuilding[]>(`${this.resourceUrl}/me/buildings`, {
      loading,
    });
  }
}
