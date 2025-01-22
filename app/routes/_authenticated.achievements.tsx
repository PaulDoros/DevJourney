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

  // Get user achievements
  const userAchievements = await getUserAchievements(request, user.id);

  // Get all achievements
  const { data: allAchievements } = await supabase
    .from('achievements')
    .select('*')
    .order('points', { ascending: false });

  return json({
    userAchievements,
    allAchievements,
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
