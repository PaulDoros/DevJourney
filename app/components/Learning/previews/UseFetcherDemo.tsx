import { useFetcher } from '@remix-run/react';
import { Button } from '~/components/ui/Button';
import { useState } from 'react';

interface Props {
  onInteraction: () => void;
}

export default function UseFetcherDemo({ onInteraction }: Props) {
  const fetcher = useFetcher();
  const [liked, setLiked] = useState(false);
  const isOptimistic = fetcher.state === 'submitting';

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      onInteraction();
      fetcher.submit({}, { method: 'post', action: '/api/like' });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-light-text/70 dark:text-dark-text/70">
        Click the button to see optimistic UI in action:
      </p>
      <Button
        onClick={handleLike}
        disabled={isOptimistic || liked}
        className="w-full"
      >
        {isOptimistic ? 'Liking...' : liked ? '👍 Liked!' : '👍 Like'}
      </Button>
      {fetcher.data?.error && (
        <p className="text-sm text-red-500">{fetcher.data.error}</p>
      )}
    </div>
  );
}
