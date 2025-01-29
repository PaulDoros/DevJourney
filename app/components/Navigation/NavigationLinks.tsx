import {
  LayoutDashboard,
  UserCog,
  Settings,
  LogOut,
  Trophy,
} from 'lucide-react';
import { LearningNavigation } from './LearningNavigation';
import { SidebarLink } from '~/components/ui/Sidebar';

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
    label: 'Achievements',
    href: '/achievements',
    icon: <Trophy className="h-5 w-5" />,
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

export function NavigationLinksList() {
  return (
    <div className="flex flex-col gap-2">
      <LearningNavigation />
      <div className="my-2 h-px bg-gray-200 dark:bg-gray-700" />
      {navigationLinks.map((link) => (
        <SidebarLink key={link.href} link={link} />
      ))}
    </div>
  );
}
