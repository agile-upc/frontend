import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-branding',
  imports: [RouterLink],
  template: `
    <a [routerLink]="[homeRoute]" class="logodark">
      <img
        src="./assets/images/logos/dark-logo.svg"
        class="align-middle m-2"
        alt="logo"
      />
    </a>

    <a [routerLink]="[homeRoute]" class="logolight">
      <img
        src="./assets/images/logos/light-logo.svg"
        class="align-middle m-2"
        alt="logo"
      />
    </a>
  `,
})
export class BrandingComponent {
  options = this.settings.getOptions();
  homeRoute = this.resolveHomeRoute();

  constructor(
    private settings: CoreService,
    private authService: AuthService
  ) {}

  private resolveHomeRoute(): string {
    const role = this.authService.user.role;

    if (role === 'FARMER') {
      return '/apps/farmer/catalog';
    }

    if (role === 'ADVISOR') {
      return '/apps/advisor/appointments';
    }

    if (role === 'ADMIN') {
      return '/apps/profile';
    }

    return '/authentication/login';
  }
}
