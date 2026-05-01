/**
 * Firebase SDK initialisation (singleton).
 *
 * Provides Firestore and Firebase Analytics instances used throughout
 * the application.  Lazy-initialised to prevent duplicate apps and
 * to avoid crashing when env vars are missing (dev/demo mode).
 *
 * Environment variables:
 *   NEXT_PUBLIC_FIREBASE_API_KEY     — Firebase Web API key
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID  — GCP project ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID      — Firebase App ID
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

/** Firebase configuration derived from environment variables. */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? ""}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? ""}.appspot.com`,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

/** True when all required Firebase env vars are present. */
export const isFirebaseConfigured =
  Boolean(firebaseConfig.apiKey) &&
  Boolean(firebaseConfig.projectId) &&
  Boolean(firebaseConfig.appId);

/** Singleton Firebase app instance. */
let app: FirebaseApp | null = null;

/** Singleton Firestore instance. */
let db: Firestore | null = null;

/** Singleton Firebase Analytics instance (browser-only). */
let analytics: Analytics | null = null;

/**
 * Returns the Firebase App instance, creating it if it doesn't exist.
 * Returns null when Firebase is not configured.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return app;
}

/**
 * Returns the Firestore instance.
 * Returns null when Firebase is not configured.
 */
export function getFirestoreDB(): Firestore | null {
  if (db) return db;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  db = getFirestore(firebaseApp);
  return db;
}

/**
 * Returns the Firebase Analytics instance (client-side only).
 * Returns null on the server or when Firebase is not configured.
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (analytics) return analytics;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  const supported = await isSupported();
  if (!supported) return null;
  analytics = getAnalytics(firebaseApp);
  return analytics;
}
