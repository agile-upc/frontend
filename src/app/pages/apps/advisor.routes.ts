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
          title: 'nav.myAppointments',
          urls: [
            { title: 'nav.appointments', url: '/apps/advisor/appointments' },
          ],
        }
      },
      {
        path: 'calendar',
        component: AdvisoryCalendarComponent,
        data: {
          title: 'nav.advisoryCalendar',
          urls: [
            { title: 'nav.calendar', url: '/apps/advisor/calendar' },
          ],
        }
      },
      {
        path: 'appointments/history',
        component: AdvisorHistoryComponent,
        data: {
          title: 'appointments.history',
          urls: [
            { title: 'nav.appointments', url: '/apps/advisor/appointments' },
            { title: 'appointments.historyShort' },
          ],
        }
      },
      {
        path: 'appointments/:id',
        component: AdvisorAppointmentDetailComponent,
        data: {
          title: 'appointments.detail',
          urls: [
            { title: 'nav.appointments', url: '/apps/advisor/appointments' },
            { title: 'common.detail' },
          ],
        }
      },
      {
        path: 'posts',
        component: AdvisorPostsComponent,
        data: {
          title: 'nav.myPosts',
          urls: [
            { title: 'nav.posts',  url: '/apps/advisor/posts' },
          ]
        }
      },
      {
        path: 'posts/create',
        component: CreatePostComponent,
        data: {
          title: 'posts.createNew',
          urls: [
            { title: 'posts.create', url: '/apps/advisor/posts' }
          ],
        }
      },
      {
        path: 'posts/:id',
        component: EditPostComponent,
        data: {
          title: 'posts.detail',
          urls: [
            { title: 'posts.edit', url: '/apps/advisor/posts' },
          ],
        }
      },
      {
        path: 'available-dates',
        component: AvailableDatesComponent,
        data: {
          title: 'nav.mySchedule',
          urls: [
            { title: 'availability.availableSlots', url: '/apps/advisor/available-dates' },
          ]
        }
      },
    ],
  },
];
