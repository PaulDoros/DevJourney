import {
  isRouteErrorResponse,
  useRouteError,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  type ErrorResponse,
} from '@remix-run/react';
import { getErrorMessage } from '~/utils/errorMessages';
import { ThemeSwitcher } from './ThemeSwitcher';
import type { ErrorDescription } from '~/utils/errorMessages';

interface DefaultErrorFallbackProps {
  message?: string;
  error?: Error | Response | ErrorResponse;
}

// Theme blocking script
const themeBlockingScript = `
  (function() {
    let theme = localStorage.getItem('user-theme');
    if (!theme) {
      theme = 'light';
      localStorage.setItem('user-theme', theme);
    }
    document.documentElement.classList.add(theme);
  })();
`;

export function DefaultErrorFallback({
  message,
  error,
}: DefaultErrorFallbackProps) {
  const routeError = error || useRouteError();
  const errorMessage =
    message ||
    (isRouteErrorResponse(routeError)
      ? getErrorMessage(routeError.status).description
      : 'An unexpected error occurred');

  return (
    <div className="bg-background text-foreground flex h-screen flex-col items-center justify-center gap-4 p-4">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold">Oops!</h1>
        <p className="text-muted-foreground text-center">{errorMessage}</p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="bg-muted mt-4 max-w-lg overflow-auto rounded p-4 text-sm">
            {isRouteErrorResponse(routeError)
              ? JSON.stringify(routeError.data, null, 2)
              : routeError instanceof Error
                ? routeError.message
                : 'Unknown error'}
          </pre>
        )}
      </div>
      <div className="mt-4">
        <ThemeSwitcher />
      </div>
    </div>
  );
}
