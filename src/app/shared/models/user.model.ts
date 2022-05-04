import { Building } from './building.model';
import { Customer } from './customer.model';
import { Role } from './role.model';
import { UserPrimary } from './user-primary.model';

export interface IUser {
  id?: string;
  username?: string;
  fullName?: string;
  password?: string;
  email?: string;
  phoneNumber?: string;
  roles?: Array<Role>;
  buildings?: Array<Building>;
  organization?: Array<Customer>;
  authorities?: any;
  authenticationType?: string;
  accountType?: string;
  contactId?: string;
  companyName?: string;
  // Thêm mới, cập nhật tài khoản nội bộ
  dayOfBirth?: string;
  gender?: string;
  repeatPassword?: string;
  roleIds?: Array<string>;
  buildingIds?: Array<string>;
  organizationId?: string;
  employeeCode?: string;
  title?: string;
  description?: string;
  status?: string;
  departmentName?: string;
  userLevel?: string;
  avatarFileId?: string;
  file?: any;
  avatarFileUrl?: string;
  deleted?: boolean;
  checked?: boolean;
  disabled?: boolean;
  userPrimary?: UserPrimary;
}

export class User implements IUser {
  constructor(
    public id?: string,
    public username?: string,
    public fullName?: string,
    public password?: string,
    public email?: string,
    public phoneNumber?: string,
    public roles?: Array<Role>,
    public buildings?: Array<Building>,
    public organization?: Array<Customer>,
    public authorities?: any,
    public authenticationType?: string,
    public accountType?: string,
    public contactId?: string,
    public companyName?: string,
    // Thêm mới, cập nhật tài khoản nội bộ
    public dayOfBirth?: string,
    public gender?: string,
    public repeatPassword?: string,
    public roleIds?: Array<string>,
    public buildingIds?: Array<string>,
    public organizationId?: string,
    public employeeCode?: string,
    public title?: string,
    public description?: string,
    public status?: string,
    public departmentName?: string,
    public userLevel?: string,
    public avatarFileId?: string,
    public file?: any,
    public avatarFileUrl?: string,
    public deleted?: boolean,
    public checked?: boolean,
    public disabled?: boolean,
    public userPrimary?: UserPrimary,
  ) {
    this.id = id;
    this.username = username;
    this.fullName = fullName;
    this.password = password;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.roles = roles;
    this.buildings = buildings;
    this.organization = organization;
    this.authorities = authorities;
    this.authenticationType = authenticationType;
    this.accountType = accountType;
    this.contactId = contactId;
    this.companyName = companyName;
    // Thêm mới, cập nhật tài khoản nội bộ
    this.dayOfBirth = dayOfBirth;
    this.gender = gender;
    this.repeatPassword = repeatPassword;
    this.roleIds = roleIds;
    this.buildingIds = buildingIds;
    this.organizationId = organizationId;
    this.employeeCode = employeeCode;
    this.title = title;
    this.description = description;
    this.status = status;
    this.departmentName = departmentName;
    this.userLevel = userLevel;
    this.avatarFileId = avatarFileId;
    // Thong tin anh trong tai khoan
    this.file = file;
    this.avatarFileUrl = avatarFileUrl;
    this.deleted = deleted;
    this.checked = checked;
    this.disabled = disabled;
    this.userPrimary = userPrimary;
  }
}
