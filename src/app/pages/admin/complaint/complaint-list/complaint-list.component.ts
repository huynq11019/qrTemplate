import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  COMPLAINT_RATING,
  COMPLAINT_STATUS,
  COMPLAINT_TYPE,
} from '@shared/constants/complaint.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import {
  USER_LEVEL_CENTER,
  USER_LEVEL_LEADER_MANAGEMENT,
} from '@shared/constants/user.constant';
import { Complaint, IComplaint } from '@shared/models/complaint.model';
import {
  ComplaintSearchRequest,
  IComplaintSearchRequest,
} from '@shared/models/request/complaint-search-request.model';
import { User } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth/auth.service';
import { ComplaintService } from '@shared/services/complaint.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ComplaintCloseComponent } from './complaint-close/complaint-close.component';
import { ComplaintFilterComponent } from './complaint-filter/complaint-filter.component';
import { HandleComplaintComponent } from './handle-complaint/handle-complaint.component';
import { MarkSpamsComponent } from './mark-spams/mark-spams.component';

@Component({
  selector: 'app-complaint-list',
  templateUrl: './complaint-list.component.html',
  styleUrls: ['./complaint-list.component.scss'],
})
export class ComplaintListComponent implements OnInit {
  translatePath = 'model.complaint.complaint-list.';
  complaints: Array<IComplaint> = [];
  complaintSelected = new Complaint();
  complaintIdSelectedArr: Array<string> = [];
  complaintSelectedArr: Array<IComplaint> = [];
  complaintStatus = COMPLAINT_STATUS;
  complaintType = COMPLAINT_TYPE;
  complaintRating = COMPLAINT_RATING;
  keyword = '';
  complaintSearchRequest: ComplaintSearchRequest = {};

  totalItems = 0;
  isVisible = false;
  isDelete = false;
  isClose = false;
  isMarkSpam = false;
  isCreateTicket = false;

  checked = false;
  isDisable = false;
  loading = false;
  setOfCheckedId = new Set<string>();
  isCallFirstRequest = true;

  groupPopup = {
    title: '',
    content: '',
    okText: '',
  };
  currentUser: User | null = null;
  USER_LEVEL_CENTER = USER_LEVEL_CENTER;
  USER_LEVEL_LEADER_MANAGEMENT = USER_LEVEL_LEADER_MANAGEMENT;

  constructor(
    private translateService: TranslateService,
    private route: Router,
    private modalService: NzModalService,
    private complaintService: ComplaintService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDataSearch(PAGINATION.PAGE_DEFAULT, PAGINATION.SIZE_DEFAULT);
    this.currentUser = this.authService.getCurrentUser();
  }

  public searchComplaint(event?: any): void {
    if (event) {
      this.complaintSearchRequest.keyword = event.target?.value;
      this.complaintSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
    }
    this.complaintService
      .searchComplaints(this.complaintSearchRequest, true)
      .subscribe((res) => {
        this.complaints = res.body?.data as Array<IComplaint>;
        this.totalItems = res.body?.page?.total || 0;
        this.refreshCheckedStatus(res.body?.data as Array<IComplaint>);
      });
  }

  public loadDataSearch(pageIndex?: number, pageSize?: number): void {
    if (pageIndex) {
      this.complaintSearchRequest.pageIndex = pageIndex;
    }
    if (pageSize) {
      this.complaintSearchRequest.pageSize = pageSize;
    }
    this.complaintService
      .searchComplaints(this.complaintSearchRequest, true)
      .subscribe((res) => {
        this.complaints = res.body?.data as Array<IComplaint>;
        this.totalItems = res.body?.page?.total || 0;
        this.refreshCheckedStatus(res.body?.data as Array<IComplaint>);
      });
  }

  public getIndex(index: number): number {
    return CommonUtil.getIndex(
      index,
      this.complaintSearchRequest.pageIndex,
      this.complaintSearchRequest.pageSize
    );
  }

  getLimitLength(text: string, length?: number): string {
    return CommonUtil.getLimitLength(text, length);
  }

  public getComplaintType(type?: string): string {
    if (type === this.complaintType.UNDEFINED.value) {
      return this.translateService.instant(this.complaintType.UNDEFINED.label);
    }
    if (type === this.complaintType.SPAM.value) {
      return this.translateService.instant(this.complaintType.SPAM.label);
    }
    if (type === this.complaintType.MIS_CLASSIFICATION.value) {
      return this.translateService.instant(
        this.complaintType.MIS_CLASSIFICATION.label
      );
    }
    if (type === this.complaintType.SERVICE_QUALITY.value) {
      return this.translateService.instant(
        this.complaintType.SERVICE_QUALITY.label
      );
    }
    return '';
  }
  public getRating(rating?: boolean): string {
    if (rating === this.complaintRating.SATIFIED.value) {
      return this.translateService.instant(this.complaintRating.SATIFIED.label);
    }
    if (rating === this.complaintRating.UNSATIFIED.value) {
      return this.translateService.instant(
        this.complaintRating.UNSATIFIED.label
      );
    }
    return '';
  }

  public format(value?: string): any {
    if (value === this.complaintStatus.RECEIVED.value) {
      return {
        color: 'badge-info',
        text: 'received',
      };
    }
    if (value === this.complaintStatus.OPEN.value) {
      return {
        color: 'badge-danger',
        text: 'waiting',
      };
    }
    if (value === this.complaintStatus.IN_PROGRESS.value) {
      return {
        color: 'badge-warning',
        text: 'processing',
      };
    }
    if (value === this.complaintStatus.CLOSED.value) {
      return {
        color: 'badge-success',
        text: 'done',
      };
    }
  }

  public getTranslate(key: string): string {
    return this.translateService.instant(this.translatePath + key);
  }

  public onChangeQueryParams(params: NzTableQueryParams): void {
    if (this.isCallFirstRequest) {
      this.isCallFirstRequest = false;
      return;
    }
    const { sortBy } = CommonUtil.onQueryParam(params);
    this.complaintSearchRequest.sortBy = sortBy;

    this.loadDataSearch();
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.complaintSearchRequest.pageIndex = pageIndex;
    this.complaintSearchRequest.pageSize = pageSize;
    this.searchComplaint();
  }

  public toCreateTicket(complaint: Complaint): void {
    if (complaint.id && !this.isDisableCreateTicket(complaint)) {
      this.route.navigate([`/ticket/create-by-complaint/${complaint.id}`]);
    }
  }

  public toComplaintDetail(complaintId?: string): void {
    if (complaintId) {
      this.route.navigate([`/complaint/${complaintId}/complaint-detail`]);
    }
  }

  public openServiceFeedback(complaint: Complaint): void {
    const base = CommonUtil.modalBase(
      HandleComplaintComponent,
      {
        complaint,
      },
      '50%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.searchComplaint();
      }
    });
  }

  public openCompleteComplaint(complaint: Complaint): void {
    this.isVisible = true;
    this.groupPopup = {
      title: 'model.complaint.confirmComplete',
      content: 'model.complaint.makeSureComplete',
      okText: 'model.complaint.complete',
    };
  }

  public openDeleteComplaint(complaint: Complaint): void {
    this.isVisible = true;
    this.isDelete = true;
    this.complaintSelected = complaint;
    this.groupPopup = {
      title: 'model.complaint.confirmDelete',
      content: 'model.complaint.makeSureDelete',
      okText: 'model.complaint.confirm',
    };
  }

  public openCloseComplaint(complaint: Complaint): void {
    if (!this.isDisableComplete(complaint)) {
      const base = CommonUtil.modalBase(
        ComplaintCloseComponent,
        {
          complaint,
        },
        '40%'
      );
      const modal: NzModalRef = this.modalService.create(base);
      modal.afterClose.subscribe((result) => {
        if (result && result?.success) {
          this.complaintSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
          this.searchComplaint();
        }
      });
    }
  }

  public openConfirmCreateTicket(complaint: Complaint): void {
    if (!this.isDisableCreateTicket(complaint)) {
      this.isVisible = true;
      this.isCreateTicket = true;
      this.complaintSelected = complaint;
      this.groupPopup = {
        title: 'model.complaint.confirmCreateTicket',
        content: 'model.complaint.makeSureCreateTicket',
        okText: 'action.confirm',
      };
    }
  }

  public openMarkSpamComplaint2(complaint: Complaint): void {
    if (!this.isDisableMarkSpam(complaint)) {
      const base = CommonUtil.modalBase(
        MarkSpamsComponent,
        {
          complaint,
          isConfirm: true,
        },
        '40%'
      );
      const modal: NzModalRef = this.modalService.create(base);
      modal.afterClose.subscribe((result) => {
        if (result && result?.success) {
          this.complaintSearchRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
          this.searchComplaint();
          this.setOfCheckedId = new Set<string>();
          this.complaintIdSelectedArr = [];
          this.complaintSelectedArr = [];
        }
      });
    }
  }

  handleAction(result: { success: boolean }): void {
    if (result && result?.success) {
      if (this.isDelete && this.complaintSelected.id) {
        this.complaintService
          .delete(this.complaintSelected.id, true)
          .subscribe((res) => {
            this.toastService.success('model.complaint.success.delete');
            this.searchComplaint();
            this.isVisible = false;
            this.isDelete = false;
          });
      }
      if (this.isCreateTicket && this.complaintSelected.id) {
        this.isCreateTicket = false;
        this.route.navigate([
          `/ticket/create-by-complaint/${this.complaintSelected.id}`,
        ]);
      }
    } else {
      this.isVisible = false;
    }
  }

  openMarkSpamComplaints(complaints: Complaint[]): void {
    if (complaints?.length === 0) {
      this.toastService.error(
        'model.complaint.complaint-list.notSelectedComplaint'
      );
    } else {
      const base = CommonUtil.modalBase(
        MarkSpamsComponent,
        {
          complaints,
          isConfirm: true,
        },
        '60%'
      );
      const modal: NzModalRef = this.modalService.create(base);
      modal.afterClose.subscribe((result) => {
        if (result && result?.success) {
          this.searchComplaint('');
          this.setOfCheckedId = new Set<string>();
          this.complaintIdSelectedArr = [];
          this.complaintSelectedArr = [];
        }
      });
    }
  }

  openDeleteSpamComplaints(complaints: Complaint[]): void {
    if (complaints?.length === 0) {
      this.toastService.error(
        'model.complaint.complaint-list.notSelectedComplaint'
      );
    } else {
      const base = CommonUtil.modalBase(
        MarkSpamsComponent,
        {
          complaints,
          isConfirm: false,
        },
        '60%'
      );
      const modal: NzModalRef = this.modalService.create(base);
      modal.afterClose.subscribe((result) => {
        if (result && result?.success) {
          this.searchComplaint('');
          this.setOfCheckedId = new Set<string>();
          this.complaintIdSelectedArr = [];
          this.complaintSelectedArr = [];
        }
      });
    }
  }

  // Check

  checkDisableCheckbox(complaint: Complaint): boolean {
    if (this.currentUser?.userLevel === USER_LEVEL_LEADER_MANAGEMENT) {
      return !(
        complaint.status === this.complaintStatus.OPEN.value &&
        complaint.complaintType === this.complaintType.UNDEFINED.value
      );
    }
    if (this.currentUser?.userLevel === USER_LEVEL_CENTER) {
      return complaint.complaintType !== this.complaintType.SPAM.value;
    }
    return false;
  }

  updateCheckedSet(complaint: IComplaint, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(complaint?.id || '');
      if (
        this.complaintSelectedArr?.every((item) => {
          return item?.id !== complaint?.id;
        })
      ) {
        this.complaintSelectedArr?.push(complaint);
      }
    } else {
      this.setOfCheckedId?.delete(complaint?.id || '');
      this.complaintSelectedArr = this.complaintSelectedArr.filter(
        (item: IComplaint) => {
          return item?.id !== complaint?.id;
        }
      );
    }
  }

  // Update checked all
  refreshCheckedStatus(complaints: IComplaint[]): void {
    let listOfEnabledData: IComplaint[] = [];
    if (this.currentUser?.userLevel === USER_LEVEL_LEADER_MANAGEMENT) {
      listOfEnabledData = complaints.filter((complaint) => {
        return (
          complaint.status === this.complaintStatus.OPEN.value &&
          complaint.complaintType === this.complaintType.UNDEFINED.value
        );
      });
    } else if (this.currentUser?.userLevel === USER_LEVEL_CENTER) {
      listOfEnabledData = complaints.filter((complaint) => {
        return complaint.complaintType === this.complaintType.SPAM.value;
      });
    }
    this.isDisable = listOfEnabledData.length === 0;
    this.checked =
      listOfEnabledData.length > 0 &&
      listOfEnabledData.every((complaint) => {
        return this.setOfCheckedId?.has(complaint?.id || '');
      });
  }

  onItemChecked(checked: boolean, complaint?: IComplaint): void {
    if (!!complaint) {
      this.updateCheckedSet(complaint, checked);
      this.refreshCheckedStatus(this.complaints);
    }
  }

  onAllChecked(checked: boolean): void {
    let listOfEnabledData: IComplaint[] = [];
    if (this.currentUser?.userLevel === USER_LEVEL_LEADER_MANAGEMENT) {
      listOfEnabledData = this.complaints.filter((complaint: IComplaint) => {
        return (
          complaint.status === this.complaintStatus.OPEN.value &&
          complaint.complaintType === this.complaintType.UNDEFINED.value
        );
      });
    } else if (this.currentUser?.userLevel === USER_LEVEL_CENTER) {
      listOfEnabledData = this.complaints.filter((complaint: IComplaint) => {
        return complaint.complaintType === this.complaintType.SPAM.value;
      });
    }
    listOfEnabledData.forEach((complaint) => {
      if (complaint.id) {
        this.updateCheckedSet(complaint, checked);
      }
    });
    this.refreshCheckedStatus(listOfEnabledData);
  }

  openAdvancedSearch(
    complaintSearchRequestAdvance: IComplaintSearchRequest
  ): void {
    const base = CommonUtil.modalBase(
      ComplaintFilterComponent,
      complaintSearchRequestAdvance,
      '50%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.complaintSearchRequest.buildingIds = result.value?.buildingIds;
        this.complaintSearchRequest.complaintType = result.value?.complaintType;
        this.complaintSearchRequest.status = result.value?.status;
        this.complaintSearchRequest.satisfiedComplaint =
          result.value?.satisfiedComplaint;
        this.complaintSearchRequest.startCreatedAt = result.value
          ?.startCreatedAt
          ? CommonUtil.getStartOfDay(
              (result.value?.startCreatedAt as Date).getTime()
            )
          : undefined;
        this.complaintSearchRequest.endCreatedAt = result.value?.endCreatedAt
          ? CommonUtil.getEndOfDay(
              (result.value?.endCreatedAt as Date).getTime()
            )
          : undefined;
        this.loadDataSearch(PAGINATION.PAGE_DEFAULT);
      }
    });
  }

  isDisableComplete(complaint: IComplaint): boolean {
    if (complaint.status === this.complaintStatus.OPEN.value) {
      return false;
    }
    return true;
  }

  isDisableCreateTicket(complaint: IComplaint): boolean {
    if (complaint.status === this.complaintStatus.OPEN.value) {
      return false;
    }
    return true;
  }

  isDisableMarkSpam(complaint: IComplaint): boolean {
    if (
      complaint.status === this.complaintStatus.OPEN.value &&
      complaint.complaintType === this.complaintType.UNDEFINED.value
    ) {
      return false;
    }
    return true;
  }
}
