import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useLocation,
  useLoaderData,
  LiveReload,
} from '@remix-run/react';
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { AnimatePresence } from 'framer-motion';

import './tailwind.css';
import stylesheet from '~/styles/app.css?url';

import { ThemeProvider, NonFlashOfWrongThemeEls } from './utils/theme-provider';
import { ScreenSizeIndicator } from '~/components/ScreenSizeIndicator';
import { getErrorMessage } from '~/utils/errorMessages';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { PageTransition } from './components/PageTransition';
import { getTheme } from '~/utils/theme.server';
import { createServerSupabase } from '~/utils/supabase';
import { ToastProvider } from '~/context/ToastContext';
import { GuestBanner } from '~/components/GuestBanner';
import { getUserFromSession } from '~/utils/auth.server';

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

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = createServerSupabase(request);

  try {
    const [
      {
        data: { session },
      },
      theme,
      user,
    ] = await Promise.all([
      supabase.auth.getSession(),
      getTheme(request),
      getUserFromSession(request),
    ]);

    // Combine session data with user data
    const sessionData = session
      ? {
          ...session,
          user: {
            ...session.user,
            ...user,
          },
        }
      : null;

    return Response.json(
      {
        session: sessionData,
        theme,
        user,
      },
      { headers: response.headers },
    );
  } catch (error) {
    console.error('Loader error:', error);
    return Response.json(
      {
        session: null,
        theme: 'light', // default theme
        user: null,
      },
      { headers: response.headers },
    );
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: themeBlockingScript }} />
        <Meta />
        <Links />
        <NonFlashOfWrongThemeEls />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>
            {children}
            <ScreenSizeIndicator />
          </ToastProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
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
            <p className="mb-6 text-center text-light-text retro:text-retro-text multi:text-black dark:text-dark-text">
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
