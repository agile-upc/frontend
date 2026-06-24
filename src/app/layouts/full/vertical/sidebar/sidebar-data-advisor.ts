import { NavItem } from './nav-item/nav-item';

export const navItemsAdvisor: NavItem[] = [
  {
    navCap: 'Citas',
  },
  {
    displayName: 'Mis citas',
    iconName: 'calendar',
    route: '/apps/advisor/appointments',
  },
  {
    displayName: 'Mis horarios',
    iconName: 'calendar-event',
    route: '/apps/advisor/available-dates',
  },
  {
    navCap: 'Publicaciones',
  },
  {
    displayName: 'Mis publicaciones',
    iconName: 'news',
    route: '/apps/advisor/posts',
  },
  {
    navCap: 'Perfil',
  },
  {
    displayName: 'Mi perfil',
    iconName: 'user-circle',
    route: '/apps/profile',
  },
  {
    displayName: 'Mis notificaciones',
    iconName: 'notification',
    route: '/apps/notifications',
  }
];
