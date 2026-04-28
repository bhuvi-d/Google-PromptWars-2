import { NextResponse } from "next/server";

// Simple in-memory rate limiter (resets on cold start — sufficient for demo/hackathon)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

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
    .replace(/<script[^>]*>.*?<\/script>/gis, "")
    .replace(/<style[^>]*>.*?<\/style>/gis, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\[INST\]|\[\/INST\]|<s>|<\/s>/gi, "")
    .trim()
    .slice(0, 1000);
}

function buildSystemInstruction(language: string, region: string, stateName: string, profile?: string): string {
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
    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before asking again." },
        { status: 429 }
      );
    }

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

    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== "string") {
        return NextResponse.json({ error: "Malformed message entry." }, { status: 400 });
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
    }

    const systemInstruction = buildSystemInstruction(
      language ?? "en",
      region ?? "india",
      stateName ?? "",
      profile
    );

    const userMessage = sanitizeInput(messages[messages.length - 1].content);
    if (!userMessage) {
      return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
    }

    const historyContext = messages
      .slice(-6, -1)
      .map((m) => `${m.role === "user" ? "USER" : "ASSISTANT"}: ${sanitizeInput(m.content)}`)
      .join("\n");

    const fullPrompt = `${systemInstruction}\n\n${historyContext ? `Recent Conversation:\n${historyContext}\n\n` : ""}USER: ${userMessage}\n\nASSISTANT:`;

    // Try multiple model variants — AI Studio REST (no SDK needed)
    const MODELS = [
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash",
      "gemini-1.0-pro",
    ];

    let responseText = "";
    let lastError = "";

    for (const modelName of MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
            generationConfig: {
              maxOutputTokens: 800,
              temperature: 0.15,
              topP: 0.8,
            },
          }),
        });

        if (!res.ok) {
          const errBody = await res.text();
          lastError = `${modelName} → ${res.status}: ${errBody.slice(0, 300)}`;
          console.error("Gemini model error:", lastError);
          continue;
        }

        const data = await res.json();
        responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        if (responseText) break;

      } catch (err) {
        lastError = `${modelName} threw: ${String(err)}`;
        console.error("Gemini model threw:", lastError);
        continue;
      }
    }

    if (!responseText) {
      console.error("All Gemini models failed. Last error:", lastError);
      return NextResponse.json(
        { error: "AI service is temporarily unavailable. Please try again later." },
        { status: 502 }
      );
    }

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
    console.error("Chat API unhandled error:", error);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again later." },
      { status: 500 }
    );
  }
}
