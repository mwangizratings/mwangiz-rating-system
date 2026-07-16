import { z } from "zod";

const optionalDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional()
  .catch(undefined);

const adminFeedbackFilterSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  rating: z.coerce.number().int().min(1).max(5).optional().catch(undefined),
  comment: z.enum(["all", "with", "without"]).catch("all"),
  q: z.string().trim().max(100).optional().catch(undefined),
  from: optionalDateSchema,
  to: optionalDateSchema,
  branch: z.string().uuid().optional().catch(undefined),
  selected: z.string().uuid().optional().catch(undefined),
});

export type AdminFeedbackFilters = z.infer<typeof adminFeedbackFilterSchema>;

type SearchParamsInput = Record<string, string | string[] | undefined>;

function getFirstSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function parseAdminFeedbackFilters(searchParams: SearchParamsInput) {
  return adminFeedbackFilterSchema.parse({
    page: getFirstSearchParam(searchParams.page),
    rating: getFirstSearchParam(searchParams.rating),
    comment: getFirstSearchParam(searchParams.comment),
    q: getFirstSearchParam(searchParams.q),
    from: getFirstSearchParam(searchParams.from),
    to: getFirstSearchParam(searchParams.to),
    branch: getFirstSearchParam(searchParams.branch),
    selected: getFirstSearchParam(searchParams.selected),
  });
}

export function getDateRangeIso(filters: AdminFeedbackFilters) {
  const from = filters.from ? new Date(`${filters.from}T00:00:00.000Z`) : null;
  const to = filters.to ? new Date(`${filters.to}T23:59:59.999Z`) : null;

  return {
    from: from?.toISOString(),
    to: to?.toISOString(),
  };
}
