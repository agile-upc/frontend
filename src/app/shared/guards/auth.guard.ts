import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/authentication/login']);
    }

    const role = this.authService.user.role;
    if (state.url === '/' || state.url === '') {
      return this.redirectByRole(role);
    }

    if (state.url.startsWith('/apps/farmer') && role !== 'FARMER') {
      return this.redirectByRole(role);
    }

    if (state.url.startsWith('/apps/advisor') && role !== 'ADVISOR') {
      return this.redirectByRole(role);
    }

    return true;
  }

  private redirectByRole(role: string): UrlTree {
    if (role === 'FARMER') {
      return this.router.createUrlTree(['/apps/farmer/catalog']);
    }
    if (role === 'ADVISOR') {
      return this.router.createUrlTree(['/apps/advisor/appointments']);
    }
    if (role === 'ADMIN') {
      return this.router.createUrlTree(['/apps/profile']);
    }
    return this.router.createUrlTree(['/authentication/login']);
  }
}
