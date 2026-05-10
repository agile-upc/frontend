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
    navCap: 'Gestión',
  },
  {
    displayName: 'Mis Recintos',
    iconName: 'building-warehouse',
    route: '/apps/farmer/enclosures',
  },
  {
    displayName: 'Mis Cultivos',
    iconName: 'plant',
    route: '/apps/farmer/crops',
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
