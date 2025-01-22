import { ThemeSwitcher } from '~/components/ThemeSwitcher';
import { useTheme } from '~/utils/theme-provider';
import { PageLayout } from '~/components/layouts/PageLayout';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs, ActionFunctionArgs, json } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';
import { AvatarSettings } from '~/components/Settings/AvatarSettings';
import { supabase } from '~/utils/supabase.server';
import {
  getUserAvatars,
  deleteOldAvatar,
  uploadAvatar,
} from '~/utils/supabase-storage.server';
import { createServerSupabase } from '~/utils/supabase';
import { getAvailableAvatars } from '~/services/achievements.server';
import { getUserAchievements } from '~/services/achievements.server';
import { checkAndUnlockAvatarAchievement } from '~/services/achievements.server';
import type { UserAchievement } from '~/types/achievements';

interface AvatarWithRequirements {
  id: string;
  title: string;
  type: string;
  url: string;
  preview_url: string;
  requirements?: {
    points?: number;
    achievement?: string;
    locked: boolean;
    reason?: string;
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const personalAvatars = await getUserAvatars(user.id);
  const availableAvatars = await getAvailableAvatars(request, user.id);
  const achievements = await getUserAchievements(request, user.id);

  // Calculate total points
  const totalPoints = achievements.reduce(
    (total, ua) => total + (ua.achievement?.points || 0),
    0,
  );

  // Add requirements to avatars
  const avatarsWithRequirements: AvatarWithRequirements[] =
    availableAvatars.map((avatar) => ({
      ...avatar,
      requirements: {
        points: getAvatarPointsRequirement(avatar.id),
        achievement: getAvatarAchievementRequirement(avatar.id),
        locked: isAvatarLocked(avatar, achievements, totalPoints),
        reason: getAvatarLockReason(avatar, achievements, totalPoints),
      },
    }));

  return json({
    user,
    personalAvatars,
    availableAvatars: avatarsWithRequirements,
    achievements,
    totalPoints,
  });
}

// Helper functions for avatar requirements
function getAvatarPointsRequirement(avatarId: string): number | undefined {
  const requirements: Record<string, number> = {
    'theme-1': 200,
    'collector-1': 500,
    // Add more avatar point requirements
  };
  return requirements[avatarId];
}

function getAvatarAchievementRequirement(avatarId: string): string | undefined {
  const requirements: Record<string, string> = {
    'theme-1': 'Theme Master',
    'collector-1': 'Avatar Collector',
    // Add more avatar achievement requirements
  };
  return requirements[avatarId];
}

function isAvatarLocked(
  avatar: any,
  achievements: any[],
  totalPoints: number,
): boolean {
  const pointsReq = getAvatarPointsRequirement(avatar.id);
  const achievementReq = getAvatarAchievementRequirement(avatar.id);

  if (pointsReq && totalPoints < pointsReq) return true;
  if (
    achievementReq &&
    !achievements.some((a) => a.achievement?.name === achievementReq)
  )
    return true;

  return false;
}

function getAvatarLockReason(
  avatar: any,
  achievements: any[],
  totalPoints: number,
): string | undefined {
  const pointsReq = getAvatarPointsRequirement(avatar.id);
  const achievementReq = getAvatarAchievementRequirement(avatar.id);

  if (pointsReq && totalPoints < pointsReq) {
    return `Requires ${pointsReq} points (you have ${totalPoints})`;
  }
  if (
    achievementReq &&
    !achievements.some((a) => a.achievement?.name === achievementReq)
  ) {
    return `Unlock "${achievementReq}" achievement first`;
  }

  return undefined;
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const { supabase } = createServerSupabase(request);

  // Handle theme change achievement
  if (formData.get('action') === 'change-theme') {
    await checkAndUnlockThemeAchievement(request, user.id);
  }

  // Handle avatar change achievement
  if (formData.has('avatar') || formData.get('action') === 'select-preset') {
    await checkAndUnlockAvatarAchievement(request, user.id);
  }

  // Handle file upload
  if (formData.has('avatar')) {
    const files = formData.getAll('avatar');
    const uploadedUrls = [];

    for (const fileData of files) {
      if (!(fileData instanceof Blob)) continue;
      const file = fileData as Blob;

      if (!file || file.size === 0) continue;
      if (file.size > 5 * 1024 * 1024) {
        throw new Response('File too large (max 5MB)', { status: 400 });
      }

      try {
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const publicUrl = await uploadAvatar(user.id, file, fileName);
        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('File upload error:', error);
        continue;
      }
    }

    if (uploadedUrls.length === 0) {
      throw new Response('No files were uploaded successfully', {
        status: 400,
      });
    }

    // Update user avatar if they don't have one
    if (!user.avatar_url) {
      await supabase
        .from('users')
        .update({ avatar_url: uploadedUrls[0] })
        .eq('id', user.id);
    }

    return { success: true, avatar_urls: uploadedUrls };
  }

  // Handle personal avatar deletion
  if (formData.get('action') === 'delete-personal-avatar') {
    const avatarName = formData.get('avatar_name') as string;
    const filePath = `${user.id}/custom/${avatarName}`;

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      throw new Response('Failed to delete avatar', { status: 500 });
    }

    // If this was the current avatar, remove it from user profile
    const { data: currentUser } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (currentUser?.avatar_url?.includes(avatarName)) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw new Response('Profile update failed', { status: 500 });
      }
    }

    return { success: true };
  }

  // Handle preset avatar selection
  if (formData.get('action') === 'select-preset') {
    const avatarUrl = formData.get('avatar_url') as string;

    // Get current avatar URL before updating
    const { data: currentUser } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    // Delete old custom avatar if exists
    if (currentUser?.avatar_url?.includes('/avatars/custom/')) {
      await deleteOldAvatar(currentUser.avatar_url);
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      throw new Response('Profile update failed', { status: 500 });
    }

    return { success: true, avatar_url: avatarUrl };
  }

  // Handle avatar removal
  if (formData.get('action') === 'remove-avatar') {
    // Get current avatar URL before updating
    const { data: currentUser } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    // Delete old custom avatar if exists
    if (currentUser?.avatar_url?.includes('/avatars/custom/')) {
      await deleteOldAvatar(currentUser.avatar_url);
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: null })
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      throw new Response('Profile update failed', { status: 500 });
    }

    return { success: true };
  }

  throw new Response('Invalid action', { status: 400 });
}

export default function Settings() {
  const { user, achievements, totalPoints, availableAvatars } =
    useLoaderData<typeof loader>();

  return (
    <PageLayout>
      <div className="h-full w-full px-4 py-6 scrollbar-hide">
        <h1 className="text-2xl font-bold text-light-text retro:text-retro-text multi:text-white multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text">
          Settings
        </h1>

        <div className="mx-auto space-y-6 pb-8">
          <section>
            <h2 className="mb-4 text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90">
              Theme
            </h2>
            <div className="rounded-lg border border-gray-300 bg-light-secondary p-6 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary">
              <p className="mb-4 text-sm text-light-text/80 retro:text-retro-text/80 multi:text-white/80 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/80">
                Choose your preferred theme appearance. Changes are saved
                automatically.
              </p>
              <ThemeSwitcher />
            </div>
          </section>

          {!user.is_guest && (
            <>
              <AvatarSettings
                user={user}
                availableAvatars={availableAvatars}
                totalPoints={totalPoints}
                achievements={achievements}
              />

              <section>
                <h2 className="mb-4 text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90">
                  Account
                </h2>
                <div className="rounded-lg border border-gray-300 bg-light-secondary p-6 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary">
                  <p className="mb-4 text-sm text-light-text/80 retro:text-retro-text/80 multi:text-white/80 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/80">
                    Manage your account settings and preferences.
                  </p>
                  {/* Account settings will go here */}
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90">
                  Notifications
                </h2>
                <div className="rounded-lg border border-gray-300 bg-light-secondary p-6 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary">
                  <p className="mb-4 text-sm text-light-text/80 retro:text-retro-text/80 multi:text-white/80 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/80">
                    Configure how and when you receive notifications.
                  </p>
                  {/* Notification settings will go here */}
                </div>
              </section>
            </>
          )}

          {user.is_guest && (
            <section>
              <h2 className="mb-4 text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90">
                Unlock More Features
              </h2>
              <div className="rounded-lg border border-gray-300 bg-light-secondary p-6 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary">
                <p className="mb-4 text-sm text-light-text/80 retro:text-retro-text/80 multi:text-white/80 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/80">
                  Create an account to unlock additional features:
                </p>

                <ul className="mb-6 space-y-2">
                  {[
                    'Customize your profile avatar',
                    'Track your progress and earn achievements',
                    'Save your preferences across devices',
                    'Join the developer community',
                    'Access exclusive content and features',
                    'Participate in coding challenges',
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-light-text/80 retro:text-retro-text/80 multi:text-white/80 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/80"
                    >
                      <svg
                        className="h-5 w-5 text-light-accent retro:text-retro-accent multi:text-white dark:text-dark-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-4">
                  <a
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-md bg-light-accent px-4 py-2 text-sm font-medium text-white hover:bg-light-accent/90 retro:bg-retro-accent retro:hover:bg-retro-accent/90 multi:bg-multi-gradient multi:from-multi-gradient-1 multi:via-multi-gradient-2 multi:to-multi-gradient-3 multi:text-white multi:shadow-lg multi:transition-all multi:hover:scale-105 multi:hover:animate-gradient multi:hover:shadow-xl dark:bg-dark-accent dark:hover:bg-dark-accent/90"
                  >
                    Create Account
                  </a>
                  <a
                    href="/login"
                    className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm text-light-text hover:text-light-accent retro:text-retro-text retro:hover:text-retro-accent multi:text-white multi:hover:text-white/80 dark:text-dark-text dark:hover:text-dark-accent"
                  >
                    Already have an account? Sign in
                  </a>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
