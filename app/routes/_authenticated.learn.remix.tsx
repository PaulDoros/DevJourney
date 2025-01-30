import { json, type LoaderFunctionArgs } from '@remix-run/node';
import {
  useLoaderData,
  useFetcher,
  useNavigation,
  Form,
} from '@remix-run/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '~/lib/utils';

import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { cardClasses, textClasses } from '~/utils/theme-classes';

interface Example {
  id: string;
  title: string;
  description: string;
  explanation: string;
  whenToUse: string[];
  realWorldUses: string[];
  code: string;
  completed: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
}

interface LoaderData {
  user: { id: number; name: string };
  posts: Post[];
  error?: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Simulate database fetch with delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate fetching posts
    const posts: Post[] = [
      {
        id: 1,
        title: 'Getting Started with Remix',
        content: 'Remix is a full stack web framework...',
        author: 'Demo User',
      },
      {
        id: 2,
        title: 'Understanding Loaders',
        content: 'Loaders are a powerful feature...',
        author: 'Demo User',
      },
      {
        id: 3,
        title: 'Data Loading Patterns',
        content: 'There are several patterns for loading data...',
        author: 'Demo User',
      },
    ];

    return json<LoaderData>({
      user: { id: 1, name: 'Demo User' },
      posts,
    });
  } catch (error) {
    console.error('Loader error:', error);
    return json<LoaderData>(
      {
        user: { id: 1, name: 'Demo User' },
        posts: [],
        error: 'Failed to load posts. Please try again later.',
      },
      { status: 500 },
    );
  }
}

export default function RemixLearningRoute() {
  const { user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  // Example states for demos
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState<string | null>(null);
  const [demoData, setDemoData] = useState<any>(null);

  const [examples] = useState<Example[]>([
    {
      id: 'file-based-routing',
      title: 'File-Based Routing in Remix',
      description:
        'Learn how Remix uses file-based routing for clean and intuitive URL structures',
      explanation:
        'Remix uses a file-based routing system where your file structure directly maps to your URL paths. Files in the routes directory automatically become available routes.',
      whenToUse: [
        'When creating new pages in your application',
        'When organizing nested routes',
        'When implementing dynamic routes with parameters',
        'When setting up resource routes for API endpoints',
      ],
      realWorldUses: [
        'Creating a blog with nested categories',
        'Building an e-commerce site with product pages',
        'Setting up an admin dashboard with nested routes',
        'Implementing API endpoints for data fetching',
      ],
      code: `// app/routes/_index.tsx -> "/"
export default function Index() {
  return <h1>Home Page</h1>;
}

// app/routes/blog.$slug.tsx -> "/blog/post-1"
export default function BlogPost() {
  const { slug } = useParams();
  return <h1>Blog Post: {slug}</h1>;
}

// app/routes/products.$category.tsx -> "/products/electronics"
export default function Category() {
  const { category } = useParams();
  return <h1>Category: {category}</h1>;
}`,
      completed: false,
      difficulty: 'beginner',
    },
    {
      id: 'loaders-data-loading',
      title: 'Loaders & Data Loading',
      description:
        'Master data loading with Remix loaders and handle async operations',
      explanation:
        'Loaders in Remix are special server-side functions that load data for your routes. They run before your component renders and can fetch data from APIs or databases.',
      whenToUse: [
        'When you need to fetch data before rendering a page',
        'When accessing databases or external APIs',
        'When performing server-side operations',
        'When handling protected routes with authentication',
      ],
      realWorldUses: [
        'Loading user profile data',
        'Fetching product information',
        'Checking authentication status',
        'Loading blog posts and comments',
      ],
      code: `// Basic loader example
export async function loader({ request }: LoaderFunctionArgs) {
  const posts = await db.post.findMany();
  return json({ posts });
}

// Loader with params
export async function loader({ params }: LoaderFunctionArgs) {
  const post = await db.post.findUnique({
    where: { slug: params.slug }
  });
  if (!post) throw new Response("Not Found", { status: 404 });
  return json({ post });
}

// Using loader data in component
export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}`,
      completed: false,
      difficulty: 'intermediate',
    },
    {
      id: 'actions-mutations',
      title: 'Actions & Form Handling',
      description:
        'Learn how to handle form submissions and mutations in Remix',
      explanation:
        'Actions in Remix handle form submissions and data mutations. They run on the server and can modify data in your database or external services.',
      whenToUse: [
        'When handling form submissions',
        'When creating, updating, or deleting data',
        'When performing server-side validations',
        'When implementing authentication flows',
      ],
      realWorldUses: [
        'User registration forms',
        'Creating new blog posts',
        'Updating user profiles',
        'Processing payments',
      ],
      code: `// Action with form handling
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");

  // Validate the data
  if (!title) {
    return json(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }

  // Create the post
  const post = await db.post.create({
    data: { title, content }
  });

  return redirect(\`/posts/\${post.id}\`);
}

// Using Form in component
export default function NewPost() {
  const actionData = useActionData<typeof action>();
  
  return (
    <Form method="post">
      <input type="text" name="title" />
      {actionData?.errors?.title && (
        <span>{actionData.errors.title}</span>
      )}
      <textarea name="content" />
      <button type="submit">Create Post</button>
    </Form>
  );
}`,
      completed: false,
      difficulty: 'intermediate',
    },
    {
      id: 'error-handling',
      title: 'Error Handling & Boundaries',
      description: 'Implement robust error handling in your Remix applications',
      explanation:
        'Remix provides built-in error handling through ErrorBoundary components and catch boundaries for handling different types of errors gracefully.',
      whenToUse: [
        'When handling API errors',
        'When dealing with 404 pages',
        'When showing user-friendly error messages',
        'When implementing fallback UI for errors',
      ],
      realWorldUses: [
        'Showing 404 pages for missing content',
        'Handling API timeout errors',
        'Displaying validation errors',
        'Managing network errors',
      ],
      code: `// Error Boundary for unexpected errors
export function ErrorBoundary() {
  const error = useRouteError();
  
  return (
    <div className="error-container">
      <h1>Something went wrong</h1>
      <pre>{error.message}</pre>
    </div>
  );
}

// CatchBoundary for expected errors
export function CatchBoundary() {
  const caught = useCatch();
  
  if (caught.status === 404) {
    return <div>Page not found</div>;
  }
  
  return (
    <div>
      <h1>{caught.status} {caught.statusText}</h1>
    </div>
  );
}

// Throwing errors in loader
export async function loader({ params }: LoaderFunctionArgs) {
  const post = await db.post.findUnique({
    where: { id: params.id }
  });
  
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  
  return json({ post });
}`,
      completed: false,
      difficulty: 'advanced',
    },
    {
      id: 'nested-routing',
      title: 'Nested Routes & Layouts',
      description: 'Master nested routing and shared layouts in Remix',
      explanation:
        'Nested routes in Remix allow you to create shared layouts and build complex page structures while keeping your code organized and maintainable.',
      whenToUse: [
        'When creating shared layouts',
        'When building complex navigation structures',
        'When implementing sidebar navigation',
        'When sharing data between parent and child routes',
      ],
      realWorldUses: [
        'Dashboard layouts with navigation',
        'Multi-step forms with progress',
        'Product categories with filters',
        'Settings pages with tabs',
      ],
      code: `// app/routes/_app.tsx (Parent layout)
export default function AppLayout() {
  return (
    <div className="layout">
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/settings">Settings</Link>
      </nav>
      
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  );
}

// app/routes/_app.dashboard.tsx
export default function Dashboard() {
  return <h1>Dashboard</h1>;
}

// app/routes/_app.settings.tsx
export default function Settings() {
  return <h1>Settings</h1>;
}`,
      completed: false,
      difficulty: 'intermediate',
    },
  ]);

  // Function to handle example completion
  const handleExampleComplete = (index: number) => {
    // Implementation similar to React learning route
  };

  // Render demo function
  const renderDemo = (id: string) => {
    switch (id) {
      case 'loaders-data-loading':
        return <LoaderDemo />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className={cn('mb-2 text-3xl font-bold', textClasses.primary)}>
          Learn Remix
        </h1>
        <p className={cn('text-lg', textClasses.secondary)}>
          Master Remix with practical examples and hands-on demos
        </p>
      </div>

      <div className="space-y-12">
        {['beginner', 'intermediate', 'advanced'].map((difficulty) => (
          <div key={difficulty} className="space-y-6">
            <h3 className={cn('text-xl font-semibold', textClasses.primary)}>
              {difficulty === 'beginner' && '🌱 '}
              {difficulty === 'intermediate' && '🚀 '}
              {difficulty === 'advanced' && '⚡ '}
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}{' '}
              Concepts
            </h3>

            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {examples
                .filter((example) => example.difficulty === difficulty)
                .map((example, index) => (
                  <motion.div
                    key={example.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      cardClasses.base,
                      'relative overflow-hidden p-6',
                      example.completed &&
                        'border-green-500 bg-green-50 dark:bg-green-900/20',
                    )}
                  >
                    {/* Card content structure similar to React learning route */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3
                              className={cn(
                                'text-lg font-semibold',
                                textClasses.primary,
                              )}
                            >
                              {example.title}
                            </h3>
                            <span
                              className={cn(
                                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                {
                                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300':
                                    example.difficulty === 'beginner',
                                  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300':
                                    example.difficulty === 'intermediate',
                                  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300':
                                    example.difficulty === 'advanced',
                                },
                              )}
                            >
                              {example.difficulty === 'beginner' && '🌱 '}
                              {example.difficulty === 'intermediate' && '🚀 '}
                              {example.difficulty === 'advanced' && '⚡ '}
                              {example.difficulty.charAt(0).toUpperCase() +
                                example.difficulty.slice(1)}
                            </span>
                          </div>
                          <p className={cn('text-sm', textClasses.secondary)}>
                            {example.description}
                          </p>
                        </div>

                        <div>
                          <h4
                            className={cn(
                              'mb-2 text-sm font-semibold',
                              textClasses.primary,
                            )}
                          >
                            Code Example
                          </h4>
                          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800 md:p-4">
                            <pre className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 overflow-x-auto text-sm">
                              <code className="block whitespace-pre-wrap break-words">
                                {example.code}
                              </code>
                            </pre>
                          </div>
                        </div>

                        <div>
                          <h4
                            className={cn(
                              'mb-2 text-sm font-semibold',
                              textClasses.primary,
                            )}
                          >
                            Understanding
                          </h4>
                          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20 md:p-4">
                            <p className={cn('text-sm', textClasses.secondary)}>
                              {example.explanation}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4
                            className={cn(
                              'mb-2 text-sm font-semibold',
                              textClasses.primary,
                            )}
                          >
                            When to Use
                          </h4>
                          <ul className="list-inside list-disc space-y-1">
                            {example.whenToUse.map((use, i) => (
                              <li
                                key={i}
                                className={cn('text-sm', textClasses.secondary)}
                              >
                                {use}
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
                            Real World Examples
                          </h4>
                          <ul className="list-inside list-disc space-y-1">
                            {example.realWorldUses.map((use, i) => (
                              <li
                                key={i}
                                className={cn('text-sm', textClasses.secondary)}
                              >
                                {use}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {renderDemo(example.id) && (
                          <div>
                            <h4
                              className={cn(
                                'mb-2 text-sm font-semibold',
                                textClasses.primary,
                              )}
                            >
                              Live Demo
                            </h4>
                            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                              {renderDemo(example.id)}
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleExampleComplete(index)}
                        className={cn(
                          'rounded-full p-1',
                          example.completed
                            ? 'text-green-500 hover:text-green-600'
                            : 'text-gray-400 hover:text-gray-500',
                        )}
                        aria-label={
                          example.completed
                            ? 'Mark as incomplete'
                            : 'Mark as complete'
                        }
                      >
                        <CheckCircleIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoaderDemo() {
  const { posts, error } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const isLoading = navigation.state === 'loading';

  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      ) : (
        <>
          <div className="flex justify-between">
            <h3 className={cn('text-lg font-semibold', textClasses.primary)}>
              Posts List Demo
            </h3>
            <Form method="get">
              <button
                type="submit"
                className={cn(
                  'rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600',
                  isLoading && 'opacity-50',
                )}
                disabled={isLoading}
              >
                {isLoading ? 'Refreshing...' : 'Refresh Posts'}
              </button>
            </Form>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className={cn('text-sm font-medium', textClasses.primary)}>
                Available Posts
              </h4>
              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                {posts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className={cn(
                      'w-full border-b border-gray-200 px-4 py-2 text-left transition-colors last:border-b-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800',
                      selectedPost?.id === post.id &&
                        'bg-blue-50 dark:bg-blue-900/30',
                    )}
                  >
                    <div className="text-sm font-medium">{post.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      By {post.author}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className={cn('text-sm font-medium', textClasses.primary)}>
                Selected Post Details
              </h4>
              <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
                {selectedPost ? (
                  <div className="space-y-2">
                    <h5 className="font-medium">{selectedPost.title}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedPost.content}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Author: {selectedPost.author}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Select a post to view details
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
