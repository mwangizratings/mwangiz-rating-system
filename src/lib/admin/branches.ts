import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BranchRow } from "@/lib/supabase/types";
import { slugifyBranchName } from "@/lib/branches/slug";

export class BranchDataError extends Error {
  constructor(message = "Unable to load branches") {
    super(message);
    this.name = "BranchDataError";
  }
}

export async function fetchBranches() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new BranchDataError(error.message);
  }

  return data ?? [];
}

export async function fetchBranchById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new BranchDataError(error.message);
  }

  return data;
}

export async function createUniqueBranchSlug(name: string) {
  const supabase = await createSupabaseServerClient();
  const baseSlug = slugifyBranchName(name) || "branch";
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    const { data, error } = await supabase
      .from("branches")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      throw new BranchDataError(error.message);
    }

    if (!data) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function createBranch(name: string) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new BranchDataError("Branch name is required");
  }

  const supabase = await createSupabaseServerClient();
  const slug = await createUniqueBranchSlug(trimmedName);
  const { data, error } = await supabase
    .from("branches")
    .insert({
      name: trimmedName,
      slug,
      is_active: true,
    })
    .select("*")
    .single();

  if (error) {
    throw new BranchDataError(error.message);
  }

  return data;
}

export async function updateBranch(input: Pick<BranchRow, "id" | "name" | "is_active">) {
  const trimmedName = input.name.trim();

  if (!trimmedName) {
    throw new BranchDataError("Branch name is required");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("branches")
    .update({
      name: trimmedName,
      is_active: input.is_active,
    })
    .eq("id", input.id)
    .select("*")
    .single();

  if (error) {
    throw new BranchDataError(error.message);
  }

  return data;
}
