import {SurveyResultDetailComponent} from './survey-result/survey-result-detail/survey-result-detail.component';
import {SurveyResultComponent} from './survey-result/survey-result.component';
import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuard} from '@core/guard/auth.guard';
import {SurveyListComponent} from './survey-list/survey-list.component';
import {UpdateSurveyComponent} from './survey-list/update-survey/update-survey.component';
import {ROUTER_UTILS} from '@shared/utils/router.utils';

const routes: Routes = [
  {
    path: ROUTER_UTILS.survey.list,
    component: SurveyListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['survey:view'],
      title: 'model.survey.listTitle'
    }
  },
  {
    path: ROUTER_UTILS.survey.result,
    component: SurveyResultComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['survey:report'],
      title: 'model.survey.resultTitle'
    }
  },
  {
    path: ROUTER_UTILS.survey.detailResult,
    component: SurveyResultDetailComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['survey:report'],
      title: 'model.survey.resultTitle'
    },
  },
  {
    path: ROUTER_UTILS.survey.create,
    component: UpdateSurveyComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['survey:create'],
      title: 'model.survey.listTitle'
    },
  },
  {
    path: ROUTER_UTILS.survey.update,
    component: UpdateSurveyComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['survey:update'],
      title: 'model.survey.listTitle'
    },
  },
  {
    path: ROUTER_UTILS.survey.detail,
    component: UpdateSurveyComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['survey:view'],
      title: 'model.survey.listTitle'
    },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule {
}
