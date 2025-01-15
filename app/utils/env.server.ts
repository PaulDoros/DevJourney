export function getEnvVars() {
  if (!process.env.SUPABASE_URL) {
    throw new Error('SUPABASE_URL is required');
  }
  if (!process.env.SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_ANON_KEY is required');
  }

  return {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  };
}
