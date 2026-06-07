import type { UserRole } from './roles';

export type AppRoute =
  | '/dashboard'
  | '/timesheets'
  | '/time-off'
  | '/approvals'
  | '/reports'
  | '/users'
  | '/profile';

export type NavigationIcon =
  | 'dashboard'
  | 'timesheets'
  | 'timeOff'
  | 'approvals'
  | 'reports'
  | 'users'
  | 'profile';

export type NavigationItem = {
  label: string;
  href: AppRoute;
  icon: NavigationIcon;
  roles: UserRole[];
  mobile: boolean;
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    roles: ['employee', 'manager', 'admin'],
    mobile: true,
  },
  {
    label: 'Timesheets',
    href: '/timesheets',
    icon: 'timesheets',
    roles: ['employee', 'manager', 'admin'],
    mobile: true,
  },
  {
    label: 'Time Off',
    href: '/time-off',
    icon: 'timeOff',
    roles: ['employee', 'manager', 'admin'],
    mobile: true,
  },
  {
    label: 'Approvals',
    href: '/approvals',
    icon: 'approvals',
    roles: ['manager', 'admin'],
    mobile: false,
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: 'reports',
    roles: ['manager', 'admin'],
    mobile: false,
  },
  {
    label: 'Users',
    href: '/users',
    icon: 'users',
    roles: ['manager', 'admin'],
    mobile: false,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: 'profile',
    roles: ['employee', 'manager', 'admin'],
    mobile: true,
  },
];

export function getNavigationItems(role: UserRole, platform: 'mobile' | 'web') {
  return NAVIGATION_ITEMS.filter((item) => {
    const roleAllowed = item.roles.includes(role);
    const platformAllowed = platform === 'web' || item.mobile;

    return roleAllowed && platformAllowed;
  });
}
