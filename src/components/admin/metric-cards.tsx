"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  CalendarRange,
  MessageSquareText,
  Percent,
  Star,
  StarHalf,
} from "lucide-react";

import type { DashboardMetrics } from "@/lib/admin/ratings";

type MetricCardsProps = {
  metrics: DashboardMetrics;
};

const metricConfig = [
  {
    key: "averageRating",
    label: "Average Rating",
    icon: StarHalf,
    format: (value: number) => value.toFixed(1),
  },
  {
    key: "totalRatings",
    label: "Total Ratings",
    icon: Star,
    format: (value: number) => value.toLocaleString(),
  },
  {
    key: "totalComments",
    label: "Total Comments",
    icon: MessageSquareText,
    format: (value: number) => value.toLocaleString(),
  },
  {
    key: "ratingsToday",
    label: "Ratings Today",
    icon: CalendarDays,
    format: (value: number) => value.toLocaleString(),
  },
  {
    key: "ratingsThisMonth",
    label: "Ratings This Month",
    icon: CalendarRange,
    format: (value: number) => value.toLocaleString(),
  },
  {
    key: "fiveStarPercentage",
    label: "Five-Star Percentage",
    icon: Percent,
    format: (value: number) => `${value}%`,
  },
] as const;

export function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      aria-label="Dashboard summary"
    >
      {metricConfig.map((metric, index) => {
        const Icon = metric.icon;
        const value = metrics[metric.key];

        return (
          <motion.article
            key={metric.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.28 }}
            className="rounded-3xl border border-[#ead9f0] bg-white/88 p-5 shadow-[0_18px_50px_rgba(61,28,82,0.08)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#766a7c]">
                  {metric.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-[#2b1836]">
                  {metric.format(value)}
                </p>
              </div>
              <div className="grid size-11 place-items-center rounded-2xl bg-[#fff3c6] text-[#6d3a8f]">
                <Icon className="size-5" aria-hidden="true" />
              </div>
            </div>
          </motion.article>
        );
      })}
    </section>
  );
}
