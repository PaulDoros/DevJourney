import { json, type ActionFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';
import { checkAndUnlockLearningAchievement } from '~/services/learning-achievements.server';

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const stepId = formData.get('stepId') as string;

  if (!stepId) {
    return json({ error: 'Step ID is required' }, { status: 400 });
  }

  try {
    // Track progress and check for achievements
    await checkAndUnlockLearningAchievement(request, user.id, stepId);

    return json({ success: true });
  } catch (error) {
    console.error('Failed to track learning progress:', error);
    return json(
      { error: 'Failed to track learning progress' },
      { status: 500 },
    );
  }
}
