import { Routes } from '@angular/router';

import { AppPostsComponent } from './farmer/posts/posts.component';
import { AppCatalogComponent } from './farmer/catalog/catalog.component';
import { AppAdvisorDetailComponent } from './farmer/catalog/advisor-detail/advisor-detail.component';
import { AppBookAppointmentComponent } from './farmer/catalog/book-appointment/book-appointment.component';
import { AppAppointmentsComponent } from './farmer/appointment/appointments.component';
import { AppAppointmentsHistoryComponent } from './farmer/appointment/history/appointments-history.component';
import { AppointmentDetailComponent } from './farmer/appointment/detail/appointment-detail.component';
import { FarmerTutorialComponent } from './farmer/tutorial/tutorial.component';
import { EducationComponent } from './farmer/education/education.component';
import { AdvisoryCalendarComponent } from './shared/advisory-calendar/advisory-calendar.component';

export const FarmerRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'tutorial',
        component: FarmerTutorialComponent,
        data: {
          title: 'nav.quickGuide',
          urls: [{ title: 'nav.quickGuide', url: '/apps/farmer/tutorial' }],
        },
      },
      {
        path: 'catalog',
        component: AppCatalogComponent,
        data: {
          title: 'nav.advisorCatalog',
          urls: [{ title: 'nav.catalog', url: '/apps/farmer/catalog' }],
        },
      },
      {
        path: 'catalog/:advisorId',
        component: AppAdvisorDetailComponent,
        data: {
          title: 'advisor.detail',
          urls: [
            { title: 'nav.catalog', url: '/apps/farmer/catalog' },
            { title: 'advisor.detail' },
          ]
        }
      },
      {
        path: 'catalog/:advisorId/book',
        component: AppBookAppointmentComponent,
        data: {
          title: 'booking.title',
          urls: [
            { title: 'nav.catalog', url: '/apps/farmer/catalog' },
            { title: 'booking.title' },
          ]
        }
      },
      {
        path: 'appointments',
        component: AppAppointmentsComponent,
        data: {
          title: 'nav.myAppointments',
          urls: [{ title: 'nav.appointments', url: '/apps/farmer/appointments' }],
        }
      },
      {
        path: 'calendar',
        component: AdvisoryCalendarComponent,
        data: {
          title: 'nav.advisoryCalendar',
          urls: [{ title: 'nav.calendar', url: '/apps/farmer/calendar' }],
        }
      },
      {
        path: 'education',
        component: EducationComponent,
        data: {
          title: 'nav.education',
          urls: [{ title: 'nav.education', url: '/apps/farmer/education' }],
        },
      },
      {
        path: 'appointments/history',
        component: AppAppointmentsHistoryComponent,
        data: {
          title: 'appointments.history',
          urls: [
            { title: 'nav.appointments', url: '/apps/farmer/appointments' },
            { title: 'appointments.historyShort' },
          ],
        }
      },
      {
        path: 'appointments/:id',
        component: AppointmentDetailComponent,
        data: {
          title: 'appointments.detail',
          urls: [
            { title: 'nav.appointments', url: '/apps/farmer/appointments' },
            { title: 'appointments.detail' },
          ],
        }
      },
      {
        path: 'posts',
        component: AppPostsComponent,
        data: {
          title: 'posts.advisorPosts',
          urls: [{ title: 'nav.posts', url: '/apps/farmer/posts' }]
        }
      }
    ],
  },
];
