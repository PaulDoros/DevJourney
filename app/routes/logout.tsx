import { type ActionFunctionArgs, redirect } from '@remix-run/node';
import { createServerSupabase } from '~/utils/supabase';

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const supabase = createServerSupabase(request);
  // Sign out from Supabase
  await supabase.supabase.auth.signOut();

  // Clear session cookie
  response.headers.append(
    'Set-Cookie',
    '_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  );

  return redirect('/login', {
    headers: response.headers,
  });
}

// In case someone visits /logout directly
export async function loader() {
  return redirect('/');
}
