import { redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { createGuestUser } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    return await createGuestUser();
  } catch (error) {
    console.error('Guest creation failed:', error);
    return redirect('/login?error=guest_login_failed');
  }
}

// Optional: Add action to handle any guest-specific setup
export async function action() {
  return Response.json({
    message: 'Guest access granted. Some features will be limited.',
  });
}
