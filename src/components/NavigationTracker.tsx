"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analyticsService } from "@/services";

function NavigationTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url =
        pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      
      // Tell GA4 via gtag config
      analyticsService.trackPageView(url, document.title);
      
      // Fire our unified custom event
      analyticsService.track("page_view", {
        page_path: url,
        page_title: document.title,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * Tracks page views on route changes within the Next.js App Router.
 * Uses analyticsService.trackPageView and triggers 'page_view' event
 * to capture full navigation flow across the application.
 */
export function NavigationTracker() {
  return (
    <Suspense fallback={null}>
      <NavigationTrackerInner />
    </Suspense>
  );
}
