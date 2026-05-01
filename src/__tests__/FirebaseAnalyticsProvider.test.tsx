/**
 * Tests for the FirebaseAnalyticsProvider component.
 */

import React from "react";
import { FirebaseAnalyticsProvider } from "@/components/FirebaseAnalyticsProvider";
import * as firebaseLib from "@/lib/firebase";

jest.mock("@/lib/firebase", () => ({
  getFirebaseAnalytics: jest.fn(() => Promise.resolve(null)),
}));

describe("FirebaseAnalyticsProvider", () => {
  it("calls getFirebaseAnalytics on mount", () => {
    // We don't have @testing-library/react installed but NextJS projects usually allow basic component mounting in test environments 
    // Wait, testing library might not be there. Let's just check the effect directly.
    const spy = jest.spyOn(firebaseLib, "getFirebaseAnalytics");
    
    // Simple component invocation test since it's a null-render hook wrapper
    expect(FirebaseAnalyticsProvider).toBeDefined();
    
    // We mock React.useEffect to run synchronously for this simple test
    const originalUseEffect = React.useEffect;
    jest.spyOn(React, "useEffect").mockImplementationOnce((f) => f());
    
    FirebaseAnalyticsProvider();
    
    expect(spy).toHaveBeenCalled();
    React.useEffect = originalUseEffect;
  });
});
