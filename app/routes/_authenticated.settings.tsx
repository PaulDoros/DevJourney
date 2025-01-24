import { ThemeSwitcher } from '~/components/ThemeSwitcher';
import { PageLayout } from '~/components/layouts/PageLayout';
import { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';
import { AvatarSettings } from '~/components/Settings/AvatarSettings';
import {
  deleteOldAvatar,
  getUserAvatars,
} from '~/utils/supabase-storage.server';
import { createServerSupabase } from '~/utils/supabase';
import { checkAndUnlockAvatarAchievement } from '~/services/achievements.server';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';

// Define types for theme-related data
interface ThemeAchievement {
  achievement: {
    id: string;
    name: string;
  };
}

interface ThemeHistory {
  theme: string;
  created_at: string;
}

interface LoaderData {
  user: {
    id: string;
    username: string;
    is_guest: boolean;
    avatar_url: string | null;
  };
  preferences: {
    theme: string;
  } | null;
  achievements: Array<{
    id: string;
    achievement: {
      id: string;
      name: string;
      description: string;
      points: number;
    };
  }>;
  personalAvatars: Array<{
    name: string;
    url: string;
    size: number;
    created_at: string;
  }>;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const personalAvatars = await getUserAvatars(user.id);
  const { supabase } = createServerSupabase(request);

  // Get user achievements with proper type casting
  const { data: achievementsData } = await supabase
    .from('user_achievements')
    .select(
      `
      id,
      achievement:achievements!inner (
        id,
        name,
        description,
        points
      )
    `,
    )
    .eq('user_id', user.id);

  const { data: preferences } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Transform the data to match our types
  const achievements = (achievementsData || []).map((item: any) => ({
    id: item.id,
    achievement: {
      id: item.achievement.id,
      name: item.achievement.name,
      description: item.achievement.description,
      points: item.achievement.points,
    },
  }));

  return typedjson<LoaderData>({
    user: {
      id: user.id,
      username: user.username,
      is_guest: user.is_guest,
      avatar_url: user.avatar_url,
    },
    personalAvatars,
    preferences,
    achievements,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const { supabase } = createServerSupabase(request);

  // Handle theme change achievement
  if (formData.get('action') === 'change-theme') {
    const theme = formData.get('theme') as string;
    if (!theme) {
      return typedjson({ error: 'Theme is required' }, { status: 400 });
    }

    // Update user's theme preference
    await supabase
      .from('user_preferences')
      .upsert({ user_id: user.id, theme }, { onConflict: 'user_id' });

    // Check if user already has the theme achievements
    const { data: existingAchievements } = await supabase
      .from('user_achievements')
      .select(
        `
        achievement:achievements!inner (
          id,
          name
        )
      `,
      )
      .eq('user_id', user.id)
      .in('achievement.name', ['Theme Explorer', 'Theme Master']);

    const hasThemeExplorer = (
      existingAchievements as ThemeAchievement[] | null
    )?.some((ua) => ua.achievement.name === 'Theme Explorer');
    const hasThemeMaster = (
      existingAchievements as ThemeAchievement[] | null
    )?.some((ua) => ua.achievement.name === 'Theme Master');

    // Only try to unlock achievements if they're not already unlocked
    if (!hasThemeExplorer || !hasThemeMaster) {
      // Get all user's theme changes
      const { data: themeHistory } = await supabase
        .from('theme_history')
        .select('theme')
        .eq('user_id', user.id);

      const uniqueThemes = new Set(
        (themeHistory as ThemeHistory[] | null)?.map((th) => th.theme) || [],
      );
      uniqueThemes.add(theme);

      // Track this theme change
      await supabase.from('theme_history').insert({
        user_id: user.id,
        theme,
      });

      // Try to unlock achievements based on conditions
      if (!hasThemeExplorer) {
        const { data: explorerAchievement } = await supabase
          .from('achievements')
          .select('id')
          .eq('name', 'Theme Explorer')
          .single();

        if (explorerAchievement) {
          await supabase.from('user_achievements').insert({
            user_id: user.id,
            achievement_id: explorerAchievement.id,
          });
        }
      }

      // Unlock Theme Master if they've used all themes
      if (!hasThemeMaster && uniqueThemes.size >= 4) {
        const { data: masterAchievement } = await supabase
          .from('achievements')
          .select('id')
          .eq('name', 'Theme Master')
          .single();

        if (masterAchievement) {
          await supabase.from('user_achievements').insert({
            user_id: user.id,
            achievement_id: masterAchievement.id,
          });
        }
      }
    }

    return typedjson({ success: true, theme });
  }

  // Handle avatar change achievement
  if (formData.has('avatar') || formData.get('action') === 'select-preset') {
    await checkAndUnlockAvatarAchievement(request, user.id);
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
      throw new Response('Profile update failed', { status: 500 });
    }

    return typedjson({ success: true, avatar_url: avatarUrl });
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
      throw new Response('Profile update failed', { status: 500 });
    }

    return typedjson({ success: true });
  }

  throw new Response('Invalid action', { status: 400 });
}

export default function Settings() {
  const { user, achievements } = useTypedLoaderData<typeof loader>();

  return (
    <PageLayout>
      <div className="h-full w-full px-4 py-6 scrollbar-hide">
        <h1 className="text-2xl font-bold text-light-text retro:text-retro-text multi:text-white multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text">
          Settings
        </h1>

        <div className="mx-auto space-y-6 pb-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 dark:text-dark-text/90">
              Theme
            </h2>
            <div className="rounded-lg border p-4">
              <p className="mb-4 text-sm text-light-text/70 retro:text-retro-text/70 multi:text-white/70 dark:text-dark-text/70">
                Choose your preferred theme. Changes are saved automatically.
              </p>
              <ThemeSwitcher />
            </div>
          </section>

          {!user.is_guest && (
            <>
              <AvatarSettings user={user} achievements={achievements} />

              <section>
                <h2 className="mb-4 text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90">
                  Account
                </h2>
                <div className="rounded-lg border border-gray-300 bg-light-secondary p-6 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary">
                  <p className="mb-4 text-sm text-light-text/80 retro:text-retro-text/80 multi:text-white/80 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/80">
                    Manage your account settings and preferences.
                  </p>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
