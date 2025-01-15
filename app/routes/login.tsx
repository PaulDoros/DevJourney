import {
  json,
  LoaderFunctionArgs,
  redirect,
  type ActionFunctionArgs,
} from '@remix-run/node';
import { Form, useActionData, useNavigation, Link } from '@remix-run/react';
import { Card } from '~/components/ui/Card';
import { ThemeSwitcher } from '~/components/ThemeSwitcher';
import { createServerSupabase } from '~/utils/supabase';
import { getEnvVars } from '~/utils/env.server';
import {
  createUserSession,
  getUserFromSession as A,
} from '~/utils/auth.server';
import { getUserFromSession } from '~/utils/session.server';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

type ActionData =
  | { error: string; message?: never }
  | { message: string; error?: never }
  | undefined;

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserFromSession(request);

  // If user is already logged in, redirect to home
  if (user) {
    return redirect('/');
  }

  // Get the redirectTo parameter
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirectTo') || '/';

  return json({ redirectTo });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  const email = formData.get('email');
  const password = formData.get('password');

  if (!intent) {
    return json<ActionData>(
      { error: 'Invalid form submission' },
      { status: 400 },
    );
  }

  const supabase = createServerSupabase(request);

  try {
    // Handle social logins
    if (['github', 'google'].includes(intent.toString())) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: intent.toString() as 'github' | 'google',
        options: {
          redirectTo: `${process.env.PUBLIC_URL || 'http://localhost:3000'}/auth/callback`,
          queryParams:
            intent.toString() === 'google'
              ? {
                  access_type: 'offline',
                  prompt: 'consent',
                }
              : undefined,
        },
      });
      if (error) throw error;
      return redirect(data.url);
    }

    // Handle email/password auth
    if (typeof email !== 'string' || typeof password !== 'string') {
      return json<ActionData>(
        { error: 'Invalid form submission' },
        { status: 400 },
      );
    }

    if (intent === 'signup') {
      // Handle signup
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
        },
      );

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('No user returned from signup');

      // Create user profile in our database
      const { data: user, error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            username: email.split('@')[0],
            is_guest: false,
          },
        ])
        .select()
        .single();

      if (profileError) throw profileError;

      return json<ActionData>({ message: 'Account created successfully!' });
    } else {
      // Handle signin
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (signInError) throw signInError;
      if (!signInData.user) throw new Error('No user returned from signin');

      const env = getEnvVars();

      console.log('Environment loaded:', {
        url: env.SUPABASE_URL.slice(0, 20),
        serviceKey: {
          full: env.SUPABASE_SERVICE_ROLE_KEY,
          start: env.SUPABASE_SERVICE_ROLE_KEY.slice(0, 10),
          length: env.SUPABASE_SERVICE_ROLE_KEY.length,
        },
      });

      // Use service role client for admin access
      const adminClient = createClient(
        env.SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        },
      );

      // Always try to create/update the profile
      const { data: user, error: upsertError } = await adminClient
        .from('users')
        .upsert(
          {
            id: signInData.user.id,
            email: signInData.user.email,
            username: email.split('@')[0],
            is_guest: false,
            points: 0,
            achievements: [],
          },
          { onConflict: 'id', ignoreDuplicates: false },
        )
        .select('*')
        .single();

      if (upsertError) {
        throw upsertError;
      }

      return createUserSession(signInData.user.id, '/');
    }
  } catch (error: any) {
    return json<ActionData>({ error: error.message }, { status: 400 });
  }
}

const SocialButtons = ({ isSubmitting }: { isSubmitting: boolean }) => {
  const socialProviders = [
    {
      name: 'google',
      label: 'Google',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 3.36 2.16 2.16 2.84 5.213 2.84 7.667 0 .76-.053 1.467-.173 2.053H12.48z"
          />
        </svg>
      ),
    },
    {
      name: 'github',
      label: 'GitHub',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {socialProviders.map((provider) => (
        <button
          key={provider.name}
          type="submit"
          name="intent"
          value={provider.name}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-gray-300 bg-light-primary px-4 py-2.5 text-sm font-medium text-light-text hover:bg-light-secondary disabled:opacity-50 retro:border-retro-text/30 retro:bg-retro-primary retro:text-retro-text retro:hover:bg-retro-secondary multi:border-white/50 multi:bg-multi-primary/60 multi:text-white multi:shadow-md multi:transition-all multi:hover:scale-105 multi:hover:bg-multi-primary/80 multi:hover:shadow-lg dark:border-gray-600 dark:bg-dark-primary dark:text-dark-text dark:hover:bg-dark-secondary"
        >
          <div className="flex items-center justify-center gap-2">
            {provider.icon}
            Continue with {provider.label}
          </div>
        </button>
      ))}
    </div>
  );
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-light-secondary retro:bg-retro-secondary multi:bg-gradient-to-br multi:from-multi-gradient-1 multi:via-multi-gradient-2 multi:to-multi-gradient-3 dark:bg-dark-secondary">
      <div className="fixed right-4 top-4 z-50">
        <ThemeSwitcher />
      </div>

      <Card className="w-full max-w-sm bg-light-primary p-6 shadow-lg retro:bg-retro-primary multi:multi-card dark:bg-dark-primary">
        <h2 className="mb-6 text-center text-2xl font-bold text-light-text retro:text-retro-text multi:text-white multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>
        {/* @ts-expect-error - We know message exists in error case */}
        {actionData?.error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-600 retro:bg-red-200 retro:text-red-800 multi:bg-red-900/50 multi:text-white multi:drop-shadow-sm dark:bg-red-900/30 dark:text-red-400">
            {/* @ts-expect-error - We know message exists in error case */}
            {actionData.error}
          </div>
        )}
        {/* @ts-expect-error - We know message exists in success case */}
        {actionData?.message && (
          <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-600 retro:bg-green-200 retro:text-green-800 multi:bg-green-900/50 multi:text-white multi:drop-shadow-sm dark:bg-green-900/30 dark:text-green-400">
            {/* @ts-expect-error - We know message exists in success case */}
            {actionData.message}
          </div>
        )}

        <Form method="post" className="space-y-4">
          <SocialButtons isSubmitting={isSubmitting} />
        </Form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 retro:border-retro-text/30 multi:border-white/50 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-light-primary px-2 text-light-text retro:bg-retro-primary retro:text-retro-text multi:bg-multi-primary/60 multi:bg-transparent multi:text-white multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:bg-dark-primary dark:text-dark-text">
              or continue with email
            </span>
          </div>
        </div>

        <Form method="post" className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-light-text retro:text-retro-text multi:text-white multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="block w-full rounded-lg border border-gray-300 bg-light-primary px-3 py-2.5 text-sm text-light-text focus:border-light-accent focus:ring-2 focus:ring-light-accent retro:border-retro-text/30 retro:bg-retro-secondary retro:text-retro-text retro:focus:border-retro-accent retro:focus:ring-retro-accent multi:border-white/50 multi:bg-multi-primary/60 multi:text-white multi:placeholder-white/70 multi:focus:border-white multi:focus:ring-white dark:border-gray-600 dark:bg-dark-secondary dark:text-dark-text dark:focus:border-dark-accent dark:focus:ring-dark-accent"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-light-text retro:text-retro-text multi:text-white multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="block w-full rounded-lg border border-gray-300 bg-light-primary px-3 py-2.5 text-sm text-light-text focus:border-light-accent focus:ring-2 focus:ring-light-accent retro:border-retro-text/30 retro:bg-retro-secondary retro:text-retro-text retro:focus:border-retro-accent retro:focus:ring-retro-accent multi:border-white/50 multi:bg-multi-primary/60 multi:text-white multi:placeholder-white/70 multi:focus:border-white multi:focus:ring-white dark:border-gray-600 dark:bg-dark-secondary dark:text-dark-text dark:focus:border-dark-accent dark:focus:ring-dark-accent"
              required
            />
          </div>

          <button
            type="submit"
            name="intent"
            value={isSignUp ? 'signup' : 'signin'}
            disabled={isSubmitting}
            className="w-full rounded-lg bg-light-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-light-accent/90 disabled:opacity-50 retro:bg-retro-accent retro:hover:bg-retro-accent/90 multi:bg-multi-gradient multi:from-multi-gradient-1 multi:via-multi-gradient-2 multi:to-multi-gradient-3 multi:text-white multi:shadow-lg multi:transition-all multi:hover:scale-105 multi:hover:animate-gradient multi:hover:shadow-xl multi:disabled:opacity-70 dark:bg-dark-accent dark:hover:bg-dark-accent/90"
          >
            {isSubmitting
              ? isSignUp
                ? 'Creating account...'
                : 'Signing in...'
              : isSignUp
                ? 'Create Account'
                : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-sm text-light-accent hover:text-light-accent/90 retro:text-retro-accent retro:hover:text-retro-accent/90 multi:font-medium multi:text-white multi:transition-all multi:hover:scale-105 multi:hover:text-multi-accent dark:text-dark-accent dark:hover:text-dark-accent/90"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </Form>

        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 retro:border-retro-text/30 multi:border-white/50 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-light-primary px-2 text-light-text retro:bg-retro-primary retro:text-retro-text multi:bg-transparent multi:text-white multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:bg-dark-primary dark:text-dark-text">
                or
              </span>
            </div>
          </div>

          <Link
            to="/guest"
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg border-2 border-gray-300 px-4 py-2.5 text-sm font-medium text-light-text hover:bg-light-secondary retro:border-retro-text/30 retro:text-retro-text retro:hover:bg-retro-secondary multi:border-white/50 multi:bg-multi-primary/60 multi:text-white multi:shadow-md multi:transition-all multi:hover:scale-105 multi:hover:bg-multi-primary/80 multi:hover:shadow-lg dark:border-gray-600 dark:text-dark-text dark:hover:bg-dark-secondary"
          >
            Continue as Guest
          </Link>
        </div>
      </Card>
    </div>
  );
}
