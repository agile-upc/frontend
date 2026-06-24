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
                { title: 'Notifications', url: '/apps/notifications' }
              ]
            },
          },
          {
            path: 'profile',
            component: AppProfileComponent,
            data: {
              title: 'Mi perfil',
              urls: [
                { title: 'Profile' },
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
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
