import { json, redirect, type ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useNavigation, Link } from '@remix-run/react';
import { Card } from '~/components/ui/Card';
import { ThemeSwitcher } from '~/components/ThemeSwitcher';
import { createServerSupabase } from '~/utils/supabase';
import { useState } from 'react';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  const email = formData.get('email');
  const password = formData.get('password');

  if (!intent) {
    return json({ error: 'Invalid form submission' }, { status: 400 });
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
      return json({ error: 'Invalid form submission' }, { status: 400 });
    }

    const { error } =
      intent === 'signup'
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${process.env.PUBLIC_URL}/auth/callback`,
            },
          })
        : await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;

    if (intent === 'signup') {
      return json({
        message: 'Check your email to confirm your account!',
      });
    }

    return redirect('/dashboard');
  } catch (error: any) {
    return json({ error: error.message }, { status: 400 });
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
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
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
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-light-secondary px-4 py-8 dark:bg-dark-secondary">
      <div className="fixed right-4 top-4 z-50">
        <ThemeSwitcher />
      </div>

      <Card className="w-full max-w-sm bg-light-primary p-6 shadow-lg dark:bg-dark-primary">
        <h2 className="mb-6 text-center text-2xl font-bold">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>

        {actionData?.error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-600">
            {actionData.error}
          </div>
        )}

        {actionData?.message && (
          <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-600">
            {actionData.message}
          </div>
        )}

        <Form method="post" className="space-y-4">
          <SocialButtons isSubmitting={isSubmitting} />
        </Form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-light-primary px-2 text-gray-500 dark:bg-dark-primary">
              or continue with email
            </span>
          </div>
        </div>

        <Form method="post" className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            name="intent"
            value={isSignUp ? 'signup' : 'signin'}
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
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
            className="w-full text-sm text-blue-500 hover:text-blue-600"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </Form>

        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-light-primary px-2 text-gray-500 dark:bg-dark-primary">
                or
              </span>
            </div>
          </div>

          <Link
            to="/guest"
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg border-2 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Continue as Guest
          </Link>
        </div>
      </Card>
    </div>
  );
}
