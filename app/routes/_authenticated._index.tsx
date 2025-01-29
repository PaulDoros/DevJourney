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

import { Link } from '@remix-run/react';
import { createServerSupabase } from '~/utils/supabase';
import type { UserAchievement } from '~/types/achievements';

import { AchievementsProgress } from '~/components/Achievements/AchievementsProgress';
import { AchievementTester } from '~/components/Achievements/AchievementTester';
import { cardClasses, textClasses } from '~/utils/theme-classes';
import { cn } from '~/lib/utils';

// Define the type for Supabase response
interface SupabaseAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement: {
    id: string;
    name: string;
    description: string;
    points: number;
    component_id: string | null;
    icon_url: string | null;
    created_at: string;
  };
}

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

  const totalPoints = userAchievements.reduce(
    (total, ua) => total + (ua.achievement?.points || 0),
    0,
  );

  return json({
    user,
    userAchievements,
    allAchievements,
    totalPoints,
  });
}

export default function Index() {
  const { user, totalPoints } = useLoaderData<typeof loader>();

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
        {/* <AchievementTester /> */}
        {/* Achievements Progress */}
        {/* <section className="mb-8"> */}
        {/* <h2 className="mb-4 text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90">
            Your Progress
          </h2> */}
        {/* <div className="rounded-lg border border-gray-300 bg-light-secondary p-6 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary">
            <AchievementsProgress
              userAchievements={userAchievements}
              allAchievements={allAchievements}
            />
          </div> */}
        {/* </section> */}

        {/* Interactive Components Section */}
        <section className="space-y-4">
          <h2 className={cn('text-xl font-semibold', textClasses.primary)}>
            Start Learning
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/learn/getting-started"
              className={cn('group', cardClasses.interactive)}
            >
              <h3
                className={cn(
                  'mb-2 text-lg font-semibold',
                  textClasses.primary,
                  'group-hover:text-light-accent retro:group-hover:text-retro-accent multi:group-hover:text-multi-accent dark:group-hover:text-dark-accent',
                )}
              >
                Learning Path →
              </h3>
              <p className={textClasses.secondary}>
                Start your journey by learning about our tech stack, tools, and
                best practices.
              </p>
            </Link>
            <Link
              to="/learn/tech-stack"
              className={cn('group', cardClasses.interactive)}
            >
              <h3
                className={cn(
                  'mb-2 text-lg font-semibold',
                  textClasses.primary,
                  'group-hover:text-light-accent retro:group-hover:text-retro-accent multi:group-hover:text-multi-accent dark:group-hover:text-dark-accent',
                )}
              >
                Tech Stack →
              </h3>
              <p className={textClasses.secondary}>
                Explore the technologies we use and why we chose them.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
