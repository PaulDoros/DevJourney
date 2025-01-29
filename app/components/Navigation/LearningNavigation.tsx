import { Link } from '@remix-run/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useSidebar } from '~/components/ui/Sidebar';
import { interactiveClasses, textClasses } from '~/utils/theme-classes';
import { cn } from '~/lib/utils';

const learningRoutes = [
  {
    title: 'Getting Started',
    path: '/learn/getting-started',
    description: 'Setup your development environment',
  },
  {
    title: 'Tech Stack',
    path: '/learn/tech-stack',
    description: 'Overview of our technology choices',
  },
  {
    title: 'Remix',
    path: '/learn/remix',
    description: 'Learn Remix fundamentals',
  },
  {
    title: 'Tailwind CSS',
    path: '/learn/tailwind',
    description: 'Master utility-first CSS',
  },
  {
    title: 'Supabase',
    path: '/learn/supabase',
    description: 'Explore backend capabilities',
  },
];

export function LearningNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { open: sidebarOpen, animate } = useSidebar();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'group/sidebar flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm font-medium',
          interactiveClasses.base,
        )}
      >
        <div className="flex items-center gap-2">
          <BookOpenIcon className="h-5 w-5" />
          <motion.span
            initial={false}
            animate={{
              width: animate ? (sidebarOpen ? 'auto' : 0) : 'auto',
              opacity: animate ? (sidebarOpen ? 1 : 0) : 1,
            }}
            transition={{
              duration: 0.3,
              ease: [0.23, 1, 0.32, 1],
            }}
            className="inline-block overflow-hidden whitespace-nowrap text-sm transition duration-150 group-hover/sidebar:translate-x-1"
            style={{
              display: 'inline-block',
              visibility: animate && !sidebarOpen ? 'hidden' : 'visible',
            }}
          >
            Learning
          </motion.span>
        </div>
        {sidebarOpen && (
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-1 space-y-1 px-2">
              {learningRoutes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={cn(
                    'flex flex-col rounded-md px-2 py-2 text-sm',
                    interactiveClasses.base,
                  )}
                >
                  <span className="font-medium">{route.title}</span>
                  <span className={textClasses.secondary}>
                    {route.description}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
