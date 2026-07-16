import { type NextRequest } from "next/server";
import { ZodError } from "zod";

import { errorResponse, successResponse } from "@/lib/api/responses";
import { hasRecentFeedbackFromDevice } from "@/lib/rate-limit/feedback";
import { getClientIp, hashIpAddress } from "@/lib/security/ip";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { RatingInsert } from "@/lib/supabase/types";
import { feedbackRequestSchema } from "@/lib/validation/feedback";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 10_000;
const DUPLICATE_FEEDBACK_MESSAGE =
  "You've already submitted feedback today. Thank you!";

async function parseRequestBody(request: NextRequest) {
  const contentLength = request.headers.get("content-length");

  if (contentLength && Number(contentLength) > MAX_REQUEST_BYTES) {
    return {
      error: errorResponse("Request body is too large", 413),
      data: null,
    };
  }

  const rawBody = await request.text();

  if (new TextEncoder().encode(rawBody).length > MAX_REQUEST_BYTES) {
    return {
      error: errorResponse("Request body is too large", 413),
      data: null,
    };
  }

  try {
    return {
      error: null,
      data: JSON.parse(rawBody) as unknown,
    };
  } catch {
    return {
      error: errorResponse("Invalid JSON payload", 400),
      data: null,
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const parsedBody = await parseRequestBody(request);

    if (parsedBody.error) {
      return parsedBody.error;
    }

    const validationResult = feedbackRequestSchema.safeParse(parsedBody.data);

    if (!validationResult.success) {
      return errorResponse("Validation failed", 400, {
        issues: validationResult.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const feedback = validationResult.data;
    const supabase = createSupabaseServiceRoleClient();
    const { data: branch, error: branchError } = await supabase
      .from("branches")
      .select("id")
      .eq("id", feedback.branchId)
      .eq("is_active", true)
      .maybeSingle();

    if (branchError) {
      console.error("Failed to verify branch", branchError);
      return errorResponse("Unable to submit feedback", 500);
    }

    if (!branch) {
      return errorResponse("Branch not found", 404);
    }

    const hasRecentFeedback = await hasRecentFeedbackFromDevice(
      feedback.deviceId,
      feedback.branchId,
    );

    if (hasRecentFeedback) {
      return errorResponse(DUPLICATE_FEEDBACK_MESSAGE, 429);
    }

    const rating: RatingInsert = {
      rating: feedback.rating,
      comment: feedback.comment,
      branch_id: feedback.branchId,
      device_id: feedback.deviceId,
      ip_hash: hashIpAddress(getClientIp(request)),
    };

    const { error } = await supabase.from("ratings").insert(rating);

    if (error) {
      console.error("Failed to insert feedback", error);
      return errorResponse("Unable to submit feedback", 500);
    }

    return successResponse(201);
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse("Validation failed", 400);
    }

    console.error("Unhandled feedback API error", error);
    return errorResponse("Something went wrong", 500);
  }
}
