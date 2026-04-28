/**
 * GoogleAnalytics — injects the GA4 gtag.js script into the document head.
 *
 * Renders nothing visible. Must be placed inside <head> (handled by
 * Next.js `<Script strategy="afterInteractive">`).
 *
 * @param measurementId - GA4 Measurement ID, e.g. "G-XXXXXXXXXX".
 */
"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;
  return <NextGoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}
