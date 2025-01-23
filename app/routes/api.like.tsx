import { json, type ActionFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';
import { createServerSupabase } from '~/utils/supabase';
import { checkAndUnlockAchievement } from '~/services/achievements.server';

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const { supabase } = createServerSupabase(request);

  try {
    // Simulate a delay to show optimistic UI
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Randomly succeed or fail to demonstrate error handling
    if (Math.random() > 0.8) {
      return json(
        { error: 'Failed to like. Please try again.' },
        { status: 500 },
      );
    }

    // Check if user has earned the "Remix Explorer" achievement
    await checkAndUnlockAchievement(request, user.id, 'Remix Explorer');

    return json({ success: true });
  } catch (error) {
    console.error('Like action error:', error);
    return json({ error: 'Failed to process like' }, { status: 500 });
  }
}
