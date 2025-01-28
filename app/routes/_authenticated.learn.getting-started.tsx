import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ClipboardIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/solid';
import {
  cardClasses,
  textClasses,
  interactiveClasses,
} from '~/utils/theme-classes';
import { cn } from '~/lib/utils';
import { Link, useFetcher } from '@remix-run/react';
import type { UserAchievement } from '~/types/achievements';

interface Step {
  id: string;
  title: string;
  description: string;
  detailedSteps?: {
    windows?: string[];
    mac?: string[];
    general?: string[];
  };
  command?: {
    windows?: string;
    mac?: string;
    general?: string;
  };
  explanation?: string;
  links?: {
    label: string;
    url: string;
  }[];
  completed: boolean;
}

export default function GettingStartedRoute() {
  const [activeTab, setActiveTab] = useState<'windows' | 'mac'>('windows');
  const fetcher = useFetcher();
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 'install-vscode',
      title: 'Install Visual Studio Code',
      description:
        'VS Code is a popular, free code editor that makes writing code easier with features like syntax highlighting, code completion, and debugging tools.',
      detailedSteps: {
        windows: [
          '1. Download VS Code for Windows from the official website',
          '2. Run the downloaded .exe installer',
          '3. Make sure these options are checked during installation:',
          '   - "Add to PATH"',
          '   - "Add Open with Code" to Windows Explorer context menu',
          '4. Launch VS Code after installation',
          '5. Install extensions (Ctrl+Shift+X):',
          '   - ESLint: Helps catch coding errors',
          '   - Prettier: Formats your code automatically',
          '   - JavaScript and TypeScript Nightly',
          '   - Tailwind CSS IntelliSense',
          '   - GitLens',
          '6. Windows Keyboard Shortcuts:',
          '   - Open Terminal: Ctrl + `',
          '   - Quick File Open: Ctrl + P',
          '   - Command Palette: Ctrl + Shift + P',
          '   - Format Document: Shift + Alt + F',
          '   - Toggle Sidebar: Ctrl + B',
          '   - Multi-cursor: Alt + Click',
          '   - Search in Files: Ctrl + Shift + F',
          '7. Open PowerShell or Command Prompt from VS Code:',
          '   - Use Terminal > New Terminal or Ctrl + `',
          '   - Select PowerShell from the dropdown',
        ],
        mac: [
          '1. Download VS Code for macOS from the official website',
          '2. Open the downloaded .dmg file',
          '3. Drag VS Code.app to the Applications folder',
          '4. Add VS Code to Dock (optional): Right-click > Options > Keep in Dock',
          '5. Install extensions (Cmd+Shift+X):',
          '   - ESLint: Helps catch coding errors',
          '   - Prettier: Formats your code automatically',
          '   - JavaScript and TypeScript Nightly',
          '   - Tailwind CSS IntelliSense',
          '   - GitLens',
          '6. macOS Keyboard Shortcuts:',
          '   - Open Terminal: Cmd + `',
          '   - Quick File Open: Cmd + P',
          '   - Command Palette: Cmd + Shift + P',
          '   - Format Document: Shift + Option + F',
          '   - Toggle Sidebar: Cmd + B',
          '   - Multi-cursor: Option + Click',
          '   - Search in Files: Cmd + Shift + F',
          '7. Open Terminal from VS Code:',
          '   - Use Terminal > New Terminal or Cmd + `',
          '   - Select zsh/bash from the dropdown',
        ],
      },
      links: [
        {
          label: '📥 Download VS Code',
          url: 'https://code.visualstudio.com/download',
        },
        {
          label: '📖 VS Code Documentation',
          url: 'https://code.visualstudio.com/docs',
        },
        {
          label: '🎥 VS Code Tutorial for Beginners',
          url: 'https://code.visualstudio.com/docs/introvideos/basics',
        },
      ],
      explanation:
        "VS Code makes coding much easier with features like code completion (suggests code as you type), error detection (underlines problems), and built-in Git support (helps track changes). It's highly customizable and has thousands of extensions to add more features.",
      completed: false,
    },
    {
      id: 'install-nodejs',
      title: 'Install Node.js',
      description:
        'Node.js is a JavaScript runtime that allows us to run JavaScript on our computer, outside of a web browser.',
      detailedSteps: {
        windows: [
          '1. Visit nodejs.org and download the Windows LTS installer (.msi)',
          '2. Run the downloaded .msi installer',
          '3. Important installation options:',
          '   - Check "Automatically install necessary tools"',
          '   - Check "Add to PATH"',
          '4. Open a new PowerShell or Command Prompt',
          '5. Verify installation:',
          '   - Type: node --version',
          '   - Type: npm --version',
          '6. If you get "not recognized" errors:',
          '   - Close and reopen PowerShell/Command Prompt',
          '   - Or restart your computer',
        ],
        mac: [
          '1. Recommended: Install via Homebrew (package manager):',
          '   - First install Homebrew if not installed:',
          '   - /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
          '   - Then: brew install node',
          'Alternative manual installation:',
          '1. Visit nodejs.org and download the macOS LTS installer (.pkg)',
          '2. Run the downloaded .pkg installer',
          '3. Follow installation wizard (requires admin password)',
          '4. Open Terminal',
          '5. Verify installation:',
          '   - Type: node --version',
          '   - Type: npm --version',
        ],
      },
      links: [
        {
          label: '📥 Download Node.js LTS',
          url: 'https://nodejs.org/en/download/',
        },
        {
          label: '📖 Node.js Documentation',
          url: 'https://nodejs.org/en/docs/',
        },
      ],
      explanation:
        'Node.js is essential for modern web development. It lets us run JavaScript code on our computer and access thousands of pre-built packages to help us build applications faster.',
      completed: false,
    },
    {
      id: 'install-pnpm',
      title: 'Install pnpm',
      description:
        'pnpm (Performant NPM) is a fast, disk space efficient package manager. It helps us manage our project dependencies.',
      detailedSteps: {
        windows: [
          '1. Open PowerShell as Administrator',
          '2. Run: npm install -g pnpm',
          '3. Verify installation: pnpm --version',
          '4. If you get permissions error:',
          '   - Run: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser',
          '   - Then try the install command again',
        ],
        mac: [
          '1. Open Terminal',
          '2. If using Homebrew: brew install pnpm',
          'Alternative:',
          '1. Run: npm install -g pnpm',
          '2. Verify installation: pnpm --version',
          '3. If you get permissions error:',
          '   - Run: sudo npm install -g pnpm',
          '   - Enter your admin password when prompted',
        ],
      },
      command: {
        windows: 'npm install -g pnpm',
        mac: 'brew install pnpm',
      },
      links: [
        {
          label: '📖 pnpm Documentation',
          url: 'https://pnpm.io/installation',
        },
        {
          label: '🚀 Why pnpm?',
          url: 'https://pnpm.io/motivation',
        },
      ],
      explanation:
        'npm (Node Package Manager) comes with Node.js, but we use pnpm because it\'s faster and uses less disk space. The "-g" flag means we\'re installing it globally on our computer so we can use it in any project.',
      completed: false,
    },
    {
      id: 'create-remix-project',
      title: 'Create Remix Project',
      description:
        "Now we'll create a new Remix project using the Vite template. Vite is a modern build tool that makes our development experience faster.",
      detailedSteps: {
        general: [
          '1. Open your terminal',
          '2. Navigate to where you want to create your project',
          '3. Run the command below',
          '4. Follow the prompts:',
          '   - Choose a project name',
          '   - Select "Remix App Server" as the deployment target',
          '   - Choose "TypeScript" for better development experience',
          '   - Select "Yes" for using ESLint and Prettier',
          '',
          '💡 Detailed Options Explanation:',
          '',
          '   📂 Project Name:',
          '   - Choose a meaningful name for your project',
          '   - Use lowercase letters and hyphens',
          '   - Example: my-remix-app',
          '',
          '   🚀 Deployment Target:',
          '   - Choose "Remix App Server"',
          '   - This is the most flexible option',
          '   - Perfect for learning and development',
          '',
          '   🔧 TypeScript Setup:',
          '   - Choose "TypeScript"',
          '   - Provides better code completion',
          '   - Catches errors before runtime',
          '',
          '   ⚙️ Code Quality Tools:',
          '   - Select "Yes" for ESLint and Prettier',
          '   - ESLint catches common mistakes',
          '   - Prettier formats your code automatically',
          '',
          '5. After Setup:',
          '   - Project structure will be created',
          '   - Git repository will be initialized',
          '   - Basic configuration files will be added',
        ],
      },
      command: {
        general: 'pnpm create remix@latest',
      },
      links: [
        {
          label: '📖 Remix Documentation',
          url: 'https://remix.run/docs/en/main',
        },
        {
          label: '🎯 Remix Stacks',
          url: 'https://remix.run/stacks',
        },
      ],
      explanation:
        'This command creates a new Remix project with all the necessary files and configuration. Remix is a full-stack web framework that makes building modern web applications easier.',
      completed: false,
    },
    {
      id: 'install-dependencies',
      title: 'Install Dependencies',
      description:
        'Install all the required packages and libraries that our project needs to run.',
      detailedSteps: {
        general: [
          '1. In your terminal, navigate to your project folder',
          '2. Run the command below to install dependencies',
          '3. Wait for installation to complete (this might take a few minutes)',
          '4. You\'ll see a new "node_modules" folder created',
          '',
          "💡 What's Being Installed:",
          '   • Remix framework packages',
          '   • React and React DOM',
          '   • TypeScript compiler',
          '   • ESLint and Prettier',
          '   • Development tools and utilities',
          '',
          '⚠️ Common Issues:',
          '   • If installation fails, try deleting node_modules and pnpm-lock.yaml',
          '   • Run "pnpm install" again',
          '   • Make sure you have write permissions in the directory',
        ],
      },
      command: {
        general: 'pnpm install',
      },
      explanation:
        'Dependencies are pre-built packages of code that our project needs. The package.json file lists these dependencies, and "pnpm install" downloads them all from the internet and sets them up in our project.',
      completed: false,
    },
    {
      id: 'start-dev-server',
      title: 'Start Development Server',
      description:
        'Run your new Remix application locally to start development.',
      detailedSteps: {
        general: [
          "1. Make sure you're in your project directory",
          '2. Run the development server command',
          '3. Open your browser and visit: http://localhost:3000',
          '4. You should see the Remix welcome page!',
          '',
          '💡 Development Server Features:',
          '   • Hot Module Replacement (HMR)',
          '   • Automatic page reloading',
          '   • Error overlay for debugging',
          '   • Fast refresh for React components',
          '',
          '📝 Available Commands:',
          '   • pnpm dev - Start development server',
          '   • pnpm build - Build for production',
          '   • pnpm start - Run production build',
          '',
          '🔍 Checking Your Setup:',
          '   • Terminal should show "Remix App Server started"',
          '   • No error messages in the console',
          '   • Browser shows Remix welcome page',
          '   • Changes to files trigger automatic reload',
        ],
      },
      command: {
        general: 'pnpm dev',
      },
      links: [
        {
          label: '🔧 Development Guide',
          url: 'https://remix.run/docs/en/main/guides/development',
        },
        {
          label: '🐛 Debugging Tips',
          url: 'https://remix.run/docs/en/main/guides/debugging',
        },
      ],
      explanation:
        'The development server runs your application locally on your computer. It automatically reloads when you make changes to your code, making development faster and easier.',
      completed: false,
    },
  ]);

  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const handleStepComplete = (index: number) => {
    const step = steps[index];
    setSteps((prevSteps) =>
      prevSteps.map((s, i) =>
        i === index ? { ...s, completed: !s.completed } : s,
      ),
    );

    if (!step.completed) {
      fetcher.submit(
        { stepId: step.id },
        { method: 'post', action: '/actions/learning-progress' },
      );
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCommand(text);
      setTimeout(() => setCopiedCommand(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
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
          Setting Up Your Development Environment
        </h2>
        <p className={cn('text-sm md:text-base', textClasses.secondary)}>
          Welcome to Dev Journey! Let's start by setting up your development
          environment. We'll guide you through each step with detailed
          explanations, making it easy even if you're completely new to web
          development.
        </p>
      </div>

      <div className="space-y-4 md:space-y-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              cardClasses.base,
              'p-4 md:p-6',
              step.completed &&
                'border-green-500 bg-green-50 dark:bg-green-900/20',
            )}
          >
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0">
              <div className="flex-1 space-y-4">
                <div>
                  <h3
                    className={cn(
                      'text-base font-semibold md:text-lg',
                      textClasses.primary,
                    )}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={cn(
                      'mt-1 text-sm md:text-base',
                      textClasses.secondary,
                    )}
                  >
                    {step.description}
                  </p>
                </div>

                {step.explanation && (
                  <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20 md:p-4">
                    <p
                      className={cn(
                        'text-xs md:text-sm',
                        textClasses.secondary,
                      )}
                    >
                      <span className="font-semibold">💡 Understanding: </span>
                      {step.explanation}
                    </p>
                  </div>
                )}

                {step.detailedSteps && (
                  <div className="space-y-3 md:space-y-4">
                    {(step.detailedSteps.windows || step.detailedSteps.mac) && (
                      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => setActiveTab('windows')}
                          className={cn(
                            'rounded-t-lg px-3 py-2 text-xs font-medium transition-colors md:text-sm',
                            activeTab === 'windows'
                              ? 'bg-light-primary text-white dark:bg-dark-primary'
                              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                          )}
                        >
                          Windows/Linux
                        </button>
                        <button
                          onClick={() => setActiveTab('mac')}
                          className={cn(
                            'rounded-t-lg px-3 py-2 text-xs font-medium transition-colors md:text-sm',
                            activeTab === 'mac'
                              ? 'bg-light-primary text-white dark:bg-dark-primary'
                              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                          )}
                        >
                          macOS
                        </button>
                      </div>
                    )}

                    {step.detailedSteps.general && (
                      <div>
                        <h4
                          className={cn(
                            'mb-2 text-xs font-semibold md:text-sm',
                            textClasses.primary,
                          )}
                        >
                          Instructions:
                        </h4>
                        <ul className="list-none space-y-1">
                          {step.detailedSteps.general.map((instruction, i) => (
                            <li
                              key={i}
                              className={cn(
                                'text-xs md:text-sm',
                                textClasses.secondary,
                              )}
                            >
                              {instruction}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeTab === 'windows' && step.detailedSteps.windows && (
                      <div>
                        <h4
                          className={cn(
                            'mb-2 text-xs font-semibold md:text-sm',
                            textClasses.primary,
                          )}
                        >
                          Windows/Linux Instructions:
                        </h4>
                        <ul className="list-none space-y-1">
                          {step.detailedSteps.windows.map((instruction, i) => (
                            <li
                              key={i}
                              className={cn(
                                'text-xs md:text-sm',
                                textClasses.secondary,
                              )}
                            >
                              {instruction}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeTab === 'mac' && step.detailedSteps.mac && (
                      <div>
                        <h4
                          className={cn(
                            'mb-2 text-xs font-semibold md:text-sm',
                            textClasses.primary,
                          )}
                        >
                          macOS Instructions:
                        </h4>
                        <ul className="list-none space-y-1">
                          {step.detailedSteps.mac.map((instruction, i) => (
                            <li
                              key={i}
                              className={cn(
                                'text-xs md:text-sm',
                                textClasses.secondary,
                              )}
                            >
                              {instruction}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {step.command && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h4
                        className={cn(
                          'mb-2 text-xs font-semibold md:text-sm',
                          textClasses.primary,
                        )}
                      >
                        Command to run:
                      </h4>
                    </div>
                    <div className="relative">
                      <pre
                        className={cn(
                          'mt-2 rounded bg-gray-100 p-2 font-mono text-xs text-black dark:bg-gray-900 dark:text-white md:p-3 md:text-sm',
                          'scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 overflow-x-auto',
                          'pr-12', // Add padding for the copy button
                        )}
                      >
                        {step.command.general ||
                          step.command.windows ||
                          step.command.mac}
                      </pre>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            step.command?.general ||
                              step.command?.windows ||
                              step.command?.mac ||
                              '',
                          )
                        }
                        className={cn(
                          'absolute right-2 top-1/2 -translate-y-1/2',
                          'rounded-md p-1.5 transition-colors',
                          'hover:bg-gray-200 dark:hover:bg-gray-800',
                          'focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent',
                        )}
                        aria-label="Copy command to clipboard"
                      >
                        {copiedCommand ===
                        (step.command?.general ||
                          step.command?.windows ||
                          step.command?.mac) ? (
                          <ClipboardDocumentCheckIcon className="h-4 w-4 text-green-500 md:h-5 md:w-5" />
                        ) : (
                          <ClipboardIcon className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 md:h-5 md:w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {step.links && (
                  <div className="mt-3 md:mt-4">
                    <h4
                      className={cn(
                        'mb-2 text-xs font-semibold md:text-sm',
                        textClasses.primary,
                      )}
                    >
                      Helpful Links:
                    </h4>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {step.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            'inline-flex items-center rounded-md px-2 py-1 text-xs transition-colors md:px-3 md:py-1.5 md:text-sm',
                            interactiveClasses.base,
                          )}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleStepComplete(index)}
                className={cn(
                  'flex-shrink-0 self-end rounded-full p-1 md:ml-4 md:self-start',
                  step.completed
                    ? 'text-green-500'
                    : 'text-gray-400 hover:text-gray-500',
                )}
                aria-label={
                  step.completed ? 'Mark as incomplete' : 'Mark as complete'
                }
              >
                <CheckCircleIcon className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h3
          className={cn(
            'text-lg font-semibold md:text-xl',
            textClasses.primary,
          )}
        >
          What's Next?
        </h3>
        <p className={cn('text-sm md:text-base', textClasses.secondary)}>
          Congratulations! You now have a fully configured development
          environment ready for modern web development. In the next section,
          we'll explore the tech stack we're using and why we chose these
          technologies.
        </p>
        <div className="mt-4 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20 md:p-4">
          <p className={cn('text-xs md:text-sm', textClasses.secondary)}>
            <span className="font-semibold">💡 Pro Tips: </span>
            <ul className="mt-2 list-disc space-y-1 pl-4 md:space-y-2">
              <li>Keep this guide bookmarked for future reference.</li>
              <li>
                Press Ctrl+` (backtick) in VS Code to open the integrated
                terminal.
              </li>
              <li>
                Use Shift+Alt+F (Windows/Linux) or Shift+Option+F (Mac) to
                format code.
              </li>
              <li>Enable "Format On Save" for automatic code formatting.</li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
}
