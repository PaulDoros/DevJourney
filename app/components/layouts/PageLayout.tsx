import { cn } from '~/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PageLayout = ({ children, className }: PageLayoutProps) => {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-1 flex-col gap-2 overflow-y-auto rounded-tl-2xl border p-2 scrollbar-hide md:p-10 md:pb-0',
        'border-gray-300 bg-light-primary',
        'retro:border-retro-text/30 retro:bg-retro-primary',
        'multi:multi-card',
        'dark:border-gray-600 dark:bg-dark-primary',
        className,
      )}
    >
      {children}
    </div>
  );
};
