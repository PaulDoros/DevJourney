import { redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { createServerSupabase } from '~/utils/supabase';
import { createUserSession } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const redirectTo = url.searchParams.get('redirectTo') || '/';

  if (!code) {
    console.error('No code provided in callback');
    return redirect('/login?error=no_code');
  }

  try {
    const supabase = createServerSupabase(request);

    // Get the session from the code
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error) throw error;
    if (!session?.user) throw new Error('No user returned from OAuth');

    // Create user profile if it doesn't exist
    const { error: upsertError } = await supabase.from('users').upsert(
      {
        id: session.user.id,
        email: session.user.email,
        username: session.user.email?.split('@')[0] || 'user',
        is_guest: false,
        points: 0,
        achievements: [],
      },
      { onConflict: 'id', ignoreDuplicates: false },
    );

    if (upsertError) {
      console.error('Error upserting user profile:', upsertError);
      // Continue anyway as this isn't critical
    }

    // Create user session and redirect
    return createUserSession(session.user.id, redirectTo);
  } catch (error) {
    console.error('Auth callback error:', error);
    return redirect('/login?error=auth_callback_failed');
  }
}
