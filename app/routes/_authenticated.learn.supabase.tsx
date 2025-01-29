import { json } from '@remix-run/node';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '~/lib/utils';
import { cardClasses, textClasses } from '~/utils/theme-classes';
import {
  KeyIcon,
  BoltIcon,
  CodeBracketIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';
import { Database } from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  code: string;
  explanation: string;
  steps: string[];
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'database-setup',
    title: 'Database Setup',
    icon: Database,
    description: 'Learn how to set up and manage your Supabase database',
    explanation: `Supabase provides a powerful PostgreSQL database with built-in features. Here's how to set it up with Remix:`,
    steps: [
      'Create a new Supabase project',
      'Set up database tables and relationships',
      'Configure Row Level Security (RLS)',
      'Connect to your Remix application',
    ],
    code: `// 1. Install Supabase client
npm install @supabase/supabase-js

// 2. Initialize Supabase client (utils/supabase.server.ts)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// 3. Create a table (SQL)
CREATE TABLE posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

// 4. Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

// 5. Create a policy
CREATE POLICY "Users can read all posts"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Users can only insert their own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);`,
  },
  {
    id: 'authentication',
    title: 'Authentication',
    icon: KeyIcon,
    description: 'Implement user authentication with Supabase Auth',
    explanation:
      'Supabase provides a complete authentication system with multiple providers and session management.',
    steps: [
      'Set up authentication providers',
      'Implement sign up and sign in',
      'Handle session management',
      'Protect routes and data',
    ],
    code: `// 1. Auth Provider Component (components/AuthProvider.tsx)
import { createBrowserClient } from '@supabase/ssr';

export function AuthProvider() {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    )
  );

  return (
    <Form method="post">
      <button
        onClick={() => supabase.auth.signInWithOAuth({
          provider: 'github'
        })}
      >
        Sign in with GitHub
      </button>
    </Form>
  );
}

// 2. Session handling (root.tsx)
export async function loader({ request }: LoaderFunctionArgs) {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!
  };

  const response = new Response();
  const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    request,
    response,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return json(
    { env, session },
    {
      headers: response.headers,
    }
  );
}`,
  },
  {
    id: 'realtime',
    title: 'Real-time Features',
    icon: BoltIcon,
    description: 'Implement real-time updates with Supabase',
    explanation:
      'Supabase provides real-time capabilities through PostgreSQL subscriptions.',
    steps: [
      'Enable real-time for tables',
      'Subscribe to changes',
      'Handle real-time events',
      'Update UI in real-time',
    ],
    code: `// 1. Enable real-time for a table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

// 2. Subscribe to changes in your component
function ChatRoom() {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          {message.content}
        </div>
      ))}
    </div>
  );
}`,
  },
  {
    id: 'api-integration',
    title: 'API Integration',
    icon: CodeBracketIcon,
    description: 'Learn how to integrate Supabase APIs with Remix',
    explanation:
      'Supabase provides auto-generated APIs for your database tables.',
    steps: [
      'Use Supabase client in loaders',
      'Handle mutations with actions',
      'Implement error handling',
      'Optimize performance',
    ],
    code: `// 1. Loader example (routes/posts.tsx)
export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = createServerSupabase(request);
  
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return json({ posts });
}

// 2. Action example
export async function action({ request }: ActionFunctionArgs) {
  const { supabase } = createServerSupabase(request);
  const formData = await request.formData();
  
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: formData.get('title'),
      content: formData.get('content'),
      user_id: formData.get('user_id')
    })
    .select()
    .single();

  if (error) {
    return json({ error: error.message }, { status: 400 });
  }

  return redirect(\`/posts/\${data.id}\`);
}`,
  },
];

export default function SupabaseLearningRoute() {
  const [showCode, setShowCode] = useState<Record<string, boolean>>({});

  const toggleCode = (sectionId: string) => {
    setShowCode((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className={cn('mb-2 text-3xl font-bold', textClasses.primary)}>
          Supabase Integration Guide
        </h1>
        <p className={cn('text-lg', textClasses.secondary)}>
          Learn how to integrate Supabase with your Remix application
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {GUIDE_SECTIONS.map((section) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(cardClasses.base, 'relative overflow-hidden p-6')}
          >
            <div className="mb-4 flex items-center gap-3">
              <section.icon className="h-6 w-6 text-blue-500" />
              <h2 className={cn('text-xl font-semibold', textClasses.primary)}>
                {section.title}
              </h2>
            </div>

            <p className={cn('mb-4 text-sm', textClasses.secondary)}>
              {section.description}
            </p>

            <div className="mb-4">
              <h3
                className={cn('mb-2 text-sm font-medium', textClasses.primary)}
              >
                Key Steps
              </h3>
              <ul className="list-inside list-disc space-y-1">
                {section.steps.map((step, index) => (
                  <li
                    key={index}
                    className={cn('text-sm', textClasses.secondary)}
                  >
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3
                className={cn('mb-2 text-sm font-medium', textClasses.primary)}
              >
                Explanation
              </h3>
              <p className={cn('text-sm', textClasses.secondary)}>
                {section.explanation}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className={cn('text-sm font-medium', textClasses.primary)}>
                  Code Example
                </h3>
                <button
                  onClick={() => toggleCode(section.id)}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-blue-500 hover:text-blue-600"
                >
                  {showCode[section.id] ? 'Hide Code' : 'Show Code'}
                  <ClipboardIcon className="h-4 w-4" />
                </button>
              </div>
              {showCode[section.id] && (
                <pre className="max-h-96 overflow-y-auto rounded-lg bg-gray-50 p-4 text-sm dark:bg-gray-800">
                  <code className="block whitespace-pre-wrap break-words font-mono">
                    {section.code}
                  </code>
                </pre>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
