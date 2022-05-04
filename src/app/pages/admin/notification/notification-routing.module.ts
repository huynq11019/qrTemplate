import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guard';
import { ROUTER_UTILS } from '@shared/utils/router.utils';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationUpdateComponent } from './notification-update/notification-update.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['notification:view'],
      title: 'model.notification.title',
    },
  },
  {
    path: ROUTER_UTILS.notification.create,
    component: NotificationUpdateComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['notification:create'],
      title: 'model.notification.title',
      isCreate: true,
    },
  },
  {
    path: ROUTER_UTILS.notification.update,
    component: NotificationUpdateComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['notification:update'],
      title: 'model.notification.title',
      isUpdate: true,
    },
  },
  {
    path: ROUTER_UTILS.notification.detail,
    component: NotificationUpdateComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['notification:view'],
      title: 'model.notification.title',
      isDetail: true,
    },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationRoutingModule {}
