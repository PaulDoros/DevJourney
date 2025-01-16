import { createClient } from '@supabase/supabase-js';
import { getEnvVars } from './env.server';

const env = getEnvVars();

if (!env.SUPABASE_URL) throw new Error('SUPABASE_URL is required');
if (!env.SUPABASE_ANON_KEY) throw new Error('SUPABASE_ANON_KEY is required');

// Create a single supabase client for interacting with your database
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
});

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
