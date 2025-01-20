import { PageLayout } from '~/components/layouts/PageLayout';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';
import { Button } from '~/components/ui/Button';
import { UserAvatar } from '~/components/UserAvatar';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  return { user };
}

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();

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
            Learning Progress
          </h2>
          <div className="rounded-lg border border-gray-300 bg-light-secondary p-4 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="h-2 w-full rounded-full bg-light-primary retro:bg-retro-primary multi:bg-white/20 dark:bg-dark-primary">
                <div className="h-full w-3/4 rounded-full bg-light-accent retro:bg-retro-accent multi:bg-multi-accent dark:bg-dark-accent" />
              </div>
              <p className="text-sm text-light-text/80 retro:text-retro-text/80 multi:text-white/80 dark:text-dark-text/80">
                75% of learning path completed
              </p>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90 sm:mb-4 sm:text-xl">
            Achievements
          </h2>
          <div className="rounded-lg border border-gray-300 bg-light-secondary p-4 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary sm:p-6">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-light-primary/50 retro:bg-retro-primary/50 multi:bg-white/10 dark:bg-dark-primary/50"
                />
              ))}
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
