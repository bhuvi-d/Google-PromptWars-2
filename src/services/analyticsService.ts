/**
 * Analytics Service — unified event tracking layer.
 *
 * Abstracts GA4 (gtag) and Firebase Analytics behind a single API.
 * Every feature module calls `analyticsService.track()` instead of
 * touching window.gtag directly.
 *
 * Tracked events:
 *   - chat_message_sent     (AI assistant usage)
 *   - chat_response_received
 *   - chat_error
 *   - roadmap_generated     (journey creation)
 *   - readiness_score_changed
 *   - voice_input_used
 *   - myth_card_flipped     (myth vs fact interaction)
 *   - document_checked
 *   - region_changed
 *   - page_view
 */

import type { AnalyticsEventName, AnalyticsEventParams } from "@/types";
import { getFirebaseAnalytics } from "@/lib/firebase";
import { logEvent as firebaseLogEvent } from "firebase/analytics";

/* ------------------------------------------------------------------ */
/*  GA4 Measurement ID                                                 */
/* ------------------------------------------------------------------ */

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

/* ------------------------------------------------------------------ */
/*  Core tracking function                                             */
/* ------------------------------------------------------------------ */

/**
 * Tracks a named analytics event through both GA4 and Firebase Analytics.
 *
 * @param eventName - Strongly-typed event name.
 * @param params    - Optional key/value pairs attached to the event.
 */
async function track(
  eventName: AnalyticsEventName,
  params?: AnalyticsEventParams
): Promise<void> {
  // GA4 via gtag.js
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }

  // Firebase Analytics
  try {
    const fbAnalytics = await getFirebaseAnalytics();
    if (fbAnalytics) {
      firebaseLogEvent(fbAnalytics, eventName as string, params);
    }
  } catch {
    // Silent — analytics should never break the app
  }
}

/* ------------------------------------------------------------------ */
/*  Page view tracking                                                 */
/* ------------------------------------------------------------------ */

/**
 * Tracks a page view explicitly (useful during SPA route transitions).
 */
function trackPageView(url: string, title?: string): void {
  if (typeof window === "undefined" || !window.gtag || !GA_MEASUREMENT_ID)
    return;
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title,
  });
}

/* ------------------------------------------------------------------ */
/*  Exported service object                                            */
/* ------------------------------------------------------------------ */

export const analyticsService = {
  track,
  trackPageView,
} as const;
