import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { Complaint, IComplaint } from '@shared/models/complaint.model';
import { IFeedBackIStatistical } from '@shared/models/feedBackIStatistical.model';
import { IComplaintStatisticRequest } from '@shared/models/request/ComplaintStatisticRequest.model';
import {
  AbstractService,
  EntityResponseType,
} from '@shared/services/common/abstract.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComplaintService extends AbstractService {
  private resourceUrl = SERVICE.TICKET + '/complaints';

  public publicUrl = SERVICE.TICKET;

  constructor(protected http: HttpClient) {
    super(http);
  }

  public findById(
    id: string,
    loading = false
  ): Observable<EntityResponseType<IComplaint>> {
    return super.get<IComplaint>(`${this.resourceUrl}/${id}`, { loading });
  }

  // public create(qrTemplate: IQrTemplate, loading = false): Observable<EntityResponseType<IQrTemplate>> {
  //   return super.post<IQrTemplate>(this.resourceUrl, qrTemplate, {loading});
  // }

  // public update(qrTemplate: IQrTemplate, loading = false): Observable<EntityResponseType<IQrTemplate>> {
  //   return super.post<IQrTemplate>(`${this.resourceUrl}/update`, qrTemplate, {loading});
  // }

  public delete(
    id: string,
    loading = false
  ): Observable<EntityResponseType<IComplaint>> {
    return super.post<IComplaint>(
      `${this.resourceUrl}/${id}/delete`,
      {},
      { loading }
    );
  }

  public deletes(
    complaintIds: string[],
    loading = false
  ): Observable<EntityResponseType<IComplaint>> {
    return super.post<IComplaint>(
      `${this.resourceUrl}/delete`,
      { complaintIds },
      { loading }
    );
  }

  public markAsSpam(
    complaintIds: string[],
    invalidReason: string,
    loading = false
  ): Observable<EntityResponseType<boolean>> {
    return super.post<boolean>(
      `${this.resourceUrl}/mark-as-spam`,
      { complaintIds, invalidReason },
      { loading }
    );
  }

  public close(
    complaintId: string,
    note: string,
    loading = false
  ): Observable<EntityResponseType<boolean>> {
    return super.post<boolean>(
      `${this.resourceUrl}/close `,
      { complaintId, note },
      { loading }
    );
  }

  public markAsMisClassification(
    complaintId: string,
    feedback?: string,
    loading = false
  ): Observable<EntityResponseType<IComplaint>> {
    return super.post<IComplaint>(
      `${this.resourceUrl}/${complaintId}/mark-as-mis-classification`,
      { feedback },
      { loading }
    );
  }

  // public active(id: string, loading = false): Observable<EntityResponseType<IQrTemplate>> {
  //   return super.put<IQrTemplate>(`${this.resourceUrl}/${id}/active`, {}, {loading});
  // }

  // public inactive(id: string, loading = false): Observable<EntityResponseType<IQrTemplate>> {
  //   return super.put<IQrTemplate>(`${this.resourceUrl}/${id}/inactive`, {}, {loading});
  // }

  // public getByBuildingAndFloor(buildingId: string, floorId: string): Observable<EntityResponseType<IQrTemplate>> {
  //   return super.get<IQrTemplate>(this.publicResourceUrl + '/building/' + buildingId + '/floor/' + floorId);
  // }

  public searchComplaints(
    params?: any,
    loading = false
  ): Observable<EntityResponseType<IComplaint[]>> {
    return super.get<IComplaint[]>(this.resourceUrl, { loading, params });
  }

  public statisticComplaint(
    params: IComplaintStatisticRequest,
    loading = false
  ): Observable<EntityResponseType<IFeedBackIStatistical[]>> {
    return super.post<IFeedBackIStatistical[]>(
      `${this.resourceUrl}/statistic`,
      params,
      { loading }
    );
  }

  createComplaint(
    body: Complaint,
    loading = false
  ): Observable<EntityResponseType<IComplaint>> {
    return super.post<IComplaint>(`${this.publicUrl}/public/complaints`, body, {
      loading,
    });
  }

  // findById(id: string, loading = false): Observable<EntityResponseType<IComplaint>> {
  //   return super
  //     .get<IComplaint>(`${this.resourceUrl}/${id}`, {loading});
  // }
}
