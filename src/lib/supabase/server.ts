import { createClient } from "@supabase/supabase-js";

import { getServerEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

export function createSupabaseServiceRoleClient() {
  const { supabaseUrl, supabaseServiceRoleKey } = getServerEnv();

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
