import { redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { createServerSupabase } from '~/utils/supabase';
import { createUserSession } from '~/utils/auth.server';
import { getEnvVars } from '~/utils/env.server';
import { createClient } from '@supabase/supabase-js';

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = createServerSupabase(request);
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return redirect('/login');
  }

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    if (!session?.user) throw new Error('No user returned from OAuth');

    // Create/update user profile
    const { error: upsertError } = await supabase.from('users').upsert(
      {
        id: session.user.id,
        email: session.user.email,
        username: session.user.email?.split('@')[0] || 'user',
        is_guest: false,
        points: 0,
        achievements: [],
        avatar_url: session.user.user_metadata?.avatar_url,
        full_name: session.user.user_metadata?.full_name,
      },
      {
        onConflict: 'id',
        ignoreDuplicates: false,
      },
    );

    if (upsertError) {
      console.error('Error upserting user profile:', upsertError);
      return redirect('/login?error=profile_creation_failed');
    }

    return createUserSession(session.user.id, '/');
  } catch (error) {
    console.error('Auth callback error:', error);
    return redirect('/login?error=auth_callback_failed');
  }
}

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
