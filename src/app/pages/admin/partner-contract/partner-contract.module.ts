import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PartnerContractListComponent } from './partner-contract-list/partner-contract-list.component';
import { PartnerContractRoutingModule } from './partner-contract-routing.module';

@NgModule({
  declarations: [
    PartnerContractListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PartnerContractRoutingModule,
  ],
  providers: []
})
export class PartnerContractModule {
}
