import { PageLayout } from '~/components/layouts/PageLayout';
import { useLoaderData, Link } from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';
import { Button } from '~/components/ui/Button';
import { UserAvatar } from '~/components/UserAvatar';
import { getUserAchievements } from '~/services/achievements.server';
import { cn } from '~/lib/utils';
import { AchievementsProgress } from '~/components/Achievements/AchievementsProgress';
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

// Add this component for achievement display
function AchievementCard({
  achievement,
  unlocked,
}: {
  achievement: { name: string; description: string; points: number };
  unlocked: boolean;
}) {
  return (
    <div
      className={cn(
        'relative flex aspect-square flex-col items-center justify-center gap-1 rounded-lg p-3 text-center',
        unlocked
          ? 'bg-light-accent/10 retro:bg-retro-accent/10 multi:bg-white/20 dark:bg-dark-accent/10'
          : 'bg-light-primary/50 retro:bg-retro-primary/50 multi:bg-white/10 dark:bg-dark-primary/50',
      )}
    >
      {unlocked ? (
        <>
          <span className="text-2xl">🏆</span>
          <span className="text-xs font-medium text-light-text/90 retro:text-retro-text/90 multi:text-white/90 dark:text-dark-text/90">
            {achievement.name}
          </span>
          <span className="text-xs text-light-text/70 retro:text-retro-text/70 multi:text-white/70 dark:text-dark-text/70">
            {achievement.points} pts
          </span>
        </>
      ) : (
        <span className="text-2xl">🔒</span>
      )}
    </div>
  );
}

export default function Profile() {
  const { user, userAchievements, allAchievements, totalPoints } =
    useLoaderData<typeof loader>();

  return (
    <PageLayout>
      {/* Profile Header - Stack on mobile, row on desktop */}
      <div className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <UserAvatar
          username={user.username}
          avatar_url={user.avatar_url}
          size="lg"
        />
        <div>
          <h1 className="text-xl font-bold text-light-text retro:text-retro-text multi:text-white multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text sm:text-2xl">
            {user.username}
          </h1>
          <p className="text-sm text-light-text/70 retro:text-retro-text/70 multi:text-white/70 dark:text-dark-text/70">
            Joined {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Grid layout - Single column on mobile, two columns on desktop */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Progress Section */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90 sm:mb-4 sm:text-xl">
            Achievement Progress
          </h2>
          <div className="rounded-lg border border-gray-300 bg-light-secondary p-4 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary sm:p-6">
            <AchievementsProgress
              userAchievements={userAchievements}
              allAchievements={allAchievements}
            />
          </div>
        </section>

        {/* Achievements Section */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90 sm:text-xl">
              Recent Achievements
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-light-text/70 retro:text-retro-text/70 multi:text-white/70 dark:text-dark-text/70">
                {totalPoints} Points
              </span>
              <Link
                to="/achievements"
                className="text-sm font-medium text-light-accent hover:text-light-accent/80 retro:text-retro-accent retro:hover:text-retro-accent/80 multi:text-multi-accent multi:hover:text-multi-accent/80 dark:text-dark-accent dark:hover:text-dark-accent/80"
              >
                View All →
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-gray-300 bg-light-secondary p-4 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary sm:p-6">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4">
              {userAchievements.map((ua) => (
                <AchievementCard
                  key={ua.achievement?.id}
                  achievement={{
                    name: ua.achievement?.name ?? '',
                    description: ua.achievement?.description ?? '',
                    points: ua.achievement?.points ?? 0,
                  }}
                  unlocked={true}
                />
              ))}
              {/* Add some locked achievements */}
              <AchievementCard
                achievement={{
                  name: 'Theme Master',
                  description: 'Try all themes',
                  points: 100,
                }}
                unlocked={false}
              />
              {/* Add more locked achievements as needed */}
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90 sm:mb-4 sm:text-xl">
            Recent Activity
          </h2>
          <div className="rounded-lg border border-gray-300 bg-light-secondary p-4 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 sm:gap-4">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-light-accent retro:bg-retro-accent multi:bg-multi-accent dark:bg-dark-accent" />
                  <div className="h-4 flex-1 rounded bg-light-primary/50 retro:bg-retro-primary/50 multi:bg-white/10 dark:bg-dark-primary/50" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90 sm:mb-4 sm:text-xl">
            Skills
          </h2>
          <div className="block rounded-lg border border-gray-300 bg-light-secondary p-6 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary">
            <div className="-m-2">
              {[
                'JavaScript',
                'React',
                'TypeScript',
                'Node.js',
                'HTML',
                'CSS',
                'Git',
                'Python',
              ].map((skill) => (
                <div
                  key={skill}
                  className="inline-block rounded-md px-2 py-1.5 text-sm font-medium text-light-text"
                >
                  <Button>{skill}</Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
