import { Outlet } from '@remix-run/react';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/Tabs';
import { Link, useLocation } from '@remix-run/react';
import { textClasses, cardClasses } from '~/utils/theme-classes';
import { cn } from '~/lib/utils';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';
import { checkAndUnlockLearningAchievement } from '~/services/learning-achievements.server';
import { Layout } from '~/root';
import { PageLayout } from '~/components/layouts/PageLayout';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const url = new URL(request.url);
  const currentSection = url.pathname.split('/').pop() || 'getting-started';

  // Track progress and check for achievements
  await checkAndUnlockLearningAchievement(request, user.id, currentSection);

  return json({ ok: true });
}

export default function LearnRoute() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <PageLayout>
      <h1 className={cn('mb-8 text-4xl font-bold', textClasses.primary)}>
        Learn Dev Journey
      </h1>
      <div className="mb-8">
        <p className={textClasses.secondary}>
          Welcome to the interactive learning section! Here you'll learn about
          all the technologies and tools we used to build Dev Journey, with
          practical examples and hands-on exercises.
        </p>
      </div>

      <Tabs defaultValue={currentPath} className="w-full">
        <div className="mb-2 overflow-x-auto px-6 sm:-mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
          <TabsList className="mb-8">
            <Link to="/learn/getting-started">
              <TabsTrigger value="/learn/getting-started">
                Getting Started
              </TabsTrigger>
            </Link>
            <Link to="/learn/tech-stack">
              <TabsTrigger value="/learn/tech-stack">Tech Stack</TabsTrigger>
            </Link>
            <Link to="/learn/react">
              <TabsTrigger value="/learn/react">React</TabsTrigger>
            </Link>
            <Link to="/learn/remix">
              <TabsTrigger value="/learn/remix">Remix</TabsTrigger>
            </Link>
            <Link to="/learn/tailwind">
              <TabsTrigger value="/learn/tailwind">Tailwind CSS</TabsTrigger>
            </Link>
            <Link to="/learn/supabase">
              <TabsTrigger value="/learn/supabase">Supabase</TabsTrigger>
            </Link>
          </TabsList>
        </div>
        <div className={cn('rounded-lg border p-6', cardClasses.base)}>
          <Outlet />
        </div>
      </Tabs>
    </PageLayout>
  );
}
