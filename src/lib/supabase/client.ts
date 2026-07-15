import { createClient } from "@supabase/supabase-js";

import { getPublicSupabaseEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

export function createSupabaseBrowserClient() {
  const { supabaseUrl, supabaseAnonKey } = getPublicSupabaseEnv();

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
