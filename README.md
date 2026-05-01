# VOTEXA — AI-Powered Election Assistant

> **Empowering citizens to vote with confidence** through AI-driven civic education, personalized election journeys, and real-time guidance.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![Google Gemini](https://img.shields.io/badge/Gemini_AI-Powered-4285F4?logo=google)](https://ai.google.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Analytics%20%2B%20Firestore-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Cloud Run](https://img.shields.io/badge/Cloud_Run-Deployable-4285F4?logo=googlecloud)](https://cloud.google.com/run)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)

---

## 🧩 The Problem

Millions of first-time and returning voters face the same challenges every election cycle:

- **"Am I eligible to vote?"** — Confusion about age limits, registration status, and required documents.
- **"What documents do I need?"** — Different regions have different ID requirements; misinformation is rampant.
- **"I moved cities — can I still vote?"** — Life changes create real bureaucratic obstacles that prevent people from participating.
- **"Where is my polling booth?"** — Finding the correct booth assigned to your registered address is non-trivial.

These barriers disproportionately affect first-time voters, young adults, senior citizens, and persons with disabilities. The result? Millions of eligible citizens skip elections every cycle — not because they don't care, but because the process feels overwhelming.

## 💡 Why VOTEXA Matters

VOTEXA addresses this civic information gap with a single, unified platform:

1. **AI-powered answers** — Instant, accurate, region-specific election guidance powered by Google Gemini, available in English and Hindi.
2. **Personalized journeys** — A step-by-step roadmap tailored to the voter's age, location, occupation, and history.
3. **Myth busting** — Interactive cards that combat misinformation with verified facts.
4. **Smart document checklists** — Region-aware lists that tell you exactly what to carry on voting day.
5. **Accessible by design** — Large text mode, keyboard navigation, screen reader support, and 10+ language translations via Google Translate.

The goal is simple: **no citizen should miss an election because of confusion.**

---

## 🏗️ Architecture

```
src/
├── app/                        # Next.js App Router pages
│   ├── api/chat/route.ts       # Gemini AI chat endpoint
│   ├── assistant/              # AI Assistant (Gemini-powered chat)
│   ├── journey/                # Personalized election roadmap
│   ├── documents/              # Smart document checklist
│   ├── myths/                  # Myth vs Fact cards
│   ├── timeline/               # Election timeline
│   ├── special-situations/     # Edge-case voter guidance
│   ├── layout.tsx              # Root layout (GA4, Firebase, a11y)
│   ├── robots.ts               # SEO robots config
│   └── sitemap.ts              # Dynamic XML sitemap
├── components/                 # Reusable UI components
│   ├── Header.tsx              # Navigation + region selector
│   ├── ErrorBoundary.tsx       # Render error recovery
│   ├── GoogleAnalytics.tsx     # GA4 script injection
│   ├── GoogleTranslate.tsx     # Google Translate widget
│   ├── FirebaseAnalyticsProvider.tsx  # Firebase Analytics init
│   └── PollingBoothMap.tsx     # Google Maps embed
├── services/                   # Service layer (core business logic)
│   ├── analyticsService.ts     # Unified GA4 + Firebase event tracking
│   ├── storageService.ts       # Firestore data access layer
│   ├── geminiService.ts        # Gemini AI interaction (server-side)
│   └── index.ts                # Barrel export
├── context/
│   └── AppContext.tsx          # Global state (readiness, region, language)
├── lib/                        # Shared utilities
│   ├── firebase.ts             # Firebase SDK singleton
│   ├── analytics.ts            # Legacy GA4 helpers (backward compat)
│   ├── schemas.ts              # Zod validation schemas
│   ├── i18n.ts                 # EN/HI translations
│   └── utils.ts                # Tailwind cn() utility
├── types/
│   ├── index.ts                # Centralized TypeScript type definitions
│   └── google.d.ts             # Global window type augmentations
└── __tests__/                  # Unit test suite
    ├── readiness.test.ts       # Readiness score logic
    ├── journey.test.ts         # Journey generation logic
    ├── geminiService.test.ts   # Gemini service utilities
    ├── storageService.test.ts  # Firestore service (no-op + contract)
    ├── pollingBoothMap.test.ts # Google Maps query construction
    ├── schemas.test.ts         # Zod schema validation
    ├── analytics.test.ts       # Analytics helpers
    └── api.test.ts             # API sanitisation + rate limiting
```

---

## 🔌 Google Services Integration

| Service                 | Purpose                                              | Integration Point              |
|-------------------------|------------------------------------------------------|--------------------------------|
| **Google Gemini AI**    | Core AI assistant — answers election questions       | `services/geminiService.ts`, `/api/chat` |
| **Firebase Analytics**  | Client-side event tracking (dual with GA4)           | `services/analyticsService.ts`, `FirebaseAnalyticsProvider.tsx` |
| **Cloud Firestore**     | Anonymous usage logging, regional statistics         | `services/storageService.ts`, `/api/chat` |
| **Google Maps API**     | Polling booth locator embed                          | `components/PollingBoothMap.tsx` |
| **Google Analytics 4**  | Page views, user interaction events                  | `components/GoogleAnalytics.tsx`, `services/analyticsService.ts` |
| **Google Translate**    | Multi-language accessibility widget                  | `components/GoogleTranslate.tsx` |
| **Google Fonts (Inter)**| Typography via next/font                             | `app/layout.tsx` |
| **Cloud Run**           | Production deployment target                         | `Dockerfile`, `cloudbuild.yaml` |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- A Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

### 1. Clone & Install

```bash
git clone https://github.com/your-username/votexa.git
cd votexa
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key

# Optional (enables additional Google services)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

### Test Coverage

| Module              | Tests                                      |
|---------------------|--------------------------------------------|
| Readiness Score     | Score calculation, edge cases, boundaries  |
| Journey Generation  | Profile-based roadmap, step selection      |
| Gemini Service      | Sanitisation, system instructions          |
| Storage Service     | Graceful no-op, API contract validation    |
| Polling Booth Map   | Query construction, URL encoding, regions  |
| Zod Schemas         | Validation, defaults, error messages       |
| Analytics           | GA4 tracking, safety guards                |
| API Route           | Rate limiting, input sanitisation          |

---

## ☁️ Cloud Run Deployment

### Option A: Using `gcloud` CLI

```bash
# Build and deploy directly
gcloud run deploy votexa-app \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key \
  --port 8080
```

### Option B: Using Cloud Build (CI/CD)

```bash
# Submit a build
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_GEMINI_API_KEY=your_key
```

### Option C: Docker locally

```bash
docker build -t votexa-app .
docker run -p 8080:8080 -e GEMINI_API_KEY=your_key votexa-app
```

---

## 📊 Analytics Events Tracked

| Event                      | Trigger                           |
|----------------------------|-----------------------------------|
| `roadmap_generated`        | User creates personalized journey |
| `readiness_score_changed`  | User completes a readiness task   |
| `chat_message_sent`        | User sends a message to AI        |
| `chat_response_received`   | AI responds successfully          |
| `voice_input_used`         | User activates voice input        |
| `myth_card_flipped`        | User reveals a myth's truth       |
| `document_checked`         | User checks a document off        |
| `region_changed`           | User changes region               |

Events flow to both **GA4** and **Firebase Analytics** simultaneously.
Usage events are also persisted to **Cloud Firestore** for aggregated analysis.

---

## 🔒 Security

- **No exposed API keys** — All secrets via environment variables
- **Input sanitisation** — HTML/script/LLM injection stripping
- **Rate limiting** — 20 requests/minute per IP
- **Zod validation** — Schema-based request validation
- **Security headers** — X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- **Non-root Docker user** — CIS benchmark compliance
- **Error boundaries** — Graceful error recovery in UI

---

## ♿ Accessibility

- Skip-to-content link
- Semantic HTML (`<main>`, `<nav>`, `<footer>`, `<section>`)
- ARIA labels, roles, and live regions
- Keyboard navigation (all interactive elements)
- Focus management and visible focus indicators
- Large text mode toggle
- Color contrast compliant palette
- Scalable typography via `rem` units

---

## 📁 Environment Variables Reference

| Variable                          | Required | Description                          |
|-----------------------------------|----------|--------------------------------------|
| `GEMINI_API_KEY`                  | ✅        | Google Gemini AI API key             |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`   | ❌        | GA4 Measurement ID                   |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ❌        | Google Maps Embed API key            |
| `NEXT_PUBLIC_FIREBASE_API_KEY`    | ❌        | Firebase Web API key                 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ❌        | Firebase/GCP project ID              |
| `NEXT_PUBLIC_FIREBASE_APP_ID`     | ❌        | Firebase App ID                      |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **AI**: Google Gemini API (2.5 Flash → 2.0 Flash → 1.5 Flash fallback)
- **Analytics**: GA4 + Firebase Analytics (dual tracking)
- **Database**: Cloud Firestore (anonymous usage logs)
- **Maps**: Google Maps Embed API
- **Validation**: Zod schemas
- **Testing**: Jest + ts-jest
- **Deployment**: Docker → Google Cloud Run
- **CI/CD**: Cloud Build (`cloudbuild.yaml`)

---

## 📜 License

MIT
