import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BranchRow } from "@/lib/supabase/types";

export async function fetchActiveBranchBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data satisfies BranchRow | null;
}
