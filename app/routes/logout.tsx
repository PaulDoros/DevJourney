import { redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { sessionStorage } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie'),
  );

  return redirect('/login', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
}

// Add a default export to prevent empty chunk
export default function Logout() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Logging out...</h1>
        <p className="text-gray-500">Please wait while we sign you out.</p>
      </div>
    </div>
  );
}
