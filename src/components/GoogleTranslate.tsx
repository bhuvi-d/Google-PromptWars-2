"use client";

/**
 * GoogleTranslate — embeds Google Translate's element widget so users who
 * need a language other than English or Hindi can still read the site.
 *
 * The widget injects a <select> dropdown into the #google_translate_element
 * container automatically once the external script loads.
 * Global type declarations (window.google, window.googleTranslateElementInit)
 * live in src/types/google.d.ts.
 */

import { useEffect } from "react";
import Script from "next/script";

export function GoogleTranslate() {
  useEffect(() => {
    /**
     * Called by the Google Translate script once it has loaded.
     * Initialises the translate widget inside #google_translate_element.
     */
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,ta,te,bn,mr,gu,kn,ml,pa,ur",
          layout:
            window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }, []);

  return (
    <>
      <div
        id="google_translate_element"
        aria-label="Google Translate widget"
        className="hidden" // hidden by default — progressively shown by CSS if widget loads
      />
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />
    </>
  );
}
