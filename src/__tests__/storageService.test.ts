/**
 * Tests for the Storage Service — Firestore data access layer.
 *
 * Since Firestore is not available in test environment (no Firebase config),
 * these tests verify that the service gracefully no-ops when unconfigured.
 * They also test the service's public API contract.
 */

// Mock the Firebase module to simulate unconfigured state
jest.mock("@/lib/firebase", () => ({
  isFirebaseConfigured: false,
  getFirestoreDB: () => null,
}));

// Mock firebase/firestore to prevent SDK initialization errors
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  increment: jest.fn((n: number) => n),
  serverTimestamp: jest.fn(),
}));

import { storageService } from "@/services/storageService";
import { addDoc, setDoc } from "firebase/firestore";

describe("storageService", () => {
  describe("when Firebase is not configured", () => {
    it("logUsageEvent resolves without throwing", async () => {
      await expect(
        storageService.logUsageEvent(
          "chat_message_sent",
          "india",
          "Maharashtra",
          "en",
          { model: "gemini-2.5-flash" }
        )
      ).resolves.toBeUndefined();
    });

    it("incrementRegionQueries resolves without throwing", async () => {
      await expect(
        storageService.incrementRegionQueries("india")
      ).resolves.toBeUndefined();
    });

    it("getRegionStats returns null", async () => {
      const result = await storageService.getRegionStats("india");
      expect(result).toBeNull();
    });

    it("logUsageEvent does not call Firestore addDoc", async () => {
      (addDoc as jest.Mock).mockClear();
      await storageService.logUsageEvent("roadmap_generated", "usa", "", "en");
      expect(addDoc).not.toHaveBeenCalled();
    });

    it("incrementRegionQueries does not call Firestore setDoc", async () => {
      (setDoc as jest.Mock).mockClear();
      await storageService.incrementRegionQueries("uk");
      expect(setDoc).not.toHaveBeenCalled();
    });
  });

  describe("service API contract", () => {
    it("exposes logUsageEvent as a function", () => {
      expect(typeof storageService.logUsageEvent).toBe("function");
    });

    it("exposes incrementRegionQueries as a function", () => {
      expect(typeof storageService.incrementRegionQueries).toBe("function");
    });

    it("exposes getRegionStats as a function", () => {
      expect(typeof storageService.getRegionStats).toBe("function");
    });
  });
});
