import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { SupportComponent } from './support/support.component';
import { SurveyAdvanceSearchComponent } from './survey-list/survey-advance-search/survey-advance-search.component';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { UpdateSurveyComponent } from './survey-list/update-survey/update-survey.component';
import { SurveyResultAdvanceSearchComponent } from './survey-result/survey-result-advance-search/survey-result-advance-search.component';
import { SurveyResultDetailComponent } from './survey-result/survey-result-detail/survey-result-detail.component';
import { SurveyResultExportComponent } from './survey-result/survey-result-export/survey-result-export.component';
import { SurveyResultComponent } from './survey-result/survey-result.component';
import { SurveyRoutingModule } from './survey-routing.module';

@NgModule({
  declarations: [
    SupportComponent,
    SurveyListComponent,
    SurveyResultComponent,
    SurveyResultDetailComponent,
    UpdateSurveyComponent,
    SurveyAdvanceSearchComponent,
    SurveyResultAdvanceSearchComponent,
    SurveyResultExportComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SurveyRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SurveyModule {
}
