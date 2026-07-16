"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createBranch, updateBranch } from "@/lib/admin/branches";

export async function createBranchAction(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const branch = await createBranch(name);

  revalidatePath("/admin/branches");
  redirect(`/admin/branches?created=${branch.slug}`);
}

export async function updateBranchAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "");
  const isActive = formData.get("is_active") === "on";

  await updateBranch({
    id,
    name,
    is_active: isActive,
  });

  revalidatePath("/admin/branches");
  revalidatePath("/admin");
}
