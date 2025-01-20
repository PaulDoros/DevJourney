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

// Add a default export to prevent empty chunk
export default function Guest() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Creating guest account...</h1>
        <p className="text-gray-500">
          Please wait while we set up your account.
        </p>
      </div>
    </div>
  );
}
