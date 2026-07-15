import { NextResponse } from "next/server";

type ErrorDetails = Record<string, unknown> | Array<Record<string, unknown>>;

export function successResponse(status = 200) {
  return NextResponse.json({ success: true }, { status });
}

export function errorResponse(
  message: string,
  status: number,
  details?: ErrorDetails,
) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(details ? { details } : {}),
    },
    { status },
  );
}
