import { z } from "zod";

import { sanitizeComment } from "@/lib/security/sanitize";

const deviceIdSchema = z
  .string()
  .trim()
  .min(16, "Device ID is required")
  .max(128, "Device ID is too long")
  .regex(/^[A-Za-z0-9._:-]+$/, "Device ID contains invalid characters");

const commentSchema = z
  .union([z.string(), z.null()])
  .optional()
  .transform((value) => {
    if (typeof value !== "string") {
      return null;
    }

    const sanitized = sanitizeComment(value);

    return sanitized.length > 0 ? sanitized : null;
  })
  .refine((value) => !value || value.length <= 1000, {
    message: "Comment must be 1000 characters or fewer",
  });

export const feedbackRequestSchema = z
  .object({
    rating: z
      .number({ error: "Rating is required" })
      .int("Rating must be an integer")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must be at most 5"),
    comment: commentSchema,
    deviceId: deviceIdSchema.optional(),
    device_id: deviceIdSchema.optional(),
    branchId: z.string().uuid("Branch ID is required"),
  })
  .strict()
  .superRefine((value, context) => {
    if (!value.deviceId && !value.device_id) {
      context.addIssue({
        code: "custom",
        path: ["deviceId"],
        message: "Device ID is required",
      });
    }

    if (
      value.deviceId &&
      value.device_id &&
      value.deviceId !== value.device_id
    ) {
      context.addIssue({
        code: "custom",
        path: ["deviceId"],
        message: "Device IDs do not match",
      });
    }
  })
  .transform((value) => ({
    rating: value.rating,
    comment: value.comment ?? null,
    deviceId: value.deviceId ?? value.device_id ?? "",
    branchId: value.branchId,
  }));

export type FeedbackRequest = z.infer<typeof feedbackRequestSchema>;
