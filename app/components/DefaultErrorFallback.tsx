import {
  isRouteErrorResponse,
  useRouteError,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { getErrorMessage } from '~/utils/errorMessages';
import { ThemeSwitcher } from './ThemeSwitcher';

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

export function DefaultErrorFallback() {
  const error = useRouteError();

  let errorTitle: string;
  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    const errorInfo = getErrorMessage(error.status);
    errorTitle = `${error.status} - ${errorInfo.title}`;
    errorMessage = errorInfo.description;

    // If there's a specific error message from the server, append it
    if (error.data) {
      errorMessage += `\n\nDetails: ${error.data}`;
    }
  } else {
    errorTitle = 'Unexpected Error';
    errorMessage =
      error instanceof Error
        ? error.message
        : 'An unknown error occurred. Please try again later.';
  }

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: themeBlockingScript }} />
        <title>{errorTitle}</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="flex min-h-screen flex-col items-center justify-center bg-light-secondary retro:bg-retro-secondary multi:bg-gradient-to-br multi:from-multi-gradient-1 multi:via-multi-gradient-2 multi:to-multi-gradient-3 dark:bg-dark-secondary">
          <div className="flex w-full max-w-2xl flex-col items-center justify-center rounded-lg bg-light-primary p-8 shadow-lg retro:bg-retro-primary multi:multi-card dark:bg-dark-primary">
            <h1 className="mb-4 text-4xl font-bold text-light-accent retro:text-retro-accent multi:multi-text-gradient dark:text-dark-accent">
              {errorTitle}
            </h1>
            <p className="mb-6 whitespace-pre-line text-center text-light-text retro:text-retro-text multi:text-black dark:text-dark-text">
              {errorMessage}
            </p>
            {isRouteErrorResponse(error) && error.status === 404 && (
              <div className="mt-4">
                <a
                  href="/"
                  className="inline-block rounded bg-light-accent from-multi-gradient-1 via-multi-gradient-2 to-multi-gradient-3 px-4 py-2 text-white transition-opacity hover:animate-gradient hover:opacity-90 retro:bg-retro-accent multi:bg-multi-gradient dark:bg-dark-accent"
                >
                  Return to Home
                </a>
              </div>
            )}
          </div>
          <div className="mt-8">
            <ThemeSwitcher />
          </div>
        </div>
        <Scripts />
        <ScrollRestoration />
      </body>
    </html>
  );
}
