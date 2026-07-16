import { RatingCard } from "@/components/rating-card";
import { fetchActiveBranchBySlug } from "@/lib/branches/public";

type BranchRatingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function BranchNotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-8 sm:px-6">
      <section className="w-full max-w-md rounded-[2rem] border border-white/80 bg-white/88 px-6 py-9 text-center shadow-[0_24px_80px_rgba(61,28,82,0.14)] backdrop-blur">
        <div className="mx-auto mb-6 grid size-18 place-items-center rounded-[1.75rem] border border-[#e8d7a3] bg-[#fff8e8]">
          <div className="grid size-12 place-items-center rounded-2xl bg-[#6d3a8f] text-xl font-bold text-[#ffd875]">
            M
          </div>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a47b17]">
          Mwangiz Beauty Parlor
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[#2b1836]">
          Branch Not Found
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#766a7c]">
          This feedback link is not active. Please scan the QR code at your
          branch or ask the team for the correct link.
        </p>
      </section>
    </main>
  );
}

export default async function BranchRatingPage({
  params,
}: BranchRatingPageProps) {
  const { slug } = await params;
  const branch = await fetchActiveBranchBySlug(slug);

  if (!branch) {
    return <BranchNotFound />;
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-8 sm:px-6">
      <RatingCard branch={{ id: branch.id, name: branch.name }} />
    </div>
  );
}
