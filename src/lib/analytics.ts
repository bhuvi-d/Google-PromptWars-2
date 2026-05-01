/**
 * @deprecated Use `@/services/analyticsService` instead.
 *
 * This file is kept for backward compatibility with existing test mocks.
 * All new code should import from `@/services`:
 *
 *   import { analyticsService } from "@/services";
 *   analyticsService.track("chat_message_sent", { ... });
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
