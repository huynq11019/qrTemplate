import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  USER_ACCOUNT_TYPE,
  USER_STATUS
} from '@shared/constants/user.constant';
import { IUserRequest } from '@shared/models/request/user-request.model';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-advanced-search-user',
  templateUrl: './advanced-search-user.component.html',
  styleUrls: ['./advanced-search-user.component.scss'],
})
export class AdvancedSearchUserComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  userRequest: IUserRequest = {};
  acountType = USER_ACCOUNT_TYPE;
  userStatus = USER_STATUS;

  advanceSearch: IUserRequest = {};

  constructor(private fb: FormBuilder, private modalRef: NzModalRef) {}

  ngOnInit(): void {
    this.advanceSearch =
      this.modalRef?.getConfig()?.nzComponentParams?.advanceSearch || {};
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      accountType: [this.advanceSearch.accountType || null],
      status: [this.advanceSearch.status || null],
    });
  }

  onSubmit(): void {
    const body = this.form.getRawValue();
    this.userRequest.accountType = body.accountType;
    this.userRequest.status = body.status;
    this.modalRef.close({
      userRequest: this.userRequest,
      success: !this.form.invalid,
    });
  }

  onCancel(): void {
    this.form.get('accountType')?.reset();
    this.form.get('status')?.reset();
  }
}
