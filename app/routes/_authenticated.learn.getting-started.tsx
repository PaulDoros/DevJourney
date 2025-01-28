import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import {
  cardClasses,
  textClasses,
  interactiveClasses,
} from '~/utils/theme-classes';
import { cn } from '~/lib/utils';

interface Step {
  title: string;
  description: string;
  command?: string;
  completed: boolean;
}

export default function GettingStartedRoute() {
  const [steps, setSteps] = useState<Step[]>([
    {
      title: 'Install Node.js',
      description:
        'First, download and install Node.js from nodejs.org. We recommend using the LTS version.',
      completed: false,
    },
    {
      title: 'Install pnpm',
      description:
        'We use pnpm as our package manager for its speed and efficiency.',
      command: 'npm install -g pnpm',
      completed: false,
    },
    {
      title: 'Create Remix Project',
      description: 'Create a new Remix project using the Vite template.',
      command: 'pnpm create remix@latest',
      completed: false,
    },
    {
      title: 'Install Dependencies',
      description: 'Install the project dependencies using pnpm.',
      command: 'pnpm install',
      completed: false,
    },
  ]);

  const handleStepComplete = (index: number) => {
    setSteps((prevSteps) =>
      prevSteps.map((step, i) =>
        i === index ? { ...step, completed: !step.completed } : step,
      ),
    );
  };

  return (
    <div className="space-y-8">
      <div className="prose dark:prose-invert">
        <h2 className={cn('text-2xl font-bold', textClasses.primary)}>
          Setting Up Your Development Environment
        </h2>
        <p className={textClasses.secondary}>
          Welcome to Dev Journey! Let's start by setting up your development
          environment. Follow these steps to get everything installed and
          configured.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              cardClasses.base,
              step.completed &&
                'border-green-500 bg-green-50 dark:bg-green-900/20',
            )}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3
                  className={cn('text-lg font-semibold', textClasses.primary)}
                >
                  {step.title}
                </h3>
                <p className={textClasses.secondary}>{step.description}</p>
                {step.command && (
                  <pre className="mt-2 rounded bg-gray-100 p-2 font-mono text-sm dark:bg-gray-900">
                    {step.command}
                  </pre>
                )}
              </div>
              <button
                onClick={() => handleStepComplete(index)}
                className={cn(
                  'ml-4 rounded-full p-1',
                  step.completed
                    ? 'text-green-500'
                    : 'text-gray-400 hover:text-gray-500',
                )}
              >
                <CheckCircleIcon className="h-6 w-6" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="prose dark:prose-invert">
        <h3 className={cn('text-xl font-semibold', textClasses.primary)}>
          What's Next?
        </h3>
        <p className={textClasses.secondary}>
          Once you've completed these steps, you'll have a fully configured
          development environment ready to start building with Remix! Head over
          to the Tech Stack section to learn about the technologies we're using.
        </p>
      </div>
    </div>
  );
}
