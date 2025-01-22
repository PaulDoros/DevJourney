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
import { CodePreview } from './CodePreview';
import { ComponentPreview } from './ComponentPreview';
import { useSubmit } from '@remix-run/react';
import type { ShowcaseComponent } from '~/types/showcase';

const SHOWCASE_COMPONENTS: ShowcaseComponent[] = [
  {
    id: 'use-optimistic',
    name: 'useOptimistic',
    description: 'Learn how to implement optimistic updates in React 19',
    code: `function Counter() {
  const [count, setCount] = useState(0);
  const [pending, optimisticCount] = useOptimistic(
    count,
    (state, value) => state + value
  );

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {optimisticCount}
    </button>
  );
}`,
    preview: 'OptimisticCounter',
  },
  {
    id: 'use-hook',
    name: 'use hook',
    description: 'Explore the new use hook for data fetching',
    code: `function UserProfile({ userId }) {
  const user = use(fetchUser(userId));
  return <div>{user.name}</div>;
}`,
    preview: 'UseHookDemo',
  },
  // Add more showcase components
];

export function ComponentShowcase() {
  const [activeComponent, setActiveComponent] = useState(
    SHOWCASE_COMPONENTS[0],
  );
  const submit = useSubmit();

  // Track component interaction for achievements
  const trackInteraction = (componentId: string) => {
    submit(
      { action: 'track-component', componentId },
      { method: 'post', navigate: false },
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <Tabs defaultValue={SHOWCASE_COMPONENTS[0].id} className="space-y-4">
        <TabsList className="flex w-full flex-wrap gap-2">
          {SHOWCASE_COMPONENTS.map((component) => (
            <TabsTrigger
              key={component.id}
              value={component.id}
              onClick={() => {
                setActiveComponent(component);
                trackInteraction(component.id);
              }}
              className="flex-shrink-0"
            >
              {component.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {SHOWCASE_COMPONENTS.map((component) => (
          <TabsContent key={component.id} value={component.id}>
            {/* Stack on mobile, grid on desktop */}
            <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
              {/* Live Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Live Preview</h3>
                <ComponentPreview
                  component={component}
                  onInteraction={() => trackInteraction(component.id)}
                />
              </div>

              {/* Code Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Code</h3>
                <div className="max-h-[300px] overflow-auto">
                  <CodePreview code={component.code} />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-medium">About</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                {component.description}
              </p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
