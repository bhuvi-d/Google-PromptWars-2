/**
 * Storage Service — Firestore data access layer.
 *
 * Handles all reads/writes to Cloud Firestore:
 *   - Logging anonymous usage records
 *   - Incrementing per-region query counters
 *   - Reading regional statistics
 *
 * Gracefully no-ops when Firebase is not configured (local dev / demo).
 */

import { getFirestoreDB } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import type {
  Region,
  Language,
  AnalyticsEventName,
  FirestoreUsageRecord,
  FirestoreRegionStats,
} from "@/types";

/* ------------------------------------------------------------------ */
/*  Collection names (constants prevent typo bugs)                      */
/* ------------------------------------------------------------------ */

const COLLECTIONS = {
  USAGE_LOGS: "usage_logs",
  REGION_STATS: "region_stats",
} as const;

/* ------------------------------------------------------------------ */
/*  Write: log an anonymous usage event                                 */
/* ------------------------------------------------------------------ */

/**
 * Writes an anonymous usage record to Firestore.
 * Used to track aggregated patterns (never stores PII).
 */
async function logUsageEvent(
  event: AnalyticsEventName,
  region: Region,
  state: string,
  language: Language,
  metadata?: Record<string, string | number | boolean>
): Promise<void> {
  const db = getFirestoreDB();
  if (!db) return;

  try {
    const record: FirestoreUsageRecord = {
      timestamp: new Date().toISOString(),
      region,
      state,
      language,
      event,
      metadata,
    };
    await addDoc(collection(db, COLLECTIONS.USAGE_LOGS), record);
  } catch (err) {
    console.warn("[StorageService] Failed to log usage event:", err);
  }
}

/* ------------------------------------------------------------------ */
/*  Write: increment regional query counter                             */
/* ------------------------------------------------------------------ */

/**
 * Increments the total-queries counter for a given region.
 * Creates the document if it doesn't exist yet.
 */
async function incrementRegionQueries(region: Region): Promise<void> {
  const db = getFirestoreDB();
  if (!db) return;

  try {
    const docRef = doc(db, COLLECTIONS.REGION_STATS, region);
    await setDoc(
      docRef,
      {
        region,
        totalQueries: increment(1),
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("[StorageService] Failed to increment region queries:", err);
  }
}

/* ------------------------------------------------------------------ */
/*  Read: get region statistics                                         */
/* ------------------------------------------------------------------ */

/**
 * Fetches aggregated stats for a region.
 * Returns null when Firestore is unavailable or document doesn't exist.
 */
async function getRegionStats(
  region: Region
): Promise<FirestoreRegionStats | null> {
  const db = getFirestoreDB();
  if (!db) return null;

  try {
    const docRef = doc(db, COLLECTIONS.REGION_STATS, region);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return snapshot.data() as FirestoreRegionStats;
  } catch (err) {
    console.warn("[StorageService] Failed to read region stats:", err);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Exported service object                                            */
/* ------------------------------------------------------------------ */

export const storageService = {
  logUsageEvent,
  incrementRegionQueries,
  getRegionStats,
} as const;
