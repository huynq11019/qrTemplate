import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PAGINATION } from '@shared/constants/pagination.constants';
import {
  IN_PROGRESS,
  OPEN,
  RECEIVED,
  TICKET_SERVICE,
  TICKET_SERVICE_TITLE,
  TICKET_STATUS,
  TICKET_STATUS_ALL,
} from '@shared/constants/ticket.constant';
import {
  USER_LEVEL_CENTER,
  USER_LEVEL_LEADER_SERVICE,
} from '@shared/constants/user.constant';
import { Pageable } from '@shared/models/pageable.model';
import { SearchTicket } from '@shared/models/request/ticket-search-request.model';
import { ITicket, Ticket } from '@shared/models/ticket.model';
import { User } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth/auth.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { TicketService } from '@shared/services/ticket.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table/src/table.types';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { CompleteTicketComponent } from './complete-ticket/complete-ticket.component';
import { HandleTicketComponent } from './handle-ticket/handle-ticket.component';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss'],
})
export class TicketListComponent implements OnInit {
  tickets: ITicket[] = [];
  keyword = '';
  isCallFirstRequest = true;
  total = 0;
  loading = true;
  sortBy = '';
  isVisible = false;
  pageIndex = PAGINATION.PAGE_DEFAULT;
  pageSize = PAGINATION.SIZE_DEFAULT;
  pageSizeOptions = PAGINATION.OPTIONS;
  ticketStatus: any;
  buildingService: any;
  size: NzButtonSize = 'small';
  statusOpen = OPEN;
  statusReceived = RECEIVED;
  statusProcessing = IN_PROGRESS;
  TICKET_STATUS_ALL = TICKET_STATUS_ALL;
  CENTER = USER_LEVEL_CENTER;
  SERVICE = USER_LEVEL_LEADER_SERVICE;
  TICKET_SERVICE_TITLE = TICKET_SERVICE_TITLE;
  searchRequest: SearchTicket = {};
  searchTicketRequest: SearchTicket = {};

  user: User | null = {};
  isComplaint = false;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private translateService: TranslateService,
    private toast: ToastService,
    private modalService: NzModalService,
    private router: ActivatedRoute,
    private routerLink: Router,
    private authService: AuthService
  ) {
    this.ticketStatus = TICKET_STATUS.reduce(
      (obj, cur) => ({ ...obj, [cur.value]: cur }),
      {}
    );
    this.buildingService = TICKET_SERVICE.reduce(
      (obj, cur) => ({ ...obj, [cur.value]: cur }),
      {}
    );
    this.getParamsFromURL();
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.loadData(this.pageIndex, this.pageSize);
  }

  getIndex(index: number): number {
    return CommonUtil.getIndex(index, this.pageIndex, this.pageSize);
  }

  search(event: any): void {
    this.keyword = event?.target?.value.trim();
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadData(this.pageIndex, this.pageSize);
  }

  loadData(page: number, size: number): void {
    const ticketRequest = {
      keyword: this.keyword,
      pageIndex: page,
      pageSize: size,
      sortBy: this.sortBy,
      hasPageable: true,
      ...this.searchRequest,
    };
    this.ticketService.search(ticketRequest, true).subscribe((response) => {
      const data = response?.body?.data as Array<ITicket>;
      // tslint:disable-next-line:no-shadowed-variable
      const paging = response?.body?.page as Pageable;
      this.tickets = data;
      this.total = paging.total || 0;
      this.loading = false;
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isCallFirstRequest) {
      this.isCallFirstRequest = false;
      return;
    }
    const { sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    if (sortField && sortOrder) {
      this.sortBy = `${sortField}.${sortOrder === 'ascend' ? 'asc' : 'desc'}`;
    } else {
      this.sortBy = '';
    }
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
    this.loadData(this.pageIndex, this.pageSize);
  }

  create(): void {
    this.routerLink.navigate(['/ticket/create']);
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadData(this.pageIndex, this.pageSize);
  }

  openAdvancedSearch(): void {
    const base = CommonUtil.modalBase(
      AdvancedSearchComponent,
      {
        searchRequest: this.searchTicketRequest,
        // roles: this.roles,
      },
      '45%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.searchRequest.buildingIds = result?.value.buildingIds;
        this.searchRequest.status = result?.value.status;
        this.searchRequest.serviceType = result?.value.serviceType;
        this.searchRequest.startAt = result?.value?.startAt;
        this.searchRequest.endAt = result?.value?.endAt;
        this.searchRequest.issuedUserId = result?.value?.issuedUserId;
        this.searchRequest.user = result?.value?.user;
        this.searchRequest.floorIds = result?.value?.floorIds;
        this.searchTicketRequest = { ...this.searchRequest };
        if (result?.value?.startAt) {
          this.searchRequest.startAt = CommonUtil.getStartOfDay(
            (result?.value?.startAt as Date)?.getTime()
          );
        }
        if (result?.value?.endAt) {
          this.searchRequest.endAt = CommonUtil.getEndOfDay(
            (result?.value?.endAt as Date)?.getTime()
          );
        }

        this.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.loadData(this.pageIndex, this.pageSize);
      }
    });
  }

  getLimitLength(text: string): string {
    return CommonUtil.getLimitLength(text, 20);
  }

  toDetail(ticketId?: string): void {
    if (ticketId) {
      this.routerLink.navigate([`/ticket/${ticketId}/detail`]);
    }
  }

  openReceiveTicket(ticket: Ticket): void {
    const base = CommonUtil.modalBase(
      HandleTicketComponent,
      {
        isReceive: true,
        ticket,
      },
      '30%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.loadData(this.pageIndex, this.pageSize);
      }
    });
  }

  openHandleTicket(ticket: Ticket): void {
    const base = CommonUtil.modalBase(
      HandleTicketComponent,
      {
        ticket,
      },
      '30%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.loadData(this.pageIndex, this.pageSize);
      }
    });
  }

  openCompleteTicket(ticket: Ticket): void {
    const base = CommonUtil.modalBase(CompleteTicketComponent, {
      ticket,
    });
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.loadData(this.pageIndex, this.pageSize);
      }
    });
  }

  formatStatus(status: string): any {
    if (!status) {
      return '-';
    }
    if (status === this.TICKET_STATUS_ALL.RECEIVED) {
      return this.TICKET_STATUS_ALL.STATUS_RECEIVED_TITLE;
    } else if (status === this.TICKET_STATUS_ALL.OPEN) {
      return this.TICKET_STATUS_ALL.STATUS_OPEN_TITLE;
    } else if (status === this.TICKET_STATUS_ALL.IN_PROGRESS) {
      return this.TICKET_STATUS_ALL.STATUS_IN_PROGRESS_TITLE;
    } else if (status === this.TICKET_STATUS_ALL.CLOSED) {
      return this.TICKET_STATUS_ALL.STATUS_CLOSED_TITLE;
    }
  }

  formatService(type: string): any {
    if (!type) {
      return '';
    }
    if (type === this.TICKET_SERVICE_TITLE.TECHNICAL) {
      return this.TICKET_SERVICE_TITLE.TECHNICAL_TITLE;
    } else if (type === this.TICKET_SERVICE_TITLE.SERVICE) {
      return this.TICKET_SERVICE_TITLE.SERVICE_TITLE;
    }
  }

  getCurrentUser(): void {
    this.user = this.authService.getCurrentUser();
  }

  getParamsFromURL(): void {
    this.router.queryParamMap.subscribe((request: any) => {
      const buildingId = request.params.buildingId;
      if (!!buildingId) {
        this.searchRequest.buildingIds = [buildingId];
      }

      const status = request.params.status;
      if (!!status && status !== '') {
        this.searchRequest.status = status;
      }
      if (request.params.expectedStartAt) {
        const expectedStartAt = request.params.expectedStartAt;
        if (expectedStartAt > 0) {
          this.searchRequest.expectedStartAt = expectedStartAt;
        }
      }
      if (request.params.expectedEndAt) {
        const expectedEndAt = request.params.expectedEndAt;
        if (expectedEndAt > 0) {
          this.searchRequest.expectedEndAt = expectedEndAt;
        }
      }
      if (request.params.startAt) {
        const startAt = request.params.startAt;
        if (startAt > 0) {
          this.searchRequest.startAt = startAt;
        }
      }
      if (request.params.endAt) {
        const endAt = request.params.endAt;
        if (endAt > 0) {
          this.searchRequest.endAt = endAt;
        }
      }
    });
    this.pageIndex = PAGINATION.PAGE_DEFAULT;
  }

  formatColor(status: string): any {
    if (!status) {
      return 'badge-secondary';
    }
    if (status === this.TICKET_STATUS_ALL.RECEIVED) {
      return 'badge-info';
    } else if (status === this.TICKET_STATUS_ALL.OPEN) {
      return 'badge-danger';
    } else if (status === this.TICKET_STATUS_ALL.IN_PROGRESS) {
      return 'badge-warning';
    } else if (status === this.TICKET_STATUS_ALL.CLOSED) {
      return 'badge-success';
    }
  }

  // chuyển ngày dự kiến hoàn thành từ cuối ngày => đầu ngày, để khi hiển thị sẽ là ngày localDate đúng (date đang là UTC)
  displayStartAt(date: number): any {
    if (date === 0) {
      return '';
    }
    return CommonUtil.getStartOfDay(date);
  }
}
