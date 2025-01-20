function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getEnvVars() {
  return {
    SUPABASE_URL: getEnvVar('SUPABASE_URL'),
    SUPABASE_ANON_KEY: getEnvVar('SUPABASE_ANON_KEY'),
    SUPABASE_SERVICE_ROLE_KEY: getEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
    SESSION_SECRET: getEnvVar('SESSION_SECRET'),
  };
}
