import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guard/auth.guard';
import { ROUTER_UTILS } from '@shared/utils/router.utils';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketUpdateComponent } from './ticket-list/ticket-update/ticket-update.component';


const routes: Routes = [
  {
    path: '',
    component: TicketListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['ticket:view'],
      title: 'model.ticket.title'
    }
  },
  {
    path: ROUTER_UTILS.ticket.create,
    component: TicketUpdateComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['ticket:create'],
      title: 'model.ticket.title'
    }
  },
  {
    path: ROUTER_UTILS.ticket.createByComplaint,
    component: TicketUpdateComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['ticket:create'],
      title: 'model.ticket.title'
    }
  },
  {
    path: ROUTER_UTILS.ticket.detail,
    component: TicketDetailComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['ticket:view'],
      title: 'model.ticket.title'
    }
  }
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
