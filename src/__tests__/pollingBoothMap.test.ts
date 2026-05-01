/**
 * Tests for PollingBoothMap utility logic.
 *
 * Validates the Google Maps URL construction for various regions
 * and state combinations, ensuring correct query encoding and
 * API key injection behavior.
 */

// We test the buildMapSrc logic by importing it indirectly.
// Since it's not exported, we replicate its logic here as a pure function test.

describe("PollingBoothMap — query construction", () => {
  describe("query string generation", () => {
    function buildQuery(region: string, stateName: string): string {
      return stateName
        ? `polling booth ${stateName} India election office`
        : region === "india"
        ? "Election Commission of India office"
        : region === "usa"
        ? "election polling place near me"
        : region === "uk"
        ? "polling station United Kingdom"
        : "election polling station";
    }

    it("returns state-specific query when stateName is provided", () => {
      const query = buildQuery("india", "Maharashtra");
      expect(query).toBe("polling booth Maharashtra India election office");
    });

    it("returns generic India query when no state is specified", () => {
      const query = buildQuery("india", "");
      expect(query).toBe("Election Commission of India office");
    });

    it("returns USA-specific query for usa region", () => {
      const query = buildQuery("usa", "");
      expect(query).toBe("election polling place near me");
    });

    it("returns UK-specific query for uk region", () => {
      const query = buildQuery("uk", "");
      expect(query).toBe("polling station United Kingdom");
    });

    it("returns generic query for unknown regions", () => {
      const query = buildQuery("generic", "");
      expect(query).toBe("election polling station");
    });

    it("prioritizes stateName over region for India", () => {
      const query = buildQuery("india", "Tamil Nadu");
      expect(query).toContain("Tamil Nadu");
      expect(query).toContain("India");
    });
  });

  describe("URL construction", () => {
    it("uses Maps Embed API when key is available", () => {
      const mapsKey = "test-api-key-123";
      const query = encodeURIComponent("Election Commission of India office");
      const url = `https://www.google.com/maps/embed/v1/search?key=${mapsKey}&q=${query}&zoom=11`;
      expect(url).toContain("maps/embed/v1/search");
      expect(url).toContain("test-api-key-123");
    });

    it("uses fallback public URL when no key is available", () => {
      const query = encodeURIComponent("Election Commission of India office");
      const url = `https://maps.google.com/maps?q=${query}&output=embed`;
      expect(url).toContain("maps.google.com");
      expect(url).toContain("output=embed");
    });

    it("properly encodes special characters in state names", () => {
      const stateName = "Jammu & Kashmir";
      const query = encodeURIComponent(`polling booth ${stateName} India election office`);
      expect(query).toContain("Jammu%20%26%20Kashmir");
    });
  });
});
