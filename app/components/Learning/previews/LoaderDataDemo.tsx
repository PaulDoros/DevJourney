import { useLoaderData } from '@remix-run/react';
import { Button } from '~/components/ui/Button';

export default function LoaderDataDemo() {
  return (
    <div className="space-y-2">
      <div className="text-sm">Demo: Data Loading</div>
      <Button>Fetch Data</Button>
    </div>
  );
}
