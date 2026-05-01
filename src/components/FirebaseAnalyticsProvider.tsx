/**
 * FirebaseAnalyticsProvider — initialises Firebase Analytics on mount.
 *
 * Renders nothing visible. Placed in the root layout to ensure
 * Firebase Analytics is active for all pages alongside GA4.
 */
"use client";

import { useEffect } from "react";
import { getFirebaseAnalytics } from "@/lib/firebase";

export function FirebaseAnalyticsProvider() {
  useEffect(() => {
    // Initialise Firebase Analytics on client-side mount
    getFirebaseAnalytics().catch(() => {
      // Silent — analytics should never break the user experience
    });
  }, []);

  return null;
}
