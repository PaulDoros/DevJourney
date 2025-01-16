export function getEnvVars() {
  console.log('Raw ENV values:', {
    url: process.env.SUPABASE_URL?.slice(0, 20),
    anon: process.env.SUPABASE_ANON_KEY?.slice(0, 10),
    service: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10),
  });

  if (!process.env.SUPABASE_URL) {
    throw new Error('SUPABASE_URL is required');
  }
  if (!process.env.SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_ANON_KEY is required');
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
  }

  return {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}
