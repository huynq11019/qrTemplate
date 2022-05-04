import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  COMPLAINT_RATING,
  COMPLAINT_STATUS,
  COMPLAINT_TYPE,
} from '@shared/constants/complaint.constant';
import { FALLBACK, NO_IMAGE } from '@shared/constants/file.constant';
import {
  USER_LEVEL_CENTER,
  USER_LEVEL_LEADER_MANAGEMENT,
} from '@shared/constants/user.constant';
import { Complaint, IComplaint } from '@shared/models/complaint.model';
import { IFile } from '@shared/models/file.model';
import { ITicket, Ticket } from '@shared/models/ticket.model';
import { User } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth/auth.service';
import { ComplaintService } from '@shared/services/complaint.service';
import { FileService } from '@shared/services/file.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { TicketService } from '@shared/services/ticket.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ComplaintCloseComponent } from '../complaint-close/complaint-close.component';
import { HandleComplaintComponent } from '../handle-complaint/handle-complaint.component';
import { MarkSpamsComponent } from '../mark-spams/mark-spams.component';

@Component({
  selector: 'app-complaint-detail',
  templateUrl: './complaint-detail.component.html',
  styleUrls: ['./complaint-detail.component.scss'],
})
export class ComplaintDetailComponent implements OnInit {
  public translatePath = 'model.complaint.complaint-detail.';
  public illustrationsFiles: IFile[] = [];
  public inspectionFiles: IFile[] = [];
  translatePathList = 'model.complaint.complaint-list.';
  complaint: Complaint = new Complaint();
  ticket: Ticket = new Ticket();
  fallback = FALLBACK;
  noImage = NO_IMAGE;
  complaintId = '';
  complaintStatus = COMPLAINT_STATUS;
  complaintType = COMPLAINT_TYPE;
  complaintRating = COMPLAINT_RATING;
  isMarkSpam = false;
  isCreateTicket = false;
  isConfirmCreateTicket = false;
  isConfirmComplete = false;
  isComplete = false;
  isServiceFeedback = false;
  isVisible = false;
  currentUser: User | null = null;
  USER_LEVEL_LEADER_MANAGEMENT = USER_LEVEL_LEADER_MANAGEMENT;
  USER_LEVEL_CENTER = USER_LEVEL_CENTER;

  groupPopup = {
    title: '',
    content: '',
    okText: '',
  };

  constructor(
    private router: ActivatedRoute,
    private translateService: TranslateService,
    private fileService: FileService,
    private complaintService: ComplaintService,
    private authService: AuthService,
    private route: Router,
    private ticketService: TicketService,
    private modalService: NzModalService,
    private toastService: ToastService
  ) {
    this.router.paramMap.subscribe((res) => {
      this.complaintId = res.get('id') || '';
    });
  }

  getTranslate(key: string): string {
    return this.translateService.instant(this.translatePath + key);
  }

  getTranslateList(key: string): string {
    return this.translateService.instant(this.translatePathList + key);
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

  ngOnInit(): void {
    this.getDetail();
    this.currentUser = this.authService.getCurrentUser();
  }

  getDetail(): void {
    this.complaintService.findById(this.complaintId).subscribe(
      (res) => {
        this.complaint = res.body?.data as IComplaint;
        if (
          this.complaint.complaintType === this.complaintType.UNDEFINED.value &&
          this.complaint.status === this.complaintStatus.OPEN.value
        ) {
          this.isMarkSpam = true;
        }
        if (this.complaint.status === this.complaintStatus.OPEN.value) {
          this.isCreateTicket = true;
        }
        if (this.complaint.status === this.complaintStatus.OPEN.value) {
          this.isComplete = true;
        }
        if (this.complaint.complaintType === this.complaintType.SPAM.value) {
          this.isServiceFeedback = true;
        }

        if (this.complaint.complaintFiles) {
          this.illustrationsFiles = this.complaint.complaintFiles;
        }
        if (this.complaint?.ticketId) {
          this.ticketService
            .getById(this.complaint?.ticketId, true)
            .subscribe((resp) => {
              this.ticket = resp.body?.data as ITicket;
            });
        }
        // if (this.ticket.inspectionFiles) {
        //   this.inspectionFiles = this.ticket.inspectionFiles;
        // }
      },
      () => {
        window.history.back();
      }
    );
  }

  getLimitLength(text: string): string {
    return CommonUtil.getLimitLength(text, 25);
  }

  onCancel(): void {
    this.route.navigate([`/complaint/list`]);
  }

  public openMarkSpamComplaint2(complaint: Complaint): void {
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
        this.route.navigate([`/complaint/list`]);
      }
    });
  }

  public openConfirmCreateTicket(): void {
    this.isVisible = true;
    this.isConfirmCreateTicket = true;
    this.groupPopup = {
      title: 'model.complaint.confirmCreateTicket',
      content: 'model.complaint.makeSureCreateTicket',
      okText: 'action.confirm',
    };
  }

  // public openConfirmCompleteComplaint(): void {
  //   this.isVisible = true;
  //   this.isConfirmComplete = true;
  //   this.groupPopup = {
  //     title: 'model.complaint.confirmComplete',
  //     content: 'model.complaint.makeSureComplete',
  //     okText: 'action.confirm',
  //   };
  // }

  public openCloseComplaint(complaint: Complaint): void {
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
        this.route.navigate([`/complaint/list`]);
      }
    });
  }

  addTokenToFile(filePath?: string, fileId?: string): string {
    if (!!filePath) {
      return filePath + '?token=' + this.authService.getToken();
    } else if (!!fileId) {
      return this.fileService.viewFileResource(fileId);
    }
    return '-';
  }

  linkTicket(id?: string): void {
    if (id) {
      this.route.navigate([`/ticket/${id}/detail`]);
    }
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

  public format(value?: string): any {
    if (value === this.complaintStatus.RECEIVED.value) {
      return 'received';
    }
    if (value === this.complaintStatus.OPEN.value) {
      return 'waiting';
    }
    if (value === this.complaintStatus.IN_PROGRESS.value) {
      return 'processing';
    }
    if (value === this.complaintStatus.CLOSED.value) {
      return 'done';
    }
  }

  hasAuthority(authority: string[]): boolean {
    return this.authService.hasAnyAuthority(authority);
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
        this.route.navigate([`/complaint/list`]);
      }
    });
  }

  handleAction(result: { success: boolean }): void {
    if (result && result?.success) {
      if (this.isConfirmCreateTicket && this.complaint.id) {
        this.route.navigate([
          `/ticket/create-by-complaint/${this.complaint.id}`,
        ]);
      }
      if (this.isConfirmComplete && this.complaint.id) {
        this.complaintService
          .close(this.complaint.id, '', true)
          .subscribe((res) => {
            this.toastService.success('model.complaint.success.receive');
            this.route.navigate([`/complaint/list`]);
          });
      }
    } else {
      this.isVisible = false;
    }
  }
}
