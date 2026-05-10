import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-branding',
  imports: [RouterLink],
  template: `
    <a [routerLink]="['/']" class="logodark">
      <img
        src="./assets/images/logos/dark-logo.svg"
        class="align-middle m-2"
        alt="logo"
      />
    </a>

    <a [routerLink]="['/']" class="logolight">
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

  constructor(private settings: CoreService) {}
}
