import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from "./shared/guards/auth.guard";
import {AppNotificationsComponent} from "./pages/apps/shared/notification/notifications.component";
import {AppProfileComponent} from "./pages/apps/shared/profile/profile.component";

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'apps',
        children: [
          {
            path: 'farmer', // subpath interno para FarmerRoutes
            loadChildren: () =>
              import('./pages/apps/farmer.routes').then((m) => m.FarmerRoutes),
          },
          {
            path: 'advisor', // subpath interno para AdvisorRoutes
            loadChildren: () =>
              import('./pages/apps/advisor.routes').then((m) => m.AdvisorRoutes),
          },
          {
            path: 'notifications',
            component: AppNotificationsComponent,
            data: {
              title: 'Notificaciones',
              urls: [
                { title: 'Notificaciones', url: '/apps/notifications' }
              ]
            },
          },
          {
            path: 'profile',
            component: AppProfileComponent,
            data: {
              title: 'Mi perfil',
              urls: [
                { title: 'Mi perfil' },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
      {
        path: 'landingpage',
        loadChildren: () =>
          import('./pages/theme-pages/landingpage/landingpage.routes').then(
            (m) => m.LandingPageRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
