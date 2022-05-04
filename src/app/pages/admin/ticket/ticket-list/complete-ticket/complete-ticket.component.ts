import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { OWNER_TYPE } from '@shared/constants/file.constant';
import { STATUS } from '@shared/constants/status.constants';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { Ticket } from '@shared/models/ticket.model';
import { FileService } from '@shared/services/file.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { TicketService } from '@shared/services/ticket.service';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-complete-ticket',
  templateUrl: './complete-ticket.component.html',
  styleUrls: ['./complete-ticket.component.scss'],
})
export class CompleteTicketComponent implements OnInit {
  @Input() ticket: Ticket = new Ticket();
  form: FormGroup = new FormGroup({});
  files: [] | any;
  filesUpload: any[] = [];
  maxFileUpload = 5;
  imageUrls?: any[] = [];
  oversized = false;
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private modalRef: NzModalRef,
    private ticketService: TicketService,
    private fileService: FileService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      feedback: [],
    });
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: null,
    });
  }

  onSubmit(): void {
    const originFiles: any[] = [];
    let inspectionFiles: any[] = [];
    if (this.filesUpload?.length > 0) {
      this.filesUpload.forEach((file: any) => {
        originFiles.push(file?.originFileObj);
      });

      this.fileService
        .uploadListFile(originFiles, '', OWNER_TYPE.TICKET)
        .subscribe((res) => {
          const ids = res.body?.data as any;
          inspectionFiles = ids.map((item: { id: string }) => item.id);
          const request = {
            feedback: this.form.get('feedback')?.value,
            inspectionFiles,
          };
          this.save(request);
        });
    }
  }

  save(body: any): void {
    this.ticketService.completeTicket(this.ticket.id, body).subscribe((res) => {
      if (res.status === STATUS.SUCCESS_200) {
        this.toast.success('model.ticket.success.complete');
        this.modalRef.close({
          success: true,
        });
      }
    });
  }

  getFiles(filesUpload: any): void {
    this.filesUpload = filesUpload;
    this.oversized = this.filesUpload.length > 5;
    const imgs: any[] = [];

    this.filesUpload.forEach((item) => {
      this.getBase64(item.originFileObj).then((data) => {
        imgs.push(data);
      });
    });
    this.imageUrls = imgs;
  }

  getFilesOrigin(files: any): void {
    this.files = files;
  }

  getBase64(image: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  valuableImages(): boolean {
    return this.filesUpload.length > 0;
  }
}
