import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useFetcher, Form } from '@remix-run/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '~/lib/utils';
import { cardClasses, textClasses } from '~/utils/theme-classes';
import {
  CheckCircleIcon,
  ClipboardIcon,
  XMarkIcon,
  PlusIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

interface ElementStyle {
  category: string;
  properties: {
    name: string;
    value: string;
    options?: string[];
  }[];
}

const STYLE_CATEGORIES: ElementStyle[] = [
  {
    category: 'Layout',
    properties: [
      {
        name: 'display',
        value: '',
        options: ['block', 'flex', 'grid', 'inline', 'hidden'],
      },
      { name: 'flex-direction', value: '', options: ['flex-row', 'flex-col'] },
      {
        name: 'justify-content',
        value: '',
        options: [
          'justify-start',
          'justify-center',
          'justify-end',
          'justify-between',
        ],
      },
      {
        name: 'align-items',
        value: '',
        options: ['items-start', 'items-center', 'items-end'],
      },
      {
        name: 'gap',
        value: '',
        options: ['gap-1', 'gap-2', 'gap-4', 'gap-6', 'gap-8'],
      },
    ],
  },
  {
    category: 'Spacing',
    properties: [
      {
        name: 'padding',
        value: '',
        options: ['p-0', 'p-1', 'p-2', 'p-4', 'p-6', 'p-8'],
      },
      {
        name: 'margin',
        value: '',
        options: ['m-0', 'm-1', 'm-2', 'm-4', 'm-6', 'm-8'],
      },
      {
        name: 'width',
        value: '',
        options: ['w-full', 'w-auto', 'w-1/2', 'w-1/3', 'w-1/4'],
      },
      { name: 'height', value: '', options: ['h-full', 'h-auto', 'h-screen'] },
    ],
  },
  {
    category: 'Typography',
    properties: [
      {
        name: 'font-size',
        value: '',
        options: ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl'],
      },
      {
        name: 'font-weight',
        value: '',
        options: ['font-normal', 'font-medium', 'font-semibold', 'font-bold'],
      },
      {
        name: 'text-align',
        value: '',
        options: ['text-left', 'text-center', 'text-right'],
      },
      {
        name: 'text-color',
        value: '',
        options: [
          'text-gray-500',
          'text-blue-500',
          'text-green-500',
          'text-red-500',
        ],
      },
    ],
  },
  {
    category: 'Borders',
    properties: [
      {
        name: 'border-radius',
        value: '',
        options: [
          'rounded-none',
          'rounded',
          'rounded-md',
          'rounded-lg',
          'rounded-full',
        ],
      },
      {
        name: 'border-width',
        value: '',
        options: ['border-0', 'border', 'border-2', 'border-4'],
      },
      {
        name: 'border-color',
        value: '',
        options: [
          'border-gray-200',
          'border-blue-500',
          'border-green-500',
          'border-red-500',
        ],
      },
    ],
  },
  {
    category: 'Effects',
    properties: [
      {
        name: 'shadow',
        value: '',
        options: [
          'shadow-none',
          'shadow-sm',
          'shadow',
          'shadow-md',
          'shadow-lg',
        ],
      },
      {
        name: 'opacity',
        value: '',
        options: ['opacity-100', 'opacity-75', 'opacity-50', 'opacity-25'],
      },
      {
        name: 'transition',
        value: '',
        options: ['transition', 'transition-all', 'transition-colors'],
      },
    ],
  },
];

// Add type for state updates
type ClassesState = Record<string, string>;

interface LoaderData {
  user: { id: number; name: string };
}

interface InspectorProperty {
  property: string;
  value: string;
  computedValue?: string;
}

// Add documentation sections
const TAILWIND_DOCS = [
  {
    title: 'Getting Started',
    content: `To use Tailwind CSS in your project:
1. Install Tailwind: \`npm install -D tailwindcss postcss autoprefixer\`
2. Initialize config: \`npx tailwindcss init\`
3. Add to your CSS:
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
4. Configure content paths in tailwind.config.js:
   content: ["./app/**/*.{js,jsx,ts,tsx}"],`,
  },
  {
    title: 'Basic Concepts',
    content: `Tailwind uses utility classes for styling:
- Layout: flex, grid, block, hidden
- Spacing: p-4 (padding), m-4 (margin), gap-4
- Colors: text-blue-500, bg-red-500
- Typography: text-sm, font-bold
- Responsive: sm:text-lg, md:flex, lg:hidden`,
  },
  {
    title: 'Customization',
    content: `Extend Tailwind in tailwind.config.js:
module.exports = {
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1234ff',
      },
      spacing: {
        '128': '32rem',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      }
    }
  }
}`,
  },
  {
    title: 'Best Practices',
    content: `1. Use semantic HTML elements
2. Group related utilities with @apply in CSS
3. Use responsive prefixes consistently
4. Leverage component classes for reusability
5. Use arbitrary values sparingly: [w-68px]`,
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return json<LoaderData>({
    user: { id: 1, name: 'Demo User' },
  });
}

export default function TailwindPlayground() {
  const fetcher = useFetcher();
  const [activeClasses, setActiveClasses] = useState<ClassesState>({});
  const [customClasses, setCustomClasses] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [showInspector, setShowInspector] = useState(false);
  const [inspectedProperties, setInspectedProperties] = useState<
    InspectorProperty[]
  >([]);
  const [newClass, setNewClass] = useState('');

  const copyClasses = useCallback(() => {
    navigator.clipboard.writeText(customClasses);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  }, [customClasses]);

  const updateClasses = useCallback(
    (category: string, property: string, value: string) => {
      setActiveClasses((prev: ClassesState) => {
        const newClasses = { ...prev };
        if (value) {
          newClasses[property] = value;
        } else {
          delete newClasses[property];
        }
        return newClasses;
      });
    },
    [],
  );

  useEffect(() => {
    const classes = Object.values(activeClasses).join(' ');
    setCustomClasses(classes);
  }, [activeClasses]);

  const inspectElement = useCallback(() => {
    if (previewRef.current) {
      const computedStyle = window.getComputedStyle(previewRef.current);
      const properties: InspectorProperty[] = [
        { property: 'width', value: computedStyle.width },
        { property: 'height', value: computedStyle.height },
        { property: 'padding', value: computedStyle.padding },
        { property: 'margin', value: computedStyle.margin },
        { property: 'background-color', value: computedStyle.backgroundColor },
        { property: 'color', value: computedStyle.color },
        { property: 'font-size', value: computedStyle.fontSize },
        { property: 'border', value: computedStyle.border },
        { property: 'border-radius', value: computedStyle.borderRadius },
        { property: 'box-shadow', value: computedStyle.boxShadow },
      ];
      setInspectedProperties(properties);
      setShowInspector(true);
    }
  }, []);

  const handleAddClass = useCallback(() => {
    if (newClass.trim()) {
      setCustomClasses((prev) => `${prev} ${newClass.trim()}`.trim());
      setNewClass('');

      // Track achievement
      fetcher.submit(
        {
          achievementType: 'tailwind-playground',
          achievementName: 'Class Master',
        },
        {
          method: 'post',
          action: '/api/track-achievement',
        },
      );
    }
  }, [newClass, fetcher]);

  const removeClassByIndex = useCallback((classToRemove: string) => {
    setCustomClasses((prev) =>
      prev
        .split(' ')
        .filter((cls) => cls !== classToRemove)
        .join(' '),
    );
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className={cn('mb-2 text-3xl font-bold', textClasses.primary)}>
          Tailwind CSS Playground
        </h1>
        <p className={cn('text-lg', textClasses.secondary)}>
          Experiment with Tailwind classes and see live previews
        </p>
      </div>

      {/* Documentation Section */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {TAILWIND_DOCS.map((doc, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-4 flex items-center gap-2">
              <BookOpenIcon className="h-5 w-5 text-blue-500" />
              <h2 className={cn('text-lg font-semibold', textClasses.primary)}>
                {doc.title}
              </h2>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300">
              {doc.content}
            </pre>
          </div>
        ))}
      </div>

      {/* Class Editor Section */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 space-y-2">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Add Tailwind Class
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddClass()}
              placeholder="Enter class name..."
              className="flex-1 rounded-md border border-gray-200 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            />
            <button
              onClick={handleAddClass}
              className="rounded-md bg-blue-500 px-4 text-white hover:bg-blue-600"
            >
              Add Class
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Active Classes
          </label>
          <div className="flex flex-wrap gap-2">
            {customClasses
              .split(' ')
              .filter(Boolean)
              .map((cls, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                >
                  {cls}
                  <button
                    onClick={() => removeClassByIndex(cls)}
                    className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
          </div>
        </div>
      </div>
      <div className="my-2 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className={cn('text-sm font-medium', textClasses.primary)}>
            Generated Classes
          </h3>
          <button
            onClick={copyClasses}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ClipboardIcon className="h-4 w-4" />
            {showCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
          <code className="text-sm">
            {customClasses || 'No classes applied'}
          </code>
        </div>
      </div>
      {/* Rest of the component (Style Editor and Preview) */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className={cn('text-xl font-semibold', textClasses.primary)}>
              Style Editor
            </h2>

            <div className="space-y-6">
              {STYLE_CATEGORIES.map((category) => (
                <div key={category.category} className="space-y-3">
                  <h3
                    className={cn('text-sm font-medium', textClasses.primary)}
                  >
                    {category.category}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {category.properties.map((prop) => (
                      <div key={prop.name} className="space-y-1">
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {prop.name}
                        </label>
                        <select
                          value={activeClasses[prop.name] || ''}
                          onChange={(e) =>
                            updateClasses(
                              category.category,
                              prop.name,
                              e.target.value,
                            )
                          }
                          className="w-full rounded-md border border-gray-200 bg-white p-1.5 text-sm dark:border-gray-700 dark:bg-gray-800"
                        >
                          <option value="">None</option>
                          {prop.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={cn('text-xl font-semibold', textClasses.primary)}>
              Live Preview
            </h2>
            <button
              onClick={inspectElement}
              className="rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
            >
              {showInspector ? 'Hide Inspector' : 'Inspect Element'}
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
            <div className="min-h-[400px] rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-center">
                <div
                  ref={previewRef}
                  className={cn('preview-element', customClasses)}
                >
                  Preview Element
                </div>
              </div>
            </div>

            {showInspector && (
              <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                  <h3
                    className={cn('text-sm font-medium', textClasses.primary)}
                  >
                    Element Inspector
                  </h3>
                </div>

                <div className="p-4">
                  <div className="mb-4 space-y-2">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Active Classes
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {customClasses
                        .split(' ')
                        .filter(Boolean)
                        .map((cls, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          >
                            {cls}
                            <button
                              onClick={() => removeClassByIndex(cls)}
                              className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              <XMarkIcon className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Computed Styles
                    </label>
                    <div className="max-h-[300px] space-y-2 overflow-y-auto rounded-md border border-gray-200 p-2 dark:border-gray-700">
                      {inspectedProperties.map((prop, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-gray-600 dark:text-gray-400">
                            {prop.property}:
                          </span>
                          <span className="font-mono text-gray-800 dark:text-gray-200">
                            {prop.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900/50">
            <h3 className={cn('mb-2 text-sm font-medium', textClasses.primary)}>
              Tips
            </h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li>Select properties from each category to style the element</li>
              <li>Use the inspect button to see computed styles</li>
              <li>Copy the generated classes to use in your own components</li>
              <li>
                Try different combinations to see how Tailwind classes work
                together
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
