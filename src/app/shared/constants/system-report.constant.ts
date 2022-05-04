export const RECEIVED = 'RECEIVED';
export const CLOSED = 'CLOSED';
export const OPEN = 'OPEN';
export const IN_PROGRESS = 'IN_PROGRESS';
export const OVER_DUE = 'OVER_DUE';
export const TOTAL = '';

export const TICKET_TYPE = {
  CUSTOMER: {
    name: 'model.report.filter.customer',
    value: 'CUSTOMER',
  },
  INTERNAL: {
    name: 'model.report.filter.internal',
    value: 'INTERNAL',
  },
  COMPLAINT: {
    name: 'model.report.filter.complaint',
    value: 'COMPLAINT',
  }
};
export const TICKET_TYPE_LIST = [
  TICKET_TYPE.CUSTOMER,
  TICKET_TYPE.INTERNAL,
  TICKET_TYPE.COMPLAINT
];
