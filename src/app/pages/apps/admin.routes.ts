import { Routes } from '@angular/router';
import { AdminEducationComponent } from './admin/education/admin-education.component';
import { AdminCredentialsComponent } from './admin/credentials/admin-credentials.component';

export const AdminRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'education',
        component: AdminEducationComponent,
        data: {
          title: 'admin.education.title',
          urls: [{ title: 'admin.education.title', url: '/apps/admin/education' }],
        },
      },
      {
        path: 'credentials',
        component: AdminCredentialsComponent,
        data: {
          title: 'admin.credentials.title',
          urls: [{ title: 'admin.credentials.title', url: '/apps/admin/credentials' }],
        },
      },
    ],
  },
];
