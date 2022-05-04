import { IRolePermission } from './role-permission.model';

export interface IRole {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  status?: string;
  createdAt?: number;
  createdBy?: string;
  lastModifiedAt?: number;
  lastModifiedBy?: string;
  permissions?: IRolePermission[];
  deleted?: boolean;
  checked?: boolean;
  isRoot?: boolean; // Nếu là true, mặc định là ADMIN
  roleLevel?: string;
}

export class Role implements IRole {
  constructor(
    public id?: string,
    public code?: string,
    public name?: string,
    public description?: string,
    public status?: string,
    public createdDate?: number,
    public createdBy?: string,
    public lastModifiedAt?: number,
    public lastModifiedBy?: string,
    public permissions?: IRolePermission[],
    public deleted?: boolean,
    public checked?: boolean,
    public isRoot?: boolean,
    public roleLevel?: string,
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.description = description;
    this.status = status;
    this.createdDate = createdDate;
    this.createdBy = createdBy;
    this.lastModifiedAt = lastModifiedAt;
    this.lastModifiedBy = lastModifiedBy;
    this.permissions = permissions ? permissions : [];
    this.deleted = deleted;
    this.checked = checked;
    this.isRoot = isRoot;
    this.roleLevel = roleLevel;
  }
}
