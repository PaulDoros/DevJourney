import { redirect } from '@remix-run/node';
import { createGuestUser, createUserSession } from '~/utils/auth.server';

export async function loader({ request }: { request: Request }) {
  try {
    // Get returnTo from URL if present
    const url = new URL(request.url);
    const returnTo = url.searchParams.get('returnTo') || '/';

    const guestUser = await createGuestUser();
    return createUserSession(guestUser.id, returnTo);
  } catch (error) {
    console.error('Guest access error:', error);
    // Pass more specific error message
    return redirect(
      '/login?error=Unable to create guest session. Please try again.',
    );
  }
}

// Optional: Add action to handle any guest-specific setup
export async function action() {
  return Response.json({
    message: 'Guest access granted. Some features will be limited.',
  });
}
