import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import {Router, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppSettings } from 'src/app/config';
import { AuthService } from "src/app/shared/services/auth.service";
import { UserNotification } from "src/app/shared/model/userNotification";
import {NotificationService} from "../../../../shared/services/notification.service";
import { navItemsAdvisor } from '../sidebar/sidebar-data-advisor';
import { navItemsFarmer } from '../sidebar/sidebar-data-farmer';
import { NavItem } from '../sidebar/nav-item/nav-item';

interface profiledd {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface apps {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface quicklinks {
  id: number;
  title: string;
  link: string;
}

@Component({
    selector: 'app-header',
    imports: [
        RouterModule,
        CommonModule,
        NgScrollbarModule,
        TablerIconsModule,
        MaterialModule,
    ],
    templateUrl: './header.component.html',
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  @Input() username = "Usuario";
  @Input() role = "Rol";
  @Input() photo = "/assets/images/profile/user-1.jpg";
  readonly fallbackPhoto = "/assets/images/profile/user-1.jpg";
  showFiller = false;
  @Input() notifications: UserNotification[] = [];

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: '/assets/images/flag/icon-flag-en.svg',
  };


  /*
  public languages: any[] = [
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: '/assets/images/flag/icon-flag-en.svg',
    },
    {
      language: 'Español',
      code: 'es',
      icon: '/assets/images/flag/icon-flag-es.svg',
    },
    {
      language: 'Français',
      code: 'fr',
      icon: '/assets/images/flag/icon-flag-fr.svg',
    },
    {
      language: 'German',
      code: 'de',
      icon: '/assets/images/flag/icon-flag-de.svg',
    },
  ];
  */

  @Output() optionsChange = new EventEmitter<AppSettings>();

  constructor(
    private settings: CoreService,
    private authService: AuthService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private router: Router
  ) {
    translate.setDefaultLang('en');
  }

  options = this.settings.getOptions();

  openDialog() {
    const dialogRef = this.dialog.open(AppSearchDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  private emitOptions() {
    this.optionsChange.emit(this.options);
  }

  setlightDark(theme: string) {
    this.settings.setOptions({ theme: theme as 'light' | 'dark' });
    this.options = this.settings.getOptions();
    this.emitOptions();
  }

  changeLanguage(lang: any): void {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/authentication/login']);
  }

  useFallbackPhoto(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (image.src.includes(this.fallbackPhoto)) {
      return;
    }

    image.src = this.fallbackPhoto;
  }

  profiledd: profiledd[] = [
    {
      id: 1,
      img: '/assets/images/svgs/icon-account.svg',
      title: 'Mi perfil',
      subtitle: 'Configuración de la cuenta',
      link: '/apps/profile',
    },
    {
      id: 2,
      img: '/assets/images/svgs/icon-inbox.svg',
      title: 'Mis notificaciones',
      subtitle: 'Notificaciones',
      link: '/apps/notifications',
    },
  ];

  apps: apps[] = [
    {
      id: 1,
      img: '/assets/images/svgs/icon-dd-chat.svg',
      title: 'Catálogo de asesores',
      subtitle: 'Buscar especialistas',
      link: '/apps/farmer/catalog',
    },
    {
      id: 2,
      img: '/assets/images/svgs/icon-dd-date.svg',
      title: 'Mis citas',
      subtitle: 'Asesorías programadas',
      link: '/apps/farmer/appointments',
    },
    {
      id: 3,
      img: '/assets/images/svgs/icon-dd-invoice.svg',
      title: 'Mis horarios',
      subtitle: 'Disponibilidad del asesor',
      link: '/apps/advisor/available-dates',
    },
    {
      id: 4,
      img: '/assets/images/svgs/icon-dd-date.svg',
      title: 'Notificaciones',
      subtitle: 'Avisos importantes',
      link: '/apps/notifications',
    },
    {
      id: 5,
      img: '/assets/images/svgs/icon-account.svg',
      title: 'Mi perfil',
      subtitle: 'Datos de usuario',
      link: '/apps/profile',
    },
  ];

  quicklinks: quicklinks[] = [
    {
      id: 1,
      title: 'Catálogo de asesores',
      link: '/apps/farmer/catalog',
    },
    {
      id: 2,
      title: 'Mis citas',
      link: '/apps/farmer/appointments',
    },
    {
      id: 3,
      title: 'Mis horarios',
      link: '/apps/advisor/available-dates',
    },
    {
      id: 4,
      title: 'Mi perfil',
      link: '/apps/profile',
    },
  ];
}

@Component({
    selector: 'search-dialog',
    imports: [RouterModule, MaterialModule, TablerIconsModule, FormsModule],
    templateUrl: 'search-dialog.component.html'
})
export class AppSearchDialogComponent {
  searchText: string = '';
  navItems: NavItem[] = [];

  navItemsData: NavItem[] = [];

  constructor(private authService: AuthService) {
    const role = this.authService.user.role;
    this.navItems = role === 'ADVISOR' ? navItemsAdvisor : role === 'FARMER' ? navItemsFarmer : [];
    this.navItemsData = this.navItems.filter((navitem) => navitem.displayName);
  }

  // filtered = this.navItemsData.find((obj) => {
  //   return obj.displayName == this.searchinput;
  // });
}
