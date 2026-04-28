/**
 * Google Analytics 4 (GA4) utility module.
 *
 * Wraps `window.gtag` with typed helpers so every page/component can fire
 * analytics events without reimplementing the null-check.
 *
 * Usage:
 *   import { trackEvent } from "@/lib/analytics";
 *   trackEvent("chat_message_sent", { language: "en", region: "india" });
 */

/** GA4 Measurement ID injected via NEXT_PUBLIC_GA_MEASUREMENT_ID */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

/**
 * Tracks a custom GA4 event.
 *
 * @param action - The event name (e.g. "chat_message_sent").
 * @param params - Optional key/value pairs sent as event parameters.
 */
export function trackEvent(
  action: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params);
}

/**
 * Tracks a page-view explicitly (useful in SPA route changes).
 *
 * @param url   - Full URL/path of the page being tracked.
 * @param title - Human-readable page title.
 */
export function trackPageView(url: string, title?: string): void {
  if (typeof window === "undefined" || !window.gtag || !GA_MEASUREMENT_ID)
    return;
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title,
  });
}
