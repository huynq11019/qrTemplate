import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  LENGTH_VALIDATOR,
  VALIDATORS,
} from '@shared/constants/validators.constant';
import { IComplaint } from '@shared/models/complaint.model';
import { ComplaintService } from '@shared/services/complaint.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-complaint-close',
  templateUrl: './complaint-close.component.html',
  styleUrls: ['./complaint-close.component.scss'],
})
export class ComplaintCloseComponent implements OnInit {
  @Input() complaint?: IComplaint;

  translatePath = 'model.complaint.';
  form: FormGroup = new FormGroup({});
  MAX_DESCRIPTION_LENGTH = LENGTH_VALIDATOR.DESC_MAX_LENGTH.MAX;

  constructor(
    private translateService: TranslateService,
    private modalRef: NzModalRef,
    private formBuilder: FormBuilder,
    private complaintService: ComplaintService,
    private toastService: ToastService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      note: [
        null,
        [
          Validators.maxLength(this.MAX_DESCRIPTION_LENGTH),
          Validators.pattern(VALIDATORS.SPACE),
        ],
      ],
    });
  }

  public getTranslate(key: string): string {
    return this.translateService.instant(this.translatePath + key);
  }

  closeComplaint(): void {
    if (this.complaint?.id) {
      this.complaintService
        .close(this.complaint?.id, this.form.controls.note.value, true)
        .subscribe((res: any) => {
          if (!!res && res?.body?.success) {
            this.toastService.success('model.complaint.success.receive');
            this.modalRef.close({
              success: true,
            });
          }
        });
    }
  }

  cancel(): void {
    this.modalRef.close({
      success: false,
    });
  }
}
