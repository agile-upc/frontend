import { NavItem } from './nav-item/nav-item';

export const navItemsFarmer: NavItem[] = [
  {
    navCap: 'Citas',
  },
  {
    displayName: 'Catálogo',
    iconName: 'aperture',
    route: '/apps/farmer/catalog',
  },
  {
    displayName: 'Mis Citas',
    iconName: 'calendar',
    route: '/apps/farmer/appointments',
  },
  {
    navCap: 'Posts',
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
