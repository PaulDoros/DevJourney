import { lazy, Suspense } from 'react';
import type { ShowcaseComponent } from '~/types/showcase';

const components = {
  OptimisticCounter: lazy(() => import('./previews/OptimisticCounter')),
  UseHookDemo: lazy(() => import('./previews/UseHookDemo')),
  // Add more components as needed
};

interface ComponentPreviewProps {
  component: ShowcaseComponent;
  onInteraction: () => void;
}

export function ComponentPreview({
  component,
  onInteraction,
}: ComponentPreviewProps) {
  const PreviewComponent =
    components[component.preview as keyof typeof components];

  return (
    <div
      className="min-h-[200px] rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:p-6"
      onClick={onInteraction}
    >
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        }
      >
        <PreviewComponent />
      </Suspense>
    </div>
  );
}
