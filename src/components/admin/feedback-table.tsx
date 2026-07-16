import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import {
  formatDateTime,
  getCommentPreview,
  renderStars,
  shortenDeviceId,
} from "@/lib/admin/format";
import type { AdminFeedbackFilters } from "@/lib/admin/filters";
import type { FeedbackPage } from "@/lib/admin/ratings";

type FeedbackTableProps = {
  feedback: FeedbackPage;
  filters: AdminFeedbackFilters;
};

function buildAdminHref(
  filters: AdminFeedbackFilters,
  overrides: Record<string, string | number | null>,
) {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.rating) params.set("rating", String(filters.rating));
  if (filters.comment !== "all") params.set("comment", filters.comment);
  if (filters.branch) params.set("branch", filters.branch);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.page > 1) params.set("page", String(filters.page));
  if (filters.selected) params.set("selected", filters.selected);

  Object.entries(overrides).forEach(([key, value]) => {
    if (value === null || value === "") {
      params.delete(key);
      return;
    }

    params.set(key, String(value));
  });

  const query = params.toString();

  return query ? `/admin?${query}` : "/admin";
}

export function FeedbackTable({ feedback, filters }: FeedbackTableProps) {
  return (
    <section className="rounded-3xl border border-[#ead9f0] bg-white/88 shadow-[0_18px_50px_rgba(61,28,82,0.08)]">
      <div className="flex flex-col gap-2 border-b border-[#ead9f0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#2b1836]">Feedback</h2>
          <p className="text-sm text-[#766a7c]">
            Showing {feedback.rows.length} of {feedback.total} submissions
          </p>
        </div>
      </div>

      {feedback.rows.length ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#ead9f0] text-left">
              <thead className="bg-[#fbf7fc] text-xs uppercase tracking-[0.14em] text-[#766a7c]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Rating</th>
                  <th className="px-5 py-3 font-semibold">Comment Preview</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Branch</th>
                  <th className="px-5 py-3 font-semibold">Device ID</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1e7f4]">
                {feedback.rows.map((rating) => (
                  <tr key={rating.id} className="align-top hover:bg-[#fffdf8]">
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#d7a51f]">
                      {renderStars(rating.rating)}
                    </td>
                    <td className="min-w-64 px-5 py-4 text-sm leading-6 text-[#59425f]">
                      {getCommentPreview(rating)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[#766a7c]">
                      {formatDateTime(rating.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-[#4a3155]">
                      {rating.branches?.name ?? "Unknown branch"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-[#766a7c]">
                      {shortenDeviceId(rating.device_id)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Link
                        href={buildAdminHref(filters, {
                          selected: rating.id,
                        })}
                        className="rounded-full bg-[#fff3c6] px-4 py-2 text-sm font-semibold text-[#4a3155] transition hover:bg-[#ffe69a]"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#ead9f0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#766a7c]">
              Page {feedback.page} of {feedback.totalPages}
            </p>
            <div className="flex gap-2">
              <Link
                aria-disabled={feedback.page <= 1}
                href={buildAdminHref(filters, {
                  page: Math.max(1, feedback.page - 1),
                  selected: null,
                })}
                className="rounded-full border border-[#ead9f0] px-4 py-2 text-sm font-semibold text-[#4a3155] aria-disabled:pointer-events-none aria-disabled:opacity-40"
              >
                Previous
              </Link>
              <Link
                aria-disabled={feedback.page >= feedback.totalPages}
                href={buildAdminHref(filters, {
                  page: Math.min(feedback.totalPages, feedback.page + 1),
                  selected: null,
                })}
                className="rounded-full border border-[#ead9f0] px-4 py-2 text-sm font-semibold text-[#4a3155] aria-disabled:pointer-events-none aria-disabled:opacity-40"
              >
                Next
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="px-5 py-12 text-center">
          <BrandLogo className="mx-auto size-20" imageClassName="size-16" />
          <h3 className="mt-5 text-lg font-semibold text-[#2b1836]">
            No customer feedback has been received yet.
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#766a7c]">
            New submissions will appear here as soon as customers share their
            experience.
          </p>
        </div>
      )}
    </section>
  );
}

export { buildAdminHref };
