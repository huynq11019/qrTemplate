import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGINATION } from '@shared/constants/pagination.constants';
import {
  ROLE_ISROOT,
  ROLE_LEVEL,
  ROLE_STATUS,
} from '@shared/constants/role.constant';
import { IRoleRequest } from '@shared/models/request/role-request.model';
import { IUser, User } from '@shared/models/user.model';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-advanced-search-role',
  templateUrl: './advanced-search-role.component.html',
  styleUrls: ['./advanced-search-role.component.scss'],
})
export class AdvancedSearchRoleComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  roleStatus = ROLE_STATUS;
  roleLevel = ROLE_LEVEL;
  createdAt = new Date();
  isRoot = ROLE_ISROOT;

  @ViewChild('startPicker') startPicker!: NzDatePickerComponent;

  @ViewChild('endPicker') endPicker!: NzDatePickerComponent;

  roleRequest: IRoleRequest = {};
  usersSearch: IUser[] = [];

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private userService: UserService
  ) {
    this.roleRequest =
      this.modalRef?.getConfig()?.nzComponentParams?.roleRequest || {};
    this.searchUser('');
    this.initForm();
  }

  ngOnInit(): void {}

  initForm(): void {
    this.form = this.fb.group({
      isRoot: [this.roleRequest.isRoot || null],
      roleLevel: [this.roleRequest.roleLevel || null],
      createdAt: [this.roleRequest.startAt || null],
      lastModifiedAt: [this.roleRequest.endAt || null],
      status: [this.roleRequest.status || null],
      createdBy: [this.roleRequest.createdBy || null],
    });
  }

  onSubmit(): void {
    const body = this.form.value;
    this.modalRef.close({
      data: body,
      success: !this.form.invalid,
    });
  }

  searchUser(keyword: string): void {
    this.userService
      .searchUsersAutoComplete({
        keyword,
        pageIndex: PAGINATION.PAGE_DEFAULT,
        pageSize: PAGINATION.SIZE_DEFAULT,
      })
      .subscribe((res: any) => {
        this.usersSearch = res.body?.data as Array<User>;
      });
  }

  mappingUsers(users: IUser[]): (string | undefined)[] {
    return users.map((user: IUser) => user.username) || [];
  }

  selectAll(controls: string, value: any[]): void {
    const formControl = this.form.controls[controls];
    if (formControl.value?.length === value.length) {
      formControl.setValue([]);
    } else {
      if (controls === 'createdBy') {
        formControl.setValue(this.mappingUsers(value));
      }
    }
  }

  disabledBeforeToday(current: Date): boolean {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) < 0;
  }

  disabledBeforeStartAt(current: Date): boolean {
    const date = document.getElementById('startPicker') as HTMLInputElement;

    return (
      differenceInCalendarDays(
        current,
        moment(date?.value, 'DD/MM/yyyy').toDate()
      ) < 0
    );
  }

  enterDatePicker(event: any, nameDate: string): void {
    const date = event?.target?.value;
    if (nameDate === 'createdAt') {
      if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
        this.form.controls[nameDate].setValue(
          this.form.controls[nameDate].value
        );
        this.startPicker.close();
      } else if (!this.disabledBeforeToday(CommonUtil.newDate(date))) {
        this.form.controls[nameDate].setValue(CommonUtil.newDate(date));
        this.startPicker.close();
      } else {
        this.form.controls[nameDate].setValue(
          this.form.controls[nameDate].value
        );
        this.startPicker.close();
      }
    } else if (nameDate === 'lastModifiedAt') {
      if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
        this.form.controls[nameDate].setValue(
          this.form.controls[nameDate].value
        );
        this.endPicker.close();
      } else if (!this.disabledBeforeStartAt(CommonUtil.newDate(date))) {
        this.form.controls[nameDate].setValue(CommonUtil.newDate(date));
        this.endPicker.close();
      } else {
        this.form.controls[nameDate].setValue(
          this.form.controls[nameDate].value
        );
        this.endPicker.close();
      }
    }
  }

  changeStartAt(): void {
    this.createdAt = moment(
      this.form?.controls?.createdAt.value,
      'DD/MM/yyyy'
    ).toDate();
    if (
      differenceInCalendarDays(
        this.form.controls.lastModifiedAt.value,
        this.form.controls.createdAt.value
      ) < 0
    ) {
      this.form.controls.lastModifiedAt.setValue(
        this.form.controls.createdAt.value
      );
    }
  }

  onCancel(): void {
    this.form.get('isRoot')?.reset();
    this.form.get('roleLevel')?.reset();
    this.form.get('createdAt')?.reset();
    this.form.get('lastModifiedAt')?.reset();
    this.form.get('status')?.reset();
    this.form.get('createdBy')?.reset();
  }
}
