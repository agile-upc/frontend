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
    // Check if the user is authenticated
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/authentication/login']);
    }
    // Redirect based on roles
    const roles = this.authService.user?.roles || [];
    if (state.url === '/' || state.url === '') {
      return this.redirectByRole(roles);
    }
    // Specific role-based access control
    if (state.url.startsWith('/apps/farmer') && !roles.includes('ROLE_FARMER')) {
      return this.redirectByRole(roles);
    }

    if (state.url.startsWith('/apps/advisor') && !roles.includes('ROLE_ADVISOR')) {
      return this.redirectByRole(roles);
    }

    return true;
  }

  private redirectByRole(roles: string[]): UrlTree {
    if (roles.includes('ROLE_FARMER')) {
      return this.router.createUrlTree(['/apps/farmer/catalog']);
    }
    if (roles.includes('ROLE_ADVISOR')) {
      return this.router.createUrlTree(['/apps/advisor/appointments']);
    }
    return this.router.createUrlTree(['/authentication/login']);
  }
}
