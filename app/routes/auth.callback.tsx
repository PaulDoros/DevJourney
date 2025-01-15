import { redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { createServerSupabase } from '~/utils/supabase';

export async function loader({ request }: LoaderFunctionArgs) {
  const supabase = createServerSupabase(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  return redirect(next);
}
