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
  },
});

// Helper function to get the user from the session
// This checks if a user is logged in and returns their data
export async function getUserFromSession(request: Request) {
  const session = await getSession(request);
  const userId = session.get('userId');
  if (!userId) return null;
  return getUserById(userId);
}

// Middleware function to require authentication
// If user isn't logged in, redirects to login page with return URL
export async function requireUser(
  request: Request,
  redirectTo: string = '/login',
) {
  const user = await getUserFromSession(request);
  if (!user) {
    // URLSearchParams is a Web API that helps create and manage URL query parameters
    // Here we're using it to save the page the user was trying to access
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return user;
}

// Helper to get the session from the request cookie
export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
}

export { sessionStorage };
