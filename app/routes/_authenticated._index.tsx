import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { PageLayout } from '~/components/layouts/PageLayout';
// import { LearningPath } from '~/components/Learning/LearningPath';
import { ComponentShowcase } from '~/components/Learning/ComponentShowcase';
// import { OptimisticTodoList } from '~/components/Tasks/OptimisticTodoList';
// import { ThemeBuilder } from '~/components/Themes/ThemeBuilder';
// import { CodeChallenges } from '~/components/Learning/CodeChallenges';
// import { getUserProgress } from '~/services/progress.server';
import { requireUser } from '~/utils/session.server';
import { getUserAchievements } from '~/services/achievements.server';
import { AchievementsProgress } from '~/components/Achievements/AchievementsProgress';
import { Link } from '@remix-run/react';
import { createServerSupabase } from '~/utils/supabase';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const { supabase } = createServerSupabase(request);

  // Get user achievements with component_id
  const { data: achievements } = await supabase
    .from('user_achievements')
    .select(
      `
      id,
      unlocked_at,
      achievement:achievements (
        id,
        name,
        description,
        points,
        component_id,
        icon_url
      )
    `,
    )
    .eq('user_id', user.id)
    .order('unlocked_at', { ascending: false });

  return json({
    user,
    achievements: achievements || [],
    totalPoints: (achievements || []).reduce(
      (total, ua) => total + (ua.achievement?.points || 0),
      0,
    ),
  });
}

export default function Index() {
  const { user, achievements, totalPoints } = useLoaderData<typeof loader>();

  return (
    <PageLayout>
      <div className="h-full w-full px-4 py-6 scrollbar-hide">
        {/* Header Section */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-light-text retro:text-retro-text multi:text-white multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text">
            Welcome, {user.username}!
          </h1>
          <div className="text-right">
            <span className="text-2xl font-bold text-light-accent retro:text-retro-accent multi:text-multi-accent dark:text-dark-accent">
              {totalPoints}
            </span>
            <span className="ml-2 text-sm text-light-text/70 retro:text-retro-text/70 multi:text-white/70 dark:text-dark-text/70">
              points
            </span>
          </div>
        </div>

        {/* Achievements Progress */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90">
            Your Progress
          </h2>
          <div className="rounded-lg border border-gray-300 bg-light-secondary p-6 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary">
            <AchievementsProgress achievements={achievements} />
          </div>
        </section>

        {/* Interactive Components Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90">
            Remix Features
          </h2>
          <ComponentShowcase />
        </section>

        {/* Recent Achievements */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90">
              Recent Achievements
            </h2>
            <Link
              to="/achievements"
              className="text-sm font-medium text-light-accent hover:text-light-accent/80 retro:text-retro-accent retro:hover:text-retro-accent/80 multi:text-multi-accent multi:hover:text-multi-accent/80 dark:text-dark-accent dark:hover:text-dark-accent/80"
            >
              View All →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.slice(0, 3).map((ua) => (
              <div
                key={ua.id}
                className="rounded-lg border border-gray-300 bg-light-secondary p-4 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-light-text retro:text-retro-text multi:text-white dark:text-dark-text">
                      {ua.achievement?.name}
                    </h3>
                    <p className="mt-1 text-sm text-light-text/60 retro:text-retro-text/60 multi:text-white/60 dark:text-dark-text/60">
                      {ua.achievement?.description}
                    </p>
                  </div>
                  <div className="rounded-full bg-light-accent/10 px-2 py-1 text-xs font-medium text-light-accent retro:bg-retro-accent/10 retro:text-retro-accent multi:bg-white/10 multi:text-white dark:bg-dark-accent/10 dark:text-dark-accent">
                    {ua.achievement?.points} pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
