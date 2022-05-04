import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { ROLE_ACTIVE, ROLE_LEVELS } from '@shared/constants/role.constant';
import { STATUS } from '@shared/constants/status.constants';
import { IRoleRequest } from '@shared/models/request/role-request.model';
import { IRole, Role } from '@shared/models/role.model';
import { AuthService } from '@shared/services/auth/auth.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { RoleService } from '@shared/services/role.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AdvancedSearchRoleComponent } from './advanced-search-role/advanced-search-role.component';
import { UpdatePermissionComponent } from './update-permission/update-permission.component';
import { UpdateRoleComponent } from './update-role/update-role.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit {
  roles: IRole[] = [];
  pageIndex = PAGINATION.PAGE_DEFAULT; // 	pageIndex , double binding
  pageSize = PAGINATION.SIZE_DEFAULT; // pageSize, double binding
  pageSizeOptions = PAGINATION.OPTIONS; // Specify the sizeChanger options
  total = 0; // total record
  sortBy = '';
  indeterminate = false; // 	nz-checkbox indeterminate status
  allChecked = false; // check all option
  keyword = ''; // keyword search
  isCallFirstRequest = true;
  roleRequest: IRoleRequest = {};
  roleActive = ROLE_ACTIVE;
  isVisible = false;
  role: IRole = {};
  groupLockPopup = {
    title: '',
    content: '',
    okText: '',
  };
  ROLE_LEVELS = ROLE_LEVELS;
  searchform: IRoleRequest = {};

  // roleProfile: IRole[] = [];

  constructor(
    private modalService: NzModalService,
    private translateService: TranslateService,
    private roleService: RoleService,
    private toast: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDataRole(this.pageIndex, this.pageSize);
  }

  loadDataRole(pageNumber?: number, size?: number, sortBy?: string): void {
    this.roleRequest.pageIndex = pageNumber;
    this.roleRequest.pageSize = size;
    this.roleRequest.hasPageable = true;
    this.roleRequest.sortBy = sortBy;
    this.roleService.search(this.roleRequest, true).subscribe(
      (response: any) => {
        const data = response?.body?.data;
        const page = response?.body?.page;
        if (data.length > 0) {
          data.map((role: Role): any => (role.checked = false));
        }
        this.roles = data;
        this.total = page.total || 0;
      },
      (error) => {
        this.roles = [];
        this.total = 0;
      }
    );
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isCallFirstRequest) {
      this.isCallFirstRequest = false;
      return;
    }
    const { pageIndex, pageSize, sort, filter } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    if (sortField && sortOrder) {
      this.sortBy = `${sortField}.${sortOrder === 'ascend' ? 'asc' : 'desc'}`;
    } else {
      this.sortBy = '';
    }
    this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
  }

  // đánh thứ tự bản ghi
  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.pageIndex, this.pageSize);
  }

  lock(role: IRole): void {
    this.isVisible = true;
    this.role = role;
    if (role.status === ROLE_ACTIVE) {
      this.groupLockPopup = {
        title: 'model.role.titleLock',
        content: 'model.role.inActiveRoleContent',
        okText: 'action.lock',
      };
    } else {
      this.groupLockPopup = {
        title: 'model.role.titleUnLock',
        content: 'model.role.activeRoleContent',
        okText: 'action.unlock',
      };
    }
  }

  onLockAndUnLock(result: { success: boolean }): void {
    if (result && result?.success) {
      if (this.role.status === ROLE_ACTIVE) {
        this.roleService.inactive(this.role.id, true).subscribe((res) => {
          this.toast.success('model.role.success.lock');
          this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
          this.isVisible = false;
        });
      } else {
        this.roleService.active(this.role.id, true).subscribe((res) => {
          this.toast.success('model.role.success.unlock');
          this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
          this.isVisible = false;
        });
      }
    } else {
      this.isVisible = false;
    }
  }

  delete(isArray: boolean, role?: IRole): void {
    /** isArray la true => forEach users get nhung ban ghi co checked = true */
    if (isArray) {
    } else {
      const form = CommonUtil.modalConfirm(
        this.translateService,
        'model.role.deleteRoleTitle',
        'model.role.deleteRoleContent',
        { code: role?.code }
      );
      const modal = this.modalService.confirm(form);
      modal.afterClose.subscribe((result) => {
        if (result?.success) {
          if (role?.id) {
            this.roleService.delete(role.id).subscribe((res) => {
              if (res.status === STATUS.SUCCESS_200) {
                this.toast.success('model.role.success.delete');
                this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
              }
            });
          }
        }
      });
    }
  }

  // chưa call API, cần xử lý nốt <có thể làm giống User, call đến func loadDataRole()>
  search(event: any): void {
    this.roleRequest.keyword = event?.target?.value.trim();
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
  }

  // tạo mới Role
  create(): void {
    const base = CommonUtil.modalBase(
      UpdateRoleComponent,
      {
        isUpdate: false,
      },
      '40%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
      }
    });
  }

  update(role: IRole): void {
    const base = CommonUtil.modalBase(
      UpdateRoleComponent,
      {
        isUpdate: true,
        role,
      },
      '40%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
      }
    });
  }

  updatePermission(role: IRole): void {
    const base = CommonUtil.modalBase(UpdatePermissionComponent, {
      isUpdate: true,
      role,
    });
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
      }
    });
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
  }

  format(value: any, type: string): any {
    if (type === 'date') {
      return CommonUtil.formatArrayToDate(value);
    } else if (type === 'status') {
      return this.translateService.instant(
        ['common', value.toLowerCase()].join('.')
      );
    }
  }

  getLimitLength(text: string): string {
    return CommonUtil.getLimitLength(text, 20);
  }

  formatLevel(str: string): any {
    if (!str) {
      return 'model.role.updating';
    }
    if (str === this.ROLE_LEVELS.CENTER) {
      return this.ROLE_LEVELS.CENTER_TITLE;
    } else if (str === this.ROLE_LEVELS.BUILDING) {
      return this.ROLE_LEVELS.BUILDING_TITLE;
    } else if (str === this.ROLE_LEVELS.CUSTOMER) {
      return this.ROLE_LEVELS.CUSTOMER_TITLE;
    }
  }

  openAdvancedSearch(): void {
    const base = CommonUtil.modalBase(
      AdvancedSearchRoleComponent,
      {
        roles: this.roles,
        roleRequest: this.searchform,
      },
      '35%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result?.success) {
        this.roleRequest.isRoot = result?.data.isRoot;
        this.roleRequest.roleLevel = result?.data.roleLevel;
        this.roleRequest.startAt = result?.data?.createdAt;
        this.roleRequest.endAt = result?.data?.lastModifiedAt;
        this.roleRequest.status = result?.data.status;
        this.roleRequest.createdBy = result?.data.createdBy;
        this.searchform = { ...this.roleRequest };
        if (result?.data?.createdAt) {
          this.roleRequest.startAt = CommonUtil.getStartOfDay(
            (result?.data?.createdAt as Date)?.getTime()
          );
        }
        if (result?.data?.lastModifiedAt) {
          this.roleRequest.endAt = CommonUtil.getEndOfDay(
            (result?.data?.lastModifiedAt as Date)?.getTime()
          );
        }
        this.loadDataRole(this.pageIndex, this.pageSize);
      }
    });
  }
}
