import { json, type ActionFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';
import { createServerSupabase } from '~/utils/supabase';
import { unlockAchievement } from '~/services/achievements.server';

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();

  const achievementType = formData.get('achievementType') as string;
  const stepId = formData.get('stepId') as string;
  const cardId = formData.get('cardId') as string;
  const achievementName = formData.get('achievementName') as string;
  const progress = Number(formData.get('progress'));
  const totalSteps = Number(formData.get('totalSteps'));
  const totalCards = Number(formData.get('totalCards'));
  const exampleId = formData.get('exampleId') as string;
  const totalExamples = Number(formData.get('totalExamples'));

  if (!achievementType) {
    return json({ error: 'Achievement type is required' }, { status: 400 });
  }

  try {
    const { supabase } = createServerSupabase(request);

    if (achievementType === 'getting-started') {
      // Get the achievement ID for this step
      const { data: achievement } = await supabase
        .from('achievements')
        .select('id')
        .eq('name', achievementName)
        .single();

      if (achievement) {
        // Unlock the individual step achievement
        await unlockAchievement(request, user.id, achievement.id);
      }

      // Check for progress achievements
      if (progress === Math.floor(totalSteps / 2)) {
        const { data: progressAchievement } = await supabase
          .from('achievements')
          .select('id')
          .eq('name', 'Setup Progress')
          .single();

        if (progressAchievement) {
          await unlockAchievement(request, user.id, progressAchievement.id);
        }
      }

      if (progress === totalSteps) {
        const { data: masterAchievement } = await supabase
          .from('achievements')
          .select('id')
          .eq('name', 'Setup Master')
          .single();

        if (masterAchievement) {
          await unlockAchievement(request, user.id, masterAchievement.id);
        }
      }
    } else if (achievementType === 'tech-stack') {
      // Get the achievement ID for this tech card
      const { data: achievement } = await supabase
        .from('achievements')
        .select('id')
        .eq('name', achievementName)
        .single();

      if (achievement) {
        // Unlock the individual tech achievement
        await unlockAchievement(request, user.id, achievement.id);
      }

      // Check for progress achievements
      if (progress === Math.floor(totalCards / 2)) {
        const { data: progressAchievement } = await supabase
          .from('achievements')
          .select('id')
          .eq('name', 'Tech Explorer')
          .single();

        if (progressAchievement) {
          await unlockAchievement(request, user.id, progressAchievement.id);
        }
      }

      if (progress === totalCards) {
        const { data: masterAchievement } = await supabase
          .from('achievements')
          .select('id')
          .eq('name', 'Tech Stack Master')
          .single();

        if (masterAchievement) {
          await unlockAchievement(request, user.id, masterAchievement.id);
        }
      }
    } else if (achievementType === 'page-visit') {
      // Existing page visit achievement logic
      const { data: starterAchievement } = await supabase
        .from('achievements')
        .select('id')
        .eq('name', 'Learning Starter')
        .single();

      if (starterAchievement) {
        await unlockAchievement(request, user.id, starterAchievement.id);
      }

      // Check for master achievement after 5 sections
      const visitedSections = await getVisitedSections(request, user.id);
      if (visitedSections.length >= 5) {
        const { data: masterAchievement } = await supabase
          .from('achievements')
          .select('id')
          .eq('name', 'Learning Master')
          .single();

        if (masterAchievement) {
          await unlockAchievement(request, user.id, masterAchievement.id);
        }
      }
    } else if (achievementType === 'react-learning') {
      // Get the achievement ID for this example
      const { data: achievement } = await supabase
        .from('achievements')
        .select('id')
        .eq('name', achievementName)
        .single();

      if (achievement) {
        // Unlock the individual example achievement
        await unlockAchievement(request, user.id, achievement.id);
      }

      // Check for progress achievements based on difficulty levels
      const completedExamples = progress;

      // Beginner progress (first 4 examples)
      if (completedExamples === 4) {
        const { data: beginnerAchievement } = await supabase
          .from('achievements')
          .select('id')
          .eq('name', 'React Beginner')
          .single();

        if (beginnerAchievement) {
          await unlockAchievement(request, user.id, beginnerAchievement.id);
        }
      }

      // Intermediate progress (next 4 examples)
      if (completedExamples === 8) {
        const { data: intermediateAchievement } = await supabase
          .from('achievements')
          .select('id')
          .eq('name', 'React Intermediate')
          .single();

        if (intermediateAchievement) {
          await unlockAchievement(request, user.id, intermediateAchievement.id);
        }
      }

      // Advanced progress (all examples)
      if (completedExamples === totalExamples) {
        const { data: advancedAchievement } = await supabase
          .from('achievements')
          .select('id')
          .eq('name', 'React Advanced')
          .single();

        if (advancedAchievement) {
          await unlockAchievement(request, user.id, advancedAchievement.id);
        }

        // Also unlock the master achievement
        const { data: masterAchievement } = await supabase
          .from('achievements')
          .select('id')
          .eq('name', 'React Master')
          .single();

        if (masterAchievement) {
          await unlockAchievement(request, user.id, masterAchievement.id);
        }
      }

      // Check for explorer achievement (trying interactive examples)
      const interactiveExamples = [
        'useState-mastery',
        'useEffect-master',
        'component-pro',
        'context-expert',
        'array-methods',
        'event-handling',
        'search-filter',
        'forms-validation',
        'conditional-rendering',
      ];

      if (interactiveExamples.includes(exampleId)) {
        const { data: explorerAchievement } = await supabase
          .from('achievements')
          .select('id')
          .eq('name', 'React Explorer')
          .single();

        if (explorerAchievement) {
          await unlockAchievement(request, user.id, explorerAchievement.id);
        }
      }
    }

    return json({ success: true });
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return json({ error: 'Failed to unlock achievement' }, { status: 500 });
  }
}

async function getVisitedSections(request: Request, userId: string) {
  const { supabase } = createServerSupabase(request);
  const { data } = await supabase
    .from('learning_progress')
    .select('section_id')
    .eq('user_id', userId);

  return data || [];
}
