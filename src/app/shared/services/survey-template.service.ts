import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import {
  AbstractService,
  EntityResponseType,
} from '@shared/services/common/abstract.service';
import { Observable } from 'rxjs';
import { SurveyTemplateRequest } from '../models/request/survey-template-request.model';
import {
  ISurveyTemplate,
  SurveyTemplate,
} from '../models/survey-template.model';

@Injectable({
  providedIn: 'root',
})
export class SurveyTemplateService extends AbstractService {
  public resourceUrl = SERVICE.SURVEY + '/survey-templates';

  constructor(protected http: HttpClient) {
    super(http);
  }

  getById(
    id: string,
    loading = false
  ): Observable<EntityResponseType<ISurveyTemplate>> {
    return super.get<ISurveyTemplate>(`${this.resourceUrl}/${id}`, { loading });
  }

  search(
    params?: SurveyTemplateRequest,
    loading = false
  ): Observable<EntityResponseType<ISurveyTemplate[]>> {
    return super.get<ISurveyTemplate[]>(`${this.resourceUrl}`, {
      params,
      loading,
    });
  }

  delete(
    id: any,
    loading = false
  ): Observable<EntityResponseType<ISurveyTemplate>> {
    return super.post<ISurveyTemplate>(
      `${this.resourceUrl}/${id}/delete`,
      {},
      { loading }
    );
  }

  create(
    surveyTemplate: SurveyTemplate,
    loading = false
  ): Observable<EntityResponseType<ISurveyTemplate>> {
    return super.post<ISurveyTemplate>(`${this.resourceUrl}`, surveyTemplate, {
      loading,
    });
  }

  update(
    surveyTemplate: SurveyTemplate,
    id: any,
    loading = false
  ): Observable<EntityResponseType<ISurveyTemplate>> {
    return super.post<ISurveyTemplate>(
      `${this.resourceUrl}/${id}/update`,
      surveyTemplate,
      { loading }
    );
  }
}
