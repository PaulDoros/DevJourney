import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { getEnvVars } from './env.server';

// Server-side Supabase client
export const createServerSupabase = (request: Request) => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = getEnvVars();
  const response = new Response();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => {
        const cookieHeader = request.headers.get('Cookie') ?? '';
        return cookieHeader.split(';').map((cookie) => {
          const [name, ...rest] = cookie.trim().split('=');
          return { name, value: rest.join('=') };
        });
      },
      setAll: (cookies) => {
        cookies.forEach((cookie) => {
          response.headers.append(
            'Set-Cookie',
            cookie.name + '=' + cookie.value,
          );
        });
      },
    },
  });
};

// Browser-side Supabase client
export const supabase = createBrowserClient(
  getEnvVars().SUPABASE_URL,
  getEnvVars().SUPABASE_ANON_KEY,
);
