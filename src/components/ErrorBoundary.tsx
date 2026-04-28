/**
 * ErrorBoundary — React class component that catches render-phase errors
 * and shows a fallback UI instead of a blank white screen.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomePage />
 *   </ErrorBoundary>
 */
"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  /** Content to render under normal conditions. */
  children: ReactNode;
  /** Optional custom fallback. Defaults to the built-in error card. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  /**
   * Called during rendering when a descendant component throws.
   * Updates state so the next render shows the fallback UI.
   */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  /**
   * Called after an error has been caught and the fallback UI rendered.
   * Logs the error for observability (GA4 event when gtag is available).
   */
  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ErrorBoundary caught:", error, info.componentStack);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gtag = typeof window !== "undefined" ? (window as any).gtag : undefined;
    if (typeof gtag === "function") {
      gtag("event", "exception", {
        description: error.message,
        fatal: false,
      });
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center min-h-[40vh] px-4 text-center"
        >
          <div className="bg-red-50 border border-red-200 rounded-3xl p-10 max-w-md w-full shadow-sm">
            <div className="bg-red-100 p-4 rounded-2xl w-fit mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-slate-500 text-sm font-medium mb-6">
              An unexpected error occurred. You can try refreshing the page or
              go back to the home screen.
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
