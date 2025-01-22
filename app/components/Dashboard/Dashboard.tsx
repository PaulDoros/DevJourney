import { Logo } from '../Logo';

export const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-gray-300 bg-light-primary p-2 retro:border-retro-text/30 retro:bg-retro-primary multi:multi-card dark:border-gray-600 dark:bg-dark-primary md:p-10">
        <div className="flex gap-2">
          {[...new Array(4)].map((_, i) => (
            <div
              key={'first-array' + i}
              className="h-20 w-full animate-pulse rounded-lg bg-light-secondary retro:bg-retro-secondary multi:bg-multi-primary/60 dark:bg-dark-secondary"
            ></div>
          ))}
        </div>{' '}
        <div className="flex flex-1 gap-2">
          {[...new Array(2)].map((_, i) => (
            <div
              key={'second-array' + i}
              className="h-full w-full animate-pulse rounded-lg bg-light-secondary retro:bg-retro-secondary multi:bg-multi-primary/60 dark:bg-dark-secondary"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
