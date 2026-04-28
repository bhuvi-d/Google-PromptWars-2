/**
 * Global type augmentation for Google services injected at runtime.
 *
 * These declarations make window.gtag and window.google available
 * throughout the codebase without casting to `any`.
 */

declare global {
  interface Window {
    /** Google Analytics 4 / Google Tag Manager command queue */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
    dataLayer?: unknown[];

    /** Google Translate / Maps SDK namespace */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google?: any;

    /** Callback registered for Google Translate widget initialisation */
    googleTranslateElementInit?: () => void;
  }
}

export {};
