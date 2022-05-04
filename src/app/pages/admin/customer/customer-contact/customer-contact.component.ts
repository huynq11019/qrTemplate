import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GENDER } from '@shared/constants/common.constant';
import { STATUS } from '@shared/constants/status.constants';
import {
  LENGTH_VALIDATOR,
  VALIDATORS,
} from '@shared/constants/validators.constant';
import { CustomerContact } from '@shared/models/customer-contact.model';
import { CustomerService } from '@shared/services/customer.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import * as moment from 'moment';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-customer-contact',
  templateUrl: './customer-contact.component.html',
  styleUrls: ['./customer-contact.component.scss'],
})
export class CustomerContactComponent implements OnInit {
  @Input() isUpdate = false;
  @Input() organizationId = '';
  @Input() customerContact: CustomerContact = {};
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    fullName: new FormControl(null),
    email: new FormControl(null),
    phoneNumber: new FormControl(null),
  });

  constructor(
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toast: ToastService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      id: [
        {
          value: this.isUpdate ? this.customerContact.id : null,
          disabled: false,
        },
      ],
      dayOfBirth: [
        {
          value: this.isUpdate
            ? this.customerContact.dayOfBirth
            : moment(new Date()).format('yyyy-MM-DD'),
          disabled: false,
        },
      ],
      gender: [
        {
          value: this.isUpdate ? this.customerContact.gender : GENDER.OTHER,
          disabled: false,
        },
      ],
      fullName: [
        {
          value: this.isUpdate ? this.customerContact.fullName : null,
          disabled: false,
        },
        [Validators.required],
      ],
      email: [
        {
          value: this.isUpdate ? this.customerContact.email : null,
          disabled: false,
        },
        [Validators.required, Validators.pattern(VALIDATORS.EMAIL)],
      ],
      phoneNumber: [
        {
          value: this.isUpdate ? this.customerContact.phoneNumber : null,
          disabled: false,
        },
        [Validators.required, Validators.pattern(VALIDATORS.PHONE)],
      ],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const body = this.form.value;
    if (this.isUpdate) {
      this.customerService
        .updateContacts(this.organizationId, body.id, body, true)
        .subscribe((res) => {
          if (res.status === STATUS.SUCCESS_200) {
            this.toast.success('common.success');
            this.modalRef.close({
              success: true,
              value: res?.body?.data,
            });
          }
        });
    } else {
      this.customerService
        .createContacts(this.organizationId, body, true)
        .subscribe((res) => {
          if (res.status === STATUS.SUCCESS_200) {
            this.toast.success('common.success');
            this.modalRef.close({
              success: true,
              value: res?.body?.data,
            });
          }
        });
    }
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: null,
    });
  }
}
