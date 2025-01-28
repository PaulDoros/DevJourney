import { createServerSupabase } from '~/utils/supabase';

export async function checkAndUnlockLearningAchievement(
  request: Request,
  userId: string,
  sectionId: string,
) {
  const { supabase } = createServerSupabase(request);

  // Get user's visited sections
  const { data: visitedSections } = await supabase
    .from('learning_progress')
    .select('section_id')
    .eq('user_id', userId);

  const uniqueSections = new Set(
    (visitedSections || []).map((visit) => visit.section_id),
  );
  uniqueSections.add(sectionId);

  // Track this visit
  await supabase.from('learning_progress').insert({
    user_id: userId,
    section_id: sectionId,
  });

  // Check for achievements based on progress
  const achievements = [];

  // Check if this is their first learning section visit
  if (uniqueSections.size === 1) {
    const { data: learningStarterAchievement } = await supabase
      .from('achievements')
      .select('id')
      .eq('name', 'Learning Starter')
      .single();

    if (learningStarterAchievement) {
      achievements.push({
        user_id: userId,
        achievement_id: learningStarterAchievement.id,
      });
    }
  }

  // Check if they've visited all main sections
  if (uniqueSections.size >= 5) {
    const { data: learningMasterAchievement } = await supabase
      .from('achievements')
      .select('id')
      .eq('name', 'Learning Master')
      .single();

    if (learningMasterAchievement) {
      achievements.push({
        user_id: userId,
        achievement_id: learningMasterAchievement.id,
      });
    }
  }

  // Unlock achievements if any
  if (achievements.length > 0) {
    await supabase.from('user_achievements').insert(achievements);
  }

  return achievements;
}
