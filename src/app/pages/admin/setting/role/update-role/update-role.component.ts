import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PERMISSION_TYPE } from '@shared/constants/permission.constants';
import { CENTER, IS_ADMIN, ROLE_LEVEL } from '@shared/constants/role.constant';
import { STATUS } from '@shared/constants/status.constants';
import {
  LENGTH_VALIDATOR,
  VALIDATORS,
} from '@shared/constants/validators.constant';
import { IPermission } from '@shared/models/permission.model';
import { IRolePermission } from '@shared/models/role-permission.model';
import { Role } from '@shared/models/role.model';
import { ToastService } from '@shared/services/helpers/toast.service';
import { PermissionService } from '@shared/services/permission.service';
import { RoleService } from '@shared/services/role.service';
import CommonUtil from '@shared/utils/common-utils';
import * as _ from 'lodash';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.scss'],
})
export class UpdateRoleComponent implements OnInit {
  @Input() isUpdate = false;
  @Input() role: Role = new Role();
  enrichRole: Role = new Role();
  rolePermissions: IPermission[] = [];
  form: FormGroup = new FormGroup({});
  permissions: IPermission[] = [];
  rolePermission: IRolePermission[] = [];
  rolePermissionRequest: IRolePermission[] = [];
  PERMISSION_TYPE = PERMISSION_TYPE;
  isAdmin = IS_ADMIN;
  ROLE_LEVEL = ROLE_LEVEL;
  CENTER = CENTER;
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private modalRef: NzModalRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.isUpdate) {
      this.getExitedRolePermission();
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      code: [
        {
          value: this.isUpdate ? this.role?.code : null,
          disabled: this.isUpdate,
        },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.CODE_MAX_LENGTH.MAX),
          Validators.pattern(VALIDATORS.CODE),
        ],
      ],
      name: [
        this.isUpdate ? this.role?.name : null,
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX),
        ],
      ],
      description: [
        this.isUpdate ? this.role?.description : null,
        [Validators.maxLength(LENGTH_VALIDATOR.DESC_MAX_LENGTH.MAX)],
      ],
      isRoot: [this.isUpdate ? this.role?.isRoot : false],
      // permissions: [null], // permision không dùng như các biến trên vì xử lý riêng
      roleLevel: [
        {
          value: this.isUpdate ? this.role?.roleLevel : null,
          disabled: this.role?.isRoot === true ? true : false,
        },
        [Validators.required],
      ],
    });
  }

  onSubmit(): void {
    if (this.isUpdate) {
      this.updateRole();
    } else {
      this.createRole();
    }
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: null,
    });
  }

  private updateRole(): void {
    // enale to save
    this.form.get('roleLevel')?.enable();
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const role: Role = {
      permissions: this.rolePermissionRequest,
      code: this.role.code,
      ...this.form.value,
    };
    const body = CommonUtil.trim(role);
    if (this.role?.id) {
      this.roleService.update(role, this.role.id).subscribe((res) => {
        if (res.status === STATUS.SUCCESS_200) {
          this.toast.success('model.role.success.update');
          this.modalRef.close({
            success: true,
            value: role,
          });
        }
      });
    }
  }

  private createRole(): void {
    // enale to save
    this.form.get('roleLevel')?.enable();
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const role: Role = {
      permissions: null,
      ...this.form.value,
    };
    // const body = CommonUtil.trim(role);
    this.roleService.create(role).subscribe((res) => {
      if (res.status === STATUS.SUCCESS_200) {
        this.toast.success('model.role.success.create');
        this.modalRef.close({
          success: true,
          value: role,
        });
      }
    });
  }

  // auto adjust roleLevel when choose root
  checkRoot(): void {
    if (this.form.get('isRoot')?.value) {
      this.form.get('isRoot')?.setValue(false);
      this.form.get('roleLevel')?.setValue(null);
      this.form.get('roleLevel')?.enable();
    } else {
      this.form.get('isRoot')?.setValue(true);
      this.form.get('roleLevel')?.setValue(CENTER);
      this.form.get('roleLevel')?.disable();
    }
  }

  chooseNotCenter(event: string): void {
    if (this.form.get('roleLevel')?.value !== CENTER) {
      this.form.get('isRoot')?.setValue(false);
    }
  }

  getExitedRolePermission(): void {
    this.roleService.findById(this.role.id).subscribe((response) => {
      const data = response?.body?.data as Role;
      if (data?.permissions) {
        this.rolePermissions = data?.permissions;
        const results = _(this.rolePermissions)
          .groupBy((x) => x.resourceCode)
          .map((value, key) => ({ resourceCode: key, per: value }))
          .value();
        for (const rolePermission of results) {
          const i = this.rolePermissionRequest.length;
          this.rolePermissionRequest.push({
            resourceCode: rolePermission.resourceCode,
            scopes: [],
          });
          for (const rolePer of rolePermission.per) {
            this.rolePermissionRequest[i].scopes?.push(rolePer.scope);
          }
        }
      }
    });
  }
}
