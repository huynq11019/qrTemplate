import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  LEASING_STATUS,
  LEASING_STATUS_LIST,
  UNIT_STATUS,
  UNIT_TYPE,
  UNIT_TYPE_LIST,
} from '@shared/constants/building.constants';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { STATUS } from '@shared/constants/status.constants';
import { IBuilding } from '@shared/models/building.model';
import { Pageable } from '@shared/models/pageable.model';
import { IBuildingRequest } from '@shared/models/request/building-request.model';
import { IUnit, Unit } from '@shared/models/unit.model';
import { AccountService } from '@shared/services/account.service';
import { BuildingService } from '@shared/services/building.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { UnitService } from '@shared/services/unit.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UnitFilterComponent } from './unit-filter/unit-filter.component';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.scss'],
})
export class UnitListComponent implements OnInit {
  translatepath = 'model.unit.';

  leasingStatus = LEASING_STATUS;
  leasingStatusList = LEASING_STATUS_LIST;
  unitType = UNIT_TYPE;
  unitStatus = UNIT_STATUS;
  unitTypeList = UNIT_TYPE_LIST;
  units: IUnit[] = [];
  unitRequest = {
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    buildingIds: [],
    sortBy: 'createdAt.desc',
    keyword: '',
    leasingStatus: [],
  };
  form: FormGroup = new FormGroup({});
  keyword = '';
  isCallFirstRequest = true;
  total = 0;
  loading = true;
  pageSizeOptions = PAGINATION.OPTIONS;
  buildingList: IBuilding[] = [];
  unitGroupModal = {
    title: 'model.unit.deleteUnit',
    content: 'model.unit.confirmDeleteUnit',
    okText: 'action.confirm',
    callBack: () => {},
  };
  isVisible = false;
  filterRequest = {
    buildingIds: [],
    leasingStatus: [],
    UnitTypes: [],
    floorIds: [],
  };
  constructor(
    private fb: FormBuilder,
    private unitService: UnitService,
    private translateService: TranslateService,
    private modalService: NzModalService,
    private route: Router,
    private buildingService: BuildingService,
    private accountService: AccountService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadDataBuilding();
  }

  getIndex(index: number): number {
    return CommonUtil.getIndex(
      index,
      this.unitRequest.pageIndex,
      this.unitRequest.pageSize
    );
  }

  search(event: any): void {
    this.unitRequest.keyword = event?.target?.value.trim();
    this.unitRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadData();
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
      .subscribe((data: any) => {
        this.buildingList = data.body.data as Array<IBuilding>;
      });
  }

  onChangeBuilding(event: any): void {
    this.unitRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadData();
  }

  loadData(isLoading = true): void {
    const unitSearchRequest = {
      pageIndex: this.unitRequest.pageIndex,
      pageSize: this.unitRequest.pageSize,
      buildingIds: this.unitRequest.buildingIds,
      leasingStatus: this.unitRequest.leasingStatus.filter(
        (item) => item !== LEASING_STATUS.DEFAULT.value
      ),
      keyword: this.unitRequest.keyword,
      sortBy: this.unitRequest.sortBy,
      unitTypes: this.filterRequest.UnitTypes,
      floorIds: this.filterRequest.floorIds,
      isDefault: !!this.unitRequest.leasingStatus.find(
        (item) => item === LEASING_STATUS.DEFAULT.value
      ),
    };
    this.unitService.search(unitSearchRequest, isLoading).subscribe((res) => {
      const data = res?.body?.data as Array<Unit>;
      const pageAble = res?.body?.page as Pageable;
      if (data.length > 0) {
        data.map((unit: Unit): any => (unit.checked = false));
      }
      this.units = data;
      this.total = pageAble?.total || 0;
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isCallFirstRequest) {
      this.isCallFirstRequest = false;
      return;
    }
    const { pageIndex, pageSize, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    if (sortField && sortOrder) {
      this.unitRequest.sortBy = `${sortField}.${sortOrder.replace('end', '')}`;
    }
    if (pageSize !== this.unitRequest.pageSize) {
      this.unitRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
      this.unitRequest.pageSize = pageSize;
    } else {
      this.unitRequest.pageIndex = pageIndex;
    }
    this.loadData();
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.unitRequest.pageIndex = pageIndex;
    this.unitRequest.pageSize = pageSize;
    this.loadData();
  }

  create(): void {
    this.route.navigate(['building/unit/create']);
  }

  goDetail(unit: IUnit): void {
    this.route.navigate([`/building/unit/${unit.id}/detail`]);
  }

  goToUpdate(unit: IUnit): void {
    this.route.navigate([`/building/unit/${unit.id}/update`]);
  }

  // get status of unit
  getUnitStatus(status?: string): string {
    if (!!status) {
      const unitStatus =
        this.leasingStatusList.find((item) => item.value === status)?.label ||
        'unknown';
      return this.translateService.instant(unitStatus);
    }
    return '-';
  }

  // get type of unit
  getType(type?: string): string {
    if (!!type) {
      const unitType =
        this.unitTypeList.find((item) => item.value === type)?.label ||
        'unknown';
      return this.translateService.instant(unitType);
    }
    return '-';
  }

  format(value: IUnit, type: string): { text: string; sClass: string } {
    let text = '-';
    let sClass = '';
    if (value.status === UNIT_STATUS.INACTIVE.value) {
      sClass = 'badge-secondary';
      text = this.translateService.instant('common.inactive');
      return { text, sClass };
    }
    if (type === 'leasingStatus') {
      if (!!value[type]) {
        text = this.translateService.instant(
          [this.translatepath + 'uStatus', value[type]?.toLowerCase()].join('.')
        );
        sClass =
          this.leasingStatusList.find((item) => item.value === value[type])
            ?.class || 'badge-secondary';
      } else if (value.isDefault) {
        text = this.translateService.instant(
          this.translatepath + 'uStatus.default'
        );
        sClass = 'badge-default';
      }
    }
    return { text, sClass };
  }

  getTranslate(key: string): string {
    return this.translateService.instant(this.translatepath + key);
  }

  limitText(value: string, limit = 20): string {
    return CommonUtil.getLimitLength(value, limit);
  }

  openConfirmDelete(unit: IUnit): void {
    this.unitGroupModal.content = this.translateService.instant(
      'model.unit.confirmDeleteUnit',
      { code: unit.code }
    );
    this.unitGroupModal.callBack = () => {
      this.unitService.removeUnit(unit.id).subscribe((res) => {
        if (res?.status === STATUS.SUCCESS_200) {
          this.loadData();
          this.toastService.success(
            this.translateService.instant('model.unit.deleteUnitSuccess')
          );
        }
      });
    };
    this.isVisible = true;
  }

  handleSuccess(unit: IUnit): void {
    this.unitGroupModal.callBack = () => {};
    this.isVisible = false;
  }

  moneyFormat(value?: number): string {
    if (value) {
      return CommonUtil.moneyFormat(value?.toString()) + ' VND';
    } else {
      return '-';
    }
  }

  filter(): void {
    const base = CommonUtil.modalBase(
      UnitFilterComponent,
      {
        filterRequest: this.filterRequest,
      },
      '50%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.filterRequest = { ...result?.value };
        this.unitRequest = { ...this.unitRequest, ...this.filterRequest };
        this.loadData();
      }
    });
  }
}
