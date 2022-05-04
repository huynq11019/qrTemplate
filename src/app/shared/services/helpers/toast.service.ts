import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  NzNotificationDataOptions,
  NzNotificationRef,
} from 'ng-zorro-antd/notification/typings';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(
    private notification: NzNotificationService,
    private translate: TranslateService
  ) {}

  success(
    content: string,
    interpolateParams?: object,
    options?: NzNotificationDataOptions
  ): void {
    const message = this.notification.success(
      this.title('success'),
      this.content(content, interpolateParams),
      options
    );
    this.observableOnClick(message);
  }

  error(
    content: string,
    interpolateParams?: object,
    options?: NzNotificationDataOptions
  ): void {
    const message = this.notification.error(
      this.title('error'),
      this.content(content, interpolateParams),
      options
    );
    this.observableOnClick(message);
  }

  info(
    content: string,
    interpolateParams?: object,
    options?: NzNotificationDataOptions
  ): void {
    const message = this.notification.info(
      this.title('info'),
      this.content(content, interpolateParams),
      options
    );
    this.observableOnClick(message);
  }

  warning(
    content: string,
    interpolateParams?: object,
    options?: NzNotificationDataOptions
  ): void {
    const message = this.notification.warning(
      this.title('warning'),
      this.content(content, interpolateParams),
      options
    );
    this.observableOnClick(message);
  }

  blank(
    content: string,
    interpolateParams?: object,
    options?: NzNotificationDataOptions
  ): void {
    const message = this.notification.blank(
      this.title('blank'),
      this.content(content, interpolateParams),
      options
    );
    this.observableOnClick(message);
  }

  title(type: string): string {
    return this.translate.instant(['common', type].join('.'));
  }

  content(key: string, interpolateParams?: object): string {
    return this.translate.instant(key, interpolateParams);
  }

  observableOnClick(message: NzNotificationRef): void {
    message.onClick.subscribe(() => {
      this.notification.remove(message.messageId);
    });
  }
}
