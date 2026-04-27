"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, Clock, Globe, CalendarDays, BellRing } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useTranslation } from "@/lib/i18n";

export default function Home() {
  const { state } = useAppContext();
  const t = useTranslation(state.language);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-24 md:py-36 overflow-hidden hero-gradient">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {t("home.badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl mb-8 leading-tight">
            {t("home.title.1")} <span className="text-primary">{t("home.title.2")}</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl leading-relaxed text-slate-600 max-w-2xl mx-auto font-medium">
            {t("home.subtitle")}
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/journey"
              className="w-full sm:w-auto rounded-full bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-xl transition-all flex items-center justify-center active:scale-[0.98]"
            >
              {t("home.btn.journey")} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/assistant" 
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm hover:shadow-md"
            >
              {t("home.btn.askAI")}
            </Link>
          </div>
        </div>
      </section>

      {/* Smart Deadline Card & Features Section */}
      <section className="py-24 bg-slate-50 relative z-10 -mt-10 rounded-t-[3rem] border-t border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Smart Deadline Banner */}
          <div className="bg-white rounded-3xl p-6 md:p-8 mb-20 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-6 justify-between max-w-5xl mx-auto transform md:-translate-y-24 relative overflow-hidden" role="complementary" aria-label="Election deadline notice">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="bg-amber-100 p-4 rounded-2xl text-amber-600" aria-hidden="true">
                <CalendarDays className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Registration Deadline Approaching
                  <BellRing className="w-4 h-4 text-amber-500" aria-hidden="true" />
                </h2>
                <p className="text-slate-600 font-medium mt-1">{t("home.deadline.desc")}</p>
              </div>
            </div>
            <Link href="/journey" className="w-full md:w-auto whitespace-nowrap bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors relative z-10 text-center">
              {t("home.deadline.btn")}
            </Link>
          </div>

          <div className="text-center mb-16 mt-[-4rem]">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{t("home.features.title")}</h2>
            <p className="mt-5 text-xl font-medium text-slate-600 max-w-2xl mx-auto">{t("home.features.subtitle")}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="h-8 w-8 text-primary" />}
              title={t("feat.1.title")}
              description={t("feat.1.desc")}
              href="/journey"
            />
            <FeatureCard 
              icon={<CheckCircle2 className="h-8 w-8 text-primary" />}
              title={t("feat.2.title")}
              description={t("feat.2.desc")}
              href="/documents"
            />
            <FeatureCard 
              icon={<Clock className="h-8 w-8 text-primary" />}
              title={t("feat.3.title")}
              description={t("feat.3.desc")}
              href="/timeline"
            />
            <FeatureCard 
              icon={<Globe className="h-8 w-8 text-primary" />}
              title={t("feat.4.title")}
              description={t("feat.4.desc")}
              href="/special-situations"
            />
          </div>
        </div>
      </section>

      {/* AI Assistant Banner */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden rounded-t-[3rem]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">Confused? Ask our AI Assistant</h2>
          <p className="text-xl font-medium text-slate-300 mb-10 leading-relaxed">
            Powered by Google Gemini, our intelligent assistant provides accurate, structured, and calm answers to all your election-related questions in seconds.
          </p>
          <Link
            href="/assistant"
            className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-base font-bold text-slate-900 shadow-xl hover:bg-slate-100 hover:scale-105 transition-all"
          >
            Try the AI Assistant now
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, href }: { icon: React.ReactNode, title: string, description: string, href: string }) {
  return (
    <Link href={href} className="flex flex-col p-8 bg-white rounded-3xl border border-slate-200 hover:border-primary/30 hover:shadow-xl transition-all group duration-300">
      <div className="bg-slate-50 p-4 rounded-2xl w-fit shadow-sm border border-slate-100 mb-6 group-hover:scale-110 group-hover:bg-primary/5 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-slate-600 font-medium leading-relaxed flex-grow">{description}</p>
    </Link>
  );
}
