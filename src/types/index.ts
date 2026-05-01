/**
 * Centralized TypeScript type definitions for VOTEXA.
 *
 * All shared interfaces / type aliases live here to enforce a single
 * source of truth and prevent duplication across services and components.
 */

/* ------------------------------------------------------------------ */
/*  Region & Language                                                  */
/* ------------------------------------------------------------------ */

/** Supported UI language codes. */
export type Language = "en" | "hi";

/** Supported geographic regions. */
export type Region = "india" | "usa" | "uk" | "generic";

/* ------------------------------------------------------------------ */
/*  Voter Profile                                                      */
/* ------------------------------------------------------------------ */

/** User profile collected during the Journey flow. */
export interface VoterProfile {
  ageGroup: "18-25" | "26-40" | "41-60" | "60+";
  isFirstTime: boolean;
  movedRecently: boolean;
  occupation: "student" | "working" | "retired" | "other";
}

/* ------------------------------------------------------------------ */
/*  Roadmap / Journey                                                  */
/* ------------------------------------------------------------------ */

/** A single step in the personalized election roadmap. */
export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
}

/* ------------------------------------------------------------------ */
/*  Chat / AI Assistant                                                */
/* ------------------------------------------------------------------ */

/** A single message in the AI chat thread. */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

/** Payload sent to POST /api/chat. */
export interface ChatRequestPayload {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  language: Language;
  region: Region;
  stateName: string;
  profile?: string;
}

/** Successful response from POST /api/chat. */
export interface ChatResponse {
  role: "assistant";
  content: string;
}

/* ------------------------------------------------------------------ */
/*  Readiness Score                                                     */
/* ------------------------------------------------------------------ */

/** Global application state persisted to localStorage. */
export interface AppState {
  language: Language;
  region: Region;
  state: string;
  readinessScore: number;
  completedTasks: string[];
  isLargeText: boolean;
  lastVisitedModule: string;
}

/* ------------------------------------------------------------------ */
/*  Document Checklist                                                  */
/* ------------------------------------------------------------------ */

/** A single document in the region-aware checklist. */
export interface VotingDocument {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: 1 | 2;
}

/* ------------------------------------------------------------------ */
/*  Analytics Events                                                    */
/* ------------------------------------------------------------------ */

/** Named analytics events tracked throughout the application. */
export type AnalyticsEventName =
  | "chat_message_sent"
  | "chat_response_received"
  | "chat_error"
  | "roadmap_generated"
  | "readiness_score_changed"
  | "voice_input_used"
  | "myth_card_flipped"
  | "document_checked"
  | "region_changed"
  | "page_view";

/** Key-value params attached to an analytics event. */
export type AnalyticsEventParams = Record<string, string | number | boolean>;

/* ------------------------------------------------------------------ */
/*  Firestore Documents                                                */
/* ------------------------------------------------------------------ */

/** Shape of an anonymous usage record stored in Firestore. */
export interface FirestoreUsageRecord {
  timestamp: string;
  region: Region;
  state: string;
  language: Language;
  event: AnalyticsEventName;
  metadata?: Record<string, string | number | boolean>;
}

/** Regional statistics aggregated in Firestore. */
export interface FirestoreRegionStats {
  region: Region;
  totalQueries: number;
  lastUpdated: string;
  popularTopics: string[];
}
