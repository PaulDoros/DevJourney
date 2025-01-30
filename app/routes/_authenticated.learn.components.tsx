import { json } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { cn } from '~/lib/utils';
import { cardClasses, textClasses } from '~/utils/theme-classes';

interface ComponentCategory {
  title: string;
  description: string;
  path: string;
  components: {
    name: string;
    description: string;
    path: string;
    achievement?: {
      name: string;
      points: number;
      description: string;
    };
  }[];
}

const COMPONENT_CATEGORIES: ComponentCategory[] = [
  {
    title: 'Layout Components',
    description: 'Essential components for page structure and layout',
    path: '/learn/components/layout',
    components: [
      {
        name: 'Hero',
        description: 'Create engaging hero sections with various styles',
        path: '/learn/components/layout/hero',
        achievement: {
          name: 'Hero Builder',
          points: 100,
          description: 'Created a custom hero section with animation',
        },
      },
      {
        name: 'Navigation Menus',
        description: 'Responsive navigation components',
        path: '/learn/components/layout/navigation',
        achievement: {
          name: 'Navigation Master',
          points: 150,
          description: 'Built a responsive navigation menu with dropdowns',
        },
      },
      // Add more layout components...
    ],
  },
  {
    title: 'UI Elements',
    description: 'Interactive UI components for rich user experiences',
    path: '/learn/components/ui',
    components: [
      {
        name: 'Button',
        description: 'Customizable button components with variants',
        path: '/learn/components/ui/button',
        achievement: {
          name: 'Button Artist',
          points: 50,
          description: 'Created custom button variants',
        },
      },
      {
        name: 'Modal',
        description: 'Dialog and modal components with animations',
        path: '/learn/components/ui/modal',
        achievement: {
          name: 'Modal Master',
          points: 100,
          description: 'Implemented animated modal dialogs',
        },
      },
      // Add more UI components...
    ],
  },
  {
    title: 'Form Elements',
    description: 'Form components with validation and interactivity',
    path: '/learn/components/form',
    components: [
      {
        name: 'Input',
        description: 'Text input components with validation',
        path: '/learn/components/form/input',
        achievement: {
          name: 'Input Innovator',
          points: 75,
          description: 'Built custom input components with validation',
        },
      },
      {
        name: 'Select',
        description: 'Dropdown select components',
        path: '/learn/components/form/select',
        achievement: {
          name: 'Select Specialist',
          points: 75,
          description: 'Created custom select components',
        },
      },
      // Add more form components...
    ],
  },
  {
    title: 'Data Display',
    description: 'Components for displaying and managing data',
    path: '/learn/components/data',
    components: [
      {
        name: 'Table',
        description: 'Data tables with sorting and filtering',
        path: '/learn/components/data/table',
        achievement: {
          name: 'Table Tactician',
          points: 150,
          description: 'Built interactive data tables',
        },
      },
      {
        name: 'Pagination',
        description: 'Pagination components for data navigation',
        path: '/learn/components/data/pagination',
        achievement: {
          name: 'Pagination Pro',
          points: 75,
          description: 'Implemented data pagination',
        },
      },
      // Add more data components...
    ],
  },
  {
    title: 'Feedback',
    description: 'Components for user feedback and notifications',
    path: '/learn/components/feedback',
    components: [
      {
        name: 'Toast',
        description: 'Toast notification system',
        path: '/learn/components/feedback/toast',
        achievement: {
          name: 'Toast Master',
          points: 100,
          description: 'Created a toast notification system',
        },
      },
      {
        name: 'Alert',
        description: 'Alert components for various states',
        path: '/learn/components/feedback/alert',
        achievement: {
          name: 'Alert Architect',
          points: 75,
          description: 'Built custom alert components',
        },
      },
      // Add more feedback components...
    ],
  },
];

export default function ComponentsLibrary() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className={cn('mb-2 text-3xl font-bold', textClasses.primary)}>
          Component Library
        </h1>
        <p className={cn('text-lg', textClasses.secondary)}>
          Explore our collection of customizable components
        </p>
      </div>

      <div className="space-y-12">
        {COMPONENT_CATEGORIES.map((category) => (
          <section key={category.path} className="space-y-4">
            <div className="mb-6">
              <h2 className={cn('text-2xl font-semibold', textClasses.primary)}>
                {category.title}
              </h2>
              <p className={cn('mt-1', textClasses.secondary)}>
                {category.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.components.map((component) => (
                <Link
                  key={component.path}
                  to={component.path}
                  className={cn('group', cardClasses.interactive)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4"
                  >
                    <h3
                      className={cn(
                        'mb-2 text-lg font-semibold',
                        textClasses.primary,
                        'group-hover:text-light-accent retro:group-hover:text-retro-accent multi:group-hover:text-multi-accent dark:group-hover:text-dark-accent',
                      )}
                    >
                      {component.name} →
                    </h3>
                    <p className={cn('text-sm', textClasses.secondary)}>
                      {component.description}
                    </p>
                    {component.achievement && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-light-accent retro:text-retro-accent multi:text-multi-accent dark:text-dark-accent">
                        <span>🏆</span>
                        <span>{component.achievement.points} points</span>
                      </div>
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
