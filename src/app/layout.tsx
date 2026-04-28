import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Header } from "@/components/Header";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { GoogleTranslate } from "@/components/GoogleTranslate";
import { ErrorBoundary } from "@/components/ErrorBoundary";

/**
 * Inter — loaded via next/font/google (Google Fonts).
 * `display: swap` prevents invisible text during font load (perf + a11y).
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | VOTEXA",
    default: "VOTEXA — AI-Powered Election Assistant",
  },
  description:
    "VOTEXA helps citizens understand the election process, check voter eligibility, prepare documents, and get instant AI-powered answers to any voting question.",
  keywords: [
    "election",
    "voting",
    "voter registration",
    "election guide",
    "AI assistant",
    "civic tech",
    "ECI",
    "NVSP",
    "Google Gemini",
  ],
  authors: [{ name: "VOTEXA" }],
  openGraph: {
    title: "VOTEXA — AI-Powered Election Assistant",
    description:
      "Your trusted guide to voting, registration, and election readiness.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-slate-50`}
      >
        {/* Google Analytics 4 — loads after hydration, IP-anonymised */}
        <GoogleAnalytics />

        {/* Google Translate widget — lazy-loaded, no layout impact */}
        <GoogleTranslate />

        <AppProvider>
          {/* Skip to main content — critical accessibility for keyboard/screen reader users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl"
          >
            Skip to main content
          </a>

          <Header />

          <main id="main-content" className="flex-1 w-full mx-auto" tabIndex={-1}>
            {/* ErrorBoundary prevents uncaught render errors from showing blank page */}
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>

          <footer
            className="border-t py-8 md:py-10 bg-white shadow-inner"
            role="contentinfo"
          >
            <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-6 md:flex-row max-w-6xl">
              <p className="text-center text-sm md:text-base leading-loose text-slate-500 md:text-left max-w-xl">
                Built to empower voters. Always verify official information with
                your local election commission.{" "}
                India:{" "}
                <a
                  href="https://eci.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  eci.gov.in
                </a>
              </p>
              <nav
                aria-label="Footer links"
                className="flex items-center gap-6 text-sm font-semibold text-slate-500"
              >
                <a
                  href="https://eci.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Official ECI
                </a>
                <a
                  href="https://voters.eci.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Voter Portal
                </a>
                <a
                  href="https://nvsp.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  NVSP
                </a>
              </nav>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
