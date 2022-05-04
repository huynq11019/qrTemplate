export const IS_ADMIN = [
  { value: true, label: 'True' },
  { value: false, label: 'False' },
];

export const ROLE_ACTIVE = 'ACTIVE';
export const ROLE_INACTIVE = 'INACTIVE';
export const ROLE_STATUS = [
  { value: ROLE_ACTIVE, label: 'model.role.active' }, // Trạng thái hoạt động
  { value: ROLE_INACTIVE, label: 'model.role.inactive' }, // Trạng thái không hoạt động
];

export const SYSTEMMANAGEMENT = 'SYSTEMMANAGEMENT';
export const CENTER = 'CENTER';
export const BUILDING = 'BUILDING';
export const CUSTOMER = 'CUSTOMER';
export const CENTER_TITLE = 'model.role.center';
export const BUILDING_TITLE = 'model.role.building';
export const CUSTOMER_TITLE = 'model.role.customer';

export const ROLE_LEVEL = [
  { value: CENTER, label: 'model.role.center' },
  { value: BUILDING, label: 'model.role.building' },
  { value: CUSTOMER, label: 'model.role.customer' },
];

export const ROLE_LEVELS = {
  CENTER,
  BUILDING,
  CUSTOMER,
  CENTER_TITLE,
  BUILDING_TITLE,
  CUSTOMER_TITLE,
};

export const ROLE_ISROOT = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' },
];
