import { Sidebar, SidebarBody, SidebarLink } from '~/components/ui/Sidebar';
import { NavigationLinksList } from '~/components/Navigation/NavigationLinks';
import { Logo, LogoIcon } from '~/components/Logo';
import { UserAvatar } from '~/components/UserAvatar';
import { useState, useEffect } from 'react';
import { cn } from '~/lib/utils';
import { Outlet, useLoaderData } from '@remix-run/react';
import { redirect, type LoaderFunctionArgs, json } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';
import {
  getUserAchievements,
  unlockAchievement,
  getAchievementByName,
} from '~/services/achievements.server';
import { FirstAchievementModal } from '~/components/Achievements/FirstAchievementModal';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  // Get user achievements
  const achievements = await getUserAchievements(request, user.id);

  // Check if this is first login and user doesn't have the welcome achievement
  const hasWelcomeAchievement = achievements.some(
    (ua) => ua.achievement?.name === 'Welcome!',
  );

  if (!hasWelcomeAchievement) {
    // Get the welcome achievement first
    const welcomeAchievement = await getAchievementByName(request, 'Welcome!');
    if (welcomeAchievement) {
      // Now unlock it with the correct UUID
      const unlockedAchievement = await unlockAchievement(
        request,
        user.id,
        welcomeAchievement.id,
      );
      achievements.push(unlockedAchievement);
    }
  }

  return json({
    user,
    achievements,
    isFirstLogin: !hasWelcomeAchievement,
  });
}

export default function AuthenticatedLayout() {
  const { user, isFirstLogin } = useLoaderData<typeof loader>();
  const [open, setOpen] = useState(false);
  const [showFirstAchievementModal, setShowFirstAchievementModal] =
    useState(false);

  useEffect(() => {
    if (isFirstLogin) {
      setShowFirstAchievementModal(true);
    }
  }, [isFirstLogin]);

  return (
    <div
      className={cn(
        'mx-auto flex h-screen w-full flex-1 flex-col overflow-auto',
        'border-gray-300 bg-light-secondary',
        'retro:border-retro-text/30 retro:bg-retro-secondary',
        'multi:border-white/50 multi:bg-gradient-to-br multi:from-multi-gradient-1 multi:via-multi-gradient-2 multi:to-multi-gradient-3',
        'dark:border-gray-600 dark:bg-dark-secondary',
        'md:flex-row',
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8">
              <NavigationLinksList />
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user.username,
                href: '/profile',
                icon: (
                  <UserAvatar
                    avatar_url={user.avatar_url}
                    username={user.username}
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <Outlet />

      <FirstAchievementModal
        isOpen={showFirstAchievementModal}
        onClose={() => setShowFirstAchievementModal(false)}
      />
    </div>
  );
}
