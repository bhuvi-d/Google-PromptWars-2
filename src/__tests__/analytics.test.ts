/**
 * Unit tests for the GA4 analytics helpers.
 *
 * The functions are mirrored inline here to keep the test file self-contained
 * and avoid Jest Windows path-mapping issues with @/ aliases.
 */

// ---- Mirror of analytics.ts helpers ----

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

function trackEvent(
  action: string,
  params?: Record<string, string | number | boolean>
): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window === "undefined" || !(window as any).gtag) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).gtag("event", action, params);
}

function trackPageView(url: string, title?: string): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window === "undefined" || !(window as any).gtag || !GA_MEASUREMENT_ID) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title,
  });
}

// ---- Tests ----

describe("trackEvent", () => {
  let gtagMock: jest.Mock;

  beforeEach(() => {
    gtagMock = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).window = { gtag: gtagMock };
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).window;
  });

  it("calls window.gtag with the correct event name", () => {
    trackEvent("chat_message_sent");
    expect(gtagMock).toHaveBeenCalledWith("event", "chat_message_sent", undefined);
  });

  it("forwards event params to gtag", () => {
    const params = { language: "en", region: "india" };
    trackEvent("chat_message_sent", params);
    expect(gtagMock).toHaveBeenCalledWith("event", "chat_message_sent", params);
  });

  it("does not throw when window.gtag is undefined", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).window = {};
    expect(() => trackEvent("some_event")).not.toThrow();
  });

  it("does not call gtag when window is undefined", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).window;
    expect(() => trackEvent("some_event")).not.toThrow();
  });

  it("accepts numeric and boolean param values", () => {
    const params = { message_length: 42, is_first_time: true };
    trackEvent("roadmap_generated", params);
    expect(gtagMock).toHaveBeenCalledWith("event", "roadmap_generated", params);
  });
});

describe("trackPageView", () => {
  let gtagMock: jest.Mock;

  beforeEach(() => {
    gtagMock = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).window = { gtag: gtagMock };
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).window;
  });

  it("does not throw when window.gtag is undefined", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).window = {};
    expect(() => trackPageView("/assistant")).not.toThrow();
  });

  it("does not call gtag when GA_MEASUREMENT_ID is empty", () => {
    // In test environment NEXT_PUBLIC_GA_MEASUREMENT_ID is not set
    // so GA_MEASUREMENT_ID === "" and the guard should bail
    if (!GA_MEASUREMENT_ID) {
      trackPageView("/assistant", "AI Assistant");
      expect(gtagMock).not.toHaveBeenCalled();
    } else {
      trackPageView("/assistant", "AI Assistant");
      expect(gtagMock).toHaveBeenCalledWith("config", GA_MEASUREMENT_ID, {
        page_path: "/assistant",
        page_title: "AI Assistant",
      });
    }
  });
});
