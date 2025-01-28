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

  // Fetch achievement IDs first
  const { data: gettingStartedAchievements } = await supabase
    .from('achievements')
    .select('id, name')
    .in('name', [
      'Getting Started Beginner',
      'Getting Started Intermediate',
      'Getting Started Master',
      'Learning Starter',
      'Learning Master',
    ]);

  if (!gettingStartedAchievements) return;

  const achievementMap = new Map(
    gettingStartedAchievements.map((a) => [a.name, a.id]),
  );

  // Unlock achievements based on progress
  if (gettingStartedProgress === 1) {
    const achievementId = achievementMap.get('Getting Started Beginner');
    if (achievementId) {
      await unlockAchievement(request, userId, achievementId);
    }
  }

  if (gettingStartedProgress === 3) {
    const achievementId = achievementMap.get('Getting Started Intermediate');
    if (achievementId) {
      await unlockAchievement(request, userId, achievementId);
    }
  }

  if (gettingStartedProgress === GETTING_STARTED_STEPS.length) {
    const achievementId = achievementMap.get('Getting Started Master');
    if (achievementId) {
      await unlockAchievement(request, userId, achievementId);
    }
  }

  // Check for general learning achievements
  const achievements = [];

  // Check if this is their first learning section visit
  if (completedSections.length === 1) {
    const learningStarterId = achievementMap.get('Learning Starter');
    if (learningStarterId) {
      achievements.push({
        user_id: userId,
        achievement_id: learningStarterId,
      });
    }
  }

  // Check if they've visited all main sections
  if (completedSections.length >= 5) {
    const learningMasterId = achievementMap.get('Learning Master');
    if (learningMasterId) {
      achievements.push({
        user_id: userId,
        achievement_id: learningMasterId,
      });
    }
  }

  // Unlock achievements if any
  if (achievements.length > 0) {
    await supabase.from('user_achievements').insert(achievements);
  }

  return achievements;
}
