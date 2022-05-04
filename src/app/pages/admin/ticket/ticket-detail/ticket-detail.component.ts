import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FALLBACK, NO_IMAGE } from '@shared/constants/file.constant';
import { MODULE } from '@shared/constants/gateway-routes-api.constant';
import {
  TICKET_SERVICE_TITLE,
  TICKET_STATUS_ALL,
} from '@shared/constants/ticket.constant';
import { IFile } from '@shared/models/file.model';
import { ITicket } from '@shared/models/ticket.model';
import { AuthService } from '@shared/services/auth/auth.service';
import { FileService } from '@shared/services/file.service';
import { TicketService } from '@shared/services/ticket.service';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss'],
})
export class TicketDetailComponent implements OnInit {
  public translatePath = 'model.ticket.ticketDetail.';
  public ticket?: ITicket = {};
  public illustrationsFiles: IFile[] = [];
  public inspectionFiles: IFile[] = [];
  ticketId = '';
  TICKET_STATUS_ALL = TICKET_STATUS_ALL;
  TICKET_SERVICE_TITLE = TICKET_SERVICE_TITLE;
  fallback = FALLBACK;
  noImage = NO_IMAGE;
  isComplaint = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private ticketService: TicketService,
    private fileService: FileService,
    private authService: AuthService
  ) {
    this.route.paramMap.subscribe((res) => {
      this.ticketId = res.get('ticketId') || '';
    });
  }

  ngOnInit(): void {
    this.getDetail();
  }

  getLinkToComplaint(): void {
    this.router.navigate([
      `${MODULE.COMPLAINT}/${this.ticket?.complaint?.id}/complaint-detail`,
    ]);
  }

  getTranslate(key: string): string {
    return this.translateService.instant(this.translatePath + key);
  }

  getDetail(): void {
    this.ticketService.getById(this.ticketId).subscribe((res) => {
      this.ticket = res.body?.data as ITicket;
      if (this.ticket.illustrationsFiles) {
        this.illustrationsFiles = this.ticket.illustrationsFiles;
        // const fileIds: Array<string> = this.ticket.illustrationsFiles.map((item: { id: string; }) => item.id);
      }
      if (this.ticket.inspectionFiles) {
        this.inspectionFiles = this.ticket.inspectionFiles;
      }
      if (this.ticket.code?.startsWith('BN', 0)) {
        this.isComplaint = true;
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

  formatService(service: string): any {
    if (!service) {
      return '-';
    }
    if (service === this.TICKET_SERVICE_TITLE.TECHNICAL) {
      return this.TICKET_SERVICE_TITLE.TECHNICAL_TITLE;
    } else if (service === this.TICKET_SERVICE_TITLE.SERVICE) {
      return this.TICKET_SERVICE_TITLE.SERVICE_TITLE;
    }
  }

  onCancel(): void {
    this.router.navigate([`/ticket`]);
  }

  addTokenToFile(filePath?: string, fileId?: string): string {
    if (!!filePath) {
      return filePath + '?token=' + this.authService.getToken();
    } else if (!!fileId) {
      return this.fileService.viewFileResource(fileId);
    }
    return '-';
  }

  hasAuthority(authority: string[]): boolean {
    return this.authService.hasAnyAuthority(authority);
  }
}
