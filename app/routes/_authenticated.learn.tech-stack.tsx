import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import {
  cardClasses,
  textClasses,
  interactiveClasses,
} from '~/utils/theme-classes';
import { cn } from '~/lib/utils';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  return json({ user });
}

interface TechCard {
  id: string;
  title: string;
  description: string;
  features: string[];
  benefits: string[];
  explanation: string;
  documentation: string;
  icon: string;
  completed: boolean;
}

const TECH_STACK_ACHIEVEMENTS = {
  'react-overview': 'React Pioneer',
  'remix-overview': 'Remix Explorer',
  'typescript-overview': 'TypeScript Enthusiast',
  'tailwind-overview': 'Tailwind Artisan',
  'supabase-overview': 'Supabase Voyager',
  'framer-motion-overview': 'Animation Master',
  'prisma-overview': 'Database Architect',
} as const;

export default function TechStackRoute() {
  const { user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [techCards, setTechCards] = useState<TechCard[]>([
    {
      id: 'react-overview',
      title: 'React',
      description:
        'The most popular library for building user interfaces - think of it as LEGO blocks for websites!',
      icon: '⚛️',
      features: [
        'Component-Based: Build UIs like LEGO blocks',
        'Virtual DOM: Makes websites super fast',
        'JSX: Write HTML-like code in JavaScript',
        'Hooks: Add special powers to your components',
        'Large Community: Lots of help available',
        'Rich Ecosystem: Many ready-to-use components',
      ],
      benefits: [
        'Easy to Learn: Gradual learning curve',
        'Reusable Code: Write once, use everywhere',
        'Great Developer Tools: Helps find bugs easily',
        'Job Market: High demand for React developers',
        'Mobile Development: Can build phone apps too',
      ],
      explanation:
        'Imagine building a website like putting together LEGO blocks. Each block (we call them components) can be a button, a form, or even a whole section. React makes it easy to create these blocks and put them together to build amazing websites!',
      documentation: 'https://react.dev',
      completed: false,
    },
    {
      id: 'remix-overview',
      title: 'Remix',
      description:
        'A framework that makes building full websites easier - like having a master blueprint for your house!',
      icon: '🚀',
      features: [
        'Server-Side Rendering: Pages load super fast',
        'Easy Routing: Like having a GPS for your website',
        'Smart Data Loading: Gets info right when needed',
        'Form Handling: Makes forms work smoothly',
        'Error Handling: Catches problems gracefully',
        'Works with React: Uses React superpowers',
      ],
      benefits: [
        'Fast Websites: Pages load quickly',
        'Better SEO: Search engines love it',
        'Great User Experience: Everything feels smooth',
        'Less Code to Write: Built-in solutions',
        'Progressive Enhancement: Works even if JavaScript fails',
      ],
      explanation:
        "Think of Remix as your website's master plan. It helps organize everything - how pages connect, where data comes from, and how to handle errors. It's like having an expert architect guiding your website construction!",
      documentation: 'https://remix.run/docs/en/main',
      completed: false,
    },
    {
      id: 'typescript-overview',
      title: 'TypeScript',
      description:
        'JavaScript with superpowers - like having spell-check for your code!',
      icon: '📘',
      features: [
        'Type Checking: Catches mistakes before they happen',
        'Better Code Hints: Like having an expert helper',
        'Works with JavaScript: Builds on what you know',
        'Modern Features: Latest coding capabilities',
        'Great Tools: Makes coding easier and safer',
      ],
      benefits: [
        'Fewer Bugs: Catches mistakes early',
        'Better Code Understanding: Clear documentation',
        'Faster Development: Tools help you code quickly',
        'Safer Changes: Makes updating code easier',
        'Team Friendly: Helps teams work together',
      ],
      explanation:
        "Imagine if your code editor could warn you about mistakes before you even run your code - that's TypeScript! It's like having a smart assistant that helps you write better code and catches errors early.",
      documentation: 'https://www.typescriptlang.org/docs/',
      completed: false,
    },
    {
      id: 'tailwind-overview',
      title: 'Tailwind CSS',
      description:
        'A styling toolkit that makes your website look great - like having a box of pre-mixed paint colors!',
      icon: '🎨',
      features: [
        'Ready-to-Use Styles: Like having design shortcuts',
        'Responsive Design: Looks good on all screens',
        'Dark Mode Built-in: Easy day/night themes',
        'Customizable: Make it match your style',
        'No CSS Files: Write styles right in HTML',
      ],
      benefits: [
        'Quick Development: Style faster than ever',
        'Consistent Look: Everything matches',
        'Small File Size: Fast loading websites',
        'Easy to Learn: Use simple class names',
        'Flexible: Change anything you want',
      ],
      explanation:
        'Tailwind is like having a huge box of pre-made design tools. Instead of mixing colors and styles yourself, you just pick the ones you want. It makes designing websites much faster and easier!',
      documentation: 'https://tailwindcss.com/docs',
      completed: false,
    },
    {
      id: 'supabase-overview',
      title: 'Supabase',
      description:
        "Your website's brain - stores information and handles user accounts, like a smart filing cabinet!",
      icon: '⚡',
      features: [
        "Database: Stores all your website's information",
        'User Accounts: Handles logins and signups',
        'Real-time Updates: Information updates instantly',
        'File Storage: Store images and files',
        'Security Built-in: Keeps data safe',
      ],
      benefits: [
        'Easy to Start: Set up quickly',
        'Powerful Features: Everything you need',
        'Real-time Ready: Live updates built-in',
        'Great for Teams: Work together easily',
        'Cost Effective: Free to start',
      ],
      explanation:
        "Supabase is like a super-smart storage system for your website. It keeps track of users, stores information, and can even update things instantly - like magic! It's the perfect backend for modern web apps.",
      documentation: 'https://supabase.com/docs',
      completed: false,
    },
    {
      id: 'framer-motion-overview',
      title: 'Framer Motion',
      description:
        'Adds smooth animations to your website - like bringing your interface to life!',
      icon: '✨',
      features: [
        'Easy Animations: Make things move smoothly',
        'Gestures: Respond to user interactions',
        'Smooth Transitions: Elements flow naturally',
        'Simple Code: Easy to add animations',
        'Performance: Runs fast and smooth',
      ],
      benefits: [
        'Better User Experience: Makes sites feel alive',
        'Easy to Use: Simple animation code',
        'Smooth Performance: No jerky movements',
        'Mobile Friendly: Works great on phones',
        'Accessible: Works for everyone',
      ],
      explanation:
        "Framer Motion makes your website come alive with smooth animations. Instead of static pages, elements can fade, slide, and move naturally. It's like adding choreography to your website's dance!",
      documentation: 'https://www.framer.com/motion/',
      completed: false,
    },
    {
      id: 'prisma-overview',
      title: 'Prisma',
      description:
        'Makes working with databases easy - like having a universal translator for your data!',
      icon: '🔷',
      features: [
        'Easy Database Access: Simple way to get data',
        'Type Safety: Prevents data mistakes',
        'Visual Database Tool: See your data clearly',
        'Auto-completion: Helps write correct code',
        'Multiple Databases: Works with many types',
      ],
      benefits: [
        'Write Less Code: Does the hard work for you',
        'Fewer Errors: Catches mistakes early',
        'Easy to Use: Simple, clear syntax',
        'Great Tools: Visual database browser',
        'Type Safety: Works great with TypeScript',
      ],
      explanation:
        "Prisma makes talking to databases easy! Instead of writing complex database code, you use simple commands that make sense. It's like having a friendly interpreter between your code and your database.",
      documentation: 'https://www.prisma.io/docs',
      completed: false,
    },
  ]);

  const handleCardComplete = (index: number) => {
    const card = techCards[index];
    setTechCards((prevCards) =>
      prevCards.map((c, i) =>
        i === index ? { ...c, completed: !c.completed } : c,
      ),
    );

    if (!card.completed) {
      // Track tech stack achievement
      fetcher.submit(
        {
          achievementType: 'tech-stack',
          cardId: card.id,
          achievementName:
            TECH_STACK_ACHIEVEMENTS[
              card.id as keyof typeof TECH_STACK_ACHIEVEMENTS
            ],
          progress: index + 1,
          totalCards: techCards.length,
        },
        {
          method: 'post',
          action: '/api/track-achievement',
        },
      );
    }
  };

  return (
    <div className="mx-auto max-w-full space-y-6 px-4 py-6 md:space-y-8 md:px-6 lg:px-8">
      <div className="prose dark:prose-invert max-w-none">
        <h2
          className={cn(
            'text-xl font-bold md:text-2xl lg:text-3xl',
            textClasses.primary,
          )}
        >
          Tech Stack Overview
        </h2>
        <p className={cn('text-sm md:text-base', textClasses.secondary)}>
          Welcome to our technology tour! We'll explore the amazing tools that
          power modern web development. Don't worry if you're new to coding -
          we'll explain everything in simple terms. Think of these technologies
          as different tools in a toolbox, each with its own special purpose to
          help build amazing websites!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {techCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              cardClasses.base,
              'relative overflow-hidden p-6',
              card.completed &&
                'border-green-500 bg-green-50 dark:bg-green-900/20',
            )}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{card.icon}</span>
                    <h3
                      className={cn(
                        'text-lg font-semibold',
                        textClasses.primary,
                      )}
                    >
                      {card.title}
                    </h3>
                  </div>
                  <p className={cn('text-sm', textClasses.secondary)}>
                    {card.description}
                  </p>
                </div>

                <div>
                  <h4
                    className={cn(
                      'mb-2 text-sm font-semibold',
                      textClasses.primary,
                    )}
                  >
                    Key Features
                  </h4>
                  <ul className="list-inside list-disc space-y-1">
                    {card.features.map((feature, i) => (
                      <li
                        key={i}
                        className={cn('text-sm', textClasses.secondary)}
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4
                    className={cn(
                      'mb-2 text-sm font-semibold',
                      textClasses.primary,
                    )}
                  >
                    Benefits
                  </h4>
                  <ul className="list-inside list-disc space-y-1">
                    {card.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className={cn('text-sm', textClasses.secondary)}
                      >
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={card.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center rounded-md px-3 py-1.5 text-sm transition-colors',
                    interactiveClasses.base,
                  )}
                >
                  📚 Documentation
                </a>
              </div>

              <button
                onClick={() => handleCardComplete(index)}
                className={cn(
                  'rounded-full p-1',
                  card.completed
                    ? 'text-green-500'
                    : 'text-gray-400 hover:text-gray-500',
                )}
                aria-label={card.completed ? 'Mark as unread' : 'Mark as read'}
              >
                <CheckCircleIcon className="h-6 w-6" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <h3 className={cn('text-lg font-semibold', textClasses.primary)}>
            💡 Why Did We Choose These Tools?
          </h3>
          <p className={cn('mt-2 text-sm', textClasses.secondary)}>
            We carefully picked these technologies to work together perfectly,
            like instruments in an orchestra:
          </p>
          <ul
            className={cn(
              'mt-4 list-disc space-y-2 pl-5 text-sm',
              textClasses.secondary,
            )}
          >
            <li>
              React makes building user interfaces fun and easy - it's the
              foundation of our website
            </li>
            <li>
              Remix organizes everything and makes our website fast and reliable
            </li>
            <li>TypeScript helps us write better code with fewer mistakes</li>
            <li>Tailwind CSS makes styling quick and consistent</li>
            <li>
              Supabase safely stores all our data and handles user accounts
            </li>
            <li>
              Framer Motion adds beautiful animations to make the site feel
              alive
            </li>
            <li>Prisma makes working with our database simple and safe</li>
          </ul>
          <p className={cn('mt-4 text-sm', textClasses.secondary)}>
            Together, these tools help us build modern, fast, and user-friendly
            websites. Each one is like a piece of a puzzle, fitting perfectly
            with the others to create something amazing!
          </p>
        </div>
      </div>
    </div>
  );
}
