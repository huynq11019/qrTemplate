import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { IUser } from '@shared/models/user.model';
import {
  AbstractService,
  EntityResponseType,
} from '@shared/services/common/abstract.service';
import { Observable } from 'rxjs';
import { Building, IBuilding } from '../models/building.model';
import { Floor, IFloor } from '../models/floor.model';
import { IBuildingRequest } from '../models/request/building-request.model';
import { IFloorRequest } from '../models/request/floor-request.model';

@Injectable({
  providedIn: 'root',
})
export class BuildingService extends AbstractService {
  public resourceUrl = SERVICE.BUILDING + '/buildings';

  constructor(protected http: HttpClient) {
    super(http);
  }

  getById(id: any, loading = false): Observable<EntityResponseType<IBuilding>> {
    return super.get<IBuilding>(`${this.resourceUrl}/${id}`, { loading });
  }

  create(
    building: Building,
    loading = false
  ): Observable<EntityResponseType<IBuilding>> {
    return super.post<IBuilding>(`${this.resourceUrl}`, building, { loading });
  }

  update(
    building: Building,
    id: string,
    loading = false
  ): Observable<EntityResponseType<IBuilding>> {
    return super.post<IBuilding>(`${this.resourceUrl}/${id}/update`, building, {
      loading,
    });
  }

  search(
    params?: IBuildingRequest,
    loading = false
  ): Observable<EntityResponseType<IBuilding[]>> {
    return super.get<IBuilding[]>(`${this.resourceUrl}`, { params, loading });
  }

  simpleSearch(
    params?: IBuildingRequest,
    loading = false
  ): Observable<EntityResponseType<IBuilding[]>> {
    return super.get<IBuilding[]>(`${this.resourceUrl}/auto-complete`, {
      params,
      loading,
    });
  }

  simpleSearchFloor(
    buildingId: any,
    params?: IFloorRequest,
    loading = false
  ): Observable<EntityResponseType<IFloor[]>> {
    return super.get<IFloor[]>(
      `${this.resourceUrl}/${buildingId}/floors/auto-complete`,
      { params, loading }
    );
  }

  searchFloorByBuilding(
    id: any,
    params?: IFloorRequest,
    loading = false
  ): Observable<EntityResponseType<IFloor[]>> {
    return super.get<IFloor[]>(`${this.resourceUrl}/${id}/floors`, {
      params,
      loading,
    });
  }

  createFloor(
    id: any,
    floor: Floor,
    loading = false
  ): Observable<EntityResponseType<IFloor>> {
    return super.post<IFloor>(`${this.resourceUrl}/${id}/floors`, floor, {
      loading,
    });
  }

  updateFloor(
    floor: Floor,
    buildingId?: string,
    floorId?: string,
    loading = false
  ): Observable<EntityResponseType<IFloor>> {
    return super.post<IFloor>(
      `${this.resourceUrl}/${buildingId}/floors/${floorId}/update`,
      floor,
      { loading }
    );
  }

  invalidBuilding(
    id: string,
    loading = false
  ): Observable<EntityResponseType<IBuilding>> {
    return super.post<IBuilding>(
      `${this.resourceUrl}/${id}/invalid`,
      {},
      { loading }
    );
  }

  activeBuilding(
    id: string,
    loading = false
  ): Observable<EntityResponseType<IBuilding>> {
    return super.post<IBuilding>(
      `${this.resourceUrl}/${id}/active`,
      {},
      { loading }
    );
  }

  deleteFloor(
    buildingId?: string,
    floorId?: string,
    loading = false
  ): Observable<EntityResponseType<IBuilding>> {
    return super.post<IBuilding>(
      `${this.resourceUrl}/${buildingId}/floors/${floorId}/delete`,
      {},
      { loading }
    );
  }

  // Search building manager in building
  searchManagerByBuilding(
    buildingIds: string,
    params?: IBuildingRequest,
    loading = false
  ): Observable<EntityResponseType<IUser[]>> {
    return super.get<IUser[]>(`${this.resourceUrl}/${buildingIds}/employees`, {
      params,
      loading,
    });
  }

  searchBuildingAutoComplete(
    params?: IBuildingRequest,
    loading = false
  ): Observable<EntityResponseType<IBuilding[]>> {
    return super.get<IBuilding[]>(`${this.resourceUrl}/auto-complete`, {
      params,
      loading,
    });
  }

  findByBuildingIds(
    ids: string[],
    loading = false
  ): Observable<EntityResponseType<IBuilding[]>> {
    return super.post<IBuilding[]>(
      `${this.resourceUrl}/find-all-by-ids`,
      { ids },
      { loading }
    );
  }
}
