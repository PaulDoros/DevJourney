import { createServerSupabase } from '~/utils/supabase';
import { unlockAchievement } from '~/services/achievements.server';

const GETTING_STARTED_STEPS = [
  'install-vscode',
  'install-nodejs',
  'install-pnpm',
  'create-remix-project',
  'install-dependencies',
  'start-dev-server',
];

export async function checkAndUnlockLearningAchievement(
  request: Request,
  userId: string,
  sectionId: string,
) {
  const { supabase } = createServerSupabase(request);

  // Track the progress
  const { error: progressError } = await supabase
    .from('learning_progress')
    .upsert(
      {
        user_id: userId,
        section_id: sectionId,
        visited_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,section_id' },
    );

  if (progressError) {
    console.error('Error tracking learning progress:', progressError);
    return;
  }

  // Get user's progress
  const { data: progress } = await supabase
    .from('learning_progress')
    .select('section_id')
    .eq('user_id', userId);

  if (!progress) return;

  const completedSections = progress.map((p) => p.section_id);

  // Check for Getting Started achievements
  const gettingStartedProgress = GETTING_STARTED_STEPS.filter((step) =>
    completedSections.includes(step),
  ).length;

  // Unlock achievements based on progress
  if (gettingStartedProgress === 1) {
    await unlockAchievement(request, userId, 'getting-started-beginner');
  }

  if (gettingStartedProgress === 3) {
    await unlockAchievement(request, userId, 'getting-started-intermediate');
  }

  if (gettingStartedProgress === GETTING_STARTED_STEPS.length) {
    await unlockAchievement(request, userId, 'getting-started-master');
  }

  // Check for achievements based on progress
  const achievements = [];

  // Check if this is their first learning section visit
  if (completedSections.length === 1) {
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
  if (completedSections.length >= 5) {
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
