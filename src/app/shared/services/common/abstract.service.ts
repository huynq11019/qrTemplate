import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BOOLEAN_STRING } from '@shared/constants/common.constant';
import { HTTP_HEADERS } from '@shared/constants/http.constants';
import { IBaseResponse } from '@shared/models/base.model';
import CommonUtils from '@shared/utils/common-utils';
import { Observable } from 'rxjs/internal/Observable';

export type EntityResponseType<T> = HttpResponse<IBaseResponse<T>>;

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractService {
  private BASE_API_URL = environment.gateway;

  protected readonly httpOptions: {
    observe: string;
    headers?:
      | HttpHeaders
      | {
          [header: string]: string | string[];
        };
    params?:
      | HttpParams
      | {
          [param: string]: string | string[];
        };
  } = {
    observe: 'response',
    // tslint:disable-next-line:no-object-literal-type-assertion
    headers: {} as HttpHeaders,
    // tslint:disable-next-line:no-object-literal-type-assertion
    params: {} as HttpParams,
  };

  protected readonly httpOptionsFile: {
    responseType: string;
    headers?:
      | HttpHeaders
      | {
          [header: string]: string | string[];
        };
    params?:
      | HttpParams
      | {
          [param: string]: string | string[];
        };
    observe: string;
  } = {
    responseType: 'blob',
    observe: 'response',
    // tslint:disable-next-line:no-object-literal-type-assertion
    headers: {} as HttpHeaders,
    // tslint:disable-next-line:no-object-literal-type-assertion
    params: {} as HttpParams,
  };

  constructor(protected http: HttpClient) {}

  /**
   * GET request
   *
   * @author hieu.daominh
   * @date 2021-12-12
   * @template T template
   * @param url end point of the api
   * @param [options] options of the request like headers, body, etc.
   * @returns Observable<EntityResponseType<T> | any>
   */
  public get<T>(
    url: string,
    options?: any
  ): Observable<EntityResponseType<T> | any> {
    return this.http.get<IBaseResponse<T>>(
      `${this.BASE_API_URL}${url}`,
      this.httpOptionCustomize(options)
    );
  }

  /**
   * GET file request
   *
   * @author hieu.daominh
   * @date 2021-12-12
   * @template T template
   * @param url end point of the api
   * @param [options] options of the request like headers, body, etc.
   * @returns Observable<Blob | any>
   */
  public getFile(url: string, options?: any): Observable<Blob | any> {
    return this.http.get(
      `${this.BASE_API_URL}${url}`,
      this.httpOptionCustomize(options, true)
    );
  }

  /**
   * POST request
   *
   * @author hieu.daominh
   * @date 2021-12-12
   * @template T template
   * @param url end point of the api
   * @param body body of the request.
   * @param options options of the request like headers, body, etc.
   * @returns Observable<EntityResponseType<T> | any>
   */
  public post<T>(
    url: string,
    body?: any,
    options?: any
  ): Observable<EntityResponseType<T> | any> {
    return this.http.post<IBaseResponse<T>>(
      `${this.BASE_API_URL}${url}`,
      CommonUtils.optimalObjectParams(body),
      this.httpOptionCustomize(options)
    );
  }

  /**
   * POST file request
   *
   * @author hieu.daominh
   * @date 2021-12-12
   * @param url end point of the api
   * @param body body of the request.
   * @param options options of the request like headers, body, etc.
   * @returns Observable<Blob | any>
   */
  public postFile(
    url: string,
    body: any,
    options?: any
  ): Observable<Blob | any> {
    return this.http.post(
      `${this.BASE_API_URL}${url}`,
      CommonUtils.optimalObjectParams(body),
      this.httpOptionCustomize(options, true)
    );
  }

  /**
   * PUT request
   *
   * @author hieu.daominh
   * @date 2021-12-12
   * @template T template
   * @param url end point of the api
   * @param body body of the request.
   * @param options options of the request like headers, body, etc.
   * @returns Observable<EntityResponseType<T> | any>
   */
  public put<T>(
    url: string,
    body: any,
    options?: any
  ): Observable<EntityResponseType<T> | any> {
    return this.http.put<IBaseResponse<T>>(
      `${this.BASE_API_URL}${url}`,
      CommonUtils.optimalObjectParams(body),
      this.httpOptionCustomize(options)
    );
  }

  /**
   * DELETE request
   *
   * @author hieu.daominh
   * @date 2021-12-12
   * @template T template
   * @param url end point of the api
   * @param options options of the request like headers, body, etc.
   * @returns Observable<EntityResponseType<T> | any>
   */
  public delete<T>(
    url: string,
    options?: any
  ): Observable<EntityResponseType<T> | any> {
    return this.http.delete<IBaseResponse<T>>(
      `${this.BASE_API_URL}${url}`,
      this.httpOptionCustomize(options)
    );
  }

  /**
   * httpOptionCustomize
   *
   * @author hieu.daominh
   * @date 2021-12-12
   * @param options httpOptions
   * @note với các service cần set headers trong httpOptions thì tạo object json dạng {}, không dùng new HttpHeaders để tạo,
   * ví dụ tạo: headers: { xxx: xxx }
   * @returns any
   */
  private httpOptionCustomize(options?: any, httpFile = false): any {
    const httpOptions = httpFile
      ? { ...this.httpOptionsFile }
      : { ...this.httpOptions };
    if (options?.observe) {
      httpOptions.observe = options.observe;
    }
    if (options?.loading !== false) {
      httpOptions.headers = new HttpHeaders({
        ...options?.headers,
        [HTTP_HEADERS.X_LOADING]: BOOLEAN_STRING.TRUE,
      });
    }
    if (options?.params) {
      httpOptions.params = CommonUtils.optimalObjectParams(options?.params);
    }
    return httpOptions;
  }
}
