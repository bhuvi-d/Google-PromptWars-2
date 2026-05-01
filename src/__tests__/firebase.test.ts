/**
 * Tests for the Firebase initialization logic.
 */

import { isFirebaseConfigured, getFirebaseApp, getFirestoreDB, getFirebaseAnalytics } from "@/lib/firebase";

// Mock firebase modules
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({ name: "[DEFAULT]" })),
  getApps: jest.fn(() => []),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
}));

jest.mock("firebase/analytics", () => ({
  getAnalytics: jest.fn(() => ({})),
  isSupported: jest.fn(() => Promise.resolve(true)),
}));

describe("Firebase Initialization", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("exports a boolean for isFirebaseConfigured", () => {
    expect(typeof isFirebaseConfigured).toBe("boolean");
  });

  it("getFirebaseApp returns null if not configured", () => {
    // Relying on the default state where it's not fully configured in tests
    const app = getFirebaseApp();
    if (!isFirebaseConfigured) {
      expect(app).toBeNull();
    }
  });

  it("getFirestoreDB returns null if app is not configured", () => {
    const db = getFirestoreDB();
    if (!isFirebaseConfigured) {
      expect(db).toBeNull();
    }
  });

  it("getFirebaseAnalytics returns null when window is undefined", async () => {
    const tmpWindow = global.window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).window;
    const analytics = await getFirebaseAnalytics();
    expect(analytics).toBeNull();
    global.window = tmpWindow;
  });
});
