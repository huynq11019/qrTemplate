import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  LOCAL_STORAGE,
  SESSION_STORAGE,
} from '@shared/constants/local-session-cookies.constants';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { AuthService } from '@shared/services/auth/auth.service';
import { EventManagerService } from '@shared/services/helpers/event-manager.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  passwordVisible = false;
  password?: string;
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    private translateService: TranslateService,
    private toast: ToastService,
    private router: Router,
    private eventManagerService: EventManagerService
  ) {
    this.isTokenUnexpired();
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: [
        '',
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.USERNAME_MAX_LENGTH.MAX),
          Validators.minLength(1),
        ],
      ],
      password: ['', [Validators.required]],
      rememberMe: [true],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  submitForm(): void {
    if (this.loginForm.valid) {
      this.authService
        .login(
          this.f.userName.value,
          this.f.password.value,
          this.f.rememberMe.value
        )
        .subscribe((token) => {
          if (token) {
            this.authService.storeProfile('/dashboard');
          }
        });
    } else {
      Object.values(this.loginForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  isTokenUnexpired(): void {
    this.eventManagerService.subscribe('reload', (res: any) => {
      this.router.navigate(['/']);
    });
    const jwt =
      this.localStorage.retrieve(LOCAL_STORAGE.JWT_TOKEN) ||
      this.sessionStorage.retrieve(SESSION_STORAGE.JWT_TOKEN);
    if (jwt) {
      if (this.authService.getCurrentUser() === null) {
        this.authService.storeProfile('/', false);
      } else {
        this.router.navigate(['/']);
      }
    }
  }
}
