import { NavItem } from './nav-item/nav-item';

export const navItemsAdmin: NavItem[] = [
  {
    navCap: 'nav.admin',
  },
  {
    displayName: 'admin.education.title',
    iconName: 'book',
    route: '/apps/admin/education',
  },
  {
    displayName: 'admin.credentials.title',
    iconName: 'shield-check',
    route: '/apps/admin/credentials',
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
  },
];
