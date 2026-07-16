import { getDateRangeIso, type AdminFeedbackFilters } from "@/lib/admin/filters";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BranchRow, RatingRow } from "@/lib/supabase/types";

export type { RatingRow };

export type AdminRatingRow = RatingRow & {
  branches: Pick<BranchRow, "id" | "name" | "slug"> | null;
};

export type DashboardMetrics = {
  averageRating: number;
  totalRatings: number;
  totalComments: number;
  ratingsToday: number;
  ratingsThisMonth: number;
  fiveStarPercentage: number;
};

export type RatingDistributionPoint = {
  rating: number;
  count: number;
  percentage: number;
};

export type RatingsOverTimePoint = {
  date: string;
  count: number;
  averageRating: number;
};

export type BranchComparisonPoint = {
  branchId: string;
  branchName: string;
  slug: string;
  totalRatings: number;
  averageRating: number;
  fiveStarPercentage: number;
};

export type FeedbackPage = {
  rows: AdminRatingRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type AdminDashboardData = {
  metrics: DashboardMetrics;
  distribution: RatingDistributionPoint[];
  ratingsOverTime: RatingsOverTimePoint[];
  branchComparison: BranchComparisonPoint[];
  recentActivity: AdminRatingRow[];
  feedback: FeedbackPage;
  selectedRating: AdminRatingRow | null;
};

export class AdminDataError extends Error {
  constructor(message = "Unable to load admin dashboard data") {
    super(message);
    this.name = "AdminDataError";
  }
}

const FEEDBACK_PAGE_SIZE = 10;
const ANALYTICS_LIMIT = 10_000;

function startOfUtcDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function startOfUtcMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

const ADMIN_RATING_SELECT = "*, branches(id,name,slug)";

function buildMetrics(ratings: AdminRatingRow[]): DashboardMetrics {
  const now = new Date();
  const todayStart = startOfUtcDay(now).getTime();
  const monthStart = startOfUtcMonth(now).getTime();
  const totalRatings = ratings.length;
  const totalStars = ratings.reduce((sum, rating) => sum + rating.rating, 0);
  const fiveStarCount = ratings.filter((rating) => rating.rating === 5).length;

  return {
    averageRating: totalRatings ? Number((totalStars / totalRatings).toFixed(1)) : 0,
    totalRatings,
    totalComments: ratings.filter((rating) => Boolean(rating.comment)).length,
    ratingsToday: ratings.filter(
      (rating) => new Date(rating.created_at).getTime() >= todayStart,
    ).length,
    ratingsThisMonth: ratings.filter(
      (rating) => new Date(rating.created_at).getTime() >= monthStart,
    ).length,
    fiveStarPercentage: totalRatings
      ? Math.round((fiveStarCount / totalRatings) * 100)
      : 0,
  };
}

function buildDistribution(ratings: AdminRatingRow[]): RatingDistributionPoint[] {
  const totalRatings = ratings.length;

  return [1, 2, 3, 4, 5].map((rating) => {
    const count = ratings.filter((row) => row.rating === rating).length;

    return {
      rating,
      count,
      percentage: totalRatings ? Math.round((count / totalRatings) * 100) : 0,
    };
  });
}

function buildRatingsOverTime(ratings: AdminRatingRow[]): RatingsOverTimePoint[] {
  const now = startOfUtcDay(new Date());
  const days = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(now);
    date.setUTCDate(now.getUTCDate() - (13 - index));

    return formatDateKey(date);
  });

  return days.map((date) => {
    const rows = ratings.filter((rating) => rating.created_at.startsWith(date));
    const totalStars = rows.reduce((sum, rating) => sum + rating.rating, 0);

    return {
      date,
      count: rows.length,
      averageRating: rows.length ? Number((totalStars / rows.length).toFixed(1)) : 0,
    };
  });
}

function buildBranchComparison(ratings: AdminRatingRow[]): BranchComparisonPoint[] {
  const groupedRatings = new Map<string, AdminRatingRow[]>();

  ratings.forEach((rating) => {
    const branchId = rating.branches?.id ?? rating.branch_id;
    const existingRatings = groupedRatings.get(branchId) ?? [];
    existingRatings.push(rating);
    groupedRatings.set(branchId, existingRatings);
  });

  return Array.from(groupedRatings.entries())
    .map(([branchId, branchRatings]) => {
      const totalRatings = branchRatings.length;
      const totalStars = branchRatings.reduce(
        (sum, rating) => sum + rating.rating,
        0,
      );
      const fiveStarCount = branchRatings.filter(
        (rating) => rating.rating === 5,
      ).length;
      const firstRating = branchRatings[0];

      return {
        branchId,
        branchName: firstRating?.branches?.name ?? "Unknown branch",
        slug: firstRating?.branches?.slug ?? "",
        totalRatings,
        averageRating: totalRatings
          ? Number((totalStars / totalRatings).toFixed(2))
          : 0,
        fiveStarPercentage: totalRatings
          ? Math.round((fiveStarCount / totalRatings) * 100)
          : 0,
      };
    })
    .sort((a, b) => {
      if (b.averageRating !== a.averageRating) {
        return b.averageRating - a.averageRating;
      }

      return b.totalRatings - a.totalRatings;
    });
}

async function fetchAnalyticsRatings(filters: AdminFeedbackFilters) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("ratings")
    .select(ADMIN_RATING_SELECT)
    .order("created_at", { ascending: false })
    .limit(ANALYTICS_LIMIT);

  if (filters.branch) {
    query = query.eq("branch_id", filters.branch);
  }

  const { data, error } = await query;

  if (error) {
    throw new AdminDataError(error.message);
  }

  return (data ?? []) as AdminRatingRow[];
}

async function fetchRecentRatings(filters: AdminFeedbackFilters) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("ratings")
    .select(ADMIN_RATING_SELECT)
    .order("created_at", { ascending: false })
    .limit(5);

  if (filters.branch) {
    query = query.eq("branch_id", filters.branch);
  }

  const { data, error } = await query;

  if (error) {
    throw new AdminDataError(error.message);
  }

  return (data ?? []) as AdminRatingRow[];
}

export async function fetchFeedback(filters: AdminFeedbackFilters) {
  const supabase = await createSupabaseServerClient();
  const { from, to } = getDateRangeIso(filters);
  const fromIndex = (filters.page - 1) * FEEDBACK_PAGE_SIZE;
  const toIndex = fromIndex + FEEDBACK_PAGE_SIZE - 1;

  let query = supabase
    .from("ratings")
    .select(ADMIN_RATING_SELECT, { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters.branch) {
    query = query.eq("branch_id", filters.branch);
  }

  if (filters.rating) {
    query = query.eq("rating", filters.rating);
  }

  if (filters.comment === "with") {
    query = query.not("comment", "is", null);
  }

  if (filters.comment === "without") {
    query = query.is("comment", null);
  }

  if (filters.q) {
    query = query.ilike("comment", `%${filters.q}%`);
  }

  if (from) {
    query = query.gte("created_at", from);
  }

  if (to) {
    query = query.lte("created_at", to);
  }

  const { data, count, error } = await query.range(fromIndex, toIndex);

  if (error) {
    throw new AdminDataError(error.message);
  }

  const total = count ?? 0;

  return {
    rows: (data ?? []) as AdminRatingRow[],
    total,
    page: filters.page,
    pageSize: FEEDBACK_PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / FEEDBACK_PAGE_SIZE)),
  };
}

export async function fetchRatingById(id: string | undefined) {
  if (!id) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ratings")
    .select(ADMIN_RATING_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new AdminDataError(error.message);
  }

  return data as AdminRatingRow | null;
}

export async function fetchAdminDashboardData(
  filters: AdminFeedbackFilters,
): Promise<AdminDashboardData> {
  const [analyticsRatings, recentActivity, feedback, selectedRating] =
    await Promise.all([
      fetchAnalyticsRatings(filters),
      fetchRecentRatings(filters),
      fetchFeedback(filters),
      fetchRatingById(filters.selected),
    ]);

  return {
    metrics: buildMetrics(analyticsRatings),
    distribution: buildDistribution(analyticsRatings),
    ratingsOverTime: buildRatingsOverTime(analyticsRatings),
    branchComparison: buildBranchComparison(analyticsRatings),
    recentActivity,
    feedback,
    selectedRating,
  };
}
