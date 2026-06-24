import { NavItem } from './nav-item/nav-item';

export const navItemsFarmer: NavItem[] = [
  {
    navCap: 'nav.appointments',
  },
  {
    displayName: 'nav.quickGuide',
    iconName: 'help-circle',
    route: '/apps/farmer/tutorial',
  },
  {
    displayName: 'nav.catalog',
    iconName: 'aperture',
    route: '/apps/farmer/catalog',
  },
  {
    displayName: 'nav.myAppointments',
    iconName: 'calendar',
    route: '/apps/farmer/appointments',
  },
  {
    displayName: 'nav.calendar',
    iconName: 'calendar-month',
    route: '/apps/farmer/calendar',
  },
  {
    navCap: 'nav.learning',
  },
  {
    displayName: 'nav.education',
    iconName: 'book',
    route: '/apps/farmer/education',
  },
  {
    navCap: 'nav.posts',
  },
  {
    displayName: 'nav.posts',
    iconName: 'news',
    route: '/apps/farmer/posts',
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
