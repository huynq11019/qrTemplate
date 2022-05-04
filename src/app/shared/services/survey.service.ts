import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {IBuilding} from '@shared/models/building.model';
import {ChartSurvey} from '@shared/models/chart-survey.model';
import {SurveyResult} from '@shared/models/survey-result.model';
import {ISurvey, Survey} from '@shared/models/survey.model';
import {Observable} from 'rxjs';
import {SurveyRequest} from '../models/request/survey-request.model';
import {SERVICE} from './../constants/gateway-routes-api.constant';
import {AbstractService, EntityResponseType} from './common/abstract.service';

@Injectable({
  providedIn: 'root'
})
export class SurveyService extends AbstractService {

  public resourceUrl = SERVICE.SURVEY + '/surveys';

  public resourceUrlRef = SERVICE.SURVEY + '/surveys';

  public resourceResultUrl = SERVICE.SURVEY + '/survey-results';

  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  search(params?: SurveyRequest, loading = false): Observable<EntityResponseType<ISurvey[]>> {
    return super.get<ISurvey[]>(`${this.resourceUrl}`, {params, loading});
  }

  searchAutoComplete(params?: SurveyRequest, loading = false): Observable<EntityResponseType<ISurvey[]>> {
    return super.get<ISurvey[]>(`${this.resourceUrl}/auto-complete`, {params, loading});
  }

  delete(id: any, loading = false): Observable<EntityResponseType<ISurvey>> {
    return super.post<ISurvey>(`${this.resourceUrl}/${id}/delete`, {}, {loading});
  }

  create(survey: Survey, loading = false): Observable<EntityResponseType<ISurvey>> {
    return super.post<ISurvey>(`${this.resourceUrl}`, survey, {loading});
  }

  update(survey: Survey, id: any, loading = false): Observable<EntityResponseType<ISurvey>> {
    return super.post<ISurvey>(`${this.resourceUrl}/${id}/update`, survey, {loading});
  }

  findBySurveyId(id: string, loading = false): Observable<EntityResponseType<ISurvey>> {
    return super.get<ISurvey>(`${this.resourceUrl}/${id}`, {loading});
  }

  // getQuestionsSurveyId(surveyId: string, loading = false): Observable<EntityResponseType<IQuestion[]>> {
  //   return super.get<IQuestion[]>(`${this.resourceUrl}/${surveyId}/questions`, {loading});
  // }

  updateStatusSurvey(surveyId: string, surveyUpdateStatus: {},
                     loading = false): Observable<EntityResponseType<ISurvey>> {
    return super.post<ISurvey>(`${this.resourceUrl}/${surveyId}/update-status`, surveyUpdateStatus, {loading});
  }

  sendSurvey(surveyId: string, loading = false): Observable<EntityResponseType<ISurvey>> {
    return super.post<ISurvey>(`${this.resourceUrl}/${surveyId}/sent`, {}, {loading});
  }

  searchSummaryByCustomer(params?: any, loading = true): Observable<EntityResponseType<SurveyResult[]>> {
    return super.get<SurveyResult[]>(`${this.resourceResultUrl}/summary-by-customer`, {params, loading});
  }

  searchSummaryBySurvey(params?: any, loading = true): Observable<EntityResponseType<SurveyResult[]>> {
    return super.get<SurveyResult[]>(`${this.resourceResultUrl}/summary-by-survey`, {params, loading});
  }

  searchDetailSummaryByCustomer(surveyId: string, params?: any,
                                loading = true): Observable<EntityResponseType<SurveyResult[]>> {
    return super.get<SurveyResult[]>(`${this.resourceResultUrl}/${surveyId}/summary-by-customer`, {params, loading});
  }

  findDetailSummary(surveyId: string, params?: any, loading = true): Observable<EntityResponseType<SurveyResult>> {
    return super.get<SurveyResult>(`${this.resourceResultUrl}/surveys/${surveyId}/summary`, {params, loading});
  }

  /**
   *
   *
   * @author hieu.daominh
   * @date 2022-01-06
   * @param  surveyId: string
   * @param  [options]: *
   * @param  [loading=true]: boolean
   * @returns Observable<any>: any
   *
   */
  export(surveyId: string, options?: any, loading = true): Observable<any> {
    return super.postFile(`${this.resourceUrlRef}/${surveyId}/export/results`, options, {loading});
  }

  // export(surveyId: string, options?: any, loading = true): Observable<any> {
  //   const headers = new HttpHeaders({
  //     loading: loading ? 'true' : 'false',
  //   });
  //   return this.http.post(`${this.resourceUrl}/${surveyId}/export/results`, options,
  //     {
  //       headers,
  //       responseType: 'blob',
  //       observe: 'response'
  //     });
  // }

  /**
   *
   *
   * @author hieu.daominh
   * @date 2022-01-06
   * @param surveyId string
   * @param [loading=true]: boolean
   * @returns Observable<any> any
   *
   */
  exportAll(surveyId: string, loading = true): Observable<any> {
    return super.postFile(`${this.resourceUrlRef}/${surveyId}/export-all`, {}, {loading});
  }

  // exportAll(surveyId: string, loading = true): Observable<any> {
  //   const headers = new HttpHeaders({
  //     loading: loading ? 'true' : 'false',
  //   });
  //   return this.http.post(`${this.resourceUrl}/${surveyId}/export-all`, {},
  //     {
  //       headers,
  //       responseType: 'blob',
  //       observe: 'response'
  //     });
  // }

  getChartSurvey(params?: any, loading = true): Observable<EntityResponseType<ChartSurvey>> {
    return super.get<ChartSurvey>(`${this.resourceResultUrl}/chart`,
      {
        params,
        loading,
      });
  }

  getBuildingsBySurveyIds(options: {}, loading = false): Observable<EntityResponseType<IBuilding[]>> {
    return super.post<IBuilding[]>(`${this.resourceUrl}/find-building-by-survey`, options, {loading});
  }

}
