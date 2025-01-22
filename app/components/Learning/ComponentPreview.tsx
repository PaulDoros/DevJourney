import { lazy, Suspense } from 'react';
import { useFetcher } from '@remix-run/react';
import { Button } from '~/components/ui/Button';
import { useState } from 'react';

const components = {
  'use-fetcher': lazy(() => import('./previews/UseFetcherDemo')),
  'loader-data': lazy(() => import('./previews/LoaderDataDemo')),
  'form-validation': lazy(() => import('./previews/FormValidationDemo')),
  'nested-routing': lazy(() => import('./previews/NestedRoutingDemo')),
};

interface ComponentPreviewProps {
  componentId: string;
}

export function ComponentPreview({ componentId }: ComponentPreviewProps) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const achievementFetcher = useFetcher();

  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      achievementFetcher.submit(
        { componentId },
        { method: 'POST', action: '/api/track-achievement' },
      );
    }
  };

  const Component = components[componentId as keyof typeof components];

  if (!Component) {
    return <div>Preview not available</div>;
  }

  return (
    <div className="space-y-4">
      <Suspense fallback={<div>Loading preview...</div>}>
        <Component onInteraction={handleInteraction} />
      </Suspense>
      {hasInteracted && (
        <div className="mt-2 text-sm text-green-600 dark:text-green-400">
          ✓ Great job! You've tried this feature.
        </div>
      )}
    </div>
  );
}
