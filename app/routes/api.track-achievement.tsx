import { json, type ActionFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';
import { createServerSupabase } from '~/utils/supabase';

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const componentId = formData.get('componentId') as string;
  const { supabase } = createServerSupabase(request);

  try {
    // Get the achievement by component_id
    const { data: achievement, error: achievementError } = await supabase
      .from('achievements')
      .select('id, name')
      .eq('component_id', componentId)
      .single();

    if (achievementError || !achievement) {
      console.error(`Achievement ${componentId} not found`);
      return json({ error: 'Achievement not found' }, { status: 404 });
    }

    // Check if user already has this achievement recently
    const { data: existingAchievement } = await supabase
      .from('user_achievements')
      .select('created_at')
      .eq('user_id', user.id)
      .eq('achievement_id', achievement.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existingAchievement) {
      const timeSinceUnlock =
        Date.now() - new Date(existingAchievement.created_at).getTime();
      if (timeSinceUnlock < 5000) {
        // 5 seconds cooldown
        return json({
          success: true,
          message: 'Achievement already unlocked recently',
        });
      }
    }

    // Insert new achievement
    const { error: insertError } = await supabase
      .from('user_achievements')
      .insert({
        user_id: user.id,
        achievement_id: achievement.id,
      });

    if (insertError) {
      if (insertError.code === '23505') {
        // Unique violation
        return json({
          success: true,
          message: 'Achievement already unlocked',
        });
      }
      throw insertError;
    }

    return json({
      success: true,
      message: 'Achievement unlocked!',
    });
  } catch (error) {
    console.error('Achievement tracking error:', error);
    return json({ error: 'Failed to track achievement' }, { status: 500 });
  }
}
