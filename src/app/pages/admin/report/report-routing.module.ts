import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guard';
import { SystemReportComponent } from './system-report/system-report.component';
const routes: Routes = [
  {
    path: '',
    component: SystemReportComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['ticket:report'],
      title: 'sidebar.report',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
