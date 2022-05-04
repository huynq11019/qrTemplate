import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { AdvancedSearchComponent } from './ticket-list/advanced-search/advanced-search.component';
import { CompleteTicketComponent } from './ticket-list/complete-ticket/complete-ticket.component';
import { HandleTicketComponent } from './ticket-list/handle-ticket/handle-ticket.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketUpdateComponent } from './ticket-list/ticket-update/ticket-update.component';
import { TicketRoutingModule } from './ticket-routing.module';

@NgModule({
  declarations: [
    TicketListComponent,
    TicketUpdateComponent,
    AdvancedSearchComponent,
    TicketDetailComponent,
    HandleTicketComponent,
    CompleteTicketComponent,
  ],
  imports: [CommonModule, SharedModule, TicketRoutingModule],
  providers: [],
})
export class TicketModule {}
