import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UploadComponent } from '@shared/components/upload/upload.component';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { STATUS_ACTIVE } from '@shared/constants/status.constants';
import {
  USER_ACTIVE,
  USER_EMPLOYEE,
  USER_INACTIVE,
  USER_PROFILE_INTERNAL,
  USER_PROFILE_LDAP,
} from '@shared/constants/user.constant';
import { IUserRequest } from '@shared/models/request/user-request.model';
import { IUser, User } from '@shared/models/user.model';
import { ToastService } from '@shared/services/helpers/toast.service';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AdvancedSearchUserComponent } from './advanced-search-user/advanced-search-user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  users: IUser[] = [];
  user: IUser = {};
  keyword = '';
  isCallFirstRequest = true;
  // allChecked = false;
  // indeterminate = false;
  total = 0;
  loading = true;
  isVisible = false;
  pageIndex = PAGINATION.PAGE_DEFAULT;
  pageSize = PAGINATION.SIZE_DEFAULT;
  pageSizeOptions = PAGINATION.OPTIONS;
  userRequest: IUserRequest = {};
  userProfileInternal = USER_PROFILE_INTERNAL;
  userProfileLdap = USER_PROFILE_LDAP;
  userActive = USER_ACTIVE;
  userInactive = USER_INACTIVE;
  userEmployee = USER_EMPLOYEE;
  active = false;
  USER_INTERNAL = USER_PROFILE_INTERNAL;
  ACTIVE = STATUS_ACTIVE;
  advanceSearch: IUserRequest = {};
  groupLockPopup = {
    title: '',
    content: '',
    okText: '',
  };
  // pathTranslateUserLevel = 'model.user.service.userLevel.';
  pathTranslateAccountType = 'model.user.service.accountType.';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private translateService: TranslateService,
    private toast: ToastService,
    private modalService: NzModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData(this.pageIndex, this.pageSize);
  }

  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.pageIndex, this.pageSize);
  }

  search(event: any): void {
    this.userRequest.keyword = event?.target?.value.trim();
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadData(this.pageIndex, this.pageSize);
  }

  loadData(
    pageNumber: number,
    size: number,
    sortBy?: string,
    isLoading = true
  ): void {
    this.userRequest.pageIndex = pageNumber;
    this.userRequest.pageSize = size;
    this.userRequest.hasPageable = true;
    this.userRequest.sortBy = sortBy;
    this.loading = isLoading;
    this.userService.search(this.userRequest, (isLoading = true)).subscribe(
      (response: any) => {
        const data = response?.body?.data;
        const page = response?.body?.page;
        if (data.length > 0) {
          data.map((user: User): any => (user.checked = false));
        }
        this.users = data;
        this.total = page.total || 0;
        this.loading = false;
      },
      (error: any) => {
        this.users = [];
        this.total = 0;
        this.loading = false;
      }
    );
  }

  // refreshStatus(item?: any, index?: number, checked?: any): void {
  //   const validData = [...this.users];
  //   const allChecked = validData.length > 0 && validData.every(value => value.checked);
  //   const allUnChecked = validData.every(value => !value.checked);
  //   this.allChecked = allChecked;
  //   this.indeterminate = !allChecked && !allUnChecked;
  // }
  //
  // changeChecked(item?: any) {
  //   item.checked = !item.checked;
  // }
  //
  // checkAll(value: boolean): void {
  //   this.users.forEach(data => {
  //     data.checked = value;
  //   });
  //   this.refreshStatus();
  // }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isCallFirstRequest) {
      this.isCallFirstRequest = false;
      return;
    }
    const { sort, filter } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    let sortBy = '';
    if (sortField && sortOrder) {
      sortBy = `${sortField}.${sortOrder === 'ascend' ? 'asc' : 'desc'}`;
    }
    this.loadData(this.pageIndex, this.pageSize, sortBy);
  }

  import(): void {
    const base = CommonUtil.modalBase(UploadComponent, {
      multiple: true,
      acceptTypeFiles: ['excel'],
    });
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.loadData(this.pageIndex, this.pageSize);
      }
    });
  }

  create(value: string): void {
    const dataObject = {
      queryParams: {
        typeUser: value,
      },
    };
    this.router.navigate([`setting/user/create`], dataObject);
  }

  update(user: IUser): void {
    const authenticType = user.authenticationType;
    const accounntType = user.accountType;
    let type = '';
    if (accounntType === this.userEmployee) {
      type = this.userProfileInternal;
    } else {
      type = this.userProfileLdap;
    }
    const dataObject = {
      queryParams: {
        typeUser: type,
      },
    };
    this.router.navigate([`setting/user/${user.id}/update`], dataObject);
  }

  // delete(isArray: boolean, user?: IUser) {
  //   /** isArray là true => forEach users get những bản ghi có checked = true */
  //   if (isArray) {
  //     const ids: any[] = this.users.filter(item => item.checked === true).map(item => item.id);
  //     const userDeleteRequest: IUserDeleteRequest = {};
  //     userDeleteRequest.ids = ids;
  //
  //     const form = CommonUtil.modalConfirm(
  //       this.translateService,
  //       'model.user.deleteCheckedUserTitle',
  //       'model.user.deleteCheckedUserContent',
  //     );
  //     const modal = this.modalService.confirm(form);
  //     modal.afterClose.subscribe(result => {
  //       if (result?.success) {
  //         this.userService.deleteUsers(userDeleteRequest).subscribe(res => {
  //           if (res.status === STATUS.SUCCESS_200) {
  //             this.toast.success('model.user.success.delete');
  //             this.loadData(this.pageIndex, this.pageSize);
  //           }
  //         });
  //       }
  //     });
  //   } else {
  //     const form = CommonUtil.modalConfirm(
  //       this.translateService,
  //       'model.user.deleteUserTitle',
  //       'model.user.deleteUserContent',
  //       {fullName: user?.fullName}
  //     );
  //     const modal = this.modalService.confirm(form);
  //     modal.afterClose.subscribe(result => {
  //       if (result?.success) {
  //         this.userService.delete(user!.id).subscribe(res => {
  //           if (res.status === STATUS.SUCCESS_200) {
  //             this.toast.success('model.user.success.delete');
  //             this.loadData(this.pageIndex, this.pageSize);
  //           }
  //         });
  //       }
  //     });
  //   }
  // }

  lock(user: IUser): void {
    this.isVisible = true;
    this.user = user;
    if (user.status === STATUS_ACTIVE) {
      this.groupLockPopup = {
        title: 'model.user.lock',
        content: 'model.user.inActiveUserContent',
        okText: 'action.lock',
      };
    } else {
      this.groupLockPopup = {
        title: 'model.user.unlock',
        content: 'model.user.activeUserContent',
        okText: 'action.unlock',
      };
    }
  }

  onLockAndUnLock(result: { success: boolean }): void {
    if (result && result?.success) {
      if (this.user.status === STATUS_ACTIVE) {
        this.userService.inactive(this.user.id).subscribe((res: any) => {
          this.toast.success('model.user.success.inactive');
          this.loadData(this.pageIndex, this.pageSize);
          this.isVisible = false;
        });
      } else {
        this.userService.active(this.user.id).subscribe((res: any) => {
          this.toast.success('model.user.success.active');
          this.loadData(this.pageIndex, this.pageSize);
          this.isVisible = false;
        });
      }
    } else {
      this.isVisible = false;
    }
  }

  // checkButton(index: number, id: any): void {
  //   const form = CommonUtil.modalConfirm(
  //     this.translateService,
  //     this.users[index].status === this.userActive ? 'common.inactive' : 'common.active',
  //     this.users[index].status === this.userActive ? 'model.user.inActiveUserContent' : 'model.user.activeUserContent'
  //   );
  //   const modal = this.modalService.confirm(form);
  //   modal.afterClose.subscribe(result => {
  //     if (result?.success) {
  //       if (this.users[index].status === this.userActive) {
  //         this.users[index].status = this.userInactive;
  //       } else {
  //         this.users[index].status = this.userActive;
  //       }
  //       if (this.users[index].status === this.userActive) {
  //         this.userService.active(id).subscribe(res => {
  //           if (res && res?.body?.success) {
  //             this.loadData(this.pageIndex, this.pageSize);
  //           }
  //         });
  //       } else {
  //         this.userService.inactive(id).subscribe(res => {
  //           if (res && res?.body?.success) {
  //             this.loadData(this.pageIndex, this.pageSize);
  //           }
  //         });
  //       }
  //     }
  //   });
  // }

  format(value: any, type: string): string | any {
    if (type === 'date') {
      return CommonUtil.formatArrayToDate(value);
    } else if (type === 'status') {
      return this.translateService.instant(
        ['common', value.toLowerCase()].join('.')
      );
    }
  }

  openChangePassword(user: User): void {
    const base = CommonUtil.modalBase(
      ChangePasswordComponent,
      {
        user,
      },
      '30%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.loadData(this.pageIndex, this.pageSize);
      }
    });
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadData(this.pageIndex, this.pageSize);
  }

  getLimitLength(text: string): string {
    return CommonUtil.getLimitLength(text, 25);
  }

  getTranslate(s: string): string {
    return this.translateService.instant(
      this.pathTranslateAccountType + '' + s
    );
  }

  // getUserLevelTrans(user: User): string {
  //   if(user?.userLevel){
  //     if(this.getTranslate(user?.userLevel?.toLowerCase()) === this.pathTranslateUserLevel){
  //       return user?.userLevel;
  //     }
  //     return this.getTranslate(user?.userLevel?.toLowerCase() || '');
  //   }
  //   return '';
  // }

  getAccountTypeTrans(user: User): string {
    if (user?.accountType) {
      if (
        this.getTranslate(user?.accountType?.toLowerCase()) ===
        this.pathTranslateAccountType
      ) {
        return user?.accountType;
      }
      return this.getTranslate(user?.accountType?.toLowerCase() || '');
    }
    return '';
  }

  openAdvancedSearch(): void {
    const base = CommonUtil.modalBase(
      AdvancedSearchUserComponent,
      {
        users: this.users,
        advanceSearch: this.advanceSearch,
      },
      '30%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result?.success) {
        this.advanceSearch = result?.userRequest;
        this.userRequest.accountType = this.advanceSearch.accountType;
        this.userRequest.status = this.advanceSearch.status;
        this.loadData(this.pageIndex, this.pageSize);
      }
    });
  }
}
