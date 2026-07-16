import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import { FeedbackDetailPanel } from "@/components/admin/feedback-detail-panel";
import { FeedbackFilters } from "@/components/admin/feedback-filters";
import { FeedbackTable } from "@/components/admin/feedback-table";
import { MetricCards } from "@/components/admin/metric-cards";
import { fetchBranches } from "@/lib/admin/branches";
import { parseAdminFeedbackFilters } from "@/lib/admin/filters";
import {
  AdminDataError,
  fetchAdminDashboardData,
} from "@/lib/admin/ratings";

type AdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function AdminErrorState({ message }: { message: string }) {
  return (
    <section className="rounded-3xl border border-[#ead9f0] bg-white/88 p-6 text-center shadow-[0_18px_50px_rgba(61,28,82,0.08)]">
      <h2 className="text-xl font-semibold text-[#2b1836]">
        We could not load the dashboard
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#766a7c]">
        {message}
      </p>
    </section>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const filters = parseAdminFeedbackFilters(params);

  try {
    const [data, branches] = await Promise.all([
      fetchAdminDashboardData(filters),
      fetchBranches(),
    ]);

    return (
      <div className="space-y-6">
        <MetricCards metrics={data.metrics} />
        <AnalyticsCharts
          distribution={data.distribution}
          ratingsOverTime={data.ratingsOverTime}
          branchComparison={data.branchComparison}
          recentActivity={data.recentActivity}
        />
        <FeedbackFilters filters={filters} branches={branches} />
        <FeedbackTable feedback={data.feedback} filters={filters} />
        <FeedbackDetailPanel
          rating={data.selectedRating}
          filters={filters}
        />
      </div>
    );
  } catch (error) {
    const message =
      error instanceof AdminDataError
        ? error.message
        : "Please check your connection and Supabase configuration.";

    return <AdminErrorState message={message} />;
  }
}
