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

  useAchievementListener(userAchievements);
  return (
    <Suspense fallback={<DefaultErrorFallback />}>
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </AnimatePresence>
    </Suspense>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const location = useLocation();
  const navigation = useNavigation();

  // Don't show error page for navigation loading states
  if (navigation.state === 'loading') {
    return null;
  }

  // Handle route errors differently
  if (isRouteErrorResponse(error)) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <DefaultErrorFallback error={error} />
          <Scripts />
          <ScrollRestoration />
        </body>
      </html>
    );
  }

  // For other errors, show a generic error page
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <DefaultErrorFallback
          error={error as Error}
          message="An unexpected error occurred"
        />
        <Scripts />
        <ScrollRestoration />
      </body>
    </html>
  );
}
