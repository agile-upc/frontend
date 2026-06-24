import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { CoreService } from 'src/app/services/core.service';
import { AppSettings } from 'src/app/config';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { NavService } from '../../services/nav.service';
import { NavItem } from './vertical/sidebar/nav-item/nav-item';
import { AppNavItemComponent } from './vertical/sidebar/nav-item/nav-item.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './vertical/sidebar/sidebar.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { HeaderComponent } from './vertical/header/header.component';
import { AppBreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { CustomizerComponent } from './shared/customizer/customizer.component';
import {AuthService} from "../../shared/services/auth.service";
import {navItemsFarmer} from "./vertical/sidebar/sidebar-data-farmer";
import {navItemsAdvisor} from "./vertical/sidebar/sidebar-data-advisor";
import {ProfileService} from "../../shared/services/profile.service";
import {UserNotification} from "../../shared/model/userNotification";
import {NotificationService} from "../../shared/services/notification.service";

const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';
const MONITOR_VIEW = 'screen and (min-width: 1024px)';
const BELOWMONITOR = 'screen and (max-width: 1023px)';

// for mobile app sidebar
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
    selector: 'app-full',
    imports: [
        RouterModule,
        AppNavItemComponent,
        MaterialModule,
        CommonModule,
        SidebarComponent,
        NgScrollbarModule,
        TablerIconsModule,
        HeaderComponent,
        AppBreadcrumbComponent,
        CustomizerComponent,
    ],
    templateUrl: './full.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class FullComponent implements OnInit {
  navItems: NavItem[] = [];
  homeRoute = '/authentication/login';

  @ViewChild('leftsidenav')
  public sidenav: MatSidenav;
  resView = false;
  @ViewChild('content', { static: true }) content!: MatSidenavContent;
  //get options from service
  options = this.settings.getOptions();
  private layoutChangesSubscription = Subscription.EMPTY;
  private isMobileScreen = false;
  private isContentWidthFixed = true;
  private isCollapsedWidthFixed = false;
  private htmlElement!: HTMLHtmlElement;

  get isOver(): boolean {
    return this.isMobileScreen;
  }

  get isTablet(): boolean {
    return this.resView;
  }

  // for mobile app sidebar
  apps: apps[] = [
    {
      id: 1,
      img: '/assets/images/svgs/icon-dd-date.svg',
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
      img: '/assets/images/svgs/icon-dd-date.svg',
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

  constructor(
    private settings: CoreService,
    private mediaMatcher: MediaMatcher,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private navService: NavService,
    private authService: AuthService,
    private profileService: ProfileService,
    private notificationService: NotificationService,
  ) {
    this.htmlElement = document.querySelector('html')!;
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_VIEW, TABLET_VIEW, MONITOR_VIEW, BELOWMONITOR])
      .subscribe((state) => {
        // SidenavOpened must be reset true when layout changes
        this.options.sidenavOpened = true;
        this.isMobileScreen = state.breakpoints[BELOWMONITOR];
        if (this.options.sidenavCollapsed == false) {
          this.options.sidenavCollapsed = state.breakpoints[TABLET_VIEW];
        }
        this.isContentWidthFixed = state.breakpoints[MONITOR_VIEW];
        this.resView = state.breakpoints[BELOWMONITOR];
      });

    // Initialize project theme with options
    this.receiveOptions(this.options);

    // This is for scroll to top
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((e) => {
        this.content.scrollTo({ top: 0 });
      });
  }

  username = "Usuario";
  role = "Rol";
  photo = "/assets/images/profile/user-1.jpg";
  notifications: UserNotification[] = [];

  ngOnInit(): void {
    const user = this.authService.user;
    const role = user.role;
    this.homeRoute = this.resolveHomeRoute(role);

    if (role === 'FARMER') {
      this.navItems = navItemsFarmer;
      this.role = "Productor agrícola";
    }

    if (role === 'ADVISOR') {
      this.navItems = navItemsAdvisor;
      this.role = "Asesor especializado"
    }

    if (role === 'ADMIN') {
      this.navItems = [];
      this.role = 'Administrador';
    }

    this.profileService.fetchMyProfile().subscribe({
      next: (profile) => {
        this.username = `${profile.firstName} ${profile.lastName}`;
        this.photo = profile.photo || '/assets/images/profile/user-1.jpg';
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
      }
    })

    this.notificationService.fetchNotifications().subscribe({
      next: (notifications: UserNotification[]) => {
        this.notifications = notifications;
      },
      error: (error: any) => {
        console.error('Error fetching notifications:', error);
      }
    })
  }

  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }

  toggleCollapsed() {
    this.isContentWidthFixed = false;
    this.options.sidenavCollapsed = !this.options.sidenavCollapsed;
    this.resetCollapsedState();
  }

  resetCollapsedState(timer = 400) {
    setTimeout(() => this.settings.setOptions(this.options), timer);
  }

  onSidenavClosedStart() {
    this.isContentWidthFixed = false;
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver;
    this.options.sidenavOpened = isOpened;
    this.settings.setOptions(this.options);
  }

  receiveOptions(options: AppSettings): void {
    this.settings.setOptions(options);
    this.options = this.settings.getOptions();
    this.toggleDarkTheme(options);
    this.toggleColorsTheme(options);
  }

  toggleDarkTheme(options: AppSettings) {
    if (options.theme === 'dark') {
      this.htmlElement.classList.add('dark-theme');
      this.htmlElement.classList.remove('light-theme');
    } else {
      this.htmlElement.classList.remove('dark-theme');
      this.htmlElement.classList.add('light-theme');
    }
  }

  toggleColorsTheme(options: AppSettings) {
    // Remove any existing theme class dynamically
    this.htmlElement.classList.forEach((className) => {
      if (className.endsWith('_theme')) {
        this.htmlElement.classList.remove(className);
      }
    });

    // Add the selected theme class
    this.htmlElement.classList.add(options.activeTheme);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/authentication/login']);
  }

  private resolveHomeRoute(role: string): string {
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
