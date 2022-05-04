import { HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as CryptoJS from 'crypto-js';
import * as fileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { PAGINATION } from '../constants/pagination.constants';

export default class CommonUtil {
  /**
   * Optimal object
   *
   * @param object any | any[]
   * @returns any | any[]
   */
  static optimalObjectParams = (object?: any | any[]): any | any[] => {
    if (object) {
      if (object instanceof FormData) {
        const formData = new FormData();
        for (const [key, value] of object) {
          if (value !== undefined && value !== null && value !== '') {
            if (typeof value === 'string') {
              value.trim();
            }
            formData.append(key, value);
          }
        }
        return formData;
      } else if (Array.isArray(object)) {
        object.map((item) => CommonUtil.optimalObjectParams(item));
      } else {
        Object.keys(object).forEach((k) => {
          if (
            object[k] === null ||
            object[k] === undefined ||
            object[k] === ''
          ) {
            delete object[k];
          } else if (typeof object[k] === 'object') {
            CommonUtil.optimalObjectParams(object[k]);
          } else if (typeof object[k] === 'string') {
            object[k].trim();
          }
        });
      }
    }
    return object;
  };

  /**
   * Delete params is [null, undefined, ''] in Object
   *
   * @param object object
   */
  static formatParams = (object: any): any => {
    if (object) {
      Object.keys(object).forEach(
        (k) =>
          (object[k] === null || object[k] === undefined || object[k] === '') &&
          delete object[k]
      );
    }
    return object;
  };

  /**
   * Convert object to form data
   *
   * @param object
   * @returns
   */
  static toFormData = (object: any) => {
    const formData = new FormData();
    const data = CommonUtil.formatParams(object);
    if (data) {
      Object.keys(data).forEach((key) => formData.append(key, data[key]));
    }
    return formData;
  };

  /**
   * Set touched event for control in formGroup, use when validate form show message error
   *
   * @param form
   */
  static markFormGroupTouched(form: FormGroup): void {
    Object.values(form.controls).forEach((control) => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  static getIndex(
    index: number,
    page: number = PAGINATION.PAGE_DEFAULT,
    size: number = PAGINATION.SIZE_DEFAULT
  ): number {
    return (page - 1) * size + index + 1;
  }

  static trim(obj: any): object {
    return Object.keys(obj).reduce((acc: any, curr: string) => {
      if (typeof obj[curr] === 'string') {
        acc[curr] = obj[curr].trim();
      } else {
        acc[curr] = obj[curr];
      }
      return acc;
    }, {});
  }

  static modalBase(
    component: any,
    params: {},
    width: string = '50%',
    center: boolean = true,
    clickOutSide: boolean = false,
    showBtnClose: boolean = true
  ): object {
    return {
      nzWidth: width,
      nzCentered: center,
      nzMaskClosable: clickOutSide,
      nzClosable: showBtnClose,
      nzContent: component,
      nzComponentParams: {
        ...params,
      },
    };
  }

  static modalConfirm(
    translateService: TranslateService,
    title: string,
    content: string,
    interpolateParams: object = {},
    // tslint:disable-next-line:ban-types
    callbackConfirm: Function = () => {
      return {
        success: true,
      };
    },
    // tslint:disable-next-line:ban-types
    callbackCancel: Function = () => {
      return {
        success: false,
      };
    },
    okText: string = 'action.confirm',
    cancelText: string = 'action.cancel'
  ): object {
    return {
      nzTitle: translateService.instant(title),
      nzContent: translateService.instant(content, interpolateParams),
      nzOkText: translateService.instant(okText),
      nzCancelText: translateService.instant(cancelText),
      nzOnCancel: () => callbackCancel(),
      nzOnOk: () => callbackConfirm(),
    };
  }

  static compareArrayIsEqual(array1: string[], array2: string[]): boolean {
    return (
      array1.length === array2.length &&
      array1.sort().every((value, index) => {
        return value === array2.sort()[index];
      })
    );
  }

  static headers(isLoading: boolean): HttpHeaders {
    return new HttpHeaders({
      isLoading: isLoading ? 'true' : 'false',
    });
  }

  static formatArrayToDate(date: any): Date {
    return new Date(date[0], date[1], date[2]);
  }

  /* Query param table */
  static onQueryParam(params: NzTableQueryParams): {
    pageIndex: number;
    pageSize: number;
    sortBy: string;
  } {
    const { pageIndex, pageSize, sort, filter } = params;

    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    let sortBy = '';
    if (sortField && sortOrder) {
      sortBy = `${sortField}.${sortOrder === 'ascend' ? 'asc' : 'desc'}`;
    }
    return { pageIndex, pageSize, sortBy };
  }

  //  Slide string if too length
  static getLimitLength(str?: string, length = 20, noWhiteSpace = 10): string {
    // nếu string không có khoảng trắng thì sẽ lấy length
    if (!!str && str.indexOf(' ') === -1) {
      return str.length <= length ? str : str.slice(0, noWhiteSpace) + '...';
    }
    return !!str
      ? str.length <= length
        ? str
        : str.slice(0, length) + '...'
      : '';
  }

  static download(lob: Blob, fileName?: string): void {
    const blob = new Blob([lob]);
    saveAs(blob, fileName);
  }

  static downloadFileType(lob: Blob, type: string, fileName?: string): void {
    if (type === 'excel') {
      type =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    const file = new Blob([lob], { type });
    fileSaver.saveAs(file, fileName);
  }

  static splitDate(str: string): string {
    const date = str.split('/');
    return date[1] + '/' + date[0] + '/' + date[2];
  }

  static newDate(dateValue: string): Date {
    const date = dateValue.trim();
    if (date.includes('/')) {
      return new Date(this.splitDate(date));
    } else if (date.length === 8 || date.length === 7) {
      if (date.length === 8) {
        const day = date.slice(0, 2);
        const month = date.slice(2, 4);
        const year = date.slice(4, 8);
        return new Date(month + '/' + day + '/' + year);
      } else if (date.length === 7) {
        const dayFirst = date.slice(0, 2);
        const daySecond = date.slice(0, 1);
        const monthFirst = date.slice(2, 3);
        const monthSecond = date.slice(1, 3);
        const year = date.slice(3, 7);

        const dateFirst = new Date(monthFirst + '/' + dayFirst + '/' + year);
        const dateSecond = new Date(monthSecond + '/' + daySecond + '/' + year);

        if (dateFirst.toString() !== 'Invalid Date') {
          return dateFirst;
        } else if (dateSecond.toString() !== 'Invalid Date') {
          return dateSecond;
        } else {
          return new Date(date);
        }
      } else {
        return new Date(date);
      }
    } else {
      return new Date(date);
    }
  }

  static numberFormatter(value: string): string {
    return value.toString().replace(/\D/g, '');
  }

  static formatToNumber(value: string): number {
    return Number(CommonUtil.numberFormatter(value));
  }

  static moneyFormat(value: string): string {
    return value
      .toString()
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  static getStartOfDay(milliseconds: number): number {
    const start = new Date(milliseconds);
    return this.setStartTime(start.getTime());
  }

  static getEndOfDay(milliseconds: number): number {
    const end = new Date(milliseconds);
    return this.setEndTime(end.getTime());
  }

  static setStartTime(milliseconds: number): number {
    return moment(milliseconds).startOf('day').valueOf();
  }

  static setEndTime(milliseconds: number): number {
    return moment(milliseconds).endOf('day').valueOf();
  }

  static setCurrentTime(milliseconds: number): number {
    return moment(milliseconds).valueOf();
  }

  static stripHTML(htmlText: string): string {
    return htmlText.replace(/<\/?[^>]+(>|$)/g, '');
  }

  static randomString(length: number): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  static sleepDebounce(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // code demo sleepDebounce
  // console.log('start');
  // await delay(3000);
  // console.log('continues after 3 seconds');

  static debounce(
    // tslint:disable-next-line:ban-types
    func: Function,
    wait: number,
    immediate: boolean = false
    // tslint:disable-next-line:ban-types
  ): Function {
    let timeout: any;
    // tslint:disable-next-line:space-before-function-paren
    return function (this: any) {
      const context = this;
      const args = arguments;
      const later = () => {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }

  // code demo function debounce
  // const find = debounce(text => fetchData(text), 2000);
  // inputSearch.addEventListener("keyup", event => {
  //   find(event.target.value);
  // });

  static convertObjectToFormDataWithFile(object: any): FormData {
    const formData = new FormData();
    Object.keys(object).forEach((key) => {
      if (Array.isArray(object[key])) {
        object[key].forEach((item: string | Blob | File) => {
          formData.append(key, item);
        });
      } else if (object[key] instanceof File) {
        formData.append(key, object[key]);
      } else if (object[key] instanceof Blob) {
        formData.append(key, object[key]);
      }
    });
    return formData;
  }

  static getDevice(): string {
    const device = window.navigator.userAgent;
    if (
      device.includes('iPhone') ||
      device.includes('iPad') ||
      device.includes('iPod')
    ) {
      return 'Ios';
    } else if (device.includes('Android')) {
      return 'Android';
    } else {
      return 'PC';
    }
  }

  static decryptMessage(value: string, key: string): string {
    let result = '';
    try {
      result = CryptoJS.AES.decrypt(value, key).toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  // endCode message with secrect key
  static encryptMessage(value: string, keys: string): string {
    const encrypted = CryptoJS.AES.encrypt(value, keys);
    return encrypted.toString();
  }
}
