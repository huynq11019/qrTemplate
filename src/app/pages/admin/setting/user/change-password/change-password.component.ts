import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { STATUS } from '@shared/constants/status.constants';
import {
  LENGTH_VALIDATOR,
  VALIDATORS,
} from '@shared/constants/validators.constant';
import { IChangePassword } from '@shared/models/request/change-password-request.model';
import { User } from '@shared/models/user.model';
import { ToastService } from '@shared/services/helpers/toast.service';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import Validation from '@shared/validators/confirmed-password.validator';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  @Input() user: User = new User();
  passwordVisible = false;
  rePasswordVisible = false;
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private modalRef: NzModalRef,
    private toast: ToastService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.PASSWORD_MAX_LENGTH.MAX),
            Validators.pattern(VALIDATORS.PASSWORD),
          ],
        ],
        repeatPassword: [
          '',
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.PASSWORD_MAX_LENGTH.MAX),
            Validators.pattern(VALIDATORS.PASSWORD),
          ],
        ],
      },
      {
        validators: [Validation.match('password', 'repeatPassword')],
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const changePassword: IChangePassword = {};
    changePassword.newPassword = this.form.get('password')?.value;
    changePassword.oldPassword = this.form.get('password')?.value;
    const body = CommonUtil.trim(changePassword);
    this.userService
      .changePassword(this.user.id, changePassword)
      .subscribe((response) => {
        if (response.status === STATUS.SUCCESS_200) {
          this.toast.success('model.user.success.update');
          this.modalRef.close({
            success: true,
            value: body,
          });
        }
      });
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: null,
    });
  }
}
