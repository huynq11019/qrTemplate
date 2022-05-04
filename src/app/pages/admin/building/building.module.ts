import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BuildingDetailComponent } from './building-detail/building-detail.component';
import { BuildingListComponent } from './building-list/building-list.component';
import { BuildingManagementInfoComponent } from './building-management-info/building-management-info.component';
import { BuildingRoutingModule } from './building-routing.module';
import { FloorUpdateComponent } from './floor-update/floor-update.component';
import { UnitDetailComponent } from './unit-list/unit-detail/unit-detail.component';
import { UnitFilterComponent } from './unit-list/unit-filter/unit-filter.component';
import { UnitListComponent } from './unit-list/unit-list.component';

@NgModule({
  declarations: [
    BuildingListComponent,
    BuildingDetailComponent,
    FloorUpdateComponent,
    UnitListComponent,
    UnitDetailComponent,
    BuildingManagementInfoComponent,
    UnitFilterComponent,
  ],
  imports: [CommonModule, SharedModule, BuildingRoutingModule],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BuildingModule {}
