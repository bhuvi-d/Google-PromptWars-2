/**
 * PollingBoothMap — embeds a Google Maps iframe to help users locate their
 * nearest polling booth / election office.
 *
 * When a Google Maps API key is available (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
 * it uses the Maps Embed API.  When no key is present it falls back to a
 * public maps.google.com search URL so the feature always works in dev/demo.
 *
 * @param region    - Geographic region (drives the default search query).
 * @param stateName - Indian state name for more targeted results.
 */
"use client";

import { MapPin, ExternalLink } from "lucide-react";

interface PollingBoothMapProps {
  region: string;
  stateName?: string;
}

/**
 * Builds the iframe src for the Maps Embed API or falls back to a plain
 * Google Maps search URL so the embed always renders.
 */
function buildMapSrc(region: string, stateName: string): string {
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const query = encodeURIComponent(
    stateName
      ? `polling booth ${stateName} India election office`
      : region === "india"
      ? "Election Commission of India office"
      : region === "usa"
      ? "election polling place near me"
      : region === "uk"
      ? "polling station United Kingdom"
      : "election polling station"
  );

  if (mapsKey) {
    return `https://www.google.com/maps/embed/v1/search?key=${mapsKey}&q=${query}&zoom=11`;
  }

  // Fallback: public Maps search (no API key needed for display, just not embeddable via API)
  return `https://maps.google.com/maps?q=${query}&output=embed`;
}

export function PollingBoothMap({ region, stateName = "" }: PollingBoothMapProps) {
  const src = buildMapSrc(region, stateName);

  const directUrl =
    stateName
      ? `https://www.google.com/maps/search/polling+booth+${encodeURIComponent(stateName)}+India`
      : `https://www.google.com/maps/search/election+office+${encodeURIComponent(region)}`;

  return (
    <section
      aria-label="Polling booth map"
      className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl">
            <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Find a Polling Booth Near You
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Powered by Google Maps
            </p>
          </div>
        </div>
        <a
          href={directUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          aria-label="Open map in Google Maps"
        >
          Open in Maps
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

      {/* Map */}
      <div className="relative w-full h-72 md:h-96 bg-slate-100">
        <iframe
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map showing polling booths near you"
          className="absolute inset-0"
        />
      </div>

      {/* Footer note */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-400 font-medium">
          Map data © Google. Verify your polling booth on the{" "}
          <a
            href="https://voters.eci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-semibold"
          >
            NVSP / ECI portal
          </a>
          .
        </p>
      </div>
    </section>
  );
}
