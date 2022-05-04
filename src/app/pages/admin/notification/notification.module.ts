import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NotificationFilterComponent } from './notification-filter/notification-filter.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationUpdateComponent } from './notification-update/notification-update.component';

@NgModule({
  declarations: [
    NotificationListComponent,
    NotificationUpdateComponent,
    NotificationFilterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NotificationRoutingModule,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NotificationModule {
}
