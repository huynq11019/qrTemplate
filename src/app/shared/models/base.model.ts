import { IPageable } from '../interface/pageable.interface';

export interface IBaseResponse<T> {
  success?: boolean;
  code?: number | string;
  data?: T;
  message?: string;
  page?: IPageable;
  timestamp?: string | number | any;
}

// export class BaseResponse implements IBaseResponse {
//   constructor(
//     public success?: boolean,
//     public code?: number | string,
//     public data?: [] | {},
//     public message?: string,
//     public page?: IPageable,
//     public timestamp?: string | number | any,
//   ) {
//     this.success = success;
//     this.code = code;
//     this.data = data;
//     this.message = message;
//     this.page = page;
//     this.timestamp = timestamp;
//   }
// }
