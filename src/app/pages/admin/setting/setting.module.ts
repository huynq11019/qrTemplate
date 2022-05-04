import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AdvancedSearchRoleComponent } from './role/advanced-search-role/advanced-search-role.component';
import { RoleComponent } from './role/role.component';
import { UpdatePermissionComponent } from './role/update-permission/update-permission.component';
import { UpdateRoleComponent } from './role/update-role/update-role.component';
import { SettingRoutingModule } from './setting-routing.module';
import { AdvancedSearchUserComponent } from './user/advanced-search-user/advanced-search-user.component';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { UserComponent } from './user/user.component';
import { ActionLogComponent } from './action-log/action-log.component';
import { ActionLogDetailComponent } from './action-log/action-log-detail/action-log-detail.component';

@NgModule({
  declarations: [
    UserComponent,
    UpdateUserComponent,
    RoleComponent,
    UpdateRoleComponent,
    UpdatePermissionComponent,
    ChangePasswordComponent,
    AdvancedSearchUserComponent,
    AdvancedSearchRoleComponent,
    ActionLogComponent,
    ActionLogDetailComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SettingRoutingModule,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SettingModule {
}
