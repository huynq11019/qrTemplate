import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { ICriteria } from '@shared/models/criteria.model';
import { IQuestion } from '@shared/models/question.model';
import {
  AbstractService,
  EntityResponseType,
} from '@shared/services/common/abstract.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionGroupService extends AbstractService {
  public resourceUrl = SERVICE.SURVEY + '/question-groups';

  constructor(protected http: HttpClient) {
    super(http);
  }

  getAll(loading = false): Observable<EntityResponseType<ICriteria[]>> {
    return super.get<ICriteria[]>(`${this.resourceUrl}`, { loading });
  }

  getById(
    questionGroupId: string,
    loading = false
  ): Observable<EntityResponseType<ICriteria>> {
    return super.get<ICriteria>(`${this.resourceUrl}/${questionGroupId}`, {
      loading,
    });
  }

  // getAllQuestionByQuestionGroupId(questionGroupId: string,
  //                                 loading = false): Observable<EntityResponseType<IQuestion[]>> {
  //   return super.get<IQuestion[]>(`${this.resourceUrl}/${questionGroupId}/questions`, {loading});
  // }

  getAllQuestionByQuestionGroupIds(
    options: {},
    loading = false
  ): Observable<EntityResponseType<IQuestion[]>> {
    return super.post<IQuestion[]>(`${this.resourceUrl}/questions`, options, {
      loading,
    });
  }

  getBySurveyIds(
    options: {},
    loading = false
  ): Observable<EntityResponseType<ICriteria[]>> {
    return super.post<ICriteria[]>(
      `${this.resourceUrl}/find-by-survey-ids`,
      options,
      { loading }
    );
  }
}
