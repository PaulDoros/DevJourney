import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '~/types/supabase';

if (!process.env.SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
if (!process.env.SUPABASE_ANON_KEY)
  throw new Error('Missing SUPABASE_ANON_KEY');

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

export function createServerSupabase(request: Request) {
  const cookies = request.headers.get('Cookie') ?? '';

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookies
            .split(';')
            .find((c) => c.trim().startsWith(`${name}=`));
          if (!cookie) return null;
          return decodeURIComponent(cookie.split('=')[1]);
        },
        set(name: string, value: string, options: CookieOptions) {
          // This is handled by the Set-Cookie header in the response
        },
        remove(name: string, options: CookieOptions) {
          // This is handled by the Set-Cookie header in the response
        },
      },
    },
  );
}

export async function getSession(request: Request) {
  const supabaseClient = createServerSupabase(request);
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  return session;
}

export async function requireAuth(request: Request) {
  const session = await getSession(request);
  if (!session) {
    throw new Response('Unauthorized', { status: 401 });
  }
  return session;
}

export async function getUserByEmail(email: string) {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) throw error;
  return user;
}

export async function createUser(userData: {
  email: string;
  name: string;
  avatar_url?: string;
}) {
  const { data: user, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();

  if (error) throw error;
  return user;
}

export async function updateUser(
  userId: string,
  updates: Partial<{
    name: string;
    avatar_url: string;
    email: string;
  }>,
) {
  const { data: user, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return user;
}

export async function deleteUser(userId: string) {
  const { error } = await supabase.from('users').delete().eq('id', userId);
  if (error) throw error;
}

// Real-time subscription helpers
export function subscribeToTable(
  tableName: string,
  callback: (payload: any) => void,
) {
  return supabase
    .channel(`public:${tableName}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: tableName },
      callback,
    )
    .subscribe();
}

// Database schema type helper
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];
