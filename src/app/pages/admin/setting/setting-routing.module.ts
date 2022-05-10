import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guard/auth.guard';
import { ROUTER_UTILS } from '@shared/utils/router.utils';
import { RoleComponent } from './role/role.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: ROUTER_UTILS.setting.user,
    component: UserComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['user:view'],
      title: 'model.user.title',
    },
  },
  {
    path: ROUTER_UTILS.setting.userCreate,
    component: UpdateUserComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['user:create'],
      title: 'model.user.title',
    },
  },
  {
    path: ROUTER_UTILS.setting.userUpdate,
    component: UpdateUserComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['user:update'],
      title: 'model.user.title',
    },
  },
  {
    path: ROUTER_UTILS.setting.role,
    component: RoleComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['role:view'],
      title: 'model.role.title',
    },
  },
  // {
  //   path: ROUTER_UTILS.setting.actionLog,
  //   component: ActionLogComponent,
  //   canActivate: [AuthGuard],
  //   data: {
  //     authorities: ['action_log:view'],
  //     title: 'model.action-log.title',
  //   },
  // },
  // {
  //   path: ROUTER_UTILS.setting.actionLogDetail,
  //   component: ActionLogDetailComponent,
  //   canActivate: [AuthGuard],
  //   data: {
  //     authorities: ['action_log:view'],
  //     title: 'model.action-log.detail.title',
  //   },
  // },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule {}
