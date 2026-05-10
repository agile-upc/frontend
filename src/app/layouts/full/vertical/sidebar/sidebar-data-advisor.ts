import { NavItem } from './nav-item/nav-item';

export const navItemsAdvisor: NavItem[] = [
  {
    navCap: 'Citas',
  },
  {
    displayName: 'Mis Citas',
    iconName: 'calendar',
    route: '/apps/advisor/appointments',
  },
  {
    displayName: 'Mis Horarios',
    iconName: 'calendar-event',
    route: '/apps/advisor/available-dates',
  },
  {
    navCap: 'Posts',
  },
  {
    displayName: 'Mis Publicaciones',
    iconName: 'news',
    route: '/apps/advisor/posts',
  },
  {
    navCap: 'Perfil',
  },
  {
    displayName: 'Mi Perfil',
    iconName: 'user-circle',
    route: '/apps/profile',
  },
  {
    displayName: 'Mis Notificaciones',
    iconName: 'notification',
    route: '/apps/notifications',
  }
];
