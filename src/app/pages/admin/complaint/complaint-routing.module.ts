import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ROUTER_UTILS} from '@shared/utils/router.utils';
import {ComplaintDetailComponent} from './complaint-list/complaint-detail/complaint-detail.component';
import {ComplaintListComponent} from './complaint-list/complaint-list.component';
import {ComplaintReportComponent} from './complaint-report/complaint-report.component';
import {QrManagerComponent} from './qr-manager/qr-manager.component';
import {QrUpdateComponent} from './qr-manager/qr-update/qr-update.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: ROUTER_UTILS.complaint.list,
    pathMatch: 'full'
  },
  {
    path: ROUTER_UTILS.complaint.list,
    component: ComplaintListComponent,
    data: {
      authorities: ['complaint:view'],
      title: 'model.complaint.title'
    }
  },
  {
    path: ROUTER_UTILS.complaint.detail,
    component: ComplaintDetailComponent,
    data: {
      authorities: ['complaint:view'],
      title: 'model.complaint.title'
    }
  },
  {
    path: ROUTER_UTILS.complaint.qrCreate,
    component: QrUpdateComponent,
    data: {
      authorities: ['complaint_template:create'],
      title: 'model.qr-manager.title'
    }
  },
  {
    path: ROUTER_UTILS.complaint.qrUpdate,
    component: QrUpdateComponent,
    data: {
      authorities: ['complaint_template:view', 'complaint_template:create', 'complaint_template:update'],
      title: 'model.qr-manager.title'
    }
  },
  {
    path: ROUTER_UTILS.complaint.qrList,
    component: QrManagerComponent,
    data: {
      authorities: ['complaint_template:view'],
      title: 'model.qr-manager.title'
    }
  },
  {
    path: ROUTER_UTILS.complaint.report,
    component: ComplaintReportComponent,
    data: {
      authorities: ['complaint:report'],
      title: 'model.complaint-report.title'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplaintRoutingModule {
}
