import { createContext, useContext, useCallback, ReactNode } from 'react';
import { toast, ToastContainer, TypeOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cn } from '~/lib/utils';
import { useTheme } from '~/utils/theme-provider';

type ToastContextType = {
  showToast: (message: string, type?: TypeOptions) => void;
  showAchievement: (title: string, description: string) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Toast Provider Component
 *
 * Provides global toast notification functionality:
 *
 * Usage Examples:
 * 1. Regular Notifications:
 *    - Success messages
 *    - Error alerts
 *    - Information updates
 *    - Warning messages
 *
 * 2. Achievement Notifications:
 *    - Unlocked achievements
 *    - Level ups
 *    - Milestone completions
 *
 * 3. Status Updates:
 *    - Operation completion
 *    - Process status
 *    - System notifications
 *
 * 4. Error Handling:
 *    - API errors
 *    - Validation errors
 *    - System errors
 *
 * Implementation:
 * ```tsx
 * const { showToast, showAchievement } = useToast()
 *
 * // Regular toast
 * showToast('Operation completed!', 'success')
 *
 * // Achievement toast
 * showAchievement('Level Up!', 'You reached level 10')
 *
 * // Error toast
 * showError('Failed to save changes')
 * ```
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const showToast = useCallback(
    (message: string, type: TypeOptions = 'default') => {
      toast(message, {
        type,
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    },
    [],
  );

  const showAchievement = useCallback((title: string, description: string) => {
    toast(
      <div className="flex items-center gap-4 p-2 pr-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-yellow-900"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
          </svg>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-lg font-bold">{title}</span>

          <span className="text-sm opacity-90">{description}</span>
        </div>
      </div>,
      {
        position: 'top-right',

        autoClose: 5000,

        hideProgressBar: false,

        closeOnClick: true,

        pauseOnHover: true,

        draggable: true,

        className:
          'bg-violet-600/95 text-white border border-violet-400/30 dark:bg-indigo-600/95 dark:text-white dark:border-indigo-400/30 retro:bg-retro-accent/95 retro:text-retro-text retro:border-retro-accent/30 multi:bg-gradient-to-r multi:from-fuchsia-600 multi:via-purple-600 multi:to-pink-600 multi:text-white multi:border-white/30',
      },
    );
  }, []);

  const showError = useCallback(
    (message: string) => {
      showToast(message, 'error');
    },
    [showToast],
  );

  const showSuccess = useCallback(
    (message: string) => {
      showToast(message, 'success');
    },
    [showToast],
  );

  const showInfo = useCallback(
    (message: string) => {
      showToast(message, 'info');
    },
    [showToast],
  );

  const showWarning = useCallback(
    (message: string) => {
      showToast(message, 'warning');
    },
    [showToast],
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showAchievement,
        showError,
        showSuccess,
        showInfo,
        showWarning,
      }}
    >
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        limit={3}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="fixed !right-4 !top-4 !z-[9999] w-auto max-w-[420px]"
        toastClassName={(context?: {
          type?: TypeOptions;

          defaultClassName?: string;

          rtl?: boolean;
        }) =>
          cn(
            'relative flex min-h-[64px] justify-between overflow-hidden rounded-lg p-4 cursor-pointer backdrop-blur-sm bg-opacity-95 border',
            // Default type
            context?.type === 'default' &&
              'bg-light-accent/90 text-light-text border-light-accent/30 dark:bg-dark-accent/90 dark:text-dark-text dark:border-dark-accent/30 retro:bg-retro-accent/95 retro:text-retro-text retro:border-retro-accent/30 multi:bg-gradient-to-r multi:from-multi-gradient-3 multi:via-multi-gradient-1 multi:to-multi-gradient-2 multi:text-white multi:border-white/30',
            // Success type
            context?.type === 'success' &&
              'bg-emerald-600/95 text-white border-emerald-400/50 retro:bg-retro-success/95 retro:text-retro-text retro:border-retro-accent/30',
            // Error type
            context?.type === 'error' &&
              'bg-rose-600/95 text-white border-rose-400/50 retro:bg-retro-error/95 retro:text-retro-text retro:border-retro-accent/30',
            // Info type
            context?.type === 'info' &&
              'bg-sky-600/95 text-white border-sky-400/50 retro:bg-retro-info/95 retro:text-retro-text retro:border-retro-accent/30',
            // Warning type
            context?.type === 'warning' &&
              'bg-amber-600/95 text-white border-amber-400/50 retro:bg-retro-warning/95 retro:text-retro-text retro:border-retro-accent/30',
          )
        }
      />
    </ToastContext.Provider>
  );
}

/**
 * Custom hook to use toast notifications
 *
 * @returns {ToastContextType} Toast functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { showSuccess, showError } = useToast()
 *
 *   const handleSave = async () => {
 *     try {
 *       await saveData()
 *       showSuccess('Changes saved successfully!')
 *     } catch (error) {
 *       showError('Failed to save changes')
 *     }
 *   }
 *
 *   return <button onClick={handleSave}>Save</button>
 * }
 * ```
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
