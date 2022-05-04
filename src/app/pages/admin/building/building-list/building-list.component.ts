import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BUILDING_STATUS } from '@shared/constants/building.constants';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { STATUS } from '@shared/constants/status.constants';
import { USER_LEVEL_CENTER } from '@shared/constants/user.constant';
import { Building, IBuilding } from '@shared/models/building.model';
import { Pageable } from '@shared/models/pageable.model';
import { IBuildingRequest } from '@shared/models/request/building-request.model';
import { User } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth/auth.service';
import { BuildingService } from '@shared/services/building.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-building-list',
  templateUrl: './building-list.component.html',
  styleUrls: ['./building-list.component.scss'],
})
export class BuildingListComponent implements OnInit {
  buildings: IBuilding[] = [];
  buildingRequest: IBuildingRequest = {};
  form: FormGroup = new FormGroup({});
  keyword = '';
  USER_LEVEL_CENTER = USER_LEVEL_CENTER;
  isCallFirstRequest = true;
  total = 0;
  pageIndex = PAGINATION.PAGE_DEFAULT;
  pageSize = PAGINATION.SIZE_DEFAULT;
  pageSizeOptions = PAGINATION.OPTIONS;
  buildingStatus = BUILDING_STATUS;
  isVisible = false;
  buildingGroupModal = {
    title: 'model.building.managerBuilding.message.create',
    content: 'common.confirmSave',
    okText: 'action.save',
    callBack: () => {},
  };

  constructor(
    private fb: FormBuilder,
    private buildingService: BuildingService,
    private translateService: TranslateService,
    private modalService: NzModalService,
    private formService: NzFormModule,
    private route: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData(this.pageIndex, this.pageSize);
  }

  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.pageIndex, this.pageSize);
  }

  search(event: any): void {
    this.buildingRequest.keyword = event?.target?.value.trim();
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadData(this.pageIndex, this.pageSize);
  }

  loadData(
    pageIndex: number,
    pageSize: number,
    sortBy?: string,
    isLoading = true
  ): void {
    this.buildingRequest.pageIndex = pageIndex;
    this.buildingRequest.pageSize = pageSize;
    this.buildingRequest.hasPageable = true;
    this.buildingRequest.sortBy = sortBy;
    this.buildingService
      .search(this.buildingRequest, isLoading)
      .subscribe((res) => {
        const data = res?.body?.data as Array<Building>;
        const pageResponse = res?.body?.page as Pageable;
        if (data.length > 0) {
          data.map((building: Building): any => (building.checked = false));
        }
        this.buildings = data;
        this.total = pageResponse?.total || 0;
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isCallFirstRequest) {
      this.isCallFirstRequest = false;
      return;
    }
    const { sortBy } = CommonUtil.onQueryParam(params);
    this.loadData(this.pageIndex, this.pageSize, sortBy);
  }
  detailBuilding(building: IBuilding): void {
    this.route.navigate([`/building/${building.id}/detail`]);
  }

  createBuilding(): void {
    this.route.navigate([`/building/create`]);
  }

  format(value = '', type: string): any {
    if (type === 'date') {
      return CommonUtil.formatArrayToDate(value);
    } else if (type === 'status') {
      return this.translateService.instant(
        ['common', value?.toLowerCase()].join('.')
      );
    }
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadData(this.pageIndex, this.pageSize);
  }

  limitText(textInput = '', length = 20): string {
    return CommonUtil.getLimitLength(textInput, length);
  }

  hasUserLevel(): boolean {
    const myProfile: User = this.authService.getCurrentUser() || {};
    return (
      !!myProfile?.userLevel &&
      (USER_LEVEL_CENTER.includes(myProfile?.userLevel || '') ||
        !!myProfile.userPrimary?.isRoot)
    );
  }

  /*handle confirm*/
  handleConfirmInvalidBuilding(result: { success: boolean }): void {
    if (!!result && result.success) {
    }
    this.buildingGroupModal.callBack = () => {};
    this.isVisible = false;
  }

  openConfirmInvalid(building: IBuilding): void {
    if (!!building.id) {
      if (building.status === BUILDING_STATUS.ACTIVE.value) {
        this.buildingGroupModal.okText = 'action.confirm';
        this.buildingGroupModal.title = 'model.building.invalidBuilding';
        this.buildingGroupModal.content = this.translateService.instant(
          'model.building.confirmContent',
          { buildingCode: building.code }
        );
        this.buildingGroupModal.callBack = () => {
          this.buildingService
            .invalidBuilding(building.id || '')
            .subscribe((res) => {
              if (res?.status === STATUS.SUCCESS_200) {
                this.loadData(this.pageIndex, this.pageSize);
              }
            });
        };
      } else {
        // active building
        this.buildingGroupModal.okText = 'action.confirm';
        this.buildingGroupModal.title = 'model.building.activeBuilding';
        this.buildingGroupModal.content = this.translateService.instant(
          'model.building.confirmActive',
          { buildingCode: building.code }
        );
        this.buildingGroupModal.callBack = () => {
          this.buildingService
            .activeBuilding(building.id || '')
            .subscribe((res) => {
              if (res?.status === STATUS.SUCCESS_200) {
                this.loadData(this.pageIndex, this.pageSize);
              }
            });
        };
      }
    }
    this.isVisible = true;
  }
}
