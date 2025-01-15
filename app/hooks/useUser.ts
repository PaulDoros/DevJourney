import { useOutletContext } from '@remix-run/react';
import type { SupabaseClient, User } from '@supabase/supabase-js';

type ContextType = {
  supabase: SupabaseClient;
  user: User | null;
};

export const useUser = () => {
  const { user } = useOutletContext<ContextType>();
  return user;
};
