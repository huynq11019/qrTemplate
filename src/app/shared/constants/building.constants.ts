export const UNIT_TYPE = {
  COMMERCE: {
    label: 'model.unit.uType.commerce',
    value: 'COMMERCE',
  },
  OFFICE: {
    label: 'model.unit.uType.office',
    value: 'OFFICE',
  },
  OTHER: {
    label: 'model.unit.uType.other',
    value: 'OTHER',
  }
};
export const LEASING_STATUS = {
  DEFAULT: {
    value: 'DEFAULT',
    label: 'model.unit.uStatus.default',
  },
  LEASED: {
    label: 'model.unit.uStatus.leased',
    value: 'LEASED'
  },
  DEPOSIT: {
    label: 'model.unit.uStatus.deposit',
    value: 'DEPOSIT'
  },
  RETURNED: {
    label: 'model.unit.uStatus.returned',
    value: 'RETURNED'
  },
  AVAILABLE: {
    label: 'model.unit.uStatus.available',
    value: 'AVAILABLE'
  },
  EMPTY: {
    label: 'model.unit.uStatus.empty',
    value: 'EMPTY'
  },
};
export const UNIT_TYPE_LIST = [
  {
    value: 'COMMERCE',
    label: 'model.unit.uType.commerce'
  },
  {
    value: 'OFFICE',
    label: 'model.unit.uType.office'
  },
  {
    value: 'OTHER',
    label: 'model.unit.uType.other'
  }
];

export const LEASING_STATUS_LIST = [
  {
    value: 'DEFAULT',
    label: 'model.unit.uStatus.default',
    class: 'badge-default'
  },
  {
    value: 'LEASED',
    label: 'model.unit.uStatus.leased',
    class: 'badge-success'
  },
  {
    value: 'DEPOSIT',
    label: 'model.unit.uStatus.deposit',
    class: 'badge-info'
  },
  {
    value: 'RETURNED',
    label: 'model.unit.uStatus.returned',
    class: 'badge-danger'
  },
  {
    value: 'AVAILABLE',
    label: 'model.unit.uStatus.available',
    class: 'badge-warning'

  }
];

export const BUILDING_STATUS = {
  INACTIVE: {
    value: 'INACTIVE',
    label: 'model.building.bStatus.inactive'
  },
  ACTIVE: {
    value: 'ACTIVE',
    label: 'model.building.bStatus.active'
  }
};

export const ACTION_TYPE = {
  CREATE_BUILDING: 'CREATE_BUILDING',
  UPDATE_BUILDING: 'UPDATE_BUILDING',
  DELETE_BUILDING: 'DELETE_BUILDING',
  DELETE_FLOOR: 'DELETE_FLOOR',
};
export const BUILDING_VALID = {};
export const UNIT_STATUS = {
  ACTIVE: {
    value: 'ACTIVE',
    label: 'model.unit.uStatus.active',
  },
  INACTIVE: {
    value: 'INACTIVE',
    label: 'model.unit.uStatus.inactive',
    class: 'badge-danger'
  }
};
export const BUILDING_VALIDATOR = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 50
  },
  address: {
    required: true,
    minLength: 3,
    maxLength: 50
  },
  description: {
    required: true,
    minLength: 3,
    maxLength: 50
  },
  status: {
    required: true
  },
  unitType: {
    required: true
  },
  unitStatus: {
    required: true
  },
  unitNumber: {
    required: true,
    minLength: 1,
    maxLength: 50
  },
  floorNumber: {
    required: true,
    minLength: 1,
    maxLength: 50
  },
  area: {
    required: true,
    min: 1,
    max: 1000000000
  },
  price: {
    required: true,
    minLength: 1,
    maxLength: 50,
    maxValue: 99999999999
  },
  leasingStatus: {
    required: true
  },
  leasingPrice: {
    required: true,
    minLength: 1,
    maxLength: 50
  },
  leasingStartDate: {
    required: true
  },
  leasingEndDate: {
    required: true
  },
  leasingDeposit: {
    required: true,
    minLength: 1,
    maxLength: 50
  },
  leasingReturned: {
    required: true,
    minLength: 1,
    maxLength: 50
  },
  leasingReturnedDate: {
    required: true
  },
  leasingReturnedPrice: {
    required: true,
    minLength: 1,
    maxLength: 50
  },
  leasingReturnedDeposit: {
    required: true,
    minLength: 1,
    maxLength: 50
  },
  leasingReturnedDescription: {
    required: true,
    minLength: 1,
    maxLength: 50
  },
  leasingReturnedStatus: {
    required: true
  },
  leasingReturnedUnitType: {
    required: true
  },
};
