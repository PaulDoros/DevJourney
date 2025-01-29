import { cn } from '~/lib/utils';

// Base theme classes for containers/cards
export const baseContainerClasses = cn(
  // Light theme
  'bg-light-primary border-gray-300',
  // Retro theme
  'retro:bg-retro-primary retro:border-retro-text/30',
  // Multi theme
  'multi:multi-card multi:border-white/50',
  // Dark theme
  'dark:bg-dark-primary dark:border-gray-600',
);

// Secondary containers (sidebar, cards, etc.)
export const secondaryContainerClasses = cn(
  // Light theme
  'bg-light-secondary border-gray-300',
  // Retro theme
  'retro:bg-retro-secondary retro:border-retro-text/30',
  // Multi theme
  'multi:bg-multi-primary/60 multi:backdrop-blur-sm multi:border-white/50',
  // Dark theme
  'dark:bg-dark-secondary dark:border-gray-600',
);

// Text classes
export const textClasses = {
  // Primary text
  primary: cn(
    'text-light-text',
    'retro:text-retro-text',
    'multi:text-white multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]',
    'dark:text-dark-text',
  ),
  // Secondary/muted text
  secondary: cn(
    'text-light-text/70',
    'retro:text-retro-text/70',
    'multi:text-white/70',
    'dark:text-dark-text/70',
  ),
  // Accent text
  accent: cn(
    'text-light-accent',
    'retro:text-retro-accent',
    'multi:text-multi-accent',
    'dark:text-dark-accent',
  ),
};

// Interactive element classes (buttons, links)
export const interactiveClasses = {
  // Base interactive element
  base: cn(
    // Light theme
    'text-light-text hover:text-light-accent',
    // Retro theme
    'retro:text-retro-text retro:hover:text-retro-accent',
    // Multi theme
    'multi:text-white multi:hover:text-white/80',
    // Dark theme
    'dark:text-dark-text dark:hover:text-dark-accent',
  ),
  // Accent interactive element
  accent: cn(
    // Light theme
    'text-light-accent hover:text-light-accent/80',
    // Retro theme
    'retro:text-retro-accent retro:hover:text-retro-accent/80',
    // Multi theme
    'multi:text-multi-accent multi:hover:text-multi-accent/80',
    // Dark theme
    'dark:text-dark-accent dark:hover:text-dark-accent/80',
  ),
};

// Border classes
export const borderClasses = {
  // Default border
  default: cn(
    'border-gray-300',
    'retro:border-retro-text/30',
    'multi:border-white/50',
    'dark:border-gray-600',
  ),
  // Accent border
  accent: cn(
    'border-light-accent',
    'retro:border-retro-accent',
    'multi:border-multi-accent',
    'dark:border-dark-accent',
  ),
};

// Card classes with hover effects
export const cardClasses = {
  // Base card
  base: cn(secondaryContainerClasses, 'rounded-lg border p-4 transition-all'),
  // Interactive card with hover effects
  interactive: cn(
    secondaryContainerClasses,
    'rounded-lg border p-4 transition-all',
    'hover:border-light-accent',
    'retro:hover:border-retro-accent',
    'multi:hover:border-multi-accent',
    'dark:hover:border-dark-accent',
  ),
};

// Tab classes
export const tabClasses = {
  // List container
  list: cn(
    // Light theme
    'bg-light-secondary border-gray-300',
    // Retro theme
    'retro:bg-retro-secondary retro:border-retro-text/30',
    // Multi theme
    'multi:bg-multi-primary/40 multi:backdrop-blur-sm',
    // Dark theme
    'dark:bg-dark-secondary dark:border-gray-600',
  ),
  // Individual tab
  tab: {
    base: cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all',
      // Light theme
      'text-light-text/70 hover:text-light-text',
      'data-[state=active]:bg-light-primary data-[state=active]:text-light-text',
      // Retro theme
      'retro:text-retro-text/70 retro:hover:text-retro-text',
      'retro:data-[state=active]:bg-retro-primary retro:data-[state=active]:text-retro-text',
      // Multi theme
      'multi:text-white/70 multi:hover:text-white',
      'multi:data-[state=active]:bg-white/10 multi:data-[state=active]:text-white',
      // Dark theme
      'dark:text-dark-text/70 dark:hover:text-dark-text',
      'dark:data-[state=active]:bg-dark-primary dark:data-[state=active]:text-dark-text',
      // Focus styles
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-accent',
      'retro:focus-visible:ring-retro-accent',
      'multi:focus-visible:ring-multi-accent',
      'dark:focus-visible:ring-dark-accent',
    ),
    disabled: 'pointer-events-none opacity-50',
  },
};
