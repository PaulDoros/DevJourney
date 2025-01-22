import { json, type ActionFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';
import { checkAndUnlockAchievement } from '~/services/achievements.server';

const COMPONENT_ACHIEVEMENT_MAP: Record<string, string> = {
  'use-fetcher': 'Remix Explorer',
  'loader-data': 'Data Master',
  'form-validation': 'Form Wizard',
  'nested-routing': 'Route Master',
};

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const componentId = formData.get('componentId') as string;

  try {
    const achievementName = COMPONENT_ACHIEVEMENT_MAP[componentId];
    if (!achievementName) {
      return json({ error: 'Invalid component' }, { status: 400 });
    }

    // Check and unlock the corresponding achievement
    await checkAndUnlockAchievement(request, user.id, achievementName);

    return json({ success: true });
  } catch (error) {
    console.error('Achievement tracking error:', error);
    return json({ error: 'Failed to track achievement' }, { status: 500 });
  }
}
