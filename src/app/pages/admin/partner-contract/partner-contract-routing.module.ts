import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guard/auth.guard';

import { PartnerContractListComponent } from './partner-contract-list/partner-contract-list.component';

const routes: Routes = [
  {
    path: '',
    component: PartnerContractListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: [],
      title: 'model.partner-contract.title'
    }
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerContractRoutingModule { }
