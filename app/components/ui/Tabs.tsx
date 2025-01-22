import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '~/lib/utils';

export const Tabs = TabsPrimitive.Root;
export const TabsList = TabsPrimitive.List;
export const TabsTrigger = TabsPrimitive.Trigger;
export const TabsContent = TabsPrimitive.Content;

// Add styling
TabsList.defaultProps = {
  className: 'flex gap-2 border-b border-gray-200 dark:border-gray-700',
};

TabsTrigger.defaultProps = {
  className: cn(
    'px-4 py-2 text-sm font-medium',
    'text-light-text/70 hover:text-light-text',
    'retro:text-retro-text/70 retro:hover:text-retro-text',
    'multi:text-white/70 multi:hover:text-white',
    'dark:text-dark-text/70 dark:hover:text-dark-text',
    'border-b-2 border-transparent',
    'data-[state=active]:border-light-accent',
    'data-[state=active]:text-light-text',
    'retro:data-[state=active]:border-retro-accent',
    'multi:data-[state=active]:border-multi-accent',
    'dark:data-[state=active]:border-dark-accent',
  ),
};
