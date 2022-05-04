import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { IComplaintTemplate } from '@shared/models/complaint-template.model';
import { IComplaintTemplateRequest } from '@shared/models/request/Complaint-template-request.model';
import {
  AbstractService,
  EntityResponseType,
} from '@shared/services/common/abstract.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QrTemplateService extends AbstractService {
  private resourceUrl = SERVICE.TICKET + '/complaint-templates';

  private publicResourceUrl = SERVICE.TICKET + '/public/qr-code-templates';

  public publicUrl = SERVICE.TICKET;

  constructor(protected http: HttpClient) {
    super(http);
  }

  public findById(
    id: string,
    loading = true
  ): Observable<EntityResponseType<IComplaintTemplate>> {
    return super.get<IComplaintTemplate>(`${this.resourceUrl}/${id}`, {
      loading,
    });
  }

  public create(
    qrTemplate: IComplaintTemplate,
    loading = false
  ): Observable<EntityResponseType<IComplaintTemplate>> {
    return super.post<IComplaintTemplate>(this.resourceUrl, qrTemplate, {
      loading,
    });
  }

  public update(
    templateId: string,
    qrTemplate: IComplaintTemplate,
    loading = false
  ): Observable<EntityResponseType<IComplaintTemplate>> {
    return super.post<IComplaintTemplate>(
      `${this.resourceUrl}/${templateId}/update`,
      qrTemplate,
      { loading }
    );
  }

  public delete(
    id: string,
    loading = false
  ): Observable<EntityResponseType<IComplaintTemplate>> {
    return super.post<IComplaintTemplate>(
      `${this.resourceUrl}/${id}/delete`,
      {},
      { loading }
    );
  }

  public active(
    id: string,
    reason: string,
    loading = false
  ): Observable<EntityResponseType<IComplaintTemplate>> {
    return super.post<IComplaintTemplate>(
      `${this.resourceUrl}/${id}/active`,
      { reason },
      { loading }
    );
  }

  public inactive(
    id: string,
    reason: string,
    loading = false
  ): Observable<EntityResponseType<IComplaintTemplate>> {
    return super.post<IComplaintTemplate>(
      `${this.resourceUrl}/${id}/inactive`,
      { reason },
      { loading }
    );
  }

  public getByBuildingAndFloor(
    buildingId: string,
    floorId: string
  ): Observable<EntityResponseType<IComplaintTemplate>> {
    return super.get<IComplaintTemplate>(
      this.publicResourceUrl + '/building/' + buildingId + '/floor/' + floorId
    );
  }

  public searchComplaintTemplate(
    params?: IComplaintTemplateRequest,
    loading = true
  ): Observable<EntityResponseType<IComplaintTemplate[]>> {
    return super.get<IComplaintTemplate[]>(this.resourceUrl, {
      loading,
      params,
    });
  }

  public getComplaintTemplateIdPublic(
    complaintTemplateId: string,
    loading = false
  ): Observable<EntityResponseType<IComplaintTemplate>> {
    return super.get<IComplaintTemplate>(
      `${this.publicUrl}/public/complaint-templates/${complaintTemplateId}`,
      { loading }
    );
  }

  public getHistoriesComplaintTemplate(
    complaintTemplateId: string,
    params: any,
    loading = false
  ): Observable<EntityResponseType<any>> {
    return super.get<any>(
      `${this.publicUrl}/complaint-templates/${complaintTemplateId}/update-histories`,
      { loading, params }
    );
  }
}
