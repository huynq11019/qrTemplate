import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { LANGUAGES_CONST, PUBLIC_PATH } from '@shared/constants/base.constant';
import { HTTP_HEADERS } from '@shared/constants/http.constants';
import {
  LOCAL_STORAGE,
  SESSION_STORAGE
} from '@shared/constants/local-session-cookies.constants';
import { AuthService } from '@shared/services/auth/auth.service';
import CommonUtil from '@shared/utils/common-utils';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    private authService: AuthService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    if (
      !request ||
      !request.url ||
      request?.url.includes(PUBLIC_PATH) ||
      (/^http/.test(request.url) &&
        !(environment.gateway && request.url.startsWith(environment.gateway)))
    ) {
      return next.handle(request);
    }
    const token =
      this.localStorage.retrieve(LOCAL_STORAGE.JWT_TOKEN) ||
      this.sessionStorage.retrieve(SESSION_STORAGE.JWT_TOKEN);
    const lang =
      this.localStorage.retrieve(LOCAL_STORAGE.LANGUAGE) ||
      LANGUAGES_CONST.VI.code;
    if (!!token) {
      const decodeAccessToken = CommonUtil.decryptMessage(
        token,
        this.authService.getTokenPrivateKey()
      );

      // request = request.clone({
      //   setHeaders: {
      //     Authorization: `Bearer ${decodeAccessToken}`,
      //     language: lang,
      //     'Accept-Language': lang
      //   },
      // });

      request = request.clone({
        headers: request.headers
          .set(
            HTTP_HEADERS.AUTHORIZATION,
            `${HTTP_HEADERS.AUTHORIZATION_TYPE}${decodeAccessToken}`
          )
          .set(HTTP_HEADERS.LOCALE, lang),
        withCredentials: false,
      });
    }

    return next.handle(request);
  }
}
