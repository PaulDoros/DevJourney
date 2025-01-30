import { json } from '@remix-run/node';
import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '~/lib/utils';
import { cardClasses, textClasses } from '~/utils/theme-classes';
import { PageLayout } from '~/components/layouts/PageLayout';
import { Button } from '~/components/ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface PlaygroundComponent {
  name: string;
  description: string;
  category: string;
  component: React.ComponentType<any>;
  sourceCode: string;
  defaultProps: Record<string, any>;
  customizableProps: {
    name: string;
    type: 'string' | 'boolean' | 'number' | 'select' | 'tailwind';
    description: string;
    options?: string[];
    default: any;
  }[];
}

interface StyleCategory {
  category: string;
  properties: {
    name: string;
    value: string;
    options?: string[];
  }[];
}

const STYLE_CATEGORIES: StyleCategory[] = [
  {
    category: 'Layout',
    properties: [
      {
        name: 'display',
        value: '',
        options: ['block', 'flex', 'inline-flex', 'inline', 'hidden'],
      },
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
        options: ['items-start', 'items-center', 'items-end', 'items-stretch'],
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
      {
        name: 'height',
        value: '',
        options: ['h-full', 'h-auto', 'h-screen'],
      },
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
      {
        name: 'transform',
        value: '',
        options: [
          'scale-95',
          'scale-100',
          'scale-105',
          'rotate-3',
          '-rotate-3',
        ],
      },
    ],
  },
];

const PLAYGROUND_COMPONENTS: PlaygroundComponent[] = [
  {
    name: 'Button',
    description: 'Interactive button component with various styles',
    category: 'UI Elements',
    component: Button,
    sourceCode: `import { forwardRef } from 'react';
import { cn } from '~/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const variants = {
  default: [
    'bg-light-accent text-light-accent-foreground hover:bg-light-accent/90',
    'retro:bg-retro-accent retro:text-retro-accent-foreground retro:hover:bg-retro-accent/90',
    'multi:bg-multi-accent multi:text-multi-accent-foreground multi:hover:bg-multi-accent/90',
    'dark:bg-dark-accent dark:text-dark-accent-foreground dark:hover:bg-dark-accent/90'
  ].join(' '),
  destructive: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
};

const sizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variant styles
          variants[variant],
          // Size styles
          sizes[size],
          // Custom classes
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };`,
    defaultProps: {
      variant: 'default',
      size: 'default',
      disabled: false,
      children: 'Click me',
      className: '',
    },
    customizableProps: [
      {
        name: 'variant',
        type: 'select',
        description: 'The visual style of the button',
        options: [
          'default',
          'destructive',
          'outline',
          'secondary',
          'ghost',
          'link',
        ],
        default: 'default',
      },
      {
        name: 'size',
        type: 'select',
        description: 'The size of the button',
        options: ['default', 'sm', 'lg', 'icon'],
        default: 'default',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: 'Whether the button is disabled',
        default: false,
      },
      {
        name: 'children',
        type: 'string',
        description: 'The content of the button',
        default: 'Click me',
      },
    ],
  },
  // Add more components...
];

export default function ComponentPlayground() {
  const [selectedComponent, setSelectedComponent] =
    useState<PlaygroundComponent | null>(null);
  const [customProps, setCustomProps] = useState<Record<string, any>>({});
  const [activeCategory, setActiveCategory] = useState<string>('Properties');
  const [customClasses, setCustomClasses] = useState('');
  const [newClass, setNewClass] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const [showSourceCode, setShowSourceCode] = useState(false);

  const categories = ['Properties', 'Styling'];

  const handleAddClass = useCallback(() => {
    if (newClass.trim()) {
      setCustomClasses((prev) => `${prev} ${newClass.trim()}`.trim());
      setNewClass('');
      setCustomProps((prev) => ({
        ...prev,
        className: `${prev.className || ''} ${newClass.trim()}`.trim(),
      }));
    }
  }, [newClass]);

  const removeClassByIndex = useCallback((classToRemove: string) => {
    setCustomClasses((prev) =>
      prev
        .split(' ')
        .filter((cls) => cls !== classToRemove)
        .join(' '),
    );
    setCustomProps((prev) => ({
      ...prev,
      className: prev.className
        .split(' ')
        .filter((cls: string) => cls !== classToRemove)
        .join(' '),
    }));
  }, []);

  const updateClasses = useCallback(
    (category: string, property: string, value: string) => {
      const currentClasses = customProps.className?.split(' ') || [];
      const newClasses = currentClasses
        .filter((cls: string) => !cls.startsWith(property.split('-')[0]))
        .concat(value)
        .filter(Boolean)
        .join(' ');

      setCustomProps((prev) => ({
        ...prev,
        className: newClasses,
      }));
      setCustomClasses(newClasses);
    },
    [customProps.className],
  );

  return (
    <PageLayout>
      <div className="h-full w-full px-4 py-6 scrollbar-hide">
        <div className="mb-8">
          <h1 className={cn('mb-2 text-3xl font-bold', textClasses.primary)}>
            Component Playground
          </h1>
          <p className={cn('text-lg', textClasses.secondary)}>
            Experiment with components and customize their properties
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[250px,1fr] lg:items-start">
          {/* Component Selection - Make it sticky on desktop */}
          <div className="lg:sticky lg:top-4">
            <div className="space-y-4">
              <h2 className={cn('text-xl font-semibold', textClasses.primary)}>
                Components
              </h2>
              <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-2">
                {PLAYGROUND_COMPONENTS.map((component) => (
                  <button
                    key={component.name}
                    onClick={() => {
                      setSelectedComponent(component);
                      setCustomProps(component.defaultProps);
                      setCustomClasses('');
                      setActiveCategory('Properties');
                    }}
                    className={cn(
                      'w-full rounded-lg p-3 text-left transition-colors',
                      selectedComponent?.name === component.name
                        ? 'bg-light-accent/10 text-light-accent retro:bg-retro-accent/10 retro:text-retro-accent multi:bg-multi-accent/10 multi:text-multi-accent dark:bg-dark-accent/10 dark:text-dark-accent'
                        : 'hover:bg-light-accent/5 retro:hover:bg-retro-accent/5 multi:hover:bg-multi-accent/5 dark:hover:bg-dark-accent/5',
                    )}
                  >
                    <div className="font-medium">{component.name}</div>
                    <div className={cn('text-sm', textClasses.secondary)}>
                      {component.category}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview and Customization */}
          <div className="space-y-8">
            {selectedComponent ? (
              <>
                {/* Preview */}
                <section className={cn(cardClasses.base, 'p-6')}>
                  <h2
                    className={cn(
                      'mb-4 text-xl font-semibold',
                      textClasses.primary,
                    )}
                  >
                    Preview
                  </h2>
                  <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed">
                    {selectedComponent && (
                      <selectedComponent.component {...customProps} />
                    )}
                  </div>
                </section>

                {/* Make tabs scrollable on mobile */}
                <div className="overflow-x-auto">
                  <div className="flex min-w-max space-x-4 border-b">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={cn(
                          'whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-colors',
                          activeCategory === category
                            ? 'border-light-accent text-light-accent retro:border-retro-accent retro:text-retro-accent multi:border-multi-accent multi:text-multi-accent dark:border-dark-accent dark:text-dark-accent'
                            : 'border-transparent text-light-text/60 hover:text-light-text/80 retro:text-retro-text/60 retro:hover:text-retro-text/80 multi:text-white/60 multi:hover:text-white/80 dark:text-dark-text/60 dark:hover:text-dark-text/80',
                        )}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {activeCategory === 'Properties' ? (
                  <section className={cn(cardClasses.base, 'p-6')}>
                    <h2
                      className={cn(
                        'mb-4 text-xl font-semibold',
                        textClasses.primary,
                      )}
                    >
                      Properties
                    </h2>
                    <div className="space-y-4">
                      {selectedComponent.customizableProps.map((prop) => (
                        <div key={prop.name} className="space-y-2">
                          <label
                            htmlFor={prop.name}
                            className={cn(
                              'block text-sm font-medium',
                              textClasses.primary,
                            )}
                          >
                            {prop.name}
                          </label>
                          <p className={cn('text-xs', textClasses.secondary)}>
                            {prop.description}
                          </p>
                          {prop.type === 'select' ? (
                            <select
                              id={prop.name}
                              value={customProps[prop.name] || prop.default}
                              onChange={(e) =>
                                setCustomProps((prev) => ({
                                  ...prev,
                                  [prop.name]: e.target.value,
                                }))
                              }
                              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-light-accent focus:outline-none focus:ring-1 focus:ring-light-accent retro:focus:border-retro-accent retro:focus:ring-retro-accent multi:focus:border-multi-accent multi:focus:ring-multi-accent dark:border-gray-600 dark:bg-gray-800 dark:focus:border-dark-accent dark:focus:ring-dark-accent"
                            >
                              {prop.options?.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : prop.type === 'boolean' ? (
                            <input
                              type="checkbox"
                              id={prop.name}
                              checked={customProps[prop.name] || prop.default}
                              onChange={(e) =>
                                setCustomProps((prev) => ({
                                  ...prev,
                                  [prop.name]: e.target.checked,
                                }))
                              }
                              className="h-4 w-4 rounded border-gray-300 text-light-accent focus:ring-light-accent retro:text-retro-accent retro:focus:ring-retro-accent multi:text-multi-accent multi:focus:ring-multi-accent dark:border-gray-600 dark:text-dark-accent dark:focus:ring-dark-accent"
                            />
                          ) : (
                            <input
                              type="text"
                              id={prop.name}
                              value={customProps[prop.name] || prop.default}
                              onChange={(e) =>
                                setCustomProps((prev) => ({
                                  ...prev,
                                  [prop.name]: e.target.value,
                                }))
                              }
                              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-light-accent focus:outline-none focus:ring-1 focus:ring-light-accent retro:focus:border-retro-accent retro:focus:ring-retro-accent multi:focus:border-multi-accent multi:focus:ring-multi-accent dark:border-gray-600 dark:bg-gray-800 dark:focus:border-dark-accent dark:focus:ring-dark-accent"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                ) : (
                  <section className={cn(cardClasses.base, 'p-6')}>
                    <h2
                      className={cn(
                        'mb-4 text-xl font-semibold',
                        textClasses.primary,
                      )}
                    >
                      Tailwind Classes
                    </h2>

                    {/* Class Input */}
                    <div className="mb-4 space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Add Tailwind Class
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newClass}
                          onChange={(e) => setNewClass(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === 'Enter' && handleAddClass()
                          }
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

                    {/* Active Classes */}
                    <div className="mb-4 space-y-2">
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

                    {/* Tailwind Categories */}
                    <div className="space-y-6">
                      {STYLE_CATEGORIES.map((category) => (
                        <div key={category.category} className="space-y-3">
                          <h3
                            className={cn(
                              'text-sm font-medium',
                              textClasses.primary,
                            )}
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
                                  value={
                                    customProps.className
                                      ?.split(' ')
                                      .find((cls: string) =>
                                        cls.startsWith(prop.name.split('-')[0]),
                                      ) || ''
                                  }
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
                  </section>
                )}

                {/* Code Section with better responsiveness */}
                <section className={cn(cardClasses.base, 'p-6')}>
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2
                      className={cn(
                        'text-xl font-semibold',
                        textClasses.primary,
                      )}
                    >
                      Code
                    </h2>
                    <div className="flex items-center gap-2 overflow-hidden">
                      <button
                        onClick={() => setShowSourceCode(!showSourceCode)}
                        className={cn(
                          'text-sm',
                          'text-light-accent hover:text-light-accent/80',
                          'retro:text-retro-accent retro:hover:text-retro-accent/80',
                          'multi:text-multi-accent multi:hover:text-multi-accent/80',
                          'dark:text-dark-accent dark:hover:text-dark-accent/80',
                        )}
                      >
                        {showSourceCode ? 'Show Usage' : 'Show Source'}
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <pre
                      className={cn(
                        'overflow-x-hidden rounded-lg bg-gray-50 p-4 dark:bg-gray-800',
                        'max-h-[600px] overflow-y-auto',
                        'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600',
                      )}
                    >
                      <code
                        className={cn(
                          'block whitespace-pre font-mono text-sm',
                          'min-w-[300px]', // Prevent code from becoming too narrow
                          showSourceCode
                            ? 'lg:max-w-[800px]'
                            : 'lg:max-w-[600px]', // Limit width on larger screens
                        )}
                      >
                        {showSourceCode
                          ? selectedComponent.sourceCode
                          : `<${selectedComponent.name}
  ${Object.entries(customProps)
    .map(
      ([key, value]) =>
        `${key}=${typeof value === 'string' ? `"${value}"` : value}`,
    )
    .join('\n  ')}
/>`}
                      </code>
                    </pre>
                  </div>
                </section>
              </>
            ) : (
              <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
                <p className={cn('text-center', textClasses.secondary)}>
                  Select a component to start customizing
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
