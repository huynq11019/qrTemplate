import { Component, Input, OnInit } from '@angular/core';
import {
  LEASING_STATUS_LIST,
  UNIT_TYPE_LIST,
} from '@shared/constants/building.constants';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { Building, IBuilding } from '@shared/models/building.model';
import { IFloor } from '@shared/models/floor.model';
import { IBuildingRequest } from '@shared/models/request/building-request.model';
import { BuildingService } from '@shared/services/building.service';
import { UnitService } from '@shared/services/unit.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-unit-filter',
  templateUrl: './unit-filter.component.html',
  styleUrls: ['./unit-filter.component.scss'],
})
export class UnitFilterComponent implements OnInit {
  @Input() filterRequest = {
    buildingIds: [],
    leasingStatus: [],
    UnitTypes: [],
    floorIds: [],
  };
  buildings: Building[] = [];
  leasingStatusList = LEASING_STATUS_LIST;
  unitTypeList = UNIT_TYPE_LIST;
  floorsList: IFloor[] = [];

  constructor(
    private buildingService: BuildingService,
    private unitService: UnitService,
    private modalRef: NzModalRef
  ) {}

  ngOnInit(): void {
    this.loadDataBuilding();
    if (this.filterRequest.buildingIds?.length > 0) {
      this.loadFloors();
    }
  }

  onChangeBuilding(event: any): void {
    this.filterRequest.buildingIds = event;
    if (event.length === 1) {
      // this.loadDataFloor(event[0]);
      this.loadFloors();
    } else {
      this.filterRequest.floorIds = [];
      this.floorsList = [];
    }
  }

  onChangeLeasingStatus(event: string[]): void {
    // this.filterRequest.leasingStatus = event.value;
    // const leasingSelected = event.filter(item => item !== 'all');
    // this.filterRequest.leasingStatus = event.filter(item => item.checked);
  }

  loadDataBuilding(keyword?: string): void {
    const buildingSearchBuildingRequest: IBuildingRequest = {
      pageIndex: PAGINATION.PAGE_DEFAULT,
      pageSize: PAGINATION.SIZE_DEFAULT,
      keyword,
      sortBy: 'code.asc',
    };
    this.buildingService
      .searchBuildingAutoComplete(buildingSearchBuildingRequest)
      .subscribe((data) => {
        this.buildings = data.body?.data as Array<IBuilding>;
      });
  }

  loadFloors(keyword?: string): void {
    this.floorsList = [];
    if (this.filterRequest.buildingIds?.length > 1) {
      return;
    }
    this.buildingService
      .simpleSearchFloor(this.filterRequest?.buildingIds[0], {
        keyword,
        sortBy: 'floorNumber.asc',
      })
      .subscribe((data) => {
        this.floorsList = data.body?.data as Array<IFloor>;
      });
  }

  onReset(): void {
    this.filterRequest = {
      buildingIds: [],
      leasingStatus: [],
      UnitTypes: [],
      floorIds: [],
    };
  }

  onSearch(): void {
    this.modalRef.close({
      success: true,
      value: this.filterRequest,
    });
  }

  limitText(text: string, limit = 10): string {
    return CommonUtil.getLimitLength(text, limit);
  }
}
