import { NavItem } from './nav-item/nav-item';

export const navItemsFarmer: NavItem[] = [
  {
    navCap: 'Citas',
  },
  {
    displayName: 'Guía rápida',
    iconName: 'help-circle',
    route: '/apps/farmer/tutorial',
  },
  {
    displayName: 'Catálogo',
    iconName: 'aperture',
    route: '/apps/farmer/catalog',
  },
  {
    displayName: 'Mis citas',
    iconName: 'calendar',
    route: '/apps/farmer/appointments',
  },
  {
    navCap: 'Publicaciones',
  },
  {
    displayName: 'Publicaciones',
    iconName: 'news',
    route: '/apps/farmer/posts',
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
