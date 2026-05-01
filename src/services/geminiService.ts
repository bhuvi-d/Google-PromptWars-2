/**
 * Gemini Service — server-side Gemini AI interaction layer.
 *
 * Encapsulates:
 *   - System instruction generation
 *   - Input sanitisation
 *   - Multi-model fallback (gemini-2.5-flash → 2.0-flash → 1.5-flash)
 *   - Structured error handling
 *
 * This module runs exclusively on the server (API routes).
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** Ordered list of Gemini models to try (newest first). */
const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
] as const;

/** Maximum tokens in the AI response. */
const MAX_OUTPUT_TOKENS = 800;

/** Temperature for controlled, factual responses. */
const TEMPERATURE = 0.15;

/* ------------------------------------------------------------------ */
/*  Input sanitisation                                                 */
/* ------------------------------------------------------------------ */

/**
 * Strips HTML, LLM injection markers, and enforces a length limit.
 * Exported for unit testing.
 */
export function sanitizeInput(text: string): string {
  return text
    .replace(/<script[^>]*>.*?<\/script>/gis, "")
    .replace(/<style[^>]*>.*?<\/style>/gis, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\[INST\]|\[\/INST\]|<s>|<\/s>/gi, "")
    .trim()
    .slice(0, 1000);
}

/* ------------------------------------------------------------------ */
/*  System instruction builder                                         */
/* ------------------------------------------------------------------ */

/**
 * Builds the system instruction string for the Gemini prompt.
 * Exported for unit testing.
 */
export function buildSystemInstruction(
  language: string,
  region: string,
  stateName: string,
  profile?: string
): string {
  const langDirective =
    language === "hi"
      ? "CRITICAL: You MUST respond entirely in Hindi (Devanagari script)."
      : "CRITICAL: You MUST respond entirely in English.";

  const regionContext =
    region === "india"
      ? `The user is in INDIA${stateName ? `, specifically in ${stateName}` : ""}. Use Indian election terminology: ECI, EPIC (Voter ID), NVSP portal, EVM, Form 6 for registration, Form 8 for address change, NOTA option.`
      : region === "usa"
      ? "The user is in the USA. Use American election terminology: Polling places, Precinct, Absentee ballot, Primary/General elections, Secretary of State for registration."
      : region === "uk"
      ? "The user is in the UK. Use British election terminology: Polling stations, Electoral register, Royal Mail postal vote, Returning officer."
      : "The user's country is not specified. Provide general election education.";

  const profileContext = profile
    ? `\n\nUser profile context: ${sanitizeInput(profile)}`
    : "";

  return `You are VOTEXA, a trusted AI-powered civic education assistant. Your purpose is to help citizens understand elections confidently.

PERSONA: Calm, clear, accurate, supportive. Never political. Never biased.

RESPONSE RULES:
- Keep answers concise and structured (use numbered lists or bullet points when helpful)
- Always prioritize official sources and processes
- If unsure, say so and recommend official resources
- Decline non-election questions politely and redirect to your purpose
- Never make up specific dates, rules, or laws

REGION CONTEXT: ${regionContext}${profileContext}

${langDirective}`;
}

/* ------------------------------------------------------------------ */
/*  Core generation function                                           */
/* ------------------------------------------------------------------ */

export interface GeminiResult {
  success: boolean;
  content: string;
  model?: string;
  isQuotaError?: boolean;
}

/**
 * Sends a prompt to the Gemini API, trying each model in order.
 * Returns structured result with the response or error details.
 */
export async function generateResponse(
  messages: Array<{ role: string; content: string }>,
  language: string,
  region: string,
  stateName: string,
  profile?: string
): Promise<GeminiResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { success: false, content: "Service temporarily unavailable." };
  }

  const systemInstruction = buildSystemInstruction(
    language,
    region,
    stateName,
    profile
  );

  const userMessage = sanitizeInput(messages[messages.length - 1].content);
  if (!userMessage) {
    return { success: false, content: "Message cannot be empty." };
  }

  const historyContext = messages
    .slice(-6, -1)
    .map(
      (m) =>
        `${m.role === "user" ? "USER" : "ASSISTANT"}: ${sanitizeInput(m.content)}`
    )
    .join("\n");

  const fullPrompt = `${systemInstruction}\n\n${
    historyContext ? `Recent Conversation:\n${historyContext}\n\n` : ""
  }USER: ${userMessage}\n\nASSISTANT:`;

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError = "";

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: {
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          temperature: TEMPERATURE,
          topP: 0.8,
        },
      });

      const responseText = result.response.text();
      if (responseText) {
        return { success: true, content: responseText, model: modelName };
      }
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : String(err);
      lastError = `${modelName}: ${errMsg}`;
      console.error("[GeminiService] Model error:", lastError);

      // Stop trying on quota errors
      if (
        errMsg.includes("429") ||
        errMsg.includes("quota")
      ) {
        return {
          success: false,
          content:
            "The AI service is experiencing high demand. Please try again in a minute.",
          isQuotaError: true,
        };
      }
    }
  }

  console.error("[GeminiService] All models failed. Last:", lastError);
  return {
    success: false,
    content: "AI service is temporarily unavailable. Please try again later.",
  };
}
