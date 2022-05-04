import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {BuildingListComponent} from './building-list/building-list.component';
import {AuthGuard} from '@core/guard/auth.guard';
import {BuildingDetailComponent} from './building-detail/building-detail.component';
import {UnitListComponent} from './unit-list/unit-list.component';
import {UnitDetailComponent} from './unit-list/unit-detail/unit-detail.component';
import {ROUTER_UTILS} from '@shared/utils/router.utils';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: ROUTER_UTILS.building.list,
    component: BuildingListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['building:view'],
      title: 'model.building.title'
    }
  },
  {
    path: ROUTER_UTILS.building.detail,
    component: BuildingDetailComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['building:view'],
      title: 'model.building.title'
    }
  }, {
    path: ROUTER_UTILS.building.create,
    component: BuildingDetailComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['building:create', 'building:update'],
      title: 'model.building.title'
    }
  },
  {
    path: ROUTER_UTILS.building.unit,
    component: UnitListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['unit:view'],
      title: 'model.unit.title'
    }
  },
  {
    path: ROUTER_UTILS.building.unitDetail,
    component: UnitDetailComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['unit:view'],
      title: 'model.unit.detail.title'
    }
  },
  {
    path: ROUTER_UTILS.building.unitCreate,
    component: UnitDetailComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['unit:create', 'unit:update'],
      title: 'model.unit.title'
    }
  },
  {
    path: ROUTER_UTILS.building.unitUpdate,
    component: UnitDetailComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['unit:create', 'unit:update'],
      title: 'model.unit.detail.title'
    }
  }
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildingRoutingModule { }
