import { Injectable, isDevMode } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '@shared/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const authorities = route?.data.authorities || [];
    return this.checkRole(authorities);
  }

  checkRole(authorities: string[]): boolean {
    if (!authorities || authorities.length === 0) {
      return false;
    }

    if (this.authService.getCurrentUser()) {
      const hasAnyAuthority = this.authService.hasAnyAuthority(authorities);
      if (hasAnyAuthority) {
        return true;
      }

      if (isDevMode()) {
        console.error(
          'User has not any of required authorities: ',
          authorities
        );
      }
      this.handle403();
    }
    this.router.navigate(['/authentication/login']);
    return false;
  }

  private handle403(): boolean {
    this.router.navigate(['/403']);
    return false;
  }
}
