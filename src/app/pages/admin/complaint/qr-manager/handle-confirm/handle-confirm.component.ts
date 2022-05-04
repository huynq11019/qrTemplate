import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {IComplaintTemplate} from '@shared/models/complaint-template.model';
import {LENGTH_VALIDATOR} from '@shared/constants/validators.constant';
import {IValidateMessage} from '@shared/interface/validate-message';
import {QR_STATUS} from '@shared/constants/complaint.constant';

@Component({
  selector: 'app-handle-confirm',
  templateUrl: './handle-confirm.component.html',
  styleUrls: ['./handle-confirm.component.scss']
})
export class HandleConfirmComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  translatePath = 'model.qr-manager.handle-confirm';
  @Input() complaintItem?: IComplaintTemplate;
  QR_STATUS = QR_STATUS;
  public validateMessages: IValidateMessage[] = [
    {
      field: 'reason',
      fieldName: this.getTranslatePath('reason'),
      valid: [
        {type: 'required', param: LENGTH_VALIDATOR.DESC_MAX_LENGTH.MAX},
      ]
    }
  ];
  MAX_DESCRIPTION_LENGTH = LENGTH_VALIDATOR.DESC_MAX_LENGTH.MAX;
  constructor(private translate: TranslateService,
              private modalRef: NzModalRef,
              private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {

  }

  initForm(): void {
    this.form = this.fb.group({
      reason: ['', [Validators.required, Validators.maxLength(LENGTH_VALIDATOR.DESC_MAX_LENGTH.MAX)]]
    });
  }

  getTranslatePath(key: string): string {
    return this.translate.instant(`${this.translatePath}.${key}`);
  }

  public onReset(): void {
    this.form.reset();
  }

  onSubmit(): void {

    this.modalRef.close({
      success: true,
      data: {
        reason: this.form.value.reason
      }
    });
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      action: ''
    });
  }
}
