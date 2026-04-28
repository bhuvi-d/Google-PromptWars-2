"use client";

import { useState } from "react";
import { ChevronDown, MapPin, SearchX, Users, Accessibility, UserX, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const situations = [
  {
    id: "moved",
    icon: MapPin,
    title: "I recently moved to a new city.",
    color: "text-blue-600",
    bg: "bg-blue-100",
    content:
      "If you changed your residence, you cannot vote in your new city with your old registration. Fill out Form 8 online via the NVSP portal or Voter Helpline App to shift your constituency. Do this well before election dates are announced to avoid being turned away at the booth.",
    action: { label: "Ask AI for step-by-step help", href: "/assistant?q=I+moved+to+a+new+city" },
  },
  {
    id: "lost-id",
    icon: SearchX,
    title: "I lost my Voter ID card.",
    color: "text-amber-600",
    bg: "bg-amber-100",
    content:
      "Don't panic. You can still vote if your name is on the electoral roll. Carry any alternative photo ID — Aadhar Card, PAN Card, Indian Passport, or Driving License. To get a replacement EPIC card, apply for a duplicate online at the NVSP portal.",
    action: { label: "Check what documents you can use", href: "/documents" },
  },
  {
    id: "missing-name",
    icon: UserX,
    title: "My name is missing from the voter list.",
    color: "text-red-600",
    bg: "bg-red-100",
    content:
      "If your name is not on the electoral roll on voting day, you cannot vote — even with a Voter ID. Always verify your name 2–3 weeks before the election at electoralsearch.in. If it's missing during the registration period, immediately file Form 6 at the NVSP portal.",
    action: { label: "Ask AI how to check your registration", href: "/assistant?q=How+do+I+check+if+my+name+is+on+voter+list" },
  },
  {
    id: "senior",
    icon: Users,
    title: "I am a senior citizen needing assistance.",
    color: "text-purple-600",
    bg: "bg-purple-100",
    content:
      "Polling stations provide priority voting for senior citizens — you don't need to wait in long queues. Wheelchairs and volunteers are usually available. Citizens above 85 years of age can also vote from home via postal ballot by filling Form 12D in advance.",
    action: { label: "Learn more with AI", href: "/assistant?q=senior+citizen+voting+assistance" },
  },
  {
    id: "pwd",
    icon: Accessibility,
    title: "I am a Person with Disability (PwD).",
    color: "text-green-600",
    bg: "bg-green-100",
    content:
      "All polling booths are designed for accessibility — ground floor with ramps. Register on the Saksham App to request free transport to your polling booth, wheelchair access, and a volunteer companion. You can also opt for postal ballot voting in advance.",
    action: { label: "Ask AI for PwD voting options", href: "/assistant?q=PwD+disability+voting+options" },
  },
];

export default function SpecialSituationsPage() {
  const [openId, setOpenId] = useState<string | null>("moved");

  return (
    <div className="container max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5">
          Special Situations
        </h1>
        <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          Life is complicated. Voting shouldn&apos;t be. Find specific guidance for your unique situation.
        </p>
      </div>

      <div className="space-y-4" role="list" aria-label="Special voting situations">
        {situations.map((sit) => {
          const Icon = sit.icon;
          const isOpen = openId === sit.id;
          return (
            <div
              key={sit.id}
              role="listitem"
              className={cn(
                "border rounded-3xl overflow-hidden transition-all duration-200",
                isOpen
                  ? "ring-2 ring-primary/20 shadow-lg border-primary/30"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-md bg-white"
              )}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : sit.id)}
                className="w-full px-6 py-5 flex items-center justify-between bg-white text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset rounded-3xl"
                aria-expanded={isOpen}
                aria-controls={`situation-${sit.id}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "p-2.5 rounded-2xl transition-colors shrink-0",
                      isOpen ? `${sit.bg} ${sit.color}` : "bg-slate-100 text-slate-500"
                    )}
                    aria-hidden="true"
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg text-slate-900 text-left">{sit.title}</span>
                </div>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0",
                    isOpen ? "rotate-180 text-primary" : ""
                  )}
                  aria-hidden="true"
                />
              </button>

              <div
                id={`situation-${sit.id}`}
                role="region"
                aria-label={sit.title}
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="px-6 pb-6 pt-2 pl-20">
                  <p className="text-slate-600 font-medium leading-relaxed text-base mb-5 border-t border-slate-100 pt-5">
                    {sit.content}
                  </p>
                  <Link
                    href={sit.action.href}
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 px-5 py-2.5 rounded-xl transition-colors"
                  >
                    {sit.action.label} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-14 bg-slate-900 p-10 rounded-[2rem] text-white text-center relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
        <h3 className="text-2xl font-extrabold mb-3 relative z-10">Have a different situation?</h3>
        <p className="text-slate-300 font-medium mb-8 max-w-md mx-auto relative z-10">
          Our AI can answer virtually any election question — describe your situation and get specific guidance.
        </p>
        <Link
          href="/assistant"
          className="relative z-10 inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-8 py-4 rounded-2xl hover:bg-slate-100 transition-colors shadow-md"
        >
          Ask AI Assistant <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
