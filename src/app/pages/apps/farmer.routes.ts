import { Routes } from '@angular/router';

import { AppPostsComponent } from './farmer/posts/posts.component';
import { AppCatalogComponent } from './farmer/catalog/catalog.component';
import { AppAdvisorDetailComponent } from './farmer/catalog/advisor-detail/advisor-detail.component';
import { AppBookAppointmentComponent } from './farmer/catalog/book-appointment/book-appointment.component';
import { AppAppointmentsComponent } from './farmer/appointment/appointments.component';
import { AppAppointmentsHistoryComponent } from './farmer/appointment/history/appointments-history.component';
import { AppointmentDetailComponent } from './farmer/appointment/detail/appointment-detail.component';

export const FarmerRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'catalog',
        component: AppCatalogComponent,
        data: {
          title: 'Catálogo de asesores',
          urls: [{ title: 'Catálogo', url: '/apps/farmer/catalog' }],
        },
      },
      {
        path: 'catalog/:advisorId',
        component: AppAdvisorDetailComponent,
        data: {
          title: 'Detalle del asesor',
          urls: [
            { title: 'Catálogo', url: '/apps/farmer/catalog' },
            { title: 'Detalle del asesor' },
          ]
        }
      },
      {
        path: 'catalog/:advisorId/book',
        component: AppBookAppointmentComponent,
        data: {
          title: 'Reservar cita',
          urls: [
            { title: 'Catálogo', url: '/apps/farmer/catalog' },
            { title: 'Reservar cita' },
          ]
        }
      },
      {
        path: 'appointments',
        component: AppAppointmentsComponent,
        data: {
          title: 'Mis citas',
          urls: [{ title: 'Citas', url: '/apps/farmer/appointments' }],
        }
      },
      {
        path: 'appointments/history',
        component: AppAppointmentsHistoryComponent,
        data: {
          title: 'Historial de citas',
          urls: [
            { title: 'Citas', url: '/apps/farmer/appointments' },
            { title: 'Historial' },
          ],
        }
      },
      {
        path: 'appointments/:id',
        component: AppointmentDetailComponent,
        data: {
          title: 'Detalle de la cita',
          urls: [
            { title: 'Citas', url: '/apps/farmer/appointments' },
            { title: 'Detalle de la cita' },
          ],
        }
      },
      {
        path: 'posts',
        component: AppPostsComponent,
        data: {
          title: 'Publicaciones de asesores',
          urls: [{ title: 'Publicaciones', url: '/apps/farmer/posts' }]
        }
      }
    ],
  },
];
