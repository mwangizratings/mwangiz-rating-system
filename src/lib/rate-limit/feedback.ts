import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

const FEEDBACK_WINDOW_HOURS = 24;

export async function hasRecentFeedbackFromDevice(deviceId: string) {
  const supabase = createSupabaseServiceRoleClient();
  const since = new Date(
    Date.now() - FEEDBACK_WINDOW_HOURS * 60 * 60 * 1000,
  ).toISOString();

  const { data, error } = await supabase
    .from("ratings")
    .select("id")
    .eq("device_id", deviceId)
    .gte("created_at", since)
    .limit(1);

  if (error) {
    throw error;
  }

  return (data?.length ?? 0) > 0;
}

export { FEEDBACK_WINDOW_HOURS };
