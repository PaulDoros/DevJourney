import { useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  maxWidth?: string;
}

/**
 * Modal Component
 *
 * A reusable modal component that supports all four theme variants:
 * - Light theme (default)
 * - Dark theme
 * - Retro theme
 * - Multi theme
 *
 * Uses the native dialog element for accessibility and proper modal behavior.
 */
export function Modal({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = '425px',
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={`/* Light Theme (default) */ /* Dark Theme */ /* Retro Theme */ /* Multi Theme */ /* Common styles */ rounded-lg border border-light-secondary bg-light-primary p-6 text-light-text shadow-lg outline-none backdrop:bg-black/50 retro:border-retro-secondary retro:bg-retro-primary retro:text-retro-text multi:text-multi-text multi:multi-card dark:border-dark-secondary dark:bg-dark-primary dark:text-dark-text`}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div style={{ maxWidth }} className="w-full">
        {title && (
          <div className="mb-6 flex items-center justify-between">
            <h2
              className={`text-lg font-semibold text-light-text retro:text-retro-text multi:text-multi-text dark:text-dark-text`}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className={`text-light-text/70 transition-opacity hover:text-light-text hover:opacity-75 retro:text-retro-text/70 retro:hover:text-retro-text multi:text-multi-text/70 multi:hover:text-multi-text dark:text-dark-text/70 dark:hover:text-dark-text`}
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </dialog>
  );
}
