import { createContext, useContext, useCallback, ReactNode } from 'react';
import { toast, ToastContainer, TypeOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const showToast = useCallback(
    (message: string, type: TypeOptions = 'default') => {
      toast(message, {
        type,
        position: 'bottom-right',
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
      <div className="flex flex-col">
        <span className="text-lg font-bold">{title}</span>
        <span className="text-sm">{description}</span>
      </div>,
      {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        className:
          'bg-gradient-to-r from-multi-gradient-1 via-multi-gradient-2 to-multi-gradient-3',
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
      <ToastContainer />
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
