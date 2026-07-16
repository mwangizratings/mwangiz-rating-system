import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import type { AdminFeedbackFilters } from "@/lib/admin/filters";
import type { BranchRow } from "@/lib/supabase/types";

type FeedbackFiltersProps = {
  filters: AdminFeedbackFilters;
  branches: BranchRow[];
};

export function FeedbackFilters({ filters, branches }: FeedbackFiltersProps) {
  return (
    <form
      action="/admin"
      className="rounded-3xl border border-[#ead9f0] bg-white/88 p-4 shadow-[0_18px_50px_rgba(61,28,82,0.08)]"
    >
      <div className="grid gap-3 md:grid-cols-[1.2fr_0.9fr_0.8fr_0.9fr_0.9fr_0.9fr_auto]">
        <label className="relative block">
          <span className="sr-only">Search comments</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#9a8aa2]"
            aria-hidden="true"
          />
          <Input
            name="q"
            defaultValue={filters.q}
            placeholder="Search comments"
            className="pl-10"
          />
        </label>

        <label className="block">
          <span className="sr-only">Branch</span>
          <select
            name="branch"
            defaultValue={filters.branch ?? ""}
            className="h-12 w-full rounded-2xl border border-[#e8ddec] bg-white/85 px-4 text-sm text-[#4a3155] outline-none focus-visible:border-[#7b459c] focus-visible:ring-[3px] focus-visible:ring-[#7b459c]/20"
          >
            <option value="">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="sr-only">Star rating</span>
          <select
            name="rating"
            defaultValue={filters.rating ?? ""}
            className="h-12 w-full rounded-2xl border border-[#e8ddec] bg-white/85 px-4 text-sm text-[#4a3155] outline-none focus-visible:border-[#7b459c] focus-visible:ring-[3px] focus-visible:ring-[#7b459c]/20"
          >
            <option value="">All ratings</option>
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} stars
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="sr-only">Comment status</span>
          <select
            name="comment"
            defaultValue={filters.comment}
            className="h-12 w-full rounded-2xl border border-[#e8ddec] bg-white/85 px-4 text-sm text-[#4a3155] outline-none focus-visible:border-[#7b459c] focus-visible:ring-[3px] focus-visible:ring-[#7b459c]/20"
          >
            <option value="all">All comments</option>
            <option value="with">Has comment</option>
            <option value="without">No comment</option>
          </select>
        </label>

        <label className="block">
          <span className="sr-only">From date</span>
          <Input name="from" type="date" defaultValue={filters.from} />
        </label>

        <label className="block">
          <span className="sr-only">To date</span>
          <Input name="to" type="date" defaultValue={filters.to} />
        </label>

        <button
          type="submit"
          className="h-12 rounded-2xl bg-[#6d3a8f] px-5 text-sm font-semibold text-white transition hover:bg-[#5d2f7d] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#6d3a8f]/30"
        >
          Apply
        </button>
      </div>
    </form>
  );
}
