"use client";

import { CalendarDays, Flag, Vote, Megaphone, FileText, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const timelineEvents = [
  {
    id: "announce",
    title: "Election Announcement",
    date: "March 15, 2026",
    description: "The Election Commission officially announces the election schedule and dates.",
    icon: Megaphone,
  },
  {
    id: "register",
    title: "Registration Deadline",
    date: "April 10, 2026",
    description: "Last day to register to vote or update your constituency details.",
    icon: FileText,
  },
  {
    id: "campaign",
    title: "Campaign Period",
    date: "April 15 - May 10, 2026",
    description: "Political parties actively campaign. Public rallies and debates take place.",
    icon: Flag,
  },
  {
    id: "vote",
    title: "Voting Day",
    date: "May 15, 2026",
    description: "Head to your designated polling booth with your documents and cast your vote.",
    icon: Vote,
  },
  {
    id: "count",
    title: "Counting & Results",
    date: "May 20, 2026",
    description: "Votes are counted and the official results are declared.",
    icon: CheckCircle2,
  },
];

export default function TimelinePage() {
  const [activeEvent, setActiveEvent] = useState(timelineEvents[3]); // Default to Voting Day

  return (
    <div className="container max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
          <CalendarDays className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
          Election Timeline
        </h1>
        <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto">
          Track the entire democratic lifecycle. Click any milestone to see details.
        </p>
      </div>

      {/* Horizontal Interactive Timeline */}
      <div className="bg-white rounded-[3rem] shadow-lg border border-slate-200 p-8 md:p-12 mb-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -mr-40 -mt-40"></div>
        
        {/* Timeline Bar Wrapper */}
        <div className="relative z-10 w-full overflow-x-auto pb-8 hide-scrollbar">
          <div className="min-w-[800px] relative flex justify-between items-center px-10 pt-10">
            
            {/* The Line */}
            <div className="absolute top-[4.5rem] left-20 right-20 h-1.5 bg-slate-100 rounded-full z-0"></div>
            
            {/* The Progress Line (fake progress to Voting Day) */}
            <div className="absolute top-[4.5rem] left-20 w-[75%] h-1.5 bg-primary rounded-full z-0 transition-all duration-1000"></div>

            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              const isActive = activeEvent.id === event.id;
              const isPast = index <= 3; // Hardcoded progress for visual effect
              
              return (
                <div 
                  key={event.id} 
                  className="relative z-10 flex flex-col items-center cursor-pointer group"
                  onClick={() => setActiveEvent(event)}
                >
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ring-8 ring-white mb-4",
                    isActive ? "bg-primary text-white scale-125 shadow-xl" : 
                    isPast ? "bg-primary/20 text-primary group-hover:scale-110" : "bg-slate-100 text-slate-400 group-hover:scale-110"
                  )}>
                    <Icon className={cn("w-7 h-7", isActive ? "animate-pulse" : "")} />
                  </div>
                  <h3 className={cn(
                    "font-bold text-center mt-2 transition-colors",
                    isActive ? "text-primary text-lg" : "text-slate-500"
                  )}>
                    {event.title}
                  </h3>
                  <span className={cn(
                    "text-xs font-bold mt-1 px-3 py-1 rounded-full",
                    isActive ? "bg-primary/10 text-primary" : "bg-transparent text-slate-400"
                  )}>
                    {event.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details Panel */}
        <div className="mt-8 bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-24 h-24 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center shrink-0 text-primary">
            <activeEvent.icon className="w-12 h-12" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{activeEvent.title}</h2>
            <p className="text-primary font-bold text-lg mb-4">{activeEvent.date}</p>
            <p className="text-slate-600 font-medium text-lg leading-relaxed">{activeEvent.description}</p>
          </div>
        </div>
      </div>

      <div className="text-center bg-primary/10 p-10 rounded-[3rem] border border-primary/20">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Want to be notified about deadlines?</h3>
        <p className="text-slate-600 font-medium mb-8 max-w-lg mx-auto">
          Create your personalized journey and we will track your progress against the official election timeline.
        </p>
        <Link
          href="/journey"
          className="inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-white hover:bg-primary/90 transition-transform active:scale-95 shadow-md"
        >
          View My Journey <ChevronRight className="ml-2 w-5 h-5" />
        </Link>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
