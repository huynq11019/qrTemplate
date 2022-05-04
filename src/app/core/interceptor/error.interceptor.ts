import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HTTP_HEADERS } from '@shared/constants/http.constants';
import { LOCAL_STORAGE } from '@shared/constants/local-session-cookies.constants';
import { AuthService } from '@shared/services/auth/auth.service';
import { EventManagerService } from '@shared/services/helpers/event-manager.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { LocalStorageService } from 'ngx-webstorage';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService,
    private eventManagerService: EventManagerService,
    private translateService: TranslateService,
    private toastService: ToastService,
    private localStorage: LocalStorageService
  ) {}
  private isTokenRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    ''
  );

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: { status: number; error: { error: string } }) => {
        if (err.status === HttpStatusCode.Unauthorized) {
          // 401 do đăng nhập fail
          if (window.location.href.includes('authentication/login')) {
            this.authService.clear();
            this.toastService.error(
              this.translateService.instant('error.login')
            );
          } else {
            // 401 do token hết hạn
            const refreshToken = this.localStorage.retrieve(
              LOCAL_STORAGE.REFRESH_TOKEN
            );
            // kiểm tra có refresh token hay không
            if (
              !!refreshToken &&
              !!CommonUtil.decryptMessage(
                refreshToken,
                this.authService.getTokenPrivateKey()
              )
            ) {
              const decodeRefreshToken = CommonUtil.decryptMessage(
                refreshToken,
                this.authService.getTokenPrivateKey()
              );
              return this.handle401Error(request, next, decodeRefreshToken);
            } else {
              // clear token back về trang đăng nhập
              this.clearTokenRefLogout();
            }
          }
        } else if (err.status === HttpStatusCode.Forbidden) {
          this.toastService.error(this.getError(err));
        } else if (err.status === HttpStatusCode.NotFound) {
          if (err?.error?.error === 'USER_NOT_FOUND') {
            this.toastService.error('error.login');
          } else {
            this.toastService.error(this.getError(err));
          }
        } else if (this.getError(err)) {
          this.toastService.error(this.getError(err));
        }
        return throwError(this.getError(err));
      })
    );
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler,
    refreshToken: string
  ): Observable<any> {
    if (!this.isTokenRefreshing) {
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next('');
      this.localStorage.clear(LOCAL_STORAGE.JWT_TOKEN);
      return this.authService.refreshToken(refreshToken).pipe(
        switchMap((res: any) => {
          const accessToken = res?.data?.accessToken;
          this.isTokenRefreshing = false;
          this.refreshTokenSubject.next(accessToken);
          // this.reloadCurrentUrl(accessToken);
          return next.handle(this.addTokenToHeader(request, accessToken));
        }),
        catchError((err: { error: { message: any } }, osb: any) => {
          this.clearTokenRefLogout();
          return throwError(err?.error?.message);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token: string) => token !== ''),
        take(1),
        switchMap((jwt: string) => {
          return next.handle(this.addTokenToHeader(request, jwt));
        })
      );
    }
  }

  // @TODO: implement case export file
  // private getErrorFile(err: any): any {
  //   const blob = new Blob([err.error]);
  //   return blob.text().then(data => {
  //     console.log(JSON.parse(data));
  //   });
  // }

  // private static addTokenToHeader(
  //   request: HttpRequest<any>,
  //   token: string
  // ): HttpRequest<any> {
  //   return request.clone({
  //     setHeaders: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  // }

  private addTokenToHeader(request: HttpRequest<any>, token: string) {
    return (request = request.clone({
      headers: request.headers.set(
        HTTP_HEADERS.AUTHORIZATION,
        `${HTTP_HEADERS.AUTHORIZATION_TYPE}${token}`
      ),
      withCredentials: true,
    }));
  }

  private getError(err: any): any {
    if (err?.error?.errors?.length > 0) {
      return err?.error?.errors[0]?.message || err?.message;
    }
    return (
      err?.error?.message ||
      err?.message ||
      this.translateService.instant('error.msg')
    );
  }

  private clearTokenRefLogout(): void {
    this.authService.clear();
    this.toastService.info('model.logout.success.session');
    this.router.navigate(['authentication/login']);
  }

  private reloadCurrentUrl(token: string): void {
    const url = this.router.routerState.snapshot.url;
    this.eventManagerService.broadcast({
      name: 'reload',
      content: {
        url,
        token,
      },
    });
  }
}
