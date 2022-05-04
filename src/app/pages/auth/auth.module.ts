import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthRoutingModule } from '@pages/auth/auth-routing.module';
import { LoginComponent } from '@pages/auth/login/login.component';
import { LogoutComponent } from '@pages/auth/logout/logout.component';
import { Page403Component } from '@pages/auth/page403/page403.component';
import { Page404Component } from '@pages/auth/page404/page404.component';
import { Page500Component } from '@pages/auth/page500/page500.component';
import { ResetPasswordComponent } from '@pages/auth/reset-password/reset-password.component';
import { SharedModule } from '@shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    ForgotPasswordComponent,
    ResetPasswordComponent,
    LoginComponent,
    LogoutComponent,
    Page403Component,
    Page404Component,
    Page500Component,
  ],
  imports: [CommonModule, SharedModule, AuthRoutingModule],
})
export class AuthModule {}
