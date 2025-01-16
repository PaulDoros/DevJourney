import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { getEnvVars } from './env.server';

// Server-side Supabase client
export const createServerSupabase = (request: Request) => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = getEnvVars();
  const response = new Response();

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => {
        const cookieHeader = request.headers.get('Cookie') ?? '';
        const cookies = cookieHeader.split(';').map((cookie) => {
          const [name, ...rest] = cookie.trim().split('=');
          return { name, value: rest.join('=') };
        });
        const cookie = cookies.find((cookie) => cookie.name === key);
        return cookie?.value;
      },
      set: (key, value, options) => {
        response.headers.append(
          'Set-Cookie',
          `${key}=${value}; Path=/; HttpOnly; SameSite=Lax; Secure`,
        );
      },
      remove: (key) => {
        response.headers.append(
          'Set-Cookie',
          `${key}=; Path=/; HttpOnly; SameSite=Lax; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        );
      },
    },
  });

  return { supabase, response };
};

// Browser-side Supabase client
export const supabase = createBrowserClient(
  getEnvVars().SUPABASE_URL,
  getEnvVars().SUPABASE_ANON_KEY,
);
