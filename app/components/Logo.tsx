import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useHydrated } from '~/hooks/useHydrated';
import { cn } from '~/lib/utils';

interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LogoIcon = ({
  className,
  size = 'md',
}: {
  className?: string;
  size?: LogoProps['size'];
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  return (
    <div
      className={cn(
        'relative -ml-1 flex-shrink-0 overflow-visible rounded-xl',
        'bg-gradient-to-br from-light-accent via-light-accent/90 to-light-accent/80',
        'retro:from-retro-accent retro:via-retro-accent/90 retro:to-retro-accent/80',
        'multi:from-multi-accent multi:via-multi-accent/90 multi:to-multi-accent/80',
        'dark:from-dark-accent dark:via-dark-accent/90 dark:to-dark-accent/80',
        sizeClasses[size],
        className,
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-light-primary retro:text-retro-primary multi:text-white dark:text-dark-primary">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 stroke-current"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
    </div>
  );
};

export const Logo = ({
  showText = true,
  size = 'md',
  className,
}: LogoProps) => {
  const isHydrated = useHydrated();
  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const numberSizes = {
    sm: 'text-4xl',
    md: 'text-5xl',
    lg: 'text-6xl',
  };

  const BackgroundNumber = () => (
    <span
      className={cn(
        'absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2',
        'font-mono font-bold',
        // Main number with gradient
        'bg-gradient-to-br from-light-accent/20 to-light-accent/30 bg-clip-text text-transparent',
        'retro:from-retro-accent/20 retro:to-retro-accent/30',
        'multi:from-multi-accent/20 multi:to-multi-accent/30',
        'dark:from-dark-accent/20 dark:to-dark-accent/30',
        // Text stroke effect
        'drop-shadow-[0_0_1px_rgba(0,0,0,0.1)]',
        'retro:drop-shadow-[0_0_1px_rgba(47,24,16,0.1)]',
        'multi:drop-shadow-[0_0_1px_rgba(255,255,255,0.1)]',
        'dark:drop-shadow-[0_0_1px_rgba(255,255,255,0.1)]',
        numberSizes[size],
      )}
      style={{
        WebkitTextStroke: '1px currentColor',
        WebkitTextStrokeColor: 'currentColor',
        WebkitTextFillColor: 'transparent',
      }}
    >
      5
    </span>
  );

  return (
    <Link
      to="/"
      className={cn(
        'relative z-20 flex items-center gap-2',
        'text-light-text hover:text-light-accent',
        'retro:text-retro-text retro:hover:text-retro-accent',
        'multi:text-white multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] multi:hover:text-white/90',
        'dark:text-dark-text dark:hover:text-dark-accent',
        className,
      )}
    >
      <LogoIcon size={size} />
      {showText && (
        <div className="relative h-[28px] overflow-hidden">
          {isHydrated ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="flex items-center"
            >
              <div className="relative flex items-center justify-center">
                <span
                  className={cn(
                    'relative font-semibold tracking-tight',
                    'bg-gradient-to-r from-light-text to-light-text/90 bg-clip-text text-transparent',
                    'retro:from-retro-text retro:to-retro-text/90',
                    'multi:from-white multi:to-white/90',
                    'dark:from-dark-text dark:to-dark-text/90',
                    textSizes[size],
                  )}
                >
                  Dev Journey
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center">
              <div className="relative flex items-center justify-center">
                <span
                  className={cn(
                    'relative font-semibold tracking-tight',
                    'bg-gradient-to-r from-light-text to-light-text/90 bg-clip-text text-transparent',
                    'retro:from-retro-text retro:to-retro-text/90',
                    'multi:from-white multi:to-white/90',
                    'dark:from-dark-text dark:to-dark-text/90',
                    textSizes[size],
                  )}
                >
                  Dev Journey
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </Link>
  );
};

export { LogoIcon };
