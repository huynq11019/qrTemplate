export const WAITING = 'status.waiting';
export const WAITING_VALUE = 'PENDING';
export const DONE = 'status.done';
export const DONE_VALUE = 'DONE';
export const IN_PROGRESS = 'status.inProgress';
export const IN_PROGRESS_VALUE = 'IN_PROGRESS';
export const FAILED = 'status.failed';
export const FAILED_VALUE = 'FAILED';

export const NOTIFICATION_STATUS = [
  {
    label: DONE,
    value: DONE_VALUE
  },
  {
    label: WAITING,
    value: WAITING_VALUE
  },
  {
    label: FAILED,
    value: FAILED_VALUE
  },
  {
    label: IN_PROGRESS,
    value: IN_PROGRESS_VALUE
  }
];

export const NOTIFICATION_STATUS_ALL = {
  WAITING,
  WAITING_VALUE,
  DONE,
  DONE_VALUE,
  IN_PROGRESS,
  IN_PROGRESS_VALUE,
  FAILED,
  FAILED_VALUE,
};
