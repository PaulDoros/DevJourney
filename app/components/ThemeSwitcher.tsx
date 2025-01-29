// Import the useTheme hook from our theme provider utility
import { useTheme } from '~/utils/theme-provider';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useCallback } from 'react';
import { debounce } from '~/utils/debounce';
import type { loader } from '~/root';

interface ThemeResponse {
  success?: boolean;
  unlockedAchievement?: any;
}

// ThemeSwitcher component allows users to switch between different theme modes
export function ThemeSwitcher() {
  // Get current theme and setTheme function from our theme context
  const { theme, setTheme } = useTheme();
  const fetcher = useFetcher<ThemeResponse>();
  const { user } = useLoaderData<typeof loader>();

  // Debounce the achievement tracking to prevent too many requests
  const trackThemeChange = useCallback(
    debounce((newTheme: string) => {
      // Only track theme changes if user is logged in
      if (user) {
        fetcher.submit(
          { theme: newTheme },
          { method: 'POST', action: '/api/theme' },
        );
      }
    }, 1000),
    [fetcher, user],
  );
  const handleThemeChange = (
    newTheme: 'light' | 'dark' | 'retro' | 'multi',
  ) => {
    setTheme(newTheme);
    // Only track if theme actually changed
    if (theme !== newTheme) {
      trackThemeChange(newTheme);
    }
  };

  return (
    // Container with flex layout and gap between buttons
    <div className="flex gap-1 md:gap-4">
      {/* Light theme button */}
      <button
        onClick={() => handleThemeChange('light')}
        className={`rounded-md px-4 py-2 ${
          // Apply accent color when light theme is active, otherwise gray
          theme === 'light'
            ? 'bg-light-accent text-white'
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        Light
      </button>

      {/* Dark theme button */}
      <button
        onClick={() => handleThemeChange('dark')}
        className={`rounded-md px-4 py-2 ${
          // Apply accent color when dark theme is active, otherwise gray
          theme === 'dark'
            ? 'bg-dark-accent text-white'
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        Dark
      </button>

      {/* Retro theme button */}
      <button
        onClick={() => handleThemeChange('retro')}
        className={`rounded-md px-4 py-2 ${
          // Apply accent color when retro theme is active, otherwise gray
          theme === 'retro'
            ? 'bg-retro-accent text-white'
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        Retro
      </button>

      {/* Multi-color theme button */}
      <button
        onClick={() => handleThemeChange('multi')}
        className={`rounded-md px-4 py-2 ${
          // Apply accent color when multi theme is active, otherwise gray
          theme === 'multi'
            ? 'bg-multi-accent text-white'
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        Multi
      </button>
    </div>
  );
}
