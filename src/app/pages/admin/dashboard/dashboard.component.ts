import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@shared/services/auth/auth.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  qrCode = 'https://play.google.com/store/apps/details?id=com.mbmobile';
  APP_STORE = 'apple-store';
  GOOGLE_PLAY = 'google-play';

  constructor(
    private authService: AuthService,
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.authService.clear();
      this.router.navigate([`authentication/login`]);
    }
  }

  download(value: string): void {
    if (value === this.APP_STORE) {
      window.open('https://www.apple.com/app-store/');
    } else if (value === this.GOOGLE_PLAY) {
      window.open('https://play.google.com/store/');
    }
  }
}
