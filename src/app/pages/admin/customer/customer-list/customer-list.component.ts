import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { STATUS_ACTIVE } from '@shared/constants/status.constants';
import { ICustomer } from '@shared/models/customer.model';
import { CustomerService } from '@shared/services/customer.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CustomerFilterComponent } from '../customer-filter/customer-filter.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {
  customers: ICustomer[] = [];
  isCallFirstRequest = true;
  isVisible = false;
  customer: ICustomer = {};
  total = 0;
  keyword = '';
  sortBy = '';
  pageIndex = PAGINATION.PAGE_DEFAULT;
  pageSize = PAGINATION.SIZE_DEFAULT;
  pageSizeOptions = PAGINATION.OPTIONS;
  ACTIVE = STATUS_ACTIVE;
  groupLockPopup = {
    title: '',
    content: '',
    okText: '',
  };

  filterModal: any = {
    incorporationDate: null,
    status: null,
  };

  constructor(
    private modalService: NzModalService,
    private customerService: CustomerService,
    private translateService: TranslateService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData(this.pageIndex, this.pageSize);
  }

  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.pageIndex, this.pageSize);
  }

  search(event: any): void {
    this.keyword = event?.target?.value;
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadData(this.pageIndex, this.pageSize);
  }

  loadData(page: number, size: number, isLoading = true): void {
    const request = {
      keyword: this.keyword.trim(),
      pageIndex: page,
      pageSize: size,
      sortBy: 'createdAt.desc',
      hasPageable: true,
      ...this.filterModal,
    };
    this.customerService.search(request, isLoading).subscribe(
      (response: any) => {
        const data = response?.body?.data;
        const pageResult = response?.body?.page;
        this.customers = data;
        this.total = pageResult?.total || 0;
      },
      () => {
        this.customers = [];
        this.total = 0;
      }
    );
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadData(this.pageIndex, this.pageSize);
  }

  create(): void {
    this.router.navigate(['/customer/create']);
  }

  update(customer?: ICustomer): void {
    this.router.navigate([`/customer/${customer?.id}/update`]);
  }

  lock(customer: ICustomer): void {
    this.isVisible = true;
    this.customer = customer;
    if (customer.status === STATUS_ACTIVE) {
      this.groupLockPopup = {
        title: 'model.customer.titleLock',
        content: 'model.customer.contentLock',
        okText: 'action.lock',
      };
    } else {
      this.groupLockPopup = {
        title: 'model.customer.titleUnLock',
        content: 'model.customer.contentUnLock',
        okText: 'action.unlock',
      };
    }
  }

  onLockAndUnLock(result: { success: boolean }): void {
    if (result && result?.success) {
      if (this.customer.status === STATUS_ACTIVE) {
        this.customerService
          .inactive(this.customer.id, true)
          .subscribe((res) => {
            this.toast.success('model.customer.success.lock');
            this.loadData(this.pageIndex, this.pageSize);
            this.isVisible = false;
          });
      } else {
        this.customerService.active(this.customer.id, true).subscribe((res) => {
          this.toast.success('model.customer.success.unlock');
          this.loadData(this.pageIndex, this.pageSize);
          this.isVisible = false;
        });
      }
    } else {
      this.isVisible = false;
    }
  }

  format(value: any, type: string): string {
    if (type === 'status') {
      return this.translateService.instant(
        ['common', value.toLowerCase()].join('.')
      );
    }
    return '-';
  }

  getLimitLength(value: string, length = 20): string {
    if (value) {
      return CommonUtil.getLimitLength(value, length);
    }
    return '';
  }

  filter(): void {
    const base = CommonUtil.modalBase(
      CustomerFilterComponent,
      {
        ...this.filterModal,
      },
      '30%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.filterModal = { ...result?.value };
        const incorporationDate = result?.value?.date
          ? moment(result?.value?.date).format('yyyy-MM-DD')
          : null;
        this.filterModal = {
          incorporationDate: this.filterModal.incorporationDate
            ? incorporationDate
            : null,
          status: this.filterModal.status,
        };
        this.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.loadData(this.pageIndex, this.pageSize);
      }
    });
  }
}
