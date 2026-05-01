"use client";

import Link from "next/link";
import { Vote, Bot, Map, ScrollText, AlertCircle, Activity, Globe, Type, MapPin, ChevronDown } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useTranslation } from "@/lib/i18n";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { analyticsService } from "@/services";

const REGIONS = [
  { value: "india", label: "🇮🇳 India" },
  { value: "usa",   label: "🇺🇸 United States" },
  { value: "uk",    label: "🇬🇧 United Kingdom" },
  { value: "generic", label: "🌍 Other" },
] as const;

const INDIA_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Delhi", "Gujarat", "Haryana",
  "Karnataka", "Kerala", "Maharashtra", "Madhya Pradesh", "Punjab",
  "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal",
];

export function Header() {
  const { state, setLanguage, toggleLargeText, setRegion } = useAppContext();
  const t = useTranslation(state.language);
  const [regionOpen, setRegionOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setRegionOpen(false);
        setStateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentRegionLabel = REGIONS.find(r => r.value === state.region)?.label ?? "🌍";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 max-w-7xl gap-4">

        {/* Logo + Nav */}
        <div className="flex gap-6 md:gap-8 items-center min-w-0">
          <Link href="/" className="flex items-center space-x-2 group shrink-0">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Vote className="h-5 w-5 text-primary" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-primary transition-colors">
              VOTEXA
            </span>
          </Link>

          <nav className="hidden lg:flex gap-5" aria-label="Main navigation">
            {[
              { href: "/assistant", icon: Bot, label: t("nav.assistant") },
              { href: "/journey",   icon: Map, label: t("nav.journey") },
              { href: "/documents", icon: ScrollText, label: t("nav.documents") },
              { href: "/special-situations", icon: AlertCircle, label: t("nav.help") },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center text-[15px] font-semibold text-slate-600 hover:text-primary transition-colors"
              >
                <Icon className="mr-1.5 h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Readiness Score Chip */}
          <Link
            href="/journey"
            className="hidden md:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:border-primary/30 transition-colors"
            aria-label={`Readiness score: ${state.readinessScore}%`}
          >
            <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
            <div className="w-14 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${state.readinessScore}%` }}
                role="progressbar"
                aria-label="Readiness progress"
                aria-valuenow={state.readinessScore}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <span className="text-sm font-bold text-slate-900">{state.readinessScore}%</span>
          </Link>

          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-slate-200" />

          {/* Region Selector */}
          <div className="relative" ref={regionRef}>
            <button
              onClick={() => { setRegionOpen(!regionOpen); setStateOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-600 text-sm font-semibold transition-colors"
              aria-haspopup="listbox"
              aria-expanded={regionOpen}
              aria-label="Select your region"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline text-xs">{currentRegionLabel.split(" ")[0]}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", regionOpen ? "rotate-180" : "")} />
            </button>

            {regionOpen && (
              <div
                className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50"
                role="listbox"
                aria-label="Select region"
              >
                {REGIONS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => {
                      setRegion(r.value as import("@/context/AppContext").Region);
                      setRegionOpen(false);
                      analyticsService.track("region_changed", { region: r.value });
                      if (r.value === "india") setStateOpen(true);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3 text-sm font-semibold transition-colors hover:bg-slate-50",
                      state.region === r.value ? "text-primary bg-primary/5" : "text-slate-700"
                    )}
                    role="option"
                    aria-selected={state.region === r.value}
                  >
                    {r.label}
                  </button>
                ))}

                {stateOpen && (
                  <div className="border-t border-slate-100 max-h-48 overflow-y-auto">
                    <p className="px-4 py-2 text-xs text-slate-400 font-bold uppercase tracking-wide">Select State</p>
                    {INDIA_STATES.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setRegion("india", s); setRegionOpen(false); setStateOpen(false); }}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50",
                          state.state === s ? "text-primary font-bold" : "text-slate-700 font-medium"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Accessibility: Large Text */}
          <button
            onClick={toggleLargeText}
            className={cn(
              "p-2 rounded-xl transition-colors",
              state.isLargeText ? "bg-primary/10 text-primary" : "hover:bg-slate-100 text-slate-500"
            )}
            title="Toggle large text"
            aria-pressed={state.isLargeText}
            aria-label="Toggle large text mode"
          >
            <Type className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(state.language === "en" ? "hi" : "en")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-600 font-bold text-sm uppercase transition-colors"
            aria-label={`Switch to ${state.language === "en" ? "Hindi" : "English"}`}
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
            <span>{state.language === "en" ? "EN" : "हि"}</span>
          </button>

          {/* CTA */}
          <Link
            href="/assistant"
            className="hidden sm:inline-flex items-center justify-center rounded-xl text-sm font-bold bg-primary text-white shadow-md hover:bg-primary/90 h-10 px-5 transition-all active:scale-95"
          >
            {t("header.askAI")}
          </Link>
        </div>
      </div>
    </header>
  );
}
