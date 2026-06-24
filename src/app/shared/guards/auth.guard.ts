import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    return this.validateAccess(state.url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    return this.validateAccess(state.url);
  }

  private validateAccess(url: string): boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/authentication/login']);
    }

    const role = this.authService.user.role;
    if (url === '/' || url === '' || url === '/apps') {
      return this.redirectByRole(role);
    }

    if (url.startsWith('/apps/farmer') && role !== 'FARMER') {
      return this.redirectByRole(role);
    }

    if (url.startsWith('/apps/advisor') && role !== 'ADVISOR') {
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
