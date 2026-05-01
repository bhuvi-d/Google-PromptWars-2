"use client";

import { useState } from "react";
import { Check, Info, FileText, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/AppContext";
import { analyticsService } from "@/services";

// Region-aware document sets
const documentsByRegion = {
  india: [
    {
      id: "epic",
      category: "Primary",
      title: "Voter ID Card (EPIC)",
      description: "Your Electoral Photo Identity Card. The most preferred document at the polling booth.",
      priority: 1,
    },
    {
      id: "aadhar",
      category: "Alternative",
      title: "Aadhar Card",
      description: "Accepted as alternative ID if your name is on the electoral roll.",
      priority: 2,
    },
    {
      id: "pan",
      category: "Alternative",
      title: "PAN Card",
      description: "Accepted for identity verification at the polling booth.",
      priority: 2,
    },
    {
      id: "driving",
      category: "Alternative",
      title: "Driving License",
      description: "A valid Indian driving license is accepted as identity proof.",
      priority: 2,
    },
    {
      id: "passport",
      category: "Alternative",
      title: "Indian Passport",
      description: "Accepted as both identity and address proof.",
      priority: 2,
    },
    {
      id: "bank",
      category: "Alternative",
      title: "Bank/Post Office Passbook",
      description: "With photograph — issued by a registered Bank or Post Office.",
      priority: 2,
    },
  ],
  usa: [
    {
      id: "drivers",
      category: "Primary",
      title: "Driver's License / State ID",
      description: "Most widely accepted photo ID at polling places across states.",
      priority: 1,
    },
    {
      id: "passport-us",
      category: "Primary",
      title: "U.S. Passport",
      description: "Accepted at all polling places as valid photo ID.",
      priority: 1,
    },
    {
      id: "military",
      category: "Alternative",
      title: "Military ID",
      description: "Active or veteran US military ID is accepted in most states.",
      priority: 2,
    },
    {
      id: "student",
      category: "Alternative",
      title: "Student ID (select states)",
      description: "Accepted in some states — check your state's specific requirements.",
      priority: 2,
    },
  ],
  uk: [
    {
      id: "passport-uk",
      category: "Primary",
      title: "UK or Irish Passport",
      description: "Required as photo ID at polling stations since 2023.",
      priority: 1,
    },
    {
      id: "driving-uk",
      category: "Primary",
      title: "UK Driving Licence",
      description: "Full or provisional driving licence accepted as photo ID.",
      priority: 1,
    },
    {
      id: "older-person-uk",
      category: "Primary",
      title: "Older Person's Bus Pass",
      description: "A concessionary travel pass funded by any UK local authority.",
      priority: 2,
    },
  ],
  generic: [
    {
      id: "gov-id",
      category: "Primary",
      title: "Government-Issued Photo ID",
      description: "A national ID card, passport, or driving licence from your country.",
      priority: 1,
    },
    {
      id: "voter-card",
      category: "Primary",
      title: "Voter Registration Card",
      description: "Your official voter registration document if issued by your election authority.",
      priority: 1,
    },
  ],
};

type DocId = string;

export default function DocumentsPage() {
  const { state } = useAppContext();
  const region = (state.region in documentsByRegion ? state.region : "india") as keyof typeof documentsByRegion;
  const documents = documentsByRegion[region];
  const [checked, setChecked] = useState<Record<DocId, boolean>>({});

  const toggleCheck = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!checked[id]) {
      analyticsService.track("document_checked", { document_id: id, region });
    }
  };

  const primaryDocs = documents.filter(d => d.priority === 1);
  const altDocs = documents.filter(d => d.priority === 2);

  const hasPrimary = primaryDocs.some(d => checked[d.id]);
  const hasAlternative = altDocs.some(d => checked[d.id]);
  const isReady = hasPrimary || hasAlternative;
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="container max-w-5xl mx-auto py-16 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5">
          Smart Document Checklist
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
          Carry at least <strong>one valid photo ID</strong> to your polling booth. Select what you have ready.
        </p>
        {state.state && (
          <p className="text-primary font-bold mt-3 text-sm uppercase tracking-widest">
            📍 Showing requirements for {state.state}, India
          </p>
        )}
      </div>

      {/* Status Banner */}
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "mb-10 p-6 md:p-8 rounded-3xl border-2 transition-all duration-300 flex items-start gap-5",
          isReady
            ? "bg-green-50 border-green-200 shadow-sm"
            : "bg-amber-50 border-amber-200"
        )}
      >
        <div className={cn("p-2.5 rounded-2xl shrink-0", isReady ? "bg-green-100" : "bg-amber-100")}>
          {isReady ? (
            <ShieldCheck className="w-7 h-7 text-green-600" aria-hidden="true" />
          ) : (
            <Info className="w-7 h-7 text-amber-600" aria-hidden="true" />
          )}
        </div>
        <div>
          <h3 className={cn("text-xl font-extrabold mb-1.5", isReady ? "text-green-800" : "text-amber-800")}>
            {isReady ? `You're ready! ✓ (${checkedCount} document${checkedCount !== 1 ? "s" : ""} selected)` : "Select a document to continue"}
          </h3>
          <p className={cn("font-medium text-base", isReady ? "text-green-700" : "text-amber-700")}>
            {isReady
              ? "Carry the ORIGINAL document to your polling booth. Photocopies are not accepted."
              : "Tick at least one document below that you will bring to the polling booth on voting day."}
          </p>
        </div>
      </div>

      {/* Primary IDs */}
      {primaryDocs.length > 0 && (
        <section aria-labelledby="primary-docs-heading" className="mb-8">
          <h2 id="primary-docs-heading" className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
            Primary Identification
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {primaryDocs.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} checked={!!checked[doc.id]} onToggle={toggleCheck} />
            ))}
          </div>
        </section>
      )}

      {/* Alternative IDs */}
      {altDocs.length > 0 && (
        <section aria-labelledby="alt-docs-heading" className="mb-10">
          <h2 id="alt-docs-heading" className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-slate-300" aria-hidden="true" />
            Alternative Identification
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {altDocs.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} checked={!!checked[doc.id]} onToggle={toggleCheck} />
            ))}
          </div>
        </section>
      )}

      {/* AI Prompt */}
      <div className="mt-6 bg-primary/5 border border-primary/20 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6 justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">Not sure which document to carry?</h3>
          <p className="text-slate-600 font-medium">Ask our AI for your specific situation — first-time voter, student, or PwD.</p>
        </div>
        <Link
          href="/assistant"
          className="shrink-0 inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all active:scale-95 shadow-md"
        >
          Ask AI <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

function DocumentCard({
  doc,
  checked,
  onToggle,
}: {
  doc: { id: string; category: string; title: string; description: string };
  checked: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => onToggle(doc.id)}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && onToggle(doc.id)}
      className={cn(
        "p-6 rounded-3xl border-2 cursor-pointer transition-all duration-200 outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        checked
          ? "border-primary bg-primary/5 shadow-md"
          : "border-slate-200 bg-white hover:border-primary/30 hover:shadow-md"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
          {doc.category}
        </span>
        <div
          className={cn(
            "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors",
            checked ? "border-primary bg-primary text-white" : "border-slate-300"
          )}
          aria-hidden="true"
        >
          {checked && <Check className="w-4 h-4" />}
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
        <FileText className="w-5 h-5 text-slate-400 shrink-0" aria-hidden="true" />
        {doc.title}
      </h3>
      <p className="text-slate-500 font-medium leading-relaxed">{doc.description}</p>
    </div>
  );
}
