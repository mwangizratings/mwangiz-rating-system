"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatShortDate } from "@/lib/admin/format";
import type {
  AdminRatingRow,
  BranchComparisonPoint,
  RatingDistributionPoint,
  RatingsOverTimePoint,
} from "@/lib/admin/ratings";

type AnalyticsChartsProps = {
  distribution: RatingDistributionPoint[];
  ratingsOverTime: RatingsOverTimePoint[];
  branchComparison: BranchComparisonPoint[];
  recentActivity: AdminRatingRow[];
};

const chartColors = {
  purple: "#6d3a8f",
  purpleSoft: "#8d5aa8",
  gold: "#d7a51f",
  grid: "#ead9f0",
  text: "#766a7c",
};

function ChartPanel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="rounded-3xl border border-[#ead9f0] bg-white/88 p-5 shadow-[0_18px_50px_rgba(61,28,82,0.08)]"
    >
      <div>
        <h2 className="text-lg font-semibold text-[#2b1836]">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-[#766a7c]">{description}</p>
        ) : null}
      </div>
      <div className="mt-5">{children}</div>
    </motion.section>
  );
}

function EmptyChartState({ message }: { message: string }) {
  return (
    <div className="grid h-64 place-items-center rounded-2xl bg-[#fbf7fc] px-5 text-center text-sm leading-6 text-[#766a7c]">
      {message}
    </div>
  );
}

export function AnalyticsCharts({
  distribution,
  ratingsOverTime,
  branchComparison,
  recentActivity,
}: AnalyticsChartsProps) {
  const distributionData = distribution.map((point) => ({
    ...point,
    label: `${point.rating} star`,
  }));
  const ratingsOverTimeData = ratingsOverTime.map((point) => ({
    ...point,
    label: formatShortDate(`${point.date}T00:00:00.000Z`),
  }));
  const branchVolumeData = branchComparison
    .slice()
    .sort((a, b) => b.totalRatings - a.totalRatings)
    .map((branch) => ({
      ...branch,
      label: branch.branchName,
    }));
  const branchPerformanceData = branchComparison.map((branch, index) => ({
    ...branch,
    rank: index + 1,
    label: branch.branchName,
  }));

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <ChartPanel
        title="Rating Distribution"
        description="How ratings are spread across 1 to 5 stars."
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ left: -16, right: 8 }}>
              <CartesianGrid stroke={chartColors.grid} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: chartColors.text, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: chartColors.text, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "#fbf7fc" }}
                contentStyle={{
                  border: "1px solid #ead9f0",
                  borderRadius: 16,
                  color: "#2b1836",
                }}
              />
              <Bar dataKey="count" name="Ratings" radius={[12, 12, 0, 0]}>
                {distributionData.map((point) => (
                  <Cell
                    key={point.rating}
                    fill={point.rating >= 4 ? chartColors.gold : chartColors.purple}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>

      <ChartPanel
        title="Ratings Over Time"
        description="Daily rating volume for the last 14 days."
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ratingsOverTimeData} margin={{ left: -16, right: 8 }}>
              <CartesianGrid stroke={chartColors.grid} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: chartColors.text, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: chartColors.text, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  border: "1px solid #ead9f0",
                  borderRadius: 16,
                  color: "#2b1836",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Ratings"
                stroke={chartColors.purple}
                strokeWidth={3}
                dot={{ r: 3, fill: chartColors.gold, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>

      <ChartPanel
        title="Branch Rating Volume"
        description="Branches ranked by number of submitted ratings."
      >
        {branchVolumeData.length ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={branchVolumeData}
                layout="vertical"
                margin={{ left: 12, right: 16 }}
              >
                <CartesianGrid stroke={chartColors.grid} horizontal={false} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fill: chartColors.text, fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={110}
                  tick={{ fill: chartColors.text, fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#fbf7fc" }}
                  contentStyle={{
                    border: "1px solid #ead9f0",
                    borderRadius: 16,
                    color: "#2b1836",
                  }}
                />
                <Bar
                  dataKey="totalRatings"
                  name="Total ratings"
                  fill={chartColors.purple}
                  radius={[0, 12, 12, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyChartState message="No branch rating volume yet." />
        )}
      </ChartPanel>

      <ChartPanel
        title="Branch Performance Ranking"
        description="Best average rating to lowest average rating."
      >
        {branchPerformanceData.length ? (
          <div className="space-y-3">
            {branchPerformanceData.map((branch) => (
              <div
                key={branch.branchId}
                className="rounded-2xl border border-[#f0e4f4] bg-[#fffdf8] px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#2b1836]">
                      #{branch.rank} {branch.branchName}
                    </p>
                    <p className="text-xs text-[#766a7c]">
                      {branch.totalRatings} ratings - {branch.fiveStarPercentage}% five-star
                    </p>
                  </div>
                  <span className="rounded-full bg-[#fff3c6] px-3 py-1 text-sm font-semibold text-[#5f3c14]">
                    {branch.averageRating.toFixed(2)}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#f2e7f6]">
                  <div
                    className="h-full rounded-full bg-[#d7a51f]"
                    style={{ width: `${(branch.averageRating / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyChartState message="No branch performance data yet." />
        )}
      </ChartPanel>

      <ChartPanel title="Recent Activity">
        {recentActivity.length ? (
          <div className="space-y-3">
            {recentActivity.map((rating) => (
              <div
                key={rating.id}
                className="rounded-2xl border border-[#f0e4f4] bg-[#fffdf8] px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-[#d7a51f]">
                    {"*".repeat(rating.rating)}
                  </span>
                  <span className="text-xs text-[#766a7c]">
                    {formatShortDate(rating.created_at)}
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold text-[#4a3155]">
                  {rating.branches?.name ?? "Unknown branch"}
                </p>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#59425f]">
                  {rating.comment ?? "No comment left."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-[#fbf7fc] px-4 py-6 text-sm text-[#766a7c]">
            No customer feedback has been received yet.
          </p>
        )}
      </ChartPanel>
    </div>
  );
}
