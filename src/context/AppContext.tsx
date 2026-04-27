"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type Language = "en" | "hi";
export type Region = "india" | "usa" | "uk" | "generic";

export type AppState = {
  language: Language;
  region: Region;
  state: string; // e.g. "Maharashtra", "California"
  readinessScore: number;
  completedTasks: string[];
  isLargeText: boolean;
  lastVisitedModule: string;
};

type AppContextType = {
  state: AppState;
  setLanguage: (lang: Language) => void;
  setRegion: (region: Region, stateName?: string) => void;
  toggleLargeText: () => void;
  completeTask: (taskId: string) => void;
  uncompleteTask: (taskId: string) => void;
  setLastVisited: (module: string) => void;
};

const initialState: AppState = {
  language: "en",
  region: "india",
  state: "",
  readinessScore: 0,
  completedTasks: [],
  isLargeText: false,
  lastVisitedModule: "",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const TASKS_FOR_SCORE = ["check-eligibility", "register-vote", "prep-docs", "find-booth"];

function calculateScore(tasks: string[]): number {
  const relevant = tasks.filter(t => TASKS_FOR_SCORE.includes(t));
  return Math.min(100, Math.round((relevant.length / TASKS_FOR_SCORE.length) * 100));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [appState, setAppState] = useState<AppState>(initialState);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem("votexa_v2_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to handle new fields
        setAppState({ ...initialState, ...parsed });
      }
    } catch {
      // Silently reset on parse error
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem("votexa_v2_state", JSON.stringify(appState));
    } catch {
      // Storage may be full — silently fail
    }

    if (appState.isLargeText) {
      document.documentElement.classList.add("large-text-mode");
    } else {
      document.documentElement.classList.remove("large-text-mode");
    }
  }, [appState, isClient]);

  const setLanguage = useCallback((lang: Language) => {
    setAppState(s => ({ ...s, language: lang }));
  }, []);

  const setRegion = useCallback((region: Region, stateName = "") => {
    setAppState(s => ({ ...s, region, state: stateName }));
  }, []);

  const toggleLargeText = useCallback(() => {
    setAppState(s => ({ ...s, isLargeText: !s.isLargeText }));
  }, []);

  const completeTask = useCallback((taskId: string) => {
    setAppState(s => {
      const newTasks = Array.from(new Set([...s.completedTasks, taskId]));
      return { ...s, completedTasks: newTasks, readinessScore: calculateScore(newTasks) };
    });
  }, []);

  const uncompleteTask = useCallback((taskId: string) => {
    setAppState(s => {
      const newTasks = s.completedTasks.filter(id => id !== taskId);
      return { ...s, completedTasks: newTasks, readinessScore: calculateScore(newTasks) };
    });
  }, []);

  const setLastVisited = useCallback((module: string) => {
    setAppState(s => ({ ...s, lastVisitedModule: module }));
  }, []);

  return (
    <AppContext.Provider value={{
      state: appState,
      setLanguage,
      setRegion,
      toggleLargeText,
      completeTask,
      uncompleteTask,
      setLastVisited,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

// Exported pure function for testing
export { calculateScore, TASKS_FOR_SCORE };
