import { Routes } from '@angular/router';

import { AdvisorAppointmentsComponent } from './advisor/appointments/advisor-appointments.component';
import { AdvisorAppointmentDetailComponent } from './advisor/appointments/detail/advisor-appointment-detail.component';
import { AdvisorHistoryComponent } from './advisor/appointments/history/advisor-history.component';
import { AvailableDatesComponent } from './advisor/available-dates/available-dates.component';
import { AdvisorPostsComponent } from './advisor/posts/advisor-posts.component';
import { EditPostComponent } from './advisor/posts/edit-post/edit-post.component';
import { CreatePostComponent } from './advisor/posts/create-post/create-post.component';
import { AdvisoryCalendarComponent } from './shared/advisory-calendar/advisory-calendar.component';

export const AdvisorRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'appointments',
        component: AdvisorAppointmentsComponent,
        data: {
          title: 'Mis citas',
          urls: [
            { title: 'Citas', url: '/apps/advisor/appointments' },
          ],
        }
      },
      {
        path: 'calendar',
        component: AdvisoryCalendarComponent,
        data: {
          title: 'Calendario de asesorías',
          urls: [
            { title: 'Calendario', url: '/apps/advisor/calendar' },
          ],
        }
      },
      {
        path: 'appointments/history',
        component: AdvisorHistoryComponent,
        data: {
          title: 'Historial de citas',
          urls: [
            { title: 'Citas', url: '/apps/advisor/appointments' },
            { title: 'Historial' },
          ],
        }
      },
      {
        path: 'appointments/:id',
        component: AdvisorAppointmentDetailComponent,
        data: {
          title: 'Detalle de cita',
          urls: [
            { title: 'Citas', url: '/apps/advisor/appointments' },
            { title: 'Detalle' },
          ],
        }
      },
      {
        path: 'posts',
        component: AdvisorPostsComponent,
        data: {
          title: 'Mis publicaciones',
          urls: [
            { title: 'Publicaciones',  url: '/apps/advisor/posts' },
          ]
        }
      },
      {
        path: 'posts/create',
        component: CreatePostComponent,
        data: {
          title: 'Crear nueva publicación',
          urls: [
            { title: 'Crear publicación', url: '/apps/advisor/posts' }
          ],
        }
      },
      {
        path: 'posts/:id',
        component: EditPostComponent,
        data: {
          title: 'Detalle de publicación',
          urls: [
            { title: 'Editar publicación', url: '/apps/advisor/posts' },
          ],
        }
      },
      {
        path: 'available-dates',
        component: AvailableDatesComponent,
        data: {
          title: 'Mis horarios',
          urls: [
            { title: 'Horarios disponibles', url: '/apps/advisor/available-dates' },
          ]
        }
      },
    ],
  },
];
