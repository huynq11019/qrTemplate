import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP_HEADERS } from '@shared/constants/http.constants';
import { LoadingService } from '@shared/services/helpers/loading.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(private loadingService: LoadingService) {}

  /**
   * Handle loading - spinner
   *
   * @author hieu.daominh
   * @date 2021-07-27
   * @param request request
   * @param next next request
   * @returns Observable<HttpEvent<any>>
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!!request.headers.get(HTTP_HEADERS.X_LOADING)) {
      this.totalRequests++;
      this.loadingService.show();

      // chỉ ẩn spinner khi số request = 0
      return next.handle(request).pipe(
        finalize(() => {
          this.totalRequests--;
          if (this.totalRequests === 0) {
            this.loadingService.hide();
          }
        })
      );
    }

    return next.handle(request);
  }
}
