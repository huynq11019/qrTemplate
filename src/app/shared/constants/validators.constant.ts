export const VALIDATORS = {
  USERNAME : '^[A-Za-z][A-Za-z0-9_@.]{1,50}$',
  PASSWORD : '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\\^$*.\\[\\]{}\\(\\)?\\-“!@#%&/,><\\’:;|_~`])\\S{8,16}$',
  BLANK: '(\\s){0,}\\S+.*(\\s){0,}',
  EMAIL: '^(\\s){0,}[a-zA-Z][a-zA-Z0-9_\\.\-]{1,50}@[a-zA-Z0-9\-_]{2,}(\\.[a-zA-Z0-9\]{2,4}){1,2}(\\s){0,}$',
  PHONE: '^(\\+[0-9]+[\\- \\.]*)?(\\([0-9]+\\)[\\- \\.]*)?([0-9][0-9\\- \\.]+[0-9])$',
  CODE: '^[A-Za-z0-9_.]{4,50}$',
  NUMBER: '^[0-9]*$',
  SPACE: '^(?![\\s-])[\\S\\s-]+$',
};

export const LENGTH_VALIDATOR = {
  USERNAME_MAX_LENGTH: {
    MAX: 50,
  },
  USERNAME_MIN_LENGTH: {
    MIN: 4,
  },
  NAME_MAX_LENGTH: {
    MAX: 100,
  },
  PASSWORD_MIN_LENGTH: {
    MIN: 3
  },
  PASSWORD_MAX_LENGTH: {
    MAX: 20
  },
  CODE_MAX_LENGTH: {
    MAX: 50,
  },
  PHONE_MAX_LENGTH: {
    MAX: 20,
  },
  EMAIL_MAX_LENGTH: {
    MAX: 50,
  },
  ENUM_MAX_LENGTH: {
    MAX: 20,
  },
  DESC_MAX_LENGTH: {
    MAX: 1000,
  },
  CONTENT_MAX_LENGTH: {
    MAX: 2000,
  },
  NOTE_MAX_LENGTH: {
    MAX: 1000,
  },
  TITLE_MAX_LENGTH: {
    MAX: 200,
  },
  ADDRESS_MAX_LENGTH: {
    MAX: 200,
  },
  ID_MIN_LENGTH: {
    MIN: 1
  },
  ID_MAX_LENGTH: {
    MAX: 36
  },
  VALUE_MAX_LENGTH: {
    MAX: 200
  },
  IDS_MAX_LENGTH: {
    MAX: 500
  },
  BIRTH_MAX_LENGTH: {
    MAX: 100
  },
  GENDER_MAX_LENGTH: {
    MAX: 20
  },
  STATUS_MAX_LENGTH: {
    MAX: 20
  },
  OPINION_MAX_LENGTH: {
    MAX: 300
  },
  LABEL_MAX_LENGTH: {
    MAX: 200
  }
};
export const VALIDATOR_MESSAGE = [
  {
    key: 'required',
    label: 'error.required',
  },
  {
    key: 'minlength',
    label: 'error.minlength',
  },
  {
    key: 'maxlength',
    label: 'error.maxlength',
  },
  {
    key: 'pattern',
    label: 'error.pattern',
  },
  {
    key: 'email',
    label: 'error.email',
  },
  {
    key: 'min',
    label: 'error.min',
  },
  {
    key: 'max',
    label: 'error.max',
  }
];
