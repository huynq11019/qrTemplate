import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guard';
import { ROUTER_UTILS } from '@shared/utils/router.utils';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerUpdateComponent } from './customer-update/customer-update.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['organization:view'],
      title: 'model.customer.title',
    },
  },
  {
    path: ROUTER_UTILS.customer.create,
    component: CustomerUpdateComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['organization:create'],
      title: 'model.customer.title',
    },
  },
  {
    path: ROUTER_UTILS.customer.update,
    component: CustomerUpdateComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['organization:update'],
      title: 'model.customer.title',
    },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
