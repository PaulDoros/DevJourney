import { json, redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { getUserFromSession } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserFromSession(request);
  if (user) {
    return redirect('/');
  }

  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirectTo') || '/';

  return json({ redirectTo });
}

export default function Login() {
  const { redirectTo } = useLoaderData<typeof loader>();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-6">
        <h1 className="text-center text-3xl font-bold">Login</h1>
        <Form method="post" className="space-y-6">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          {/* ... rest of your login form */}
        </Form>
      </div>
    </div>
  );
}
