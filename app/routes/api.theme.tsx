import { json, type ActionFunctionArgs } from '@remix-run/node';
import { checkAndUnlockThemeAchievement } from '~/services/achievements.server';
import { requireUser } from '~/utils/session.server';
import { createServerSupabase } from '~/utils/supabase';

export async function action({ request }: ActionFunctionArgs) {
  try {
    const user = await requireUser(request);
    const formData = await request.formData();
    const theme = formData.get('theme') as string;
    const { supabase } = createServerSupabase(request);

    if (!theme) {
      return json({ error: 'Theme is required' }, { status: 400 });
    }

    // Update user's theme preference
    await supabase
      .from('user_preferences')
      .upsert({ user_id: user.id, theme }, { onConflict: 'user_id' });

    // Check if theme achievement was recently unlocked
    const { data: recentUnlock } = await supabase
      .from('user_achievements')
      .select('created_at')
      .eq('user_id', user.id)
      .eq('achievement_name', 'Theme Master')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Only check for achievement if no recent unlock
    let unlockedAchievement = null;
    if (
      !recentUnlock ||
      Date.now() - new Date(recentUnlock.created_at).getTime() > 5000
    ) {
      unlockedAchievement = await checkAndUnlockThemeAchievement(
        request,
        user.id,
        theme,
      );
    }

    return json({
      success: true,
      theme,
      unlockedAchievement,
    });
  } catch (error: any) {
    console.error('Error updating theme:', error);

    // Handle rate limiting specifically
    if (error?.status === 429) {
      return json(
        { error: 'Please wait a moment before changing themes again' },
        { status: 429 },
      );
    }

    return json(
      { error: 'Failed to update theme' },
      { status: error?.status || 500 },
    );
  }
}
