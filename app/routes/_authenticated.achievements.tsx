import { PageLayout } from '~/components/layouts/PageLayout';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';
import { getUserAchievements } from '~/services/achievements.server';
import { AchievementsDashboard } from '~/components/Achievements/AchievementsDashboard';
import { createServerSupabase } from '~/utils/supabase';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const { supabase } = createServerSupabase(request);

  const [userAchievementsResponse, allAchievementsResponse] = await Promise.all(
    [
      supabase
        .from('user_achievements')
        .select('*, achievement:achievements(*)')
        .eq('user_id', user.id),
      supabase
        .from('achievements')
        .select('*')
        .order('points', { ascending: false }),
    ],
  );

  const userAchievements = userAchievementsResponse.data || [];
  const allAchievements = allAchievementsResponse.data || [];

  // Calculate total points
  const totalPoints = userAchievements.reduce(
    (total, ua) => total + (ua.achievement?.points || 0),
    0,
  );

  return json({
    userAchievements,
    allAchievements,
    totalPoints,
  });
}

export default function Achievements() {
  const { userAchievements, allAchievements } = useLoaderData<typeof loader>();

  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <AchievementsDashboard
          userAchievements={userAchievements ?? []}
          allAchievements={allAchievements ?? []}
        />
      </div>
    </PageLayout>
  );
}
