import { useState, useEffect } from 'react';
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

// Add difficulty level type
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Update Example interface
interface Example {
  id: string;
  title: string;
  description: string;
  code: string;
  explanation: string;
  whenToUse: string[];
  realWorldUses: string[];
  completed: boolean;
  difficulty: DifficultyLevel;
}

const REACT_ACHIEVEMENTS = {
  'jsx-basics': 'JSX Pioneer',
  'component-basics': 'Component Builder',
  'useState-mastery': 'State Manager',
  'event-handling': 'Event Handler',
  'props-master': 'Props Master',
  'useEffect-master': 'Effect Wizard',
  'component-pro': 'Component Architect',
  'array-methods': 'Array Master',
  'forms-validation': 'Form Validator',
  'context-expert': 'Context Expert',
  'performance-pro': 'Performance Pro',
} as const;

export default function ReactLearningRoute() {
  const { user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  // Example state for demos
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: true },
    { id: 2, text: 'Build an app', completed: false },
    { id: 3, text: 'Write clean code', completed: false },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Add to the state declarations at the top
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [demoUser, setDemoUser] = useState<{ name: string; id: number } | null>(
    null,
  );
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState<string | null>(null);

  // Update the examples state declaration
  const [examples, setExamples] = useState<Example[]>([
    // Beginner Level
    {
      id: 'jsx-basics',
      title: 'JSX: Writing HTML in JavaScript',
      description:
        'Learn the basics of JSX - the foundation of React components!',
      explanation:
        'JSX is like writing HTML inside JavaScript. It lets you mix HTML-like code with regular JavaScript to create your webpage elements.',
      whenToUse: [
        'When you need to create any visual elements in React',
        'When you want to embed JavaScript expressions in your HTML',
        'When you need to write cleaner, more readable component code',
        "When you want to structure your component's layout",
      ],
      realWorldUses: [
        'Creating dynamic text content',
        'Building component templates',
        'Displaying user information',
        'Rendering lists of items',
      ],
      code: `// Basic JSX
const greeting = <h1>Hello, World!</h1>;

// JSX with JavaScript expressions
const name = 'John';
const welcome = <h1>Welcome, {name}!</h1>;

// JSX with multiple elements
const userCard = (
  <div className="card">
    <img src="/avatar.jpg" alt="User Avatar" />
    <h2>{user.name}</h2>
    <p>{user.bio}</p>
  </div>
);`,
      completed: false,
      difficulty: 'beginner',
    },
    {
      id: 'component-basics',
      title: 'Basic Components: Your First React Building Block',
      description: 'Create your first React component!',
      explanation:
        'Components are like custom HTML tags you create. Think of them as LEGO pieces that you can combine to build your website.',
      whenToUse: [
        'When you want to create a reusable piece of UI',
        'When you need to break down a page into smaller pieces',
        'When you have a simple UI element that stands alone',
        'When you want to organize your code better',
      ],
      realWorldUses: [
        'Header component',
        'Simple button component',
        'User avatar component',
        'Footer component',
      ],
      code: `// Your first component
function Greeting() {
  return <h1>Hello from React!</h1>;
}

// Component with dynamic content
function Welcome({ name }) {
  return (
    <div>
      <h1>Welcome!</h1>
      <p>Hello {name}, we're glad you're here.</p>
    </div>
  );
}

// Using your components
<div>
  <Greeting />
  <Welcome name="Sarah" />
</div>`,
      completed: false,
      difficulty: 'beginner',
    },
    {
      id: 'useState-mastery',
      title: 'useState: Managing Component State',
      description: 'Learn how to make your components remember things!',
      explanation:
        'useState is like giving your component a memory. It can remember numbers, text, or any other information that might change while someone uses your website.',
      whenToUse: [
        'When you need to store data that changes over time (like a counter or form input)',
        'When you want your component to react to user interactions',
        "When you need to update what's shown on the screen based on user actions",
        'When you want to toggle between different states (like open/closed, light/dark)',
      ],
      realWorldUses: [
        'Shopping cart item count',
        'Form input fields',
        'Toggle switches',
        'User preferences',
      ],
      code: `const [count, setCount] = useState(0);

// Increase the count
const handleClick = () => {
  setCount(count + 1);
};`,
      completed: false,
      difficulty: 'beginner',
    },
    {
      id: 'event-handling',
      title: 'Event Handling: Responding to User Actions',
      description: 'Make your components interactive!',
      explanation:
        "Events let your website respond when users do things like clicking buttons or typing. It's like creating a list of instructions for what should happen when users interact with your page.",
      whenToUse: [
        'When you need to respond to user clicks',
        'When you want to handle form input',
        'When you need to respond to keyboard or mouse actions',
        'When you want to make your UI interactive',
      ],
      realWorldUses: [
        'Button clicks',
        'Form inputs',
        'Menu toggles',
        'Image sliders',
      ],
      code: `// Simple click handler
function ClickButton() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}

// Form input handler
function NameInput() {
  const handleChange = (event) => {
    console.log('New value:', event.target.value);
  };

  return (
    <input 
      type="text"
      onChange={handleChange}
      placeholder="Enter your name"
    />
  );
}`,
      completed: false,
      difficulty: 'beginner',
    },

    // Intermediate Level
    {
      id: 'props-master',
      title: 'Props: Component Communication',
      description: 'Pass data between components!',
      explanation:
        'Props are like settings you can pass to your components. Just like a TV remote controls your TV, props control how your components look and work.',
      whenToUse: [
        'When you need to pass data from a parent to a child component',
        'When you want to make a component reusable with different data',
        'When you need to pass callback functions to handle events',
        'When you want to customize how a component looks or behaves',
      ],
      realWorldUses: [
        'User profile cards with different user data',
        'Product listings with different products',
        'Custom buttons with different text and actions',
        'Form fields with different labels and validations',
      ],
      code: `// UserCard component with props
function UserCard({ name, role, avatar, onEdit }) {
  return (
    <div className="card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{role}</p>
      <button onClick={onEdit}>Edit Profile</button>
    </div>
  );
}

// Using the component
<UserCard
  name="John Doe"
  role="Developer"
  avatar="/john.jpg"
  onEdit={() => openEditModal()}
/>`,
      completed: false,
      difficulty: 'intermediate',
    },
    {
      id: 'conditional-rendering',
      title: 'Conditional Rendering: Showing Content Dynamically',
      description: 'Learn to show or hide content based on conditions!',
      explanation:
        'Conditional rendering is like having a light switch for your content. You can show or hide different parts of your UI based on certain conditions, like user preferences or application state.',
      whenToUse: [
        'When you need to show/hide elements based on conditions',
        'When you want to render different content for different users',
        'When you need to handle loading states',
        'When you want to implement feature toggles',
      ],
      realWorldUses: [
        'Loading spinners',
        'Error messages',
        'User role-based content',
        'Theme switching',
      ],
      code: `// Using ternary operator
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn 
        ? <h1>Welcome back!</h1>
        : <h1>Please log in</h1>
      }
    </div>
  );
}

// Using && operator
function Notification({ message }) {
  return (
    <div>
      {message && (
        <div className="alert">
          {message}
        </div>
      )}
    </div>
  );
}`,
      completed: false,
      difficulty: 'intermediate',
    },
    {
      id: 'array-methods',
      title: 'Array Methods in React',
      description:
        'Master the essential array methods for handling lists and data!',
      explanation:
        'Array methods like map, filter, and reduce are your best friends in React. They help you transform and display lists of data in a clean and efficient way.',
      whenToUse: [
        'When you need to display lists of items',
        'When you need to transform data before displaying it',
        'When you need to filter or search through data',
        'When you need to calculate totals or combine data',
      ],
      realWorldUses: [
        'Product listings with filtering and sorting',
        'Todo lists with completion status',
        'User tables with search functionality',
        'Shopping cart with total calculation',
      ],
      code: `// Different array methods and their uses
// 1. map - Transform each item
const listItems = products.map(product => (
  <ProductCard 
    key={product.id}
    {...product}
  />
));

// 2. filter - Show only matching items
const activeUsers = users.filter(user => user.isActive);

// 3. find - Get a single matching item
const currentUser = users.find(user => user.id === userId);

// 4. reduce - Calculate totals
const cartTotal = items.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);`,
      completed: false,
      difficulty: 'intermediate',
    },
    {
      id: 'forms-validation',
      title: 'Forms and Validation',
      description: 'Handle forms and validate user input!',
      explanation:
        'Forms are everywhere in web apps. Learn how to manage form state, handle submissions, and validate user input effectively.',
      whenToUse: [
        'When you need to collect user input',
        'When you need to validate data before submission',
        'When you need to handle multiple form fields',
        'When you need to show error messages',
      ],
      realWorldUses: [
        'User registration forms',
        'Contact forms',
        'Payment information forms',
        'Profile edit forms',
      ],
      code: `const [errors, setErrors] = useState({});

const validateForm = () => {
  const newErrors = {};
  if (!formData.name) newErrors.name = 'Name is required';
  if (!formData.email) newErrors.email = 'Email is required';
  return newErrors;
};

const handleSubmit = (e) => {
  e.preventDefault();
  const newErrors = validateForm();
  if (Object.keys(newErrors).length === 0) {
    // Submit form
    console.log('Form is valid:', formData);
  } else {
    setErrors(newErrors);
  }
};`,
      completed: false,
      difficulty: 'intermediate',
    },
    {
      id: 'custom-hooks',
      title: 'Custom Hooks: Create Reusable Logic',
      description:
        'Learn to create your own hooks to share logic between components',
      explanation:
        'Custom hooks are functions that let you extract component logic into reusable functions. They start with "use" and can call other hooks.',
      whenToUse: [
        'When you have complex logic that needs to be reused across components',
        'When you want to extract stateful logic from a component',
        'When you need to share real-time data or state updates',
        'When handling complex form validation or API calls',
      ],
      realWorldUses: [
        'Authentication hook (useAuth)',
        'Form validation hook (useForm)',
        'Window size hook (useWindowSize)',
        'API data fetching hook (useFetch)',
      ],
      code: `// Custom hook for handling form state
function useForm(initialState = {}) {
  const [values, setValues] = useState(initialState);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => setValues(initialState);
  
  return { values, handleChange, resetForm };
}

// Using the custom hook
function SignupForm() {
  const { values, handleChange, resetForm } = useForm({
    username: '',
    email: '',
    password: ''
  });

  return (
    <form>
      <input
        name="username"
        value={values.username}
        onChange={handleChange}
      />
      {/* Other form fields */}
    </form>
  );
}`,
      completed: false,
      difficulty: 'intermediate',
    },
    {
      id: 'error-boundaries',
      title: 'Error Boundaries: Graceful Error Handling',
      description:
        'Learn to handle errors gracefully in your React applications',
      explanation:
        'Error boundaries are React components that catch JavaScript errors anywhere in their child component tree and display a fallback UI instead of crashing.',
      whenToUse: [
        'When you need to catch and handle errors in component trees',
        'When you want to prevent the entire app from crashing',
        'When you need to log errors to an error reporting service',
        'When you want to show user-friendly error messages',
      ],
      realWorldUses: [
        'Handling API errors gracefully',
        'Catching rendering errors in components',
        'Showing fallback UI for failed component loads',
        'Error logging and monitoring',
      ],
      code: `class ErrorBoundary extends React.Component {
        state = { hasError: false, error: null };
        
        static getDerivedStateFromError(error) {
          return { hasError: true, error };
        }
        
        componentDidCatch(error, errorInfo) {
          // Log error to error reporting service
          logErrorToService(error, errorInfo);
        }
        
        render() {
          if (this.state.hasError) {
            return (
              <div className="error-ui">
                <h2>Something went wrong!</h2>
                <button onClick={() => this.setState({ hasError: false })}>
                  Try again
                </button>
              </div>
            );
          }
          
          return this.props.children;
        }
      }

      // Using Error Boundary
      <ErrorBoundary>
        <UserProfile />
      </ErrorBoundary>`,
      completed: false,
      difficulty: 'intermediate',
    },
    {
      id: 'suspense-lazy',
      title: 'Suspense & Lazy Loading',
      description: 'Optimize your app with code splitting and lazy loading',
      explanation:
        'Suspense lets you specify loading states for parts of your app that are loading, while lazy loading helps split your code into smaller chunks that load on demand.',
      whenToUse: [
        'When you have large components that are not immediately needed',
        'When you want to improve initial page load time',
        'When implementing route-based code splitting',
        'When showing loading states for async operations',
      ],
      realWorldUses: [
        'Loading different pages/routes on demand',
        'Lazy loading heavy UI components',
        'Showing loading spinners during data fetch',
        'Optimizing bundle size for better performance',
      ],
      code: `// Lazy loading a component
const HeavyComponent = React.lazy(() => 
  import('./HeavyComponent')
);

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}

// Route-based code splitting
const Dashboard = React.lazy(() => 
  import('./routes/Dashboard')
);
const Settings = React.lazy(() => 
  import('./routes/Settings')
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}`,
      completed: false,
      difficulty: 'advanced',
    },
    {
      id: 'concurrent-features',
      title: 'Concurrent Features & Transitions',
      description: "Learn about React 18's concurrent rendering features",
      explanation:
        'Concurrent features in React 18 allow you to handle multiple state updates with different priorities, making your apps more responsive.',
      whenToUse: [
        'When handling expensive state updates',
        'When you need to keep the UI responsive during updates',
        'When implementing search-as-you-type functionality',
        'When dealing with complex animations and transitions',
      ],
      realWorldUses: [
        'Implementing responsive search interfaces',
        'Handling complex data visualizations',
        'Managing state updates in large forms',
        'Optimizing user interactions in complex UIs',
      ],
      code: `// Using useTransition for non-urgent updates
      function SearchResults() {
        const [query, setQuery] = useState('');
        const [isPending, startTransition] = useTransition();
        const [results, setResults] = useState([]);
        
        const handleSearch = (e) => {
          // Urgent update: Update input immediately
          setQuery(e.target.value);
          
          // Non-urgent update: Wrap in startTransition
          startTransition(() => {
            // Expensive search operation
            setResults(searchDatabase(e.target.value));
          });
        };
        
        return (
          <div>
            <input value={query} onChange={handleSearch} />
            {isPending ? (
              <Spinner />
            ) : (
              <ResultsList results={results} />
            )}
          </div>
        );
      }

      // Using useDeferredValue
      function ProductList({ products }) {
        const deferredProducts = useDeferredValue(products);
        
        return (
          <div>
            {deferredProducts.map(product => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
        );
      }`,
      completed: false,
      difficulty: 'advanced',
    },

    // Advanced Level
    {
      id: 'useEffect-master',
      title: 'useEffect and Async Operations',
      description: 'Master asynchronous operations and side effects!',
      explanation:
        'useEffect combined with async/await lets you handle complex operations like API calls and data fetching. Think of it as setting up a series of automated tasks that run at specific times.',
      whenToUse: [
        'When you need to fetch data from APIs',
        'When you need to handle multiple async operations',
        'When you need to manage subscriptions or cleanup',
        'When you need to sync with external systems',
      ],
      realWorldUses: [
        'Loading and updating user data',
        'Real-time data synchronization',
        'WebSocket connections',
        'Complex form submissions with API calls',
      ],
      code: `// Advanced async/await patterns with useEffect
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Using async IIFE pattern
    (async () => {
      try {
        setLoading(true);
        // Parallel API calls
        const [userResponse, postsResponse] = await Promise.all([
          fetch(\`/api/users/\${userId}\`),
          fetch(\`/api/users/\${userId}/posts\`)
        ]);

        // Handle potential errors
        if (!userResponse.ok || !postsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        // Parse responses
        const userData = await userResponse.json();
        const postsData = await postsResponse.json();

        setUser(userData);
        setPosts(postsData);
      } catch (err) {
        setError(err.message);
        // Log error to monitoring service
        console.error('Dashboard Error:', err);
      } finally {
        setLoading(false);
      }
    })();

    // Cleanup function
    return () => {
      // Cancel any pending requests
      // Reset states
      setUser(null);
      setPosts([]);
      setLoading(false);
    };
  }, [userId]);

  // Component rendering logic
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <NotFound />;

  return (
    <Dashboard user={user} posts={posts} />
  );
}`,
      completed: false,
      difficulty: 'advanced',
    },
    {
      id: 'context-expert',
      title: 'Context and Global State Management',
      description: 'Share data across your entire app!',
      explanation:
        'Context is like a TV broadcast - it lets you share information with many components at once without passing it through each component in between.',
      whenToUse: [
        'When you need to share data between many components',
        'When passing props through many layers becomes cumbersome (prop drilling)',
        'When you need app-wide settings or preferences',
        'When you need to manage global state like user authentication',
      ],
      realWorldUses: [
        'Theme settings (light/dark mode)',
        'User authentication state',
        'Shopping cart data',
        'Language preferences',
      ],
      code: `// Create a context
const ThemeContext = createContext();

// Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Using the context in any component
function ThemeButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}`,
      completed: false,
      difficulty: 'advanced',
    },
    {
      id: 'performance-pro',
      title: 'Performance Optimization',
      description:
        'Learn to optimize your React components for better performance!',
      explanation:
        'Performance optimization in React is like fine-tuning a car engine. You can make your app run faster by preventing unnecessary re-renders and optimizing heavy computations.',
      whenToUse: [
        'When your app feels slow or laggy',
        'When you have components that re-render too often',
        'When you need to optimize expensive calculations',
        "When you're dealing with large lists or complex UI",
      ],
      realWorldUses: [
        'Long lists of items',
        'Real-time data updates',
        'Complex dashboards',
        'Animation-heavy interfaces',
      ],
      code: `// Using React.memo for component memoization
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  return (
    <div>
      {/* Complex rendering logic */}
    </div>
  );
});

// Using useMemo for expensive calculations
function DataGrid({ items }) {
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => b.value - a.value);
  }, [items]);

  return (
    <div>
      {sortedItems.map(item => (
        <Row key={item.id} data={item} />
      ))}
    </div>
  );
}

// Using useCallback for stable callbacks
function ParentComponent() {
  const handleClick = useCallback(() => {
    // Handle click logic
  }, []); // Empty deps array = stable reference

  return <ChildComponent onClick={handleClick} />;
}`,
      completed: false,
      difficulty: 'advanced',
    },
  ]);

  // Update the handleExampleComplete function with proper typing
  const handleExampleComplete = (index: number) => {
    const example = examples[index];
    setExamples((prevExamples: Example[]) =>
      prevExamples.map((ex: Example, i: number) =>
        i === index ? { ...ex, completed: !ex.completed } : ex,
      ),
    );

    if (!example.completed) {
      fetcher.submit(
        {
          achievementType: 'react-learning',
          exampleId: example.id,
          achievementName:
            REACT_ACHIEVEMENTS[example.id as keyof typeof REACT_ACHIEVEMENTS],
          progress: index + 1,
          totalExamples: examples.length,
        },
        {
          method: 'post',
          action: '/api/track-achievement',
        },
      );
    }
  };

  // Live demos
  const renderDemo = (id: string) => {
    switch (id) {
      case 'useState-mastery':
        return (
          <div className="space-y-4">
            <p className="text-center text-2xl">{count}</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setCount((c) => c - 1)}
                className={cn('rounded-md px-4 py-2', interactiveClasses.base)}
              >
                Decrease
              </button>
              <button
                onClick={() => setCount((c) => c + 1)}
                className={cn('rounded-md px-4 py-2', interactiveClasses.base)}
              >
                Increase
              </button>
            </div>
          </div>
        );

      case 'useEffect-master':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h5 className="mb-2 font-semibold">Async Data Loading Demo</h5>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">
                    Simulate API Call
                  </label>
                  <button
                    onClick={async () => {
                      setDemoLoading(true);
                      setDemoError(null);
                      try {
                        // Simulate API delay
                        await new Promise((resolve) =>
                          setTimeout(resolve, 1000),
                        );

                        // Simulate API response
                        const mockUser = {
                          id: Math.floor(Math.random() * 1000),
                          name: ['Alice', 'Bob', 'Charlie', 'Diana'][
                            Math.floor(Math.random() * 4)
                          ],
                        };
                        setDemoUser(mockUser);
                      } catch (err) {
                        setDemoError('Failed to load user');
                      } finally {
                        setDemoLoading(false);
                      }
                    }}
                    className={cn(
                      'mt-2 rounded-md px-4 py-2',
                      interactiveClasses.base,
                    )}
                    disabled={demoLoading}
                  >
                    {demoLoading ? 'Loading...' : 'Load Random User'}
                  </button>
                </div>

                <div className="mt-4">
                  {demoLoading && (
                    <div className="text-sm text-blue-600">
                      Loading user data...
                    </div>
                  )}
                  {demoError && (
                    <div className="text-sm text-red-600">
                      Error: {demoError}
                    </div>
                  )}
                  {demoUser && !demoLoading && (
                    <div className="rounded-md bg-green-50 p-3">
                      <p className="text-sm text-green-800">
                        Welcome, {demoUser.name}! (ID: {demoUser.id})
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This demo simulates an async API call with loading states,
                    error handling, and success states. Click the button
                    multiple times to see different users loaded!
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'component-pro':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add an item..."
              className="w-full rounded-md border border-gray-300 px-4 py-2 dark:border-gray-600"
            />
            <button
              onClick={() => {
                if (text) {
                  setItems([...items, text]);
                  setText('');
                }
              }}
              className={cn('rounded-md px-4 py-2', interactiveClasses.base)}
            >
              Add Item
            </button>
            <ul className="list-disc pl-5">
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        );

      case 'context-expert':
        return (
          <div className="space-y-4">
            <div
              className={cn(
                'rounded-md p-4 transition-colors',
                theme === 'light'
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-white',
              )}
            >
              <p>Current theme: {theme}</p>
              <button
                onClick={() =>
                  setTheme((t) => (t === 'light' ? 'dark' : 'light'))
                }
                className={cn(
                  'mt-2 rounded-md px-4 py-2',
                  interactiveClasses.base,
                )}
              >
                Toggle Theme
              </button>
            </div>
          </div>
        );

      case 'array-methods':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h5 className="mb-2 font-semibold">
                Todo List with Array Methods
              </h5>
              <div className="space-y-2">
                {todos.map((todo) => (
                  <div key={todo.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => {
                        setTodos(
                          todos.map((t) =>
                            t.id === todo.id
                              ? { ...t, completed: !t.completed }
                              : t,
                          ),
                        );
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className={todo.completed ? 'line-through' : ''}>
                      {todo.text}
                    </span>
                    <button
                      onClick={() =>
                        setTodos(todos.filter((t) => t.id !== todo.id))
                      }
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'event-handling':
        return (
          <div className="space-y-4">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">
                  Click Counter
                </label>
                <button
                  onClick={() => setCount((c) => c + 1)}
                  className={cn(
                    'mt-1 rounded-md px-4 py-2',
                    interactiveClasses.base,
                  )}
                >
                  Clicked {count} times
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Mouse Position
                </label>
                <div
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setText(
                      `X: ${e.clientX - rect.left}, Y: ${e.clientY - rect.top}`,
                    );
                  }}
                  className="h-24 rounded-md border border-gray-300 p-2"
                >
                  {text || 'Move mouse here'}
                </div>
              </div>
            </form>
          </div>
        );

      case 'search-filter':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search todos..."
              className="w-full rounded-md border border-gray-300 px-4 py-2"
            />
            <div className="space-y-2">
              {todos
                .filter((todo) =>
                  todo.text.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((todo) => (
                  <div key={todo.id} className="flex items-center gap-2">
                    <span>{todo.text}</span>
                    <span
                      className={cn(
                        'ml-auto rounded-full px-2 py-1 text-xs',
                        todo.completed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800',
                      )}
                    >
                      {todo.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        );

      case 'forms-validation':
        return (
          <div className="space-y-4">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
                />
              </div>
              <button
                type="submit"
                className={cn('rounded-md px-4 py-2', interactiveClasses.base)}
              >
                Submit Form
              </button>
            </form>
          </div>
        );

      case 'conditional-rendering':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">
                User Logged In
              </label>
              <input
                type="checkbox"
                checked={isLoggedIn}
                onChange={(e) => setIsLoggedIn(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Notification Message
              </label>
              <input
                type="text"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="Enter a message"
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
              />
            </div>
            <div className="mt-4">
              <h5 className="font-medium">Result:</h5>
              <div className="mt-2 space-y-2">
                <DemoGreeting isLoggedIn={isLoggedIn} />
                <DemoNotification message={notificationMessage} />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Add these component definitions before the renderDemo function
  function DemoGreeting({ isLoggedIn }: { isLoggedIn: boolean }) {
    return (
      <div
        className={cn(
          'rounded-md p-3',
          isLoggedIn ? 'bg-green-100' : 'bg-yellow-100',
        )}
      >
        {isLoggedIn ? (
          <h1 className="text-green-800">Welcome back!</h1>
        ) : (
          <h1 className="text-yellow-800">Please log in</h1>
        )}
      </div>
    );
  }

  function DemoNotification({ message }: { message: string }) {
    return (
      <div>
        {message && (
          <div className="rounded-md bg-blue-100 p-3 text-blue-800">
            {message}
          </div>
        )}
      </div>
    );
  }

  // Add difficulty badge component
  function DifficultyBadge({ level }: { level: DifficultyLevel }) {
    const colors = {
      beginner: 'bg-green-100 text-green-800 dark:bg-green-900/20',
      intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20',
      advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20',
    };

    return (
      <span
        className={cn(
          'rounded-full px-2 py-1 text-xs font-medium',
          colors[level],
        )}
      >
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  }

  return (
    <div className="min-h-0 w-full flex-1 overflow-y-auto">
      <div className="container mx-auto space-y-8 px-4 py-6 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="prose dark:prose-invert max-w-none">
          <h2
            className={cn(
              'text-xl font-bold md:text-2xl lg:text-3xl',
              textClasses.primary,
            )}
          >
            React Fundamentals
          </h2>
          <p className={cn('text-sm md:text-base', textClasses.secondary)}>
            Start your React journey with beginner-friendly examples and
            progress to advanced concepts. Each section is tailored to your
            experience level, so you can learn at your own pace.
          </p>
        </div>

        {/* Render each difficulty section */}
        {(['beginner', 'intermediate', 'advanced'] as const).map(
          (difficulty) => (
            <div key={difficulty} className="space-y-6">
              <h3
                className={cn(
                  'text-lg font-semibold md:text-xl',
                  textClasses.primary,
                )}
              >
                {difficulty === 'beginner' && '🌱 '}
                {difficulty === 'intermediate' && '�� '}
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
                              <DifficultyBadge level={example.difficulty} />
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
                              <p
                                className={cn('text-sm', textClasses.secondary)}
                              >
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
                                  className={cn(
                                    'text-sm',
                                    textClasses.secondary,
                                  )}
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
                                  className={cn(
                                    'text-sm',
                                    textClasses.secondary,
                                  )}
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
          ),
        )}
      </div>
    </div>
  );
}
