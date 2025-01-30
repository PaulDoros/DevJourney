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
  useNavigation,
} from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { lazy, Suspense, useEffect, useRef } from 'react';

import './tailwind.css';
import stylesheet from '~/styles/app.css?url';

import { ThemeProvider, NonFlashOfWrongThemeEls } from './utils/theme-provider';
import { ScreenSizeIndicator } from '~/components/ScreenSizeIndicator';
import { getErrorMessage } from '~/utils/errorMessages';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { DefaultErrorFallback } from '~/components/DefaultErrorFallback';

import { ToastProvider, useToast } from '~/context/ToastContext';
import { getUserFromSession } from '~/utils/auth.server';
import { supabase } from './utils/supabase';
import { UserAchievement } from './types/achievements';
import { useAchievementListener } from './hooks/useAchivementToast';
import { useHydrated } from 'remix-utils/use-hydrated';
import { ThemeSwitcherError } from './components/ThemeSwitcherError';
import { createServerSupabase } from './utils/supabase.server';

// Lazy load components that use Framer Motion
const PageTransition = lazy(() =>
  import('./components/PageTransition').then((mod) => ({
    default: mod.PageTransition,
  })),
);

const AnimatePresence = lazy(() =>
  import('framer-motion').then((mod) => ({
    default: mod.AnimatePresence,
  })),
);

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
  const user = await getUserFromSession(request);

  let userAchievements: UserAchievement[] = [];

  if (user) {
    const { supabase } = createServerSupabase(request);
    const [userAchievementsResponse] = await Promise.all([
      supabase
        .from('user_achievements')
        .select('*, achievement:achievements(*)')
        .eq('user_id', user.id),
    ]);
    userAchievements = userAchievementsResponse.data || [];
  }

  return json({
    user,
    userAchievements,
    ENV: {
      NODE_ENV: process.env.NODE_ENV,
      REMIX_DEV_SERVER_WS_PORT: process.env.REMIX_DEV_SERVER_WS_PORT,
    },
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
  const location = useLocation();
  const { userAchievements } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  useAchievementListener(userAchievements);

  return (
    <div className="relative isolate">
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <PageTransition key={location.key || location.pathname}>
          <Outlet />
        </PageTransition>
      </AnimatePresence>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return (
      <html lang="en" className="h-full">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <script dangerouslySetInnerHTML={{ __html: themeBlockingScript }} />
          <Meta />
          <Links />
        </head>
        <body className="h-full">
          <ThemeProvider>
            <div className="flex min-h-screen flex-col items-center justify-center bg-light-secondary dark:bg-dark-secondary">
              <div className="flex w-full max-w-2xl flex-col items-center justify-center rounded-lg bg-light-primary p-8 shadow-lg dark:bg-dark-primary">
                <div className="h-8 w-8 animate-pulse rounded-full bg-light-accent/20 dark:bg-dark-accent/20" />
              </div>
            </div>
          </ThemeProvider>
          <Scripts />
        </body>
      </html>
    );
  }

  let errorTitle = 'Unexpected Error';
  let errorMessage = 'An unexpected error occurred. Please try again later.';

  if (isRouteErrorResponse(error)) {
    const errorInfo = getErrorMessage(error.status);
    errorTitle = `${error.status} - ${errorInfo.title}`;
    errorMessage = errorInfo.description;
    if (error.data) {
      errorMessage += `\n\nDetails: ${error.data}`;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
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
        <ThemeProvider>
          <div className="flex min-h-screen flex-col items-center justify-center bg-light-secondary retro:bg-retro-secondary multi:bg-gradient-to-br multi:from-multi-gradient-1 multi:via-multi-gradient-2 multi:to-multi-gradient-3 dark:bg-dark-secondary">
            <div className="flex w-full max-w-2xl flex-col items-center justify-center rounded-lg bg-light-primary p-8 shadow-lg retro:bg-retro-primary multi:multi-card dark:bg-dark-primary">
              <h1 className="mb-4 text-4xl font-bold text-light-accent retro:text-retro-accent multi:multi-text-gradient dark:text-dark-accent">
                {errorTitle}
              </h1>
              <p className="mb-6 text-center text-light-text retro:text-retro-text multi:text-black dark:text-dark-text">
                {errorMessage}
              </p>
              <div className="mt-4">
                <a
                  href="/"
                  className="inline-block rounded bg-light-accent px-4 py-2 text-white transition-opacity hover:opacity-90"
                >
                  Return to Home
                </a>
              </div>
            </div>
            <div className="mt-8">
              <ThemeSwitcherError />
            </div>
          </div>
        </ThemeProvider>
        <Scripts />
        <ScrollRestoration />
      </body>
    </html>
  );
}
