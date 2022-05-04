export interface IErrorMessageType {
  param?: number | string; // tham số hiện thị của validate: vd: 'name tối đa 40 ký tự'
  type: string; // required | min | max | minlength | maxlength | pattern
  message?: string; // nếu muốn tự dùng custom error message thì dùng message này
}

export interface IValidateMessage {
  field: string;
  fieldName: string;
  valid: Array<IErrorMessageType>;
}
