import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { ReportRoutingModule } from './report-routing.module';
import { SystemReportComponent } from './system-report/system-report.component';
import { AdvancedSearchReportComponent } from './system-report/advanced-search-report/advanced-search-report.component';


@NgModule({
  declarations: [
    SystemReportComponent,
    AdvancedSearchReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReportRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
  ]
})
export class ReportModule {
}
