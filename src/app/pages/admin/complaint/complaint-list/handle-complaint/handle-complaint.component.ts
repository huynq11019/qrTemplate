import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STATUS } from '@shared/constants/status.constants';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { Complaint } from '@shared/models/complaint.model';
import { ComplaintService } from '@shared/services/complaint.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-handle-complaint',
  templateUrl: './handle-complaint.component.html',
  styleUrls: ['./handle-complaint.component.scss'],
})
export class HandleComplaintComponent implements OnInit {
  @Input() complaint = new Complaint();
  form: FormGroup = new FormGroup({});

  constructor(
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private complaintService: ComplaintService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      feedback: [
        this.complaint?.feedback ? this.complaint?.feedback : null,
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.CONTENT_MAX_LENGTH.MAX),
        ],
      ],
    });
  }

  onSubmit(): void {
    // debugger
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    if (this.complaint.id) {
      this.complaintService
        .markAsMisClassification(
          this.complaint?.id,
          this.form.get('feedback')?.value,
          true
        )
        .subscribe((res) => {
          if (res.status === STATUS.SUCCESS_200) {
            this.toast.success('model.complaint.serviceFeedbackSuccess');
            this.modalRef.close({
              success: true,
            });
          }
        });
    }
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
    });
  }
}
