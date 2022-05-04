import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { STATUS } from '@shared/constants/status.constants';
import { IPermission, Permission } from '@shared/models/permission.model';
import { IRolePermission } from '@shared/models/role-permission.model';
import { Role } from '@shared/models/role.model';
import { ToastService } from '@shared/services/helpers/toast.service';
import { PermissionService } from '@shared/services/permission.service';
import { RoleService } from '@shared/services/role.service';
import * as _ from 'lodash';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-update-permission',
  templateUrl: './update-permission.component.html',
  styleUrls: ['./update-permission.component.scss'],
})
export class UpdatePermissionComponent implements OnInit {
  @Input() isUpdate = false;
  @Input() role: Role = new Role();
  loading = true; // Loading status of table
  pageIndex = PAGINATION.PAGE_DEFAULT; // 	pageIndex , double binding
  pageSize = PAGINATION.SIZE_DEFAULT; // pageSize, double binding
  pageSizeOptions = PAGINATION.OPTIONS; // Specify the sizeChanger options
  total = 0; // total record
  permissions: IPermission[] = [];
  rolePermission: IRolePermission[] = [];
  rolePermissionRequest: IRolePermission[] = [];
  rolePermissions: any[] = [];
  active = false;
  roleName = '';

  constructor(
    private translateService: TranslateService,
    private permissionService: PermissionService,
    private roleService: RoleService,
    private modalRef: NzModalRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.getExitedRolePermission();
    setTimeout(() => {
      this.roleName = this.role?.name || '';
    }, 1);
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: null,
    });
  }

  // get list all permission and group by resourceCode
  getListPermission(): void {
    this.permissionService.findAll().subscribe((response) => {
      if (response?.body?.data) {
        const datas = response.body.data as Array<IPermission>;
        datas.map(
          (permission: Permission): any => (permission.checked = false)
        );
        if (this.rolePermission.length > 0) {
          for (const data of datas) {
            for (const rolePer of this.rolePermission) {
              if (
                data.resourceCode === rolePer.resourceCode &&
                data.scope === rolePer.scope
              ) {
                data.checked = true;
              }
            }
          }
        }
        this.permissions = datas;
        const results = _(this.permissions)
          .groupBy((x) => x.resourceCode)
          .map((value, key) => ({ resourceCode: key, per: value }))
          .value();
        // rolePermissions is Object[] use groupBy, [{resourceCode: string, per: Permission[]}]
        this.rolePermissions = results;
      }
    });
  }

  updatePermission(): void {
    for (const rolePermission of this.rolePermissions) {
      const i = this.rolePermissionRequest.length;
      this.rolePermissionRequest.push({
        resourceCode: rolePermission.resourceCode,
        scopes: [],
      });
      for (const rolePer of rolePermission.per) {
        if (rolePer.checked === true) {
          this.rolePermissionRequest[i].scopes?.push(rolePer.scope);
        }
      }
    }

    const role = this.role;
    role.permissions = this.rolePermissionRequest;
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

  // change checked
  changeCheckPermission(item: IPermission): void {
    for (const permissions of this.rolePermissions) {
      if (permissions.resourceCode === item.resourceCode) {
        for (const per of permissions.per) {
          if (per.scope === item.scope) {
            item.checked = !item.checked;
          }
        }
      }
    }
  }

  // get list permission of this role
  private getExitedRolePermission(): void {
    this.roleService.findById(this.role.id).subscribe((response) => {
      const data = response?.body?.data as Role;
      if (data?.permissions) {
        this.rolePermission = data?.permissions;
      }
      this.getListPermission();
    });
  }
}
