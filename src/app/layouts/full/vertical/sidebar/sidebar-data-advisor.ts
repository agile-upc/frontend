import { NavItem } from './nav-item/nav-item';

export const navItemsAdvisor: NavItem[] = [
  {
    navCap: 'nav.appointments',
  },
  {
    displayName: 'nav.myAppointments',
    iconName: 'calendar',
    route: '/apps/advisor/appointments',
  },
  {
    displayName: 'nav.calendar',
    iconName: 'calendar-month',
    route: '/apps/advisor/calendar',
  },
  {
    displayName: 'nav.mySchedule',
    iconName: 'calendar-event',
    route: '/apps/advisor/available-dates',
  },
  {
    navCap: 'nav.posts',
  },
  {
    displayName: 'nav.myPosts',
    iconName: 'news',
    route: '/apps/advisor/posts',
  },
  {
    navCap: 'nav.profile',
  },
  {
    displayName: 'nav.profile',
    iconName: 'user-circle',
    route: '/apps/profile',
  },
  {
    displayName: 'nav.myNotifications',
    iconName: 'notification',
    route: '/apps/notifications',
  }
];
