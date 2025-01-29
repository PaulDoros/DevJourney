import { json, type ActionFunctionArgs } from '@remix-run/node';
import { createServerSupabase, requireAuth } from '~/utils/supabase.server';
import type { Database } from '~/types/supabase';

type Achievement = Database['public']['Tables']['achievements']['Row'];
type UserAchievement = Database['public']['Tables']['user_achievements']['Row'];

export async function action({ request }: ActionFunctionArgs) {
  const session = await requireAuth(request);
  const { supabase } = createServerSupabase(request);
  const formData = await request.formData();

  const achievementType = formData.get('achievementType') as string;
  const achievementName = formData.get('achievementName') as string;

  if (!achievementType || !achievementName) {
    return json(
      { error: 'Achievement type and name are required' },
      { status: 400 },
    );
  }

  try {
    // Check if achievement exists
    const { data: achievement, error: achievementError } = await supabase
      .from('achievements')
      .select('*')
      .eq('name', achievementName)
      .single();

    if (achievementError || !achievement) {
      return json({ error: 'Achievement not found' }, { status: 404 });
    }

    // Check if user already has this achievement
    const { data: existingAchievement, error: existingError } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('achievement_id', achievement.id)
      .single();

    if (existingAchievement) {
      return json({ message: 'Achievement already earned' }, { status: 200 });
    }

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError;
    }

    // Award the achievement
    const { error: awardError } = await supabase
      .from('user_achievements')
      .insert({
        user_id: session.user.id,
        achievement_id: achievement.id,
        earned_at: new Date().toISOString(),
      });

    if (awardError) {
      throw awardError;
    }

    // Update user points
    const { error: updateError } = await supabase
      .from('users')
      .update({
        points: supabase.rpc('increment_points', {
          amount: achievement.points,
        }),
        achievements: supabase.rpc('array_append', {
          arr: 'achievements',
          item: achievement.id,
        }),
      })
      .eq('id', session.user.id);

    if (updateError) {
      throw updateError;
    }

    return json({
      message: 'Achievement unlocked!',
      achievement,
    });
  } catch (error) {
    console.error('Error tracking achievement:', error);
    return json({ error: 'Failed to track achievement' }, { status: 500 });
  }
}
