import { isRouteErrorResponse, useRouteError } from '@remix-run/react';

export function DefaultErrorFallback() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-600">
          {error.status} {error.statusText}
        </h1>
        <p className="mt-2 text-gray-600">{error.data}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-red-600">Application Error</h1>
      <p className="mt-2 text-gray-600">
        {error instanceof Error ? error.message : 'Unknown error occurred'}
      </p>
    </div>
  );
}
