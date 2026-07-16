import Link from "next/link";
import { X } from "lucide-react";

import { buildAdminHref } from "@/components/admin/feedback-table";
import {
  formatDateTime,
  maskIpHash,
  renderStars,
} from "@/lib/admin/format";
import type { AdminFeedbackFilters } from "@/lib/admin/filters";
import type { AdminRatingRow } from "@/lib/admin/ratings";

type FeedbackDetailPanelProps = {
  rating: AdminRatingRow | null;
  filters: AdminFeedbackFilters;
};

export function FeedbackDetailPanel({
  rating,
  filters,
}: FeedbackDetailPanelProps) {
  if (!rating) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 bg-[#2b1836]/30 backdrop-blur-sm">
      <aside className="ml-auto flex h-full w-full max-w-lg flex-col bg-white shadow-[0_24px_80px_rgba(61,28,82,0.22)]">
        <div className="flex items-center justify-between border-b border-[#ead9f0] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a47b17]">
              Feedback Details
            </p>
            <h2 className="text-xl font-semibold text-[#2b1836]">
              Customer submission
            </h2>
          </div>
          <Link
            href={buildAdminHref(filters, { selected: null })}
            className="grid size-10 place-items-center rounded-full border border-[#ead9f0] text-[#4a3155] hover:bg-[#fff8e8]"
            aria-label="Close feedback details"
          >
            <X className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="space-y-6 overflow-y-auto px-6 py-6">
          <section className="rounded-3xl bg-[#fffdf8] p-5">
            <p className="text-sm font-semibold text-[#766a7c]">Rating</p>
            <p className="mt-2 text-2xl font-semibold text-[#d7a51f]">
              {renderStars(rating.rating)}
            </p>
          </section>

          <section className="rounded-3xl border border-[#ead9f0] p-4">
            <p className="text-sm font-semibold text-[#766a7c]">Branch</p>
            <p className="mt-1 text-sm text-[#2b1836]">
              {rating.branches?.name ?? "Unknown branch"}
            </p>
          </section>

          <section>
            <p className="text-sm font-semibold text-[#766a7c]">Full comment</p>
            <p className="mt-2 rounded-3xl border border-[#ead9f0] bg-[#fbf7fc] p-4 text-sm leading-7 text-[#59425f]">
              {rating.comment ?? "No comment left."}
            </p>
          </section>

          <dl className="grid gap-4">
            <div className="rounded-3xl border border-[#ead9f0] p-4">
              <dt className="text-sm font-semibold text-[#766a7c]">
                Submission date
              </dt>
              <dd className="mt-1 text-sm text-[#2b1836]">
                {formatDateTime(rating.created_at)}
              </dd>
            </div>
            <div className="rounded-3xl border border-[#ead9f0] p-4">
              <dt className="text-sm font-semibold text-[#766a7c]">
                Device ID
              </dt>
              <dd className="mt-1 break-all font-mono text-xs text-[#2b1836]">
                {rating.device_id}
              </dd>
            </div>
            <div className="rounded-3xl border border-[#ead9f0] p-4">
              <dt className="text-sm font-semibold text-[#766a7c]">
                IP hash
              </dt>
              <dd className="mt-1 font-mono text-xs text-[#2b1836]">
                {maskIpHash(rating.ip_hash)}
              </dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}
