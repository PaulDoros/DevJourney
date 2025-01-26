import { useState } from 'react';
import { useOptimistic } from 'react';
import { Button } from '~/components/ui/Button';

export default function OptimisticCounter() {
  const [count, setCount] = useState(0);
  const [pending, optimisticCount] = useOptimistic(
    count,
    (state: number, value: number) => state + value,
  );

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <Button
        onClick={() => {
          // Simulate network delay
          setTimeout(() => setCount(count + 1), 1000);
        }}
        disabled={pending}
        className="w-full sm:w-auto"
      >
        Increment
      </Button>
      <span className="text-sm sm:text-base">Count: {optimisticCount}</span>
    </div>
  );
}
