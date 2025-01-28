import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/node';
import { typedjson } from 'remix-typedjson';
import { requireUser } from '~/utils/session.server';
import { unlockAchievement } from '~/services/achievements.server';
import { createServerSupabase } from '~/utils/supabase';
import type { Achievement } from '~/types/achievements';

// Type for our achievements mapping
export type AchievementsMap = {
  [category: string]: {
    [name: string]: string; // achievement ID
  };
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = createServerSupabase(request);

  const { data: achievements, error } = await supabase
    .from('achievements')
    .select('*')
    .order('points', { ascending: false });

  if (error) {
    console.error('Error loading achievements:', error);
    return typedjson({ achievements: [] });
  }

  return typedjson({ achievements: achievements || [] });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const achievementId = formData.get('achievementId') as string;
  const context = formData.get('context') as string;

  if (!achievementId) {
    return typedjson({ error: 'Achievement ID is required' }, { status: 400 });
  }

  try {
    const result = await unlockAchievement(request, user.id, achievementId);
    return typedjson({
      success: result.success,
      alreadyUnlocked: result.alreadyUnlocked,
      context,
    });
  } catch (error) {
    console.error('Achievement unlock error:', error);
    return typedjson(
      { error: 'Failed to process achievement' },
      { status: 500 },
    );
  }
}
