import { createHash } from "crypto";
import { type NextRequest } from "next/server";

import { getServerEnv } from "@/lib/env";

const IP_HEADERS = [
  "cf-connecting-ip",
  "x-real-ip",
  "x-forwarded-for",
  "forwarded",
];

function parseForwardedHeader(value: string) {
  const firstEntry = value.split(",")[0]?.trim();
  const forPart = firstEntry
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.toLowerCase().startsWith("for="));

  return forPart?.slice(4).replace(/^"|"$/g, "");
}

export function getClientIp(request: NextRequest) {
  for (const header of IP_HEADERS) {
    const value = request.headers.get(header);

    if (!value) {
      continue;
    }

    if (header === "forwarded") {
      const forwardedIp = parseForwardedHeader(value);

      if (forwardedIp) {
        return forwardedIp;
      }
    }

    return value.split(",")[0]?.trim() ?? "unknown";
  }

  return "unknown";
}

export function hashIpAddress(ipAddress: string) {
  const { ipHashSecret } = getServerEnv();

  return createHash("sha256")
    .update(`${ipHashSecret}:${ipAddress}`)
    .digest("hex");
}
