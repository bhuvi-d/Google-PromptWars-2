/**
 * GoogleAnalytics — injects the GA4 gtag.js script into the document head.
 *
 * Renders nothing visible. Must be placed inside <head> (handled by
 * Next.js `<Script strategy="afterInteractive">`).
 *
 * @param measurementId - GA4 Measurement ID, e.g. "G-XXXXXXXXXX".
 */
"use client";

import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
