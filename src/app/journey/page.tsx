"use client";

import { useState } from "react";
import { User, MapPin, Briefcase, Calendar, CheckCircle2, ArrowRight, BookOpen, ChevronRight, Activity, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/AppContext";
import { useTranslation } from "@/lib/i18n";
import { PollingBoothMap } from "@/components/PollingBoothMap";
import { trackEvent } from "@/lib/analytics";

type Profile = {
  ageGroup: string;
  isFirstTime: boolean;
  movedRecently: boolean;
  occupation: string;
};

export default function JourneyPage() {
  const { state, completeTask, uncompleteTask } = useAppContext();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const t = useTranslation(state.language);
  const [step, setStep] = useState<"profile" | "roadmap">("profile");
  const [profile, setProfile] = useState<Profile>({
    ageGroup: "18-25",
    isFirstTime: true,
    movedRecently: false,
    occupation: "student",
  });

  const toggleTask = (taskId: string) => {
    if (state.completedTasks.includes(taskId)) {
      uncompleteTask(taskId);
    } else {
      completeTask(taskId);
    }
  };

  const generateRoadmap = () => {
    const steps = [
      { id: "check-eligibility", title: "Check Eligibility", description: "Ensure you meet the minimum age requirement and hold citizenship." },
    ];

    if (profile.isFirstTime) {
      steps.push({ id: "register-vote", title: "Register to Vote", description: "Submit Form 6 to register yourself in the electoral roll via the NVSP portal." });
    }

    if (profile.movedRecently) {
      steps.push({ id: "update-address", title: "Update Voter Details", description: "Fill out Form 8 to shift your constituency to your new current address." });
    } else if (!profile.isFirstTime) {
      steps.push({ id: "verify-name", title: "Verify Name on List", description: "Check the current electoral roll online to ensure your name is active." });
    }

    if (profile.occupation === "student") {
      steps.push({ id: "prep-docs", title: "Prepare Documents", description: "Gather your College ID, Aadhar Card, and address proof for verification." });
    } else {
      steps.push({ id: "prep-docs", title: "Prepare Documents", description: "Gather your Voter ID (EPIC), Pan Card, or Aadhar Card." });
    }

    steps.push({ id: "find-booth", title: "Find Polling Station", description: "Locate your designated polling booth online a few days before voting." });
    steps.push({ id: "vote", title: "Cast Your Vote", description: "Head to the booth early, get inked, and press the EVM button." });

    return steps;
  };

  const roadmapSteps = generateRoadmap();
  
  // Readiness Logic
  const completedCount = roadmapSteps.filter(s => state.completedTasks.includes(s.id)).length;
  const progressPercent = roadmapSteps.length > 0 ? Math.round((completedCount / roadmapSteps.length) * 100) : 0;
  
  let readinessLabel = "Just Started";
  if (progressPercent > 80) readinessLabel = "Almost Ready!";
  if (progressPercent === 100) readinessLabel = "Fully Ready!";

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      {step === "profile" ? (
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Personalized Election Journey</h1>
            <p className="text-lg md:text-xl text-slate-600 font-medium">Tell us a little about yourself, and we&apos;ll generate a custom step-by-step roadmap.</p>
          </div>
          
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-8 text-slate-900">Create Your Voter Profile</h2>
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> Age Group
                  </label>
                  <select 
                    className="w-full rounded-2xl border border-slate-200 p-4 bg-slate-50 outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                    value={profile.ageGroup}
                    onChange={(e) => setProfile({...profile, ageGroup: e.target.value})}
                  >
                    <option value="18-25">18-25</option>
                    <option value="26-40">26-40</option>
                    <option value="41-60">41-60</option>
                    <option value="60+">60+</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" /> Current Status
                  </label>
                  <select 
                    className="w-full rounded-2xl border border-slate-200 p-4 bg-slate-50 outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                    value={profile.occupation}
                    onChange={(e) => setProfile({...profile, occupation: e.target.value})}
                  >
                    <option value="student">Student</option>
                    <option value="working">Working Professional</option>
                    <option value="retired">Retired / Senior Citizen</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-slate-200 cursor-pointer" onClick={() => setProfile({...profile, isFirstTime: !profile.isFirstTime})}>
                <div>
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                    <User className="w-5 h-5 text-primary" /> First Time Voter?
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Have you ever voted in an election before?</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer pointer-events-none">
                  <input type="checkbox" className="sr-only peer" checked={profile.isFirstTime} readOnly />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-slate-200 cursor-pointer" onClick={() => setProfile({...profile, movedRecently: !profile.movedRecently})}>
                <div>
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                    <MapPin className="w-5 h-5 text-primary" /> Moved Recently?
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Have you changed your city or address recently?</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer pointer-events-none">
                  <input type="checkbox" className="sr-only peer" checked={profile.movedRecently} readOnly />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <button 
                onClick={() => {
                  setStep("roadmap");
                  trackEvent("roadmap_generated", {
                    age_group: profile.ageGroup,
                    occupation: profile.occupation,
                    is_first_time: profile.isFirstTime,
                    moved_recently: profile.movedRecently,
                    region: state.region,
                  });
                }}
                className="w-full mt-8 bg-primary text-white font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 text-lg"
              >
                Generate My Roadmap <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10 items-start relative">
          
          {/* Main Visual Progress Map */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-8">
              <button 
                onClick={() => setStep("profile")}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/50 transition-colors shadow-sm"
              >
                <ChevronRight className="w-6 h-6 rotate-180" />
              </button>
              <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                <Map className="w-8 h-8 text-primary" /> Your Election Map
              </h1>
            </div>

            {profile.isFirstTime && (
              <div className="mb-10 p-6 bg-primary/5 rounded-3xl border border-primary/20 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 shadow-sm">
                <div className="bg-white p-4 rounded-full shadow-sm flex-shrink-0 z-10">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <div className="z-10 flex-1">
                  <h3 className="text-xl font-bold text-primary-dark mb-2">First Time Voter Guide</h3>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    Voting for the first time is exciting! On voting day: Join the queue, have your ID checked, get your finger inked, and confidently press the button on the EVM next to your chosen candidate.
                  </p>
                </div>
                <a href="/assistant" className="z-10 whitespace-nowrap bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md active:scale-95">
                  Ask AI About It
                </a>
              </div>
            )}
            
            {/* The Visual Node Map */}
            <div className="relative pt-4 pb-8 pl-8 md:pl-16 space-y-6">
              {/* Connecting Line */}
              <div className="absolute top-8 bottom-12 left-[48px] md:left-[80px] w-1 bg-slate-200 rounded-full z-0" />
              <div 
                className="absolute top-8 left-[48px] md:left-[80px] w-1 bg-primary rounded-full z-0 transition-all duration-1000 ease-out" 
                style={{ height: `calc(${progressPercent}% - 32px)` }} 
              />

              {roadmapSteps.map((s, index) => {
                const isComplete = state.completedTasks.includes(s.id);
                const isNext = !isComplete && (index === 0 || state.completedTasks.includes(roadmapSteps[index-1].id));
                
                return (
                  <div key={s.id} className="relative z-10 flex items-center group cursor-pointer" onClick={() => toggleTask(s.id)}>
                    {/* Node Circle */}
                    <div className={cn(
                      "absolute -left-12 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ring-4 ring-slate-50 shadow-sm",
                      isComplete ? "bg-primary text-white" : 
                      isNext ? "bg-white border-4 border-primary text-primary shadow-lg scale-110" : "bg-white border-2 border-slate-300 text-slate-400"
                    )}>
                      {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-bold">{index + 1}</span>}
                    </div>
                    
                    {/* Visual Card */}
                    <div className={cn(
                      "w-full ml-4 bg-white p-6 rounded-[2rem] border transition-all duration-300 shadow-sm",
                      isComplete ? "border-primary/20 bg-primary/5" : 
                      isNext ? "border-primary/50 shadow-md ring-2 ring-primary/10" : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                    )}>
                      <h3 className={cn("text-xl font-bold mb-2 transition-colors", isComplete ? "text-primary-dark" : "text-slate-900")}>
                        {s.title}
                      </h3>
                      <p className={cn("font-medium leading-relaxed", isComplete ? "text-slate-700" : "text-slate-500")}>
                        {s.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Google Maps: Polling Booth Locator */}
            <div className="mt-8">
              <PollingBoothMap region={state.region} stateName={state.state} />
            </div>
          </div>

          {/* Sticky Sidebar: Readiness Visual Meter */}
          <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-28">
            <div className="bg-white rounded-[2rem] shadow-md border border-slate-200 p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> Readiness Score
              </h3>
              
              {/* SVG Circular Progress Meter */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-100" />
                  {/* Progress Circle */}
                  <circle 
                    cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" 
                    className={cn("transition-all duration-1000 ease-out", progressPercent === 100 ? "text-green-500" : "text-primary")}
                    strokeDasharray={251.2} 
                    strokeDashoffset={251.2 - (251.2 * progressPercent) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-extrabold text-slate-900">{progressPercent}<span className="text-2xl">%</span></span>
                </div>
              </div>
              
              <p className={cn("text-xl font-bold mb-2", progressPercent === 100 ? "text-green-600" : "text-primary")}>
                {readinessLabel}
              </p>
              <p className="text-slate-500 font-medium text-sm">
                {roadmapSteps.length - completedCount} steps remaining to be fully prepared.
              </p>
            </div>
            
            <div className="mt-6 bg-slate-900 rounded-[2rem] p-6 text-white text-center shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              <h4 className="font-bold text-lg mb-2">Need Guidance?</h4>
              <p className="text-slate-300 text-sm mb-4">Our AI can walk you through any step.</p>
              <a href="/assistant" className="inline-block w-full bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-100 transition-colors shadow-sm">
                Ask AI Assistant
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
