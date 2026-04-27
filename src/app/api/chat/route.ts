import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Simple in-memory rate limiter (resets on cold start — sufficient for demo/hackathon)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests
const RATE_WINDOW_MS = 60_000; // per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count += 1;
  return true;
}

function sanitizeInput(text: string): string {
  return text
    .replace(/<script[^>]*>.*?<\/script>/gis, "") // Remove script blocks entirely
    .replace(/<style[^>]*>.*?<\/style>/gis, "")   // Remove style blocks entirely
    .replace(/<[^>]*>/g, "")                        // Strip remaining HTML tags
    .replace(/\[INST\]|\[\/INST\]|<s>|<\/s>/gi, "") // LLM injection patterns
    .trim()
    .slice(0, 1000); // Hard cap at 1000 chars
}

function buildSystemInstruction(language: string, region: string, stateName: string, profile?: string): string {
  const langDirective =
    language === "hi"
      ? "CRITICAL: You MUST respond entirely in Hindi (Devanagari script)."
      : "CRITICAL: You MUST respond entirely in English.";

  const regionContext = region === "india"
    ? `The user is in INDIA${stateName ? `, specifically in ${stateName}` : ""}. Use Indian election terminology: ECI (Election Commission of India), EPIC (Voter ID), NVSP portal, EVM (Electronic Voting Machine), Form 6 for registration, Form 8 for address change, NOTA option.`
    : region === "usa"
    ? "The user is in the USA. Use American election terminology: Polling places, Precinct, Absentee ballot, Primary/General elections, Secretary of State for registration."
    : region === "uk"
    ? "The user is in the UK. Use British election terminology: Polling stations, Electoral register, Royal Mail postal vote, Returning officer."
    : "The user's country is not specified. Provide general election education.";

  const profileContext = profile ? `\n\nUser profile context: ${sanitizeInput(profile)}` : "";

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

export async function POST(req: Request) {
  try {
    // Rate limiting by IP
    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before asking again." },
        { status: 429 }
      );
    }

    // Parse and validate body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { messages, language, region, stateName, profile } = body as {
      messages: { role: string; content: string }[];
      language?: string;
      region?: string;
      stateName?: string;
      profile?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages format." }, { status: 400 });
    }

    // Validate each message
    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== "string") {
        return NextResponse.json({ error: "Malformed message entry." }, { status: 400 });
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Service temporarily unavailable." },
        { status: 503 }
      );
    }

    const systemInstruction = buildSystemInstruction(
      language ?? "en",
      region ?? "india",
      stateName ?? "",
      profile
    );

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction,
    });

    // Build history — strip initial assistant greeting for Gemini
    let historyMessages = messages.slice(0, -1);
    if (historyMessages.length > 0 && historyMessages[0].role === "assistant") {
      historyMessages = historyMessages.slice(1);
    }

    const formattedHistory = historyMessages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: sanitizeInput(msg.content) }],
    }));

    const currentMessage = sanitizeInput(messages[messages.length - 1].content);

    if (!currentMessage) {
      return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
    }

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.15, // Low temperature = more factual, less hallucination
        topP: 0.8,
      },
    });

    const result = await chat.sendMessage(currentMessage);
    const responseText = result.response.text();

    return NextResponse.json(
      { role: "assistant", content: responseText },
      {
        headers: {
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
        },
      }
    );
  } catch (error) {
    // Don't leak internal error details to the client
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again later." },
      { status: 500 }
    );
  }
}
