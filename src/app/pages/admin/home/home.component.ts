import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { LANGUAGES_CONST } from '@shared/constants/base.constant';
import CommonUtil from '@shared/utils/common-utils';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel/carousel.component';
import { LocalStorageService } from 'ngx-webstorage';
import { LOCAL_STORAGE } from 'src/app/shared/constants/local-session-cookies.constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('mobileSlider') mobileSlider!: NzCarouselComponent;
  tabIndex = {
    introduce: 1,
    download: 2,
  };
  currentYear = new Date().getFullYear();
  index = 1;
  qrCode = 'http://qltn.mbamc.com.vn';
  sliders: any[] = [];
  public array = [1, 2, 3, 4];
  currentLanguage = '';
  visible = false;
  width = 168;

  LANGUAGES_CONST = LANGUAGES_CONST;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private activatedRoute: ActivatedRoute
  ) {
    this.currentLanguage =
      this.localStorage.retrieve(LOCAL_STORAGE.LANGUAGE) ||
      LANGUAGES_CONST.VI.code;
  }

  ngOnInit(): void {
    this.qrCode =
      environment.qrCode +
      '?tab=' +
      this.tabIndex.download +
      '&isDownload=true';
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params?.tab) {
        this.changeTab(Number(params.tab));
      }
      if (
        Number(params?.tab) === this.tabIndex.download &&
        Boolean(params?.isDownload)
      ) {
        this.getDevice();
      }
    });
  }

  navigate(url: string): void {
    this.router.navigate([url]);
  }

  changeTab(index: number): void {
    this.index = index;
  }

  getClassIndex(index: number): string {
    if (this.index === index) {
      return 'tab-selected';
    }
    return '';
  }

  onChangeLanguage(language: string): void {
    if (this.currentLanguage !== language) {
      this.localStorage.store(LOCAL_STORAGE.LANGUAGE, language);
      location.reload();
    } else {
      this.visible = false;
    }
  }

  ngAfterViewInit(): void {
    this.sliders = [
      {
        name: 'slider1',
        src: 'assets/images/slider1x1920.svg',
      },
      {
        name: 'slider2',
        src: 'assets/images/slider2x1920.svg',
      },
      {
        name: 'slider3',
        src: 'assets/images/slider3x1920.svg',
      },
    ];
  }

  nextImage(): void {
    this.mobileSlider.next();
  }

  public getDevice(): void {
    const device = CommonUtil.getDevice();
    if (device === 'Android') {
      this.toDownloadAndroid();
    } else if (device === 'Ios') {
      this.toDownloadIos();
    } else {
      console.log('PC');
    }
  }

  toDownloadIos(): void {
    window.location.href = environment.iosDownloadUrl;
  }

  toDownloadAndroid(): void {
    window.location.href = environment.androidDownloadUrl;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth <= 1024) {
      this.width = 150;
    } else {
      {
        this.width = 168;
      }
    }
  }

  toHome(): void {
    this.router.navigate(['/home']).then();
    this.index = this.tabIndex.introduce;
  }

  goPrivacy(): void {
    this.router.navigate(['/privacy-policy']).then();
  }
}
