/**
 * POST /api/chat — Gemini-powered AI chat endpoint.
 *
 * Architecture:
 *   1. Rate limiting (in-memory, per-IP)
 *   2. Zod schema validation (ChatRequestSchema)
 *   3. Gemini response via geminiService
 *   4. Async Firestore logging via storageService
 *   5. Secure response headers
 */

import { NextResponse } from "next/server";
import { ChatRequestSchema } from "@/lib/schemas";
import { generateResponse } from "@/services/geminiService";
import { storageService } from "@/services/storageService";
import type { Region, Language } from "@/types";

/* ------------------------------------------------------------------ */
/*  Rate limiter                                                       */
/* ------------------------------------------------------------------ */

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

/** Periodically purge expired entries to prevent memory leaks on long-running servers. */
function purgeExpiredEntries() {
  const now = Date.now();
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key);
  }
}
// Run cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(purgeExpiredEntries, 5 * 60_000);
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

/* ------------------------------------------------------------------ */
/*  Security headers                                                   */
/* ------------------------------------------------------------------ */

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
} as const;

/* ------------------------------------------------------------------ */
/*  POST handler                                                       */
/* ------------------------------------------------------------------ */

export async function POST(req: Request) {
  try {
    // 1. Rate limit
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before asking again." },
        { status: 429, headers: SECURITY_HEADERS }
      );
    }

    // 2. Parse and validate request body with Zod
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    const parseResult = ChatRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0]?.message ?? "Validation failed.";
      return NextResponse.json(
        { error: firstIssue },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    const { messages, language, region, stateName, profile } = parseResult.data;

    // 3. Generate AI response via Gemini service
    const result = await generateResponse(
      messages,
      language,
      region,
      stateName,
      profile
    );

    if (!result.success) {
      const status = result.isQuotaError ? 429 : 502;
      return NextResponse.json(
        { error: result.content },
        { status, headers: SECURITY_HEADERS }
      );
    }

    // 4. Async Firestore logging (fire-and-forget, never blocks response)
    storageService
      .logUsageEvent(
        "chat_message_sent",
        region as Region,
        stateName,
        language as Language,
        { model: result.model ?? "unknown" }
      )
      .catch(() => {});

    storageService
      .incrementRegionQueries(region as Region)
      .catch(() => {});

    // 5. Return response
    return NextResponse.json(
      { role: "assistant", content: result.content },
      { headers: SECURITY_HEADERS }
    );
  } catch (error) {
    console.error("[ChatAPI] Unhandled error:", error);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again later." },
      { status: 500, headers: SECURITY_HEADERS }
    );
  }
}
