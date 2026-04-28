"use client";

import { HelpCircle, AlertTriangle, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const myths = [
  {
    id: 1,
    myth: "You can vote online from home.",
    fact: "In India, voting must be done in person at a designated polling booth. There is no online voting system.",
  },
  {
    id: 2,
    myth: "EVMs can be easily hacked via Bluetooth.",
    fact: "EVMs are standalone machines with no wireless communication capabilities. They cannot be hacked remotely.",
  },
  {
    id: 3,
    myth: "You cannot vote if you don't have a Voter ID card.",
    fact: "If your name is on the electoral roll, you can vote using alternate photo ID proofs like an Aadhaar Card or Passport.",
  },
  {
    id: 4,
    myth: "If you don't vote, your vote is automatically cast to the ruling party.",
    fact: "Uncast votes are simply not counted. They do not automatically go to any party.",
  },
  {
    id: 5,
    myth: "You can vote anywhere in the country.",
    fact: "You must vote at the specific polling station assigned to the address where you are registered.",
  },
  {
    id: 6,
    myth: "Pressing NOTA wastes your vote completely.",
    fact: "NOTA registers your active rejection of all candidates, which is a powerful democratic metric, though it doesn't change the election outcome.",
  }
];

export default function MythsPage() {
  return (
    <div className="container max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-6">
          <HelpCircle className="h-10 w-10 text-amber-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
          Myths vs Facts
        </h1>
        <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto">
          Misinformation hurts democracy. Click on the cards below to reveal the truth behind common election rumors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 perspective-1000">
        {myths.map((item) => (
          <FlipCard key={item.id} myth={item.myth} fact={item.fact} />
        ))}
      </div>

      <div className="mt-12 text-center bg-slate-900 p-10 md:p-14 rounded-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-20 -mt-20"></div>
        <h3 className="text-3xl font-extrabold text-white mb-4 relative z-10">Heard a new rumor?</h3>
        <p className="text-slate-300 font-medium mb-8 max-w-lg mx-auto text-lg relative z-10">
          Our AI Assistant is trained on official election guidelines and can instantly verify if a statement is true or false.
        </p>
        <Link
          href="/assistant"
          className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-lg font-bold text-slate-900 hover:bg-slate-100 transition-transform active:scale-95 shadow-lg relative z-10"
        >
          Verify with AI <ChevronRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

function FlipCard({ myth, fact }: { myth: string; fact: string }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="group h-80 w-full cursor-pointer relative"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: "1000px" }}
    >
      <div 
        className={cn(
          "w-full h-full transition-all duration-500 relative shadow-md hover:shadow-xl rounded-[2rem]",
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front (Myth) */}
        <div 
          className="absolute inset-0 w-full h-full bg-white border border-slate-200 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <span className="text-sm font-bold text-red-500 uppercase tracking-widest mb-3">Myth</span>
          <h3 className="text-xl font-bold text-slate-900 leading-relaxed">&quot;{myth}&quot;</h3>
          <p className="absolute bottom-6 text-slate-400 text-sm font-medium animate-pulse">Click to reveal truth</p>
        </div>

        {/* Back (Fact) */}
        <div 
          className="absolute inset-0 w-full h-full bg-primary border border-primary-dark rounded-[2rem] p-8 flex flex-col justify-center items-center text-center backface-hidden text-white [transform:rotateY(180deg)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-sm font-bold text-primary-100 uppercase tracking-widest mb-3">Fact</span>
          <p className="text-lg font-bold leading-relaxed">{fact}</p>
        </div>
      </div>
    </div>
  );
}
