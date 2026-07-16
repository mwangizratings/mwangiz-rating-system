import {
  createBranchAction,
  updateBranchAction,
} from "@/app/admin/(dashboard)/branches/actions";
import { BranchQrCode } from "@/components/admin/branch-qr-code";
import { Input } from "@/components/ui/input";
import { BranchDataError, fetchBranches } from "@/lib/admin/branches";
import { getPublicSiteUrl } from "@/lib/env";

type BranchesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function BranchesErrorState({ message }: { message: string }) {
  return (
    <section className="rounded-3xl border border-[#ead9f0] bg-white/88 p-6 text-center shadow-[0_18px_50px_rgba(61,28,82,0.08)]">
      <h2 className="text-xl font-semibold text-[#2b1836]">
        We could not load branches
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#766a7c]">
        {message}
      </p>
    </section>
  );
}

export default async function BranchesPage({ searchParams }: BranchesPageProps) {
  const params = await searchParams;
  const createdSlug =
    typeof params.created === "string" ? params.created : undefined;
  const baseUrl = getPublicSiteUrl();

  try {
    const branches = await fetchBranches();
    const createdBranch = branches.find((branch) => branch.slug === createdSlug);

    return (
      <div className="space-y-6">
        <section className="rounded-3xl border border-[#ead9f0] bg-white/88 p-5 shadow-[0_18px_50px_rgba(61,28,82,0.08)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a47b17]">
                Branches
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-[#2b1836]">
                Manage salon locations
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#766a7c]">
                Each branch gets its own rating URL and QR code. Customers never
                choose a branch manually.
              </p>
            </div>
          </div>

          <form action={createBranchAction} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="block">
              <span className="sr-only">Branch name</span>
              <Input name="name" placeholder="Branch name, e.g. Eldoret CBD" required />
            </label>
            <button
              type="submit"
              className="h-12 rounded-2xl bg-[#6d3a8f] px-5 text-sm font-semibold text-white transition hover:bg-[#5d2f7d] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#6d3a8f]/30"
            >
              Create Branch
            </button>
          </form>

          {createdBranch ? (
            <div className="mt-5 rounded-3xl border border-[#ead9f0] bg-[#fff8e8] px-4 py-3 text-sm leading-6 text-[#5f3c14]">
              Created {createdBranch.name}. Public rating URL:{" "}
              <span className="break-all font-semibold">
                {baseUrl}/b/{createdBranch.slug}
              </span>
            </div>
          ) : null}
        </section>

        <section className="grid gap-5">
          {branches.length ? (
            branches.map((branch) => {
              const publicUrl = `${baseUrl}/b/${branch.slug}`;

              return (
                <article
                  key={branch.id}
                  className="grid gap-5 rounded-3xl border border-[#ead9f0] bg-white/88 p-5 shadow-[0_18px_50px_rgba(61,28,82,0.08)] lg:grid-cols-[1fr_auto]"
                >
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-[#2b1836]">
                          {branch.name}
                        </h3>
                        <p className="mt-1 break-all text-sm text-[#766a7c]">
                          {publicUrl}
                        </p>
                      </div>
                      <span className="w-fit rounded-full bg-[#fbf7fc] px-3 py-1 text-xs font-semibold text-[#4a3155]">
                        {branch.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <form
                      action={updateBranchAction}
                      className="grid gap-3 md:grid-cols-[1fr_auto_auto]"
                    >
                      <input type="hidden" name="id" value={branch.id} />
                      <label className="block">
                        <span className="sr-only">Branch name</span>
                        <Input name="name" defaultValue={branch.name} required />
                      </label>
                      <label className="flex h-12 items-center gap-2 rounded-2xl border border-[#e8ddec] bg-white/85 px-4 text-sm font-semibold text-[#4a3155]">
                        <input
                          type="checkbox"
                          name="is_active"
                          defaultChecked={branch.is_active}
                          className="size-4 accent-[#6d3a8f]"
                        />
                        Active
                      </label>
                      <button
                        type="submit"
                        className="h-12 rounded-2xl bg-[#6d3a8f] px-5 text-sm font-semibold text-white transition hover:bg-[#5d2f7d]"
                      >
                        Save
                      </button>
                    </form>
                  </div>

                  <BranchQrCode branchName={branch.name} publicUrl={publicUrl} />
                </article>
              );
            })
          ) : (
            <div className="rounded-3xl border border-[#ead9f0] bg-white/88 px-5 py-12 text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-[#fff3c6] text-2xl text-[#6d3a8f]">
                M
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[#2b1836]">
                No branches yet
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#766a7c]">
                Create your first branch to generate its public rating link and
                QR code.
              </p>
            </div>
          )}
        </section>
      </div>
    );
  } catch (error) {
    const message =
      error instanceof BranchDataError
        ? error.message
        : "Please check your Supabase configuration.";

    return <BranchesErrorState message={message} />;
  }
}
