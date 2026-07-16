import type { RatingRow } from "@/lib/supabase/types";

const dateTimeFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

const shortDateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
});

export function formatDateTime(date: string) {
  return dateTimeFormatter.format(new Date(date));
}

export function formatShortDate(date: string) {
  return shortDateFormatter.format(new Date(date));
}

export function renderStars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export function shortenDeviceId(deviceId: string) {
  if (deviceId.length <= 18) {
    return deviceId;
  }

  return `${deviceId.slice(0, 10)}...${deviceId.slice(-6)}`;
}

export function maskIpHash(ipHash: string) {
  return `${ipHash.slice(0, 10)}...${ipHash.slice(-8)}`;
}

export function getCommentPreview(rating: RatingRow) {
  if (!rating.comment) {
    return "No comment";
  }

  return rating.comment.length > 88
    ? `${rating.comment.slice(0, 88)}...`
    : rating.comment;
}
