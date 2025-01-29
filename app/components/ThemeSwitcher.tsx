// Import the useTheme hook from our theme provider utility
import { useTheme } from '~/utils/theme-provider';

type Theme = 'light' | 'dark' | 'retro' | 'multi';

// ThemeSwitcher component allows users to switch between different theme modes
export function ThemeSwitcher() {
  // Get current theme and setTheme function from our theme context
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleThemeChange('light')}
        className={`rounded-lg p-2 hover:bg-light-accent/10 retro:hover:bg-retro-accent/10 multi:hover:bg-white/10 dark:hover:bg-dark-accent/10 ${
          theme === 'light'
            ? 'bg-light-accent/20 retro:bg-retro-accent/20 multi:bg-white/20 dark:bg-dark-accent/20'
            : ''
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </svg>
      </button>

      <button
        onClick={() => handleThemeChange('dark')}
        className={`rounded-lg p-2 hover:bg-light-accent/10 retro:hover:bg-retro-accent/10 multi:hover:bg-white/10 dark:hover:bg-dark-accent/10 ${
          theme === 'dark'
            ? 'bg-light-accent/20 retro:bg-retro-accent/20 multi:bg-white/20 dark:bg-dark-accent/20'
            : ''
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
      </button>

      <button
        onClick={() => handleThemeChange('retro')}
        className={`rounded-lg p-2 hover:bg-light-accent/10 retro:hover:bg-retro-accent/10 multi:hover:bg-white/10 dark:hover:bg-dark-accent/10 ${
          theme === 'retro'
            ? 'bg-light-accent/20 retro:bg-retro-accent/20 multi:bg-white/20 dark:bg-dark-accent/20'
            : ''
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
          />
        </svg>
      </button>

      <button
        onClick={() => handleThemeChange('multi')}
        className={`rounded-lg p-2 hover:bg-light-accent/10 retro:hover:bg-retro-accent/10 multi:hover:bg-white/10 dark:hover:bg-dark-accent/10 ${
          theme === 'multi'
            ? 'bg-light-accent/20 retro:bg-retro-accent/20 multi:bg-white/20 dark:bg-dark-accent/20'
            : ''
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
          />
        </svg>
      </button>
    </div>
  );
}
