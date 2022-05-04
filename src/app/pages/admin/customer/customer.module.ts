import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CustomerContactComponent } from './customer-contact/customer-contact.component';
import { CustomerFilterComponent } from './customer-filter/customer-filter.component';
import { CustomerLeasingComponent } from './customer-leasing/customer-leasing.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerUpdateComponent } from './customer-update/customer-update.component';

@NgModule({
  declarations: [
    CustomerListComponent,
    CustomerUpdateComponent,
    CustomerLeasingComponent,
    CustomerContactComponent,
    CustomerFilterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CustomerRoutingModule,
  ],
  providers: []
})
export class CustomerModule {
}
