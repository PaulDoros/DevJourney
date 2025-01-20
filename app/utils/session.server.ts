import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { getUserById } from './auth.server';

// createCookieSessionStorage is a Remix utility that helps manage session data in cookies
// It provides a secure way to store user session information
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session', // Name of the cookie in the browser
    sameSite: 'lax', // CSRF protection - cookie won't be sent on cross-site requests
    path: '/', // Cookie is available across all routes
    httpOnly: true, // Prevents JavaScript access to the cookie (XSS protection)
    secrets: [process.env.SESSION_SECRET || 's3cr3t'], // Used to sign the cookie to prevent tampering
    secure: process.env.NODE_ENV === 'production', // Only sent over HTTPS in production
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
});

// Helper function to get the user from the session
// This checks if a user is logged in and returns their data
export async function getUserFromSession(request: Request) {
  try {
    const session = await getSession(request);
    const userId = session.get('userId');
    if (!userId) return null;

    const user = await getUserById(userId);
    if (!user) {
      console.log('No user found for userId:', userId);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

// Middleware function to require authentication
// If user isn't logged in, redirects to login page with return URL
export async function requireUser(request: Request) {
  try {
    const user = await getUserFromSession(request);
    if (!user) {
      const url = new URL(request.url);
      const searchParams = new URLSearchParams([['redirectTo', url.pathname]]);
      throw redirect(`/login?${searchParams}`);
    }
    return user;
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Require user error:', error);
    throw new Error('Authentication failed');
  }
}

// Helper to get the session from the request cookie
export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
}

export { sessionStorage };
