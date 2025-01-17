import { createClient } from '@supabase/supabase-js';
import { getEnvVars } from './env.server';

const env = getEnvVars();

// Create a single instance for server-side operations
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Create authenticated client for user operations
export function createServerSupabase(request: Request) {
  const cookies = request.headers.get('Cookie') || '';

  return {
    supabase: createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          cookie: cookies,
        },
      },
    }),
  };
}

// Helper function to check if a user exists
export async function checkUserExists(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error checking user:', error);
    return false;
  }

  return !!data;
}

// Helper function to create a new user record
export async function createUserRecord(userData: {
  id: string;
  username: string;
  email: string;
  isGuest: boolean;
}) {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        ...userData,
        points: 0,
        achievements: [],
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }

  return data;
}
