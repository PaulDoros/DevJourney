import { createServerSupabase } from './supabase';

// Cache structure
interface SessionCache {
  user: any;
  expiresAt: number;
}

// In-memory cache for sessions
const SESSION_CACHE = new Map<string, SessionCache>();
const SESSION_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getAuthUser(request: Request) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const accessToken = cookieHeader
    .split(';')
    .find((cookie) => cookie.trim().startsWith('sb-access-token='))
    ?.split('=')[1];

  if (!accessToken) {
    return null;
  }

  // Check cache first
  const cachedSession = SESSION_CACHE.get(accessToken);
  if (cachedSession && Date.now() < cachedSession.expiresAt) {
    return cachedSession.user;
  }

  try {
    const { supabase } = createServerSupabase(request);
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session?.user) {
      return null;
    }

    // Cache the session
    SESSION_CACHE.set(accessToken, {
      user: session.user,
      expiresAt: Date.now() + SESSION_DURATION,
    });

    return session.user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

// Clean up expired sessions every hour
setInterval(
  () => {
    const now = Date.now();
    for (const [key, value] of SESSION_CACHE.entries()) {
      if (now >= value.expiresAt) {
        SESSION_CACHE.delete(key);
      }
    }
  },
  60 * 60 * 1000,
);
