// Import necessary hooks from React for state management and context creation
import { createContext, useContext, useEffect, useState } from 'react';

// Define the available theme options as a union type
// This ensures type safety when setting themes
type Theme = 'light' | 'dark' | 'retro' | 'multi';

// Define the shape of our theme context
// It includes the current theme and a function to update it
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Create a React context to share theme data throughout the app
// Initially undefined, will be populated by ThemeProvider
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'user-theme';

// ThemeProvider component that wraps the app and manages theme state
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || 'light';
  });

  // Persist theme changes to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'retro', 'multi');
    root.classList.add(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Provide theme context to children components
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Add this to prevent flash of wrong theme
export function NonFlashOfWrongThemeEls() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const theme = localStorage.getItem('${THEME_STORAGE_KEY}') ?? 'light';
              document.documentElement.classList.remove('light', 'dark', 'retro', 'multi');
              document.documentElement.classList.add(theme);
            } catch (e) {}
          })();
        `,
      }}
    />
  );
}

// Custom hook to consume theme context
// Throws error if used outside ThemeProvider
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
