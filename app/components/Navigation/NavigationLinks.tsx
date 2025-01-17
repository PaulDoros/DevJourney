import { LayoutDashboard, UserCog, Settings, LogOut } from 'lucide-react';

export const navigationLinks = [
  {
    label: 'Home',
    href: '/',
    icon: (
      <LayoutDashboard className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: (
      <UserCog className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: (
      <Settings className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: 'Logout',
    href: '/logout',
    icon: (
      <LogOut className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
    isForm: true,
  },
];
