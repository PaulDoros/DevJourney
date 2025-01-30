import { json } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { PageLayout } from '~/components/layouts/PageLayout';
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
      {
        name: 'Footer',
        description: 'Customizable footer layouts',
        path: '/learn/components/layout/footer',
        achievement: {
          name: 'Footer Architect',
          points: 100,
          description: 'Created a responsive footer with multiple sections',
        },
      },
      {
        name: 'Sidebar',
        description: 'Collapsible sidebar navigation',
        path: '/learn/components/layout/sidebar',
        achievement: {
          name: 'Sidebar Specialist',
          points: 150,
          description: 'Built an animated sidebar with nested navigation',
        },
      },
      {
        name: 'Scroll Area',
        description: 'Custom scrollable containers',
        path: '/learn/components/layout/scroll-area',
        achievement: {
          name: 'Scroll Master',
          points: 100,
          description: 'Implemented custom scrollable areas with styling',
        },
      },
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
        name: 'Card',
        description: 'Versatile content containers',
        path: '/learn/components/ui/card',
        achievement: {
          name: 'Card Creator',
          points: 100,
          description: 'Built interactive card components',
        },
      },
      {
        name: 'Dialog / Modal',
        description: 'Accessible modal dialogs',
        path: '/learn/components/ui/dialog',
        achievement: {
          name: 'Dialog Designer',
          points: 150,
          description: 'Created accessible modal dialogs with animations',
        },
      },
      {
        name: 'Popover',
        description: 'Floating content panels',
        path: '/learn/components/ui/popover',
        achievement: {
          name: 'Popover Pro',
          points: 100,
          description: 'Implemented interactive popovers',
        },
      },
      {
        name: 'Tooltip',
        description: 'Informative hover tooltips',
        path: '/learn/components/ui/tooltip',
        achievement: {
          name: 'Tooltip Technician',
          points: 75,
          description: 'Added helpful tooltips to improve UX',
        },
      },
      {
        name: 'Badge',
        description: 'Status and label indicators',
        path: '/learn/components/ui/badge',
        achievement: {
          name: 'Badge Builder',
          points: 50,
          description: 'Created custom badge styles',
        },
      },
      {
        name: 'Avatar',
        description: 'User profile pictures and initials',
        path: '/learn/components/ui/avatar',
        achievement: {
          name: 'Avatar Artist',
          points: 75,
          description: 'Implemented responsive avatars with fallbacks',
        },
      },
      {
        name: 'Spinner Loader',
        description: 'Loading state indicators',
        path: '/learn/components/ui/spinner',
        achievement: {
          name: 'Loading Expert',
          points: 75,
          description: 'Created custom loading animations',
        },
      },
    ],
  },
  {
    title: 'Form Elements',
    description: 'Form components with validation and interactivity',
    path: '/learn/components/form',
    components: [
      {
        name: 'Form',
        description: 'Complete form handling solution',
        path: '/learn/components/form/form',
        achievement: {
          name: 'Form Master',
          points: 200,
          description: 'Built a complete form with validation',
        },
      },
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
      {
        name: 'Checkbox',
        description: 'Custom checkbox inputs',
        path: '/learn/components/form/checkbox',
        achievement: {
          name: 'Checkbox Champion',
          points: 50,
          description: 'Implemented styled checkbox components',
        },
      },
      {
        name: 'Radio Group',
        description: 'Radio button selection groups',
        path: '/learn/components/form/radio-group',
        achievement: {
          name: 'Radio Ranger',
          points: 75,
          description: 'Created custom radio button groups',
        },
      },
      {
        name: 'Text Area',
        description: 'Multi-line text input',
        path: '/learn/components/form/textarea',
        achievement: {
          name: 'Text Area Ace',
          points: 50,
          description: 'Built resizable text area components',
        },
      },
      {
        name: 'Date Picker',
        description: 'Calendar date selection',
        path: '/learn/components/form/date-picker',
        achievement: {
          name: 'Date Master',
          points: 150,
          description: 'Implemented a custom date picker',
        },
      },
      {
        name: 'File Upload',
        description: 'File upload with drag and drop',
        path: '/learn/components/form/file-upload',
        achievement: {
          name: 'Upload Expert',
          points: 150,
          description: 'Created drag and drop file upload',
        },
      },
      {
        name: 'Slider',
        description: 'Range slider input',
        path: '/learn/components/form/slider',
        achievement: {
          name: 'Slider Specialist',
          points: 100,
          description: 'Built custom range slider components',
        },
      },
      {
        name: 'Toggle',
        description: 'Switch toggle buttons',
        path: '/learn/components/form/toggle',
        achievement: {
          name: 'Toggle Technician',
          points: 75,
          description: 'Created animated toggle switches',
        },
      },
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
        description: 'Pagination controls for data navigation',
        path: '/learn/components/data/pagination',
        achievement: {
          name: 'Pagination Pro',
          points: 75,
          description: 'Implemented data pagination',
        },
      },
      {
        name: 'Calendar',
        description: 'Calendar view for events and dates',
        path: '/learn/components/data/calendar',
        achievement: {
          name: 'Calendar Creator',
          points: 150,
          description: 'Built an interactive calendar component',
        },
      },
      {
        name: 'Numbers',
        description: 'Animated number displays',
        path: '/learn/components/data/numbers',
        achievement: {
          name: 'Number Ninja',
          points: 100,
          description: 'Created animated number counters',
        },
      },
      {
        name: 'File Tree',
        description: 'Hierarchical file structure display',
        path: '/learn/components/data/file-tree',
        achievement: {
          name: 'Tree Master',
          points: 150,
          description: 'Built an interactive file tree component',
        },
      },
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
      {
        name: 'Empty State',
        description: 'Empty state placeholders',
        path: '/learn/components/feedback/empty-state',
        achievement: {
          name: 'Empty State Expert',
          points: 75,
          description: 'Created engaging empty state displays',
        },
      },
      {
        name: 'Notification',
        description: 'In-app notification components',
        path: '/learn/components/feedback/notification',
        achievement: {
          name: 'Notification Ninja',
          points: 100,
          description: 'Built an in-app notification system',
        },
      },
    ],
  },
  {
    title: 'Navigation',
    description: 'Components for site navigation and menus',
    path: '/learn/components/navigation',
    components: [
      {
        name: 'Menu',
        description: 'Dropdown and context menus',
        path: '/learn/components/navigation/menu',
        achievement: {
          name: 'Menu Maestro',
          points: 100,
          description: 'Created accessible dropdown menus',
        },
      },
      {
        name: 'Tabs',
        description: 'Tabbed content navigation',
        path: '/learn/components/navigation/tabs',
        achievement: {
          name: 'Tab Master',
          points: 100,
          description: 'Built accessible tabbed interfaces',
        },
      },
      {
        name: 'Dropdown',
        description: 'Dropdown selection menus',
        path: '/learn/components/navigation/dropdown',
        achievement: {
          name: 'Dropdown Designer',
          points: 100,
          description: 'Created custom dropdown components',
        },
      },
      {
        name: 'Link',
        description: 'Enhanced link components',
        path: '/learn/components/navigation/link',
        achievement: {
          name: 'Link Legend',
          points: 50,
          description: 'Built styled link components',
        },
      },
    ],
  },
  {
    title: 'Media',
    description: 'Components for displaying media content',
    path: '/learn/components/media',
    components: [
      {
        name: 'Images',
        description: 'Responsive image components',
        path: '/learn/components/media/images',
        achievement: {
          name: 'Image Expert',
          points: 75,
          description: 'Created responsive image displays',
        },
      },
      {
        name: 'Video',
        description: 'Video player components',
        path: '/learn/components/media/video',
        achievement: {
          name: 'Video Virtuoso',
          points: 100,
          description: 'Built custom video player components',
        },
      },
      {
        name: 'Carousel',
        description: 'Image and content carousels',
        path: '/learn/components/media/carousel',
        achievement: {
          name: 'Carousel Creator',
          points: 125,
          description: 'Created interactive content carousels',
        },
      },
    ],
  },
  {
    title: 'Marketing',
    description: 'Components for marketing and promotional content',
    path: '/learn/components/marketing',
    components: [
      {
        name: 'Call to Action',
        description: 'Engaging CTA sections',
        path: '/learn/components/marketing/cta',
        achievement: {
          name: 'CTA Champion',
          points: 100,
          description: 'Created compelling call-to-action sections',
        },
      },
      {
        name: 'Testimonials',
        description: 'Customer testimonial displays',
        path: '/learn/components/marketing/testimonials',
        achievement: {
          name: 'Testimonial Pro',
          points: 100,
          description: 'Built engaging testimonial components',
        },
      },
      {
        name: 'Pricing',
        description: 'Pricing table components',
        path: '/learn/components/marketing/pricing',
        achievement: {
          name: 'Pricing Pioneer',
          points: 125,
          description: 'Created interactive pricing tables',
        },
      },
      {
        name: 'Comparison',
        description: 'Feature comparison tables',
        path: '/learn/components/marketing/comparison',
        achievement: {
          name: 'Comparison Creator',
          points: 100,
          description: 'Built feature comparison components',
        },
      },
      {
        name: 'Clients',
        description: 'Client and partner logos',
        path: '/learn/components/marketing/clients',
        achievement: {
          name: 'Client Showcase Expert',
          points: 75,
          description: 'Created responsive client logo displays',
        },
      },
    ],
  },
  {
    title: 'Authentication',
    description: 'Components for user authentication',
    path: '/learn/components/auth',
    components: [
      {
        name: 'Sign In',
        description: 'User login forms',
        path: '/learn/components/auth/sign-in',
        achievement: {
          name: 'Auth Expert',
          points: 150,
          description: 'Built secure authentication forms',
        },
      },
      {
        name: 'Sign Up',
        description: 'User registration forms',
        path: '/learn/components/auth/sign-up',
        achievement: {
          name: 'Registration Master',
          points: 150,
          description: 'Created user registration flows',
        },
      },
    ],
  },
  {
    title: 'Advanced',
    description: 'Advanced and specialized components',
    path: '/learn/components/advanced',
    components: [
      {
        name: 'AI Chat',
        description: 'AI-powered chat interfaces',
        path: '/learn/components/advanced/ai-chat',
        achievement: {
          name: 'AI Interface Master',
          points: 200,
          description: 'Built an AI chat interface',
        },
      },
      {
        name: 'Maps',
        description: 'Interactive map components',
        path: '/learn/components/advanced/maps',
        achievement: {
          name: 'Map Master',
          points: 150,
          description: 'Created interactive map displays',
        },
      },
      {
        name: 'Docks',
        description: 'Dockable panel systems',
        path: '/learn/components/advanced/docks',
        achievement: {
          name: 'Dock Designer',
          points: 175,
          description: 'Built a dockable panel system',
        },
      },
      {
        name: 'Accordion',
        description: 'Collapsible content sections',
        path: '/learn/components/advanced/accordion',
        achievement: {
          name: 'Accordion Ace',
          points: 100,
          description: 'Created animated accordion components',
        },
      },
    ],
  },
  {
    title: 'Styling',
    description: 'Components for visual styling and effects',
    path: '/learn/components/styling',
    components: [
      {
        name: 'Backgrounds',
        description: 'Custom background components',
        path: '/learn/components/styling/backgrounds',
        achievement: {
          name: 'Background Artist',
          points: 75,
          description: 'Created custom background effects',
        },
      },
      {
        name: 'Borders',
        description: 'Border styling components',
        path: '/learn/components/styling/borders',
        achievement: {
          name: 'Border Master',
          points: 75,
          description: 'Built custom border styles',
        },
      },
      {
        name: 'Text',
        description: 'Typography components',
        path: '/learn/components/styling/text',
        achievement: {
          name: 'Typography Expert',
          points: 75,
          description: 'Created custom text styles',
        },
      },
      {
        name: 'Icons',
        description: 'Icon components and systems',
        path: '/learn/components/styling/icons',
        achievement: {
          name: 'Icon Master',
          points: 75,
          description: 'Built an icon system',
        },
      },
      {
        name: 'Tags',
        description: 'Tag and label components',
        path: '/learn/components/styling/tags',
        achievement: {
          name: 'Tag Designer',
          points: 50,
          description: 'Created custom tag components',
        },
      },
    ],
  },
];

export default function ComponentsLibrary() {
  return (
    <PageLayout>
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
                <h2
                  className={cn('text-2xl font-semibold', textClasses.primary)}
                >
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
    </PageLayout>
  );
}
