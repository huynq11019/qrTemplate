import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  HTTP_CODES,
  METHODS,
  MODULES,
} from '@shared/constants/common.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { IActionLog } from '@shared/models/action-log.model';
import {
  ActionLogRequest,
  IActionLogRequest,
} from '@shared/models/request/action-log-request.model';
import { User } from '@shared/models/user.model';
import { ActionLogService } from '@shared/services/action-log.service';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-action-log',
  templateUrl: './action-log.component.html',
  styleUrls: ['./action-log.component.scss'],
})
export class ActionLogComponent implements OnInit {
  actionLogs: IActionLog[] = [];
  pageIndex = PAGINATION.PAGE_DEFAULT; // 	pageIndex , double binding
  pageSize = PAGINATION.SIZE_DEFAULT; // pageSize, double binding
  pageSizeOptions = PAGINATION.OPTIONS; // Specify the sizeChanger options
  total = 0; // total record
  sortBy = '';
  keyword = ''; // keyword search
  isCallFirstRequest = true;
  groupLockPopup = {
    title: '',
    content: '',
    okText: '',
  };
  uris: string[] = [];
  actionLogRequest: IActionLogRequest = {};
  usersSearch: User[] = [];
  form: FormGroup = new FormGroup({});
  isNotReset = true;
  METHODS = METHODS;
  MODULES = MODULES;
  HTTP_CODES = HTTP_CODES;

  constructor(
    private actionLogService: ActionLogService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.onGetData();
  }

  ngOnInit(): void {
    this.initForm();
    this.loadDataActionLog(this.pageIndex, this.pageSize);
  }

  onSearch(event: any, type?: string, isReset?: boolean): void {
    const param = event;
    if (type === 'method' && param !== '') {
      this.actionLogRequest.method = param;
    }
    if (type === 'module' && param !== '') {
      this.actionLogRequest.module = param;
    }
    if (type === 'httpCode' && param !== 0) {
      this.actionLogRequest.httpCode = param;
    }
    if (type === 'uri' && param !== '') {
      this.actionLogRequest.uri = param;
    }
    if (type === 'userIds' && param !== '') {
      this.actionLogRequest.userIds = param;
    }
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    if (this.isNotReset === true) {
      this.loadDataActionLog(this.pageIndex, this.pageSize, this.sortBy);
    }
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
    this.loadDataActionLog(this.pageIndex, this.pageSize, this.sortBy);
  }

  loadDataActionLog(pageNumber?: number, size?: number, sortBy?: string): void {
    this.actionLogRequest.pageIndex = pageNumber;
    this.actionLogRequest.pageSize = size;
    this.actionLogRequest.hasPageable = true;
    this.actionLogRequest.sortBy = sortBy;
    this.actionLogService.search(this.actionLogRequest, true).subscribe(
      (response: any) => {
        const data = response?.body?.data;
        const page = response?.body?.page;
        this.actionLogs = data;
        this.total = page.total || 0;
      },
      (error) => {
        this.actionLogs = [];
        this.total = 0;
      }
    );
  }

  // đánh thứ tự bản ghi
  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.pageIndex, this.pageSize);
  }

  getLimitLength(text: string): string {
    return CommonUtil.getLimitLength(text, 20);
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadDataActionLog(this.pageIndex, this.pageSize, this.sortBy);
    // this.loadDataRole(this.pageIndex, this.pageSize, this.sortBy);
  }

  onDetail(actionLog: IActionLog): void {
    this.router.navigate([`/setting/action-log/${actionLog?.id}/detail`]);
  }

  onGetData(): void {
    this.onSearchUris();
    this.onSearchUser('');
  }

  onSearchUris(event?: any): void {
    const params: ActionLogRequest = {};
    params.keyword = event;
    this.actionLogService.autocompleteUri(params).subscribe((res) => {
      const uris = res?.body?.data;
      if (uris) {
        this.uris = uris;
      }
    });
  }

  onSearchUser(keyword: string): void {
    this.userService
      .searchUsersAutoComplete({
        keyword,
        pageIndex: PAGINATION.PAGE_DEFAULT,
        pageSize: PAGINATION.SIZE_DEFAULT,
      })
      .subscribe((res: any) => {
        this.usersSearch = res.body?.data as Array<User>;
      });
  }

  initForm(): void {
    this.form = this.fb.group({
      method: null,
      module: null,
      httpCode: null,
      uri: null,
      userIds: null,
    });
  }

  refresh() {
    this.isNotReset = false;
    this.form.reset();
    this.actionLogRequest = {};
    this.loadDataActionLog(this.pageIndex, this.pageSize, this.sortBy);
    // if done refresh return isNotReset is true
    this.isNotReset = true;
  }
}
