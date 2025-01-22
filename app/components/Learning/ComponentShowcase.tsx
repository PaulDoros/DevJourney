/**
 * A showcase section demonstrating various React components with live examples
 * and code snippets. Each interaction with a component can unlock achievements.
 *
 * Features:
 * - Live component preview
 * - Code snippets with syntax highlighting
 * - Interactive examples
 * - Achievement tracking
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/Tabs';
import { CodePreview } from '~/components/Learning/CodePreview';
import { ComponentPreview } from '~/components/Learning/ComponentPreview';
import { useFetcher } from '@remix-run/react';
import { Button } from '~/components/ui/Button';
import { CodeEditor } from '~/components/Learning/CodeEditor';

interface ShowcaseComponent {
  id: string;
  name: string;
  description: string;
  code: string;
  achievement?: string;
}

const SHOWCASE_COMPONENTS: ShowcaseComponent[] = [
  {
    id: 'use-fetcher',
    name: 'useFetcher Demo',
    description: `The useFetcher hook is perfect for non-navigation mutations and data updates. Use it when you want to:
    • Update data without page navigation
    • Handle optimistic UI updates
    • Submit forms without full page reloads
    • Make API calls in the background`,
    achievement: 'Remix Explorer',
    code: `function LikeButton() {
  const fetcher = useFetcher();
  const isOptimistic = fetcher.state === 'submitting';

  return (
    <fetcher.Form method="post">
      <button disabled={isOptimistic}>
        {isOptimistic ? 'Liking...' : 'Like'}
      </button>
    </fetcher.Form>
  );
}`,
  },
  {
    id: 'loader-data',
    name: 'useLoaderData',
    description: `useLoaderData provides type-safe server data in your components. Best for:
    • Server-side data fetching
    • SEO-friendly content
    • Initial page load data
    • Secure data access with server-side validation`,
    achievement: 'Data Master',
    code: `export async function loader() {
  // Server-side code
  const data = await db.getItems();
  return json({ items: data });
}

export default function Items() {
  // Client-side code with full type safety
  const { items } = useLoaderData<typeof loader>();
  return <ItemList items={items} />;
}`,
  },
  {
    id: 'form-validation',
    name: 'Form Validation',
    description: `Remix forms provide built-in server validation with client feedback. Perfect for:
    • User input validation
    • File uploads
    • Complex form submissions
    • Progressive enhancement`,
    achievement: 'Form Wizard',
    code: `export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  const email = form.get('email');
  
  if (!isValidEmail(email)) {
    return json(
      { error: 'Invalid email' },
      { status: 400 }
    );
  }
  
  // Process valid data
  return json({ success: true });
}`,
  },
  {
    id: 'nested-routing',
    name: 'Nested Routing',
    description: `Nested routes in Remix enable powerful layout composition. Use them for:
    • Shared layouts across routes
    • Parallel data loading
    • URL-driven state management
    • Complex UI hierarchies`,
    achievement: 'Route Master',
    code: `// routes/_app.tsx (Parent Layout)
export default function AppLayout() {
  return (
    <div className="layout">
      <nav>{/* Shared Navigation */}</nav>
      <Outlet /> {/* Child Routes Render Here */}
    </div>
  );
}

// routes/_app.dashboard.tsx (Nested Route)
export default function Dashboard() {
  return <div>Dashboard Content</div>;
}`,
  },
];

export function ComponentShowcase() {
  const [activeComponent, setActiveComponent] = useState(
    SHOWCASE_COMPONENTS[0],
  );
  const achievementFetcher = useFetcher();

  const handleInteraction = (componentId: string) => {
    achievementFetcher.submit(
      { componentId },
      { method: 'POST', action: '/api/track-achievement' },
    );
  };

  return (
    <div className="rounded-lg border border-gray-300 bg-light-secondary p-6 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary">
      <Tabs defaultValue={SHOWCASE_COMPONENTS[0].id} className="space-y-4">
        {/* Make tabs scrollable on mobile */}
        <div className="-mx-6 overflow-x-auto px-6 pb-3 sm:-mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
          <TabsList className="w-max sm:w-full">
            {SHOWCASE_COMPONENTS.map((component) => (
              <TabsTrigger
                key={component.id}
                value={component.id}
                onClick={() => {
                  setActiveComponent(component);
                  handleInteraction(component.id);
                }}
              >
                {component.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {SHOWCASE_COMPONENTS.map((component) => (
          <TabsContent key={component.id} value={component.id}>
            {/* Stack on mobile, grid on desktop */}
            <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
              {/* Live Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preview</h3>
                <div className="rounded-md border p-4">
                  <ComponentPreview componentId={component.id} />
                </div>
              </div>

              {/* Code Editor */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Try it yourself</h3>
                <CodeEditor
                  initialCode={component.code}
                  componentId={component.id}
                  onSuccess={() => handleInteraction(component.id)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <p className="whitespace-pre-line text-sm text-light-text/80 retro:text-retro-text/80 multi:text-white/80 dark:text-dark-text/80">
                {component.description}
              </p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
