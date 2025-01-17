import { redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { createServerSupabase } from '~/utils/supabase';
import { createUserSession } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = createServerSupabase(request);
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return redirect('/login');
  }

  try {
    await supabase.auth.exchangeCodeForSession(code);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('No user found after authentication');
    }

    return createUserSession(user.id, '/');
  } catch (error) {
    console.error('Auth callback error:', error);
    return redirect('/login?error=auth_callback_failed');
  }
}

// Add a default export to prevent empty chunk
export default function AuthCallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Authenticating...</h1>
        <p className="text-gray-500">Please wait while we log you in.</p>
      </div>
    </div>
  );
}
