export const USER_ACTIVE = 'ACTIVE';
export const USER_INACTIVE = 'INACTIVE';
export const USER_LEVEL_CENTER = 'CENTER';
export const USER_LEVEL_LEADER_MANAGEMENT = 'BUILDING_MANAGER';
export const USER_LEVEL_LEADER_ENGINEER = 'TECHNICAL_LEADER';
export const USER_LEVEL_LEADER_SERVICE = 'SERVICE_LEADER';
export const USER_EMPLOYEE = 'EMPLOYEE';
export const USER_CUSTOMER = 'CUSTOMER';

export const USER_STATUS = [
  {value: USER_ACTIVE, label: 'model.user.service.userStatus.active'}, // Trạng thái hoạt động
  {value: USER_INACTIVE, label: 'model.user.service.userStatus.inactive'}, // Trạng thái không hoạt động
];

export const USER_LEVEL = [
  {value: USER_LEVEL_CENTER, label: 'model.user.service.userLevel.center'}, // Trung tâm
  {value: USER_LEVEL_LEADER_MANAGEMENT, label: 'model.user.service.userLevel.building_manager'}, // Quản lý lãnh đạo
  {value: USER_LEVEL_LEADER_ENGINEER, label: 'model.user.service.userLevel.technical_leader'}, // Quản lý kỹ sư
  {value: USER_LEVEL_LEADER_SERVICE, label: 'model.user.service.userLevel.service_leader'}, // Quản lý dịch vụ
];

export const USER_LEVEL_TITLE = [
  USER_LEVEL_CENTER,
  USER_LEVEL_LEADER_MANAGEMENT,
  USER_LEVEL_LEADER_ENGINEER,
  USER_LEVEL_LEADER_SERVICE
];

export const USER_GENDER = [
  {value: 'MALE', label: 'model.user.service.userGender.male'},
  {value: 'FEMALE', label: 'model.user.service.userGender.female'},
  // { value: "OTHER", label:'model.user.service.userGender.other' },
];

export const ACTION_TYPE = {
  CREATE_USER: 'CREATE_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER'
};

export const USER_ACCOUNT_TYPE = [
  {value: USER_CUSTOMER, label: 'model.user.service.accountType.customer'},
  {value: USER_EMPLOYEE, label: 'model.user.service.accountType.employee'},
];


export const USER_TYPE = 'user';
export const USER_INTERNAL = 'user_internal';
export const USER_LDAP = 'user_ldap';
export const USER_PROFILE_INTERNAL = 'INTERNAL';
export const USER_PROFILE_LDAP = 'LDAP';





