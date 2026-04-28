/**
 * Zod-based schema validation for the /api/chat route.
 *
 * Centralising validation here means:
 *  - The route stays clean (no inline validation noise).
 *  - The schema is easily unit-testable.
 *  - TypeScript types are derived automatically — no duplication.
 */

import { z } from "zod";

/** Individual chat message */
export const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1, "Message cannot be empty").max(1000),
});

/** Full body expected by POST /api/chat */
export const ChatRequestSchema = z.object({
  messages: z
    .array(MessageSchema)
    .min(1, "At least one message is required")
    .max(50, "Too many messages in context"),
  language: z.enum(["en", "hi"]).optional().default("en"),
  region: z.enum(["india", "usa", "uk", "generic"]).optional().default("india"),
  stateName: z.string().max(100).optional().default(""),
  profile: z.string().max(500).optional(),
});

/** Inferred TypeScript types — no manual duplication */
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatMessage = z.infer<typeof MessageSchema>;
