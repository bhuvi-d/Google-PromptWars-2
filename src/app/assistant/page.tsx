"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Loader2, AlertCircle, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/AppContext";
import { trackEvent } from "@/lib/analytics";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

// SpeechRecognition types are declared globally in src/types/google.d.ts

const SUGGESTED_QUESTIONS = [
  "How do I register to vote?",
  "What documents do I need on voting day?",
  "What if I moved to a new city?",
  "What is NOTA?",
];

export default function AssistantPage() {
  const { state } = useAppContext();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        state.language === "hi"
          ? "नमस्ते! मैं VOTEXA हूँ। चुनाव, पंजीकरण, या मतदान के बारे में कोई भी प्रश्न पूछें।"
          : "Hello! I'm VOTEXA — your AI election guide. Ask me anything about registration, polling booths, eligibility, or required documents.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = state.language === "hi" ? "hi-IN" : "en-IN";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognitionRef.current.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "network") {
        setError("Voice input unavailable in this browser. Please type your question.");
      } else if (event.error === "not-allowed") {
        setError("Microphone access denied. Allow mic permissions to use voice input.");
      }
      setTimeout(() => setError(null), 6000);
    };

    recognitionRef.current.onend = () => setIsListening(false);
  }, [state.language]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInput("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  }, [isListening]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Track each AI message sent as a GA4 event
      trackEvent("chat_message_sent", {
        language: state.language,
        region: state.region,
        message_length: text.trim().length,
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          language: state.language,
          region: state.region,
          stateName: state.state,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: data.content },
      ]);

      trackEvent("chat_response_received", { region: state.region });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      trackEvent("chat_error", { error_message: message });
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, state.language, state.region, state.state]);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    sendMessage(input);
  }, [input, sendMessage]);

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 flex flex-col h-[calc(100vh-5rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-2xl">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          AI Election Assistant
        </h1>
        <p className="text-slate-500 mt-2 font-medium ml-1">
          Powered by Google Gemini · Context-aware for{" "}
          <span className="text-primary font-bold capitalize">{state.region === "india" ? `India${state.state ? ` · ${state.state}` : ""}` : state.region}</span>
        </p>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-[2rem] border border-slate-200 shadow-sm">
        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full gap-4",
                message.role === "user"
                  ? "ml-auto flex-row-reverse max-w-[85%] md:max-w-[75%]"
                  : "mr-auto max-w-[90%] md:max-w-[80%]"
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-sm",
                  message.role === "user" ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
                )}
                aria-hidden="true"
              >
                {message.role === "user" ? <User size={18} /> : <Bot size={20} />}
              </div>
              <div
                className={cn(
                  "p-4 md:p-5 rounded-3xl text-base leading-relaxed shadow-sm",
                  message.role === "user"
                    ? "bg-primary text-white rounded-tr-sm"
                    : "bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-sm whitespace-pre-wrap"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}

          {/* Suggested questions — show only when only the greeting exists */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-3 mt-4" role="group" aria-label="Suggested questions">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="px-4 py-2.5 rounded-full text-sm font-semibold bg-primary/5 border border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex gap-4 max-w-[80%] mr-auto">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Bot size={20} className="text-slate-600" />
              </div>
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 rounded-tl-sm flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-slate-500 font-medium">Thinking...</span>
              </div>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="flex items-center gap-3 text-red-700 bg-red-50 border border-red-200 p-4 rounded-2xl mx-auto max-w-lg"
            >
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-100">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative">
              {isListening && (
                <>
                  <span className="absolute inset-0 rounded-2xl bg-red-400 animate-ping opacity-25 scale-150 pointer-events-none" />
                  <span className="absolute inset-0 rounded-2xl bg-red-400 animate-pulse opacity-40 scale-125 pointer-events-none" />
                </>
              )}
              <button
                type="button"
                onClick={toggleListening}
                className={cn(
                  "relative z-10 h-14 w-14 rounded-2xl flex items-center justify-center transition-all",
                  isListening
                    ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
                aria-label={isListening ? "Stop voice input" : "Start voice input"}
              >
                {isListening ? <MicOff size={22} /> : <Mic size={22} />}
              </button>
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask about registration, documents, polling booths..."}
              className="flex-1 h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 transition-all"
              disabled={isLoading}
              maxLength={500}
              aria-label="Type your election question"
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-14 px-8 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-40 flex items-center gap-2 shadow-sm"
              aria-label="Send message"
            >
              <span className="hidden sm:inline">Send</span>
              <Send size={18} />
            </button>
          </form>
          <p className="text-center mt-3 text-xs font-medium text-slate-400">
            VOTEXA AI may occasionally be inaccurate. Always verify with your official Election Commission.
          </p>
        </div>
      </div>
    </div>
  );
}
