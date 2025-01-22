import { createServerSupabase } from '~/utils/supabase';
import type { Achievement, UserAchievement } from '~/types/achievements';

export async function unlockAchievement(
  request: Request,
  userId: string,
  achievementId: string,
) {
  const { supabase } = createServerSupabase(request);

  const { data, error } = await supabase
    .from('user_achievements')
    .insert({
      user_id: userId,
      achievement_id: achievementId,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function getUserAchievements(request: Request, userId: string) {
  const { supabase } = createServerSupabase(request);

  const { data: achievements, error } = await supabase
    .from('user_achievements')
    .select('*, achievement:achievements(*)')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });

  if (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }

  return achievements;
}

export async function getAvailableAvatars(request: Request, userId: string) {
  const { supabase } = createServerSupabase(request);

  // Get user's unlocked achievements
  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId);

  const unlockedAchievementIds =
    userAchievements?.map((ua) => ua.achievement_id) || [];

  // Get available avatars (either no achievement requirement or unlocked achievement)
  const { data: avatars, error } = await supabase
    .from('preset_avatars')
    .select(
      `
      *,
      achievement:achievements(*)
    `,
    )
    .or(
      `id.in.(${
        unlockedAchievementIds.length > 0
          ? unlockedAchievementIds
              .map(
                (id) =>
                  `select preset_avatar_id from achievements where id = '${id}'`,
              )
              .join(',')
          : 'null'
      })`,
    );

  if (error) throw error;
  return avatars;
}

export async function getAchievementByName(request: Request, name: string) {
  const { supabase } = createServerSupabase(request);

  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('name', name)
    .single();

  if (error) throw error;
  return data;
}

export async function checkAndUnlockAchievement(
  request: Request,
  userId: string,
  achievementName: string,
) {
  const { supabase } = createServerSupabase(request);

  // Get the achievement
  const { data: achievement } = await supabase
    .from('achievements')
    .select('id')
    .eq('name', achievementName)
    .single();

  if (!achievement) {
    console.error(`Achievement ${achievementName} not found`);
    return null;
  }

  // Check if user already has this achievement
  const { data: existingAchievement } = await supabase
    .from('user_achievements')
    .select('id')
    .eq('user_id', userId)
    .eq('achievement_id', achievement.id)
    .single();

  if (existingAchievement) {
    return existingAchievement;
  }

  // Unlock the achievement
  const { data: unlockedAchievement, error } = await supabase
    .from('user_achievements')
    .insert({
      user_id: userId,
      achievement_id: achievement.id,
    })
    .select('*, achievement:achievements(*)')
    .single();

  if (error) {
    console.error('Error unlocking achievement:', error);
    return null;
  }

  return unlockedAchievement;
}

export async function checkAndUnlockAvatarAchievement(
  request: Request,
  userId: string,
) {
  const { supabase } = createServerSupabase(request);

  // Check if user already has the achievement
  const existingAchievement = await getAchievementByName(
    request,
    'Avatar Customizer',
  );
  if (!existingAchievement) return null;

  const { data: userAchievement } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId)
    .eq('achievement_id', existingAchievement.id)
    .single();

  if (!userAchievement) {
    return await unlockAchievement(request, userId, existingAchievement.id);
  }

  return null;
}
