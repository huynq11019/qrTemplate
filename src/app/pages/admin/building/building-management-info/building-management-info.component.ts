import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PAGINATION } from '@shared/constants/pagination.constants';
import {
  USER_CUSTOMER,
  USER_EMPLOYEE,
  USER_PROFILE_INTERNAL,
  USER_PROFILE_LDAP,
} from '@shared/constants/user.constant';
import { Pageable } from '@shared/models/pageable.model';
import { IUser, User } from '@shared/models/user.model';
import { BuildingService } from '@shared/services/building.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-building-management-info',
  templateUrl: './building-management-info.component.html',
  styleUrls: ['./building-management-info.component.scss'],
})
export class BuildingManagementInfoComponent implements OnInit, AfterViewInit {
  @Input() buildingId: string | undefined;
  translatePath = 'model.building.managerBuilding.';
  isCallFirstRequest = false;
  managerQuery = {
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    sortBy: '',
    keyword: '',
  };
  total = 0;
  pageSizeOptions = PAGINATION.OPTIONS;
  buildingManagers: IUser[] = [];

  constructor(
    private translateService: TranslateService,
    private buildingService: BuildingService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadManager();
  }

  search(keyword?: any): void {
    this.managerQuery.keyword = keyword.target?.value;
    this.loadManager();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isCallFirstRequest) {
      this.isCallFirstRequest = false;
    }
    const { sortBy } = CommonUtil.onQueryParam(params);
    this.managerQuery.sortBy = sortBy;
    this.loadManager();
  }

  getTranslate(key: string): string {
    return this.translateService.instant(this.translatePath + key);
  }

  /* query phân trang manager building*/
  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.managerQuery.pageIndex = pageIndex;
    this.managerQuery.pageSize = pageSize;
    this.loadManager();
  }

  /* load danh sách ban quản lý toàn nhà */
  loadManager(isLoading = true): void {
    // this.managerQuery.hasPageable = true;
    if (!this.buildingId) {
      return;
    }

    this.buildingService
      .searchManagerByBuilding(this.buildingId, this.managerQuery, isLoading)
      .subscribe((response) => {
        this.buildingManagers = response?.body?.data as Array<User>;
        const page = response?.body?.page as Pageable;
        this.total = page?.total || 0;
      });
  }

  redirectToUpdateAccount(userid?: string, accountType?: string): void {
    if (userid && accountType) {
      let type = '';
      if (accountType === USER_EMPLOYEE) {
        type = USER_PROFILE_INTERNAL;
      } else if (accountType === USER_CUSTOMER) {
        type = USER_PROFILE_LDAP;
      }
      this.router.navigate([`setting/user/${userid}/update`], {
        queryParams: { typeUser: type },
      });
    }
  }

  getIndex(index: number): number {
    return CommonUtil.getIndex(
      index,
      this.managerQuery.pageIndex,
      this.managerQuery.pageSize
    );
  }
}
