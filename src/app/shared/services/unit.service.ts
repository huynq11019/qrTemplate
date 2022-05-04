import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { EntityResponseType } from '@shared/services/common/abstract.service';
import { Observable } from 'rxjs';
import { IFloorRequest } from '../models/request/floor-request.model';
import { IUnitRequest } from '../models/request/unit-request.model';
import { Unit } from '../models/unit.model';
import { IUnit } from './../models/unit.model';
import { AbstractService } from './common/abstract.service';

@Injectable({
  providedIn: 'root',
})
export class UnitService extends AbstractService {
  public resourceUrl = SERVICE.BUILDING + '/units';

  constructor(protected http: HttpClient) {
    super(http);
  }

  getById(id: any, loading = false): Observable<EntityResponseType<IUnit>> {
    return super.get<IUnit>(`${this.resourceUrl}/${id}`, { loading });
  }

  create(unit: Unit, loading = false): Observable<EntityResponseType<IUnit>> {
    return super.post<IUnit>(`${this.resourceUrl}`, unit, { loading });
  }

  update(
    unit: Unit,
    id: string,
    loading = false
  ): Observable<EntityResponseType<IUnit>> {
    return super.post<IUnit>(`${this.resourceUrl}/${id}/update`, unit, {
      loading,
    });
  }

  search(
    options?: IUnitRequest,
    loading = false
  ): Observable<EntityResponseType<IUnit[]>> {
    return super.get<IUnit[]>(`${this.resourceUrl}`, {
      params: options,
      loading,
    });
  }

  searchAutoComplete(
    options?: IUnitRequest,
    loading = false
  ): Observable<EntityResponseType<IUnit[]>> {
    return super.get<IUnit[]>(`${this.resourceUrl}/auto-complete`, {
      params: options,
      loading,
    });
  }

  searchFloorByBuilding(
    id: any,
    options?: IFloorRequest,
    loading = false
  ): Observable<EntityResponseType<IUnit[]>> {
    return super.get<IUnit[]>(`${this.resourceUrl}/${id}/floors`, {
      params: options,
      loading,
    });
  }

  removeUnit(id: any, loading = false): Observable<EntityResponseType<IUnit>> {
    return super.post<IUnit>(
      `${this.resourceUrl}/${id}/delete`,
      {},
      { loading }
    );
  }
}
