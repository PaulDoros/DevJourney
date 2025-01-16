import { redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { createServerSupabase } from '~/utils/supabase';
import { createUserSession } from '~/utils/auth.server';
import { getEnvVars } from '~/utils/env.server';
import { createClient } from '@supabase/supabase-js';

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase, response } = createServerSupabase(request);
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    console.error('No code provided in callback');
    return redirect('/login?error=no_code');
  }

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error) throw error;
    if (!session?.user) throw new Error('No user returned from OAuth');

    const env = getEnvVars();
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

    // Check if a user with this email already exists
    const { data: existingUser, error: userError } = await adminClient
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .maybeSingle();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error checking existing user:', userError);
      throw userError;
    }

    if (existingUser && existingUser.id !== session.user.id) {
      // User exists with different ID, update auth user
      const { error: updateError } =
        await adminClient.auth.admin.updateUserById(session.user.id, {
          email: session.user.email,
          user_metadata: {
            ...session.user.user_metadata,
            linked_account: existingUser.id,
          },
        });

      if (updateError) {
        console.error('Error updating auth user:', updateError);
        throw updateError;
      }

      // Only update fields that exist in the database
      const updateFields: Record<string, any> = {};

      if (session.user.user_metadata?.avatar_url) {
        updateFields.avatar_url = session.user.user_metadata.avatar_url;
      }

      if (session.user.user_metadata?.full_name) {
        updateFields.full_name = session.user.user_metadata.full_name;
      }

      if (Object.keys(updateFields).length > 0) {
        const { error: profileUpdateError } = await adminClient
          .from('users')
          .update(updateFields)
          .eq('id', existingUser.id);

        if (profileUpdateError) {
          console.error('Error updating user profile:', profileUpdateError);
          throw profileUpdateError;
        }
      }

      // Use the existing user's ID for the session
      return createUserSession(existingUser.id, '/');
    }

    // No existing user or same user, create/update profile
    const baseUsername = session.user.email?.split('@')[0] || 'user';
    let username = baseUsername;
    let counter = 1;

    // Generate unique username if needed
    while (true) {
      const { data: existingUsername, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (checkError && checkError.code === 'PGRST116') {
        break;
      }

      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Create/update user profile
    const { error: upsertError } = await supabase
      .from('users')
      .upsert(
        {
          id: session.user.id,
          email: session.user.email,
          username: existingUser?.username || username,
          is_guest: false,
          points: existingUser?.points || 0,
          achievements: existingUser?.achievements || [],
          ...(session.user.user_metadata?.avatar_url && {
            avatar_url: session.user.user_metadata.avatar_url,
          }),
          ...(session.user.user_metadata?.full_name && {
            full_name: session.user.user_metadata.full_name,
          }),
        },
        {
          onConflict: 'id',
          ignoreDuplicates: false,
        },
      )
      .select()
      .single();

    if (upsertError) {
      console.error('Error upserting user profile:', upsertError);
      return redirect('/login?error=profile_creation_failed');
    }

    // Create session and merge cookies
    const userSession = await createUserSession(session.user.id, '/');
    const cookieHeader = response.headers.get('Set-Cookie');
    if (cookieHeader) {
      userSession.headers.append('Set-Cookie', cookieHeader);
    }

    return userSession;
  } catch (error) {
    console.error('Auth callback error:', error);
    return redirect('/login?error=auth_callback_failed');
  }
}
