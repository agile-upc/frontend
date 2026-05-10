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
        path: 'starter',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
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
            path: 'template',
            loadChildren: () =>
              import('./pages/apps/template.routes').then((m) => m.TemplateRoutes),
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
      {
        path: 'dashboards',
        loadChildren: () =>
          import('./pages/dashboards/dashboards.routes').then(
            (m) => m.DashboardsRoutes
          ),
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./pages/forms/forms.routes').then((m) => m.FormsRoutes),
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./pages/charts/charts.routes').then((m) => m.ChartsRoutes),
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./pages/widgets/widgets.routes').then((m) => m.WidgetsRoutes),
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./pages/tables/tables.routes').then((m) => m.TablesRoutes),
      },
      {
        path: 'datatable',
        loadChildren: () =>
          import('./pages/datatable/datatable.routes').then(
            (m) => m.DatatablesRoutes
          ),
      },
      {
        path: 'theme-pages',
        loadChildren: () =>
          import('./pages/theme-pages/theme-pages.routes').then(
            (m) => m.ThemePagesRoutes
          ),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
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
