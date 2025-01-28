import { Outlet, useLocation, useLoaderData } from '@remix-run/react';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/Tabs';
import { Link } from '@remix-run/react';
import { textClasses, cardClasses } from '~/utils/theme-classes';
import { cn } from '~/lib/utils';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';
import { trackLearningSection } from '~/services/achievements.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const url = new URL(request.url);
  const section = url.pathname.split('/')[2]; // Get section from URL: /learn/[section]

  if (section) {
    await trackLearningSection(request, user.id, section);
  }

  return json({ user });
}

export default function LearnRoute() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
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
        <TabsList className="mb-8">
          <Link to="/learn/getting-started">
            <TabsTrigger value="/learn/getting-started">
              Getting Started
            </TabsTrigger>
          </Link>
          <Link to="/learn/tech-stack">
            <TabsTrigger value="/learn/tech-stack">Tech Stack</TabsTrigger>
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

        <div className={cn('rounded-lg border p-6', cardClasses.base)}>
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
}
