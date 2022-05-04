import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import {
  Event,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGES_CONST } from '@shared/constants/base.constant';
import { LOCAL_STORAGE } from '@shared/constants/local-session-cookies.constants';
import { LoadingService } from '@shared/services/helpers/loading.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewChecked {
  currentUrl = '';
  defaultLanguage: string = LANGUAGES_CONST.VI.code;

  constructor(
    public router: Router,
    public loadingService: LoadingService,
    protected localStorage: LocalStorageService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    const self = this;
    this.router.events.subscribe((routerEvent: Event) => {
      let language = self.localStorage.retrieve(LOCAL_STORAGE.LANGUAGE);
      if (!language) {
        language = self.defaultLanguage;
        self.localStorage.store(LOCAL_STORAGE.LANGUAGE, self.defaultLanguage);
      }
      self.setLanguage(language);

      if (routerEvent instanceof NavigationStart) {
        self.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1
        );
      }

      if (
        routerEvent instanceof NavigationError &&
        routerEvent.error.status === 404
      ) {
        this.router.navigate(['/404']);
      }

      window.scrollTo(0, 0);
    });
  }

  setLanguage(language: string): void {
    this.translate.setDefaultLang(language);
    this.translate.use(language);
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }
}
