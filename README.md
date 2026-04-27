# VOTEXA — AI-Powered Election Education Platform 🗳️

> **Empowering citizens to vote with confidence, clarity, and zero confusion.**

VOTEXA is a production-ready civic technology platform built to make the democratic process understandable and accessible for every citizen — first-time voters, senior citizens, students, people who recently moved, or anyone who simply has questions about how elections work.

Built with **Next.js**, powered by **Google Gemini 2.5 Flash**, and designed for real-world public use.

---

## 🌟 Why This Matters

Millions of eligible voters stay home because the process feels confusing, unfamiliar, or intimidating. Questions like:

- *"Am I even registered?"*
- *"What documents do I need?"*
- *"I moved last year — can I still vote?"*
- *"I heard EVMs can be hacked — is that true?"*

These aren't silly questions. They're the questions that decide whether someone votes or doesn't. **VOTEXA eliminates that uncertainty.**

---

## ✨ Features

### 🤖 Gemini AI Election Assistant
An intelligent, context-aware chat interface powered by **Google Gemini 2.5 Flash**. Users can type or use **voice input** (Web Speech API) to ask any election question and receive accurate, structured, calm answers.

- Region-aware responses (India, USA, UK, or generic)
- Language-aware (English and Hindi)
- Suggested quick questions for instant guidance
- Prompt-injected safety via input sanitization

### 🗺️ Visual Election Journey Map
A personalized, visual step-by-step roadmap generated based on the user's profile:
- Age group, voter status, occupation
- Whether they've moved recently
- First-time voter special guidance
- Interactive node map with a **live circular readiness meter**

### ⏳ Interactive Election Timeline
A horizontal, clickable timeline showing all election lifecycle stages — Announcement → Registration → Campaign → Voting → Counting — with expandable detail panels.

### 📋 Smart Document Checklist
Know exactly what to bring to your polling booth. Interactive cards let you mark what you have ready, with instant "Ready to Vote" feedback.

### 🛡️ Myth vs Fact Flip Cards
Interactive 3D flip cards that combat common election misinformation. Users click to reveal the truth behind popular myths about EVMs, NOTA, proxy voting, and more.

### 🆘 Special Situations Helper
Accordion-style guidance for edge cases:
- Recently moved to a new city
- Lost Voter ID card
- Name missing from the voter list
- Senior citizen assistance
- Person with Disability (PwD) services

### 💯 Election Readiness Score
A persistent, local-storage-backed readiness score (0–100%) tracked in the Header. No login required — state is preserved across visits automatically.

### 🌐 Region-Aware Personalization
Select your country and state. Gemini prompts are automatically adjusted to use the right:
- Terminology (EPIC/Voter ID for India, Absentee ballot for USA, etc.)
- Forms and portals (NVSP, EVM for India)
- Local context

### 🌍 Multilingual Support
Toggle between **English** and **Hindi** with a single click. The AI is instructed to respond in the selected language.

### ♿ Accessibility Features
- Large Text Mode (scales all text 115% via CSS)
- Voice input (Web Speech API)
- Semantic HTML throughout
- ARIA labels on all interactive elements
- `role="log"` and `aria-live` on chat window
- Keyboard navigable
- High contrast color palette

---

## 🏗️ Architecture

```
VOTEXA/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts       # Gemini API — rate limiting, sanitization, region prompts
│   │   ├── assistant/page.tsx      # AI Chat UI — voice input, suggested questions
│   │   ├── journey/page.tsx        # Visual Node Map + Circular Readiness Meter
│   │   ├── timeline/page.tsx       # Interactive Horizontal Timeline
│   │   ├── documents/page.tsx      # Smart Document Checklist
│   │   ├── myths/page.tsx          # 3D Flip Cards — Myth vs Fact
│   │   ├── special-situations/     # Accordion Help
│   │   └── page.tsx                # Landing page — Smart Deadline Card
│   ├── components/
│   │   └── Header.tsx              # Sticky nav — Readiness, Region, Lang, A11y toggles
│   ├── context/
│   │   └── AppContext.tsx          # Global state — region, lang, tasks, readiness
│   └── lib/
│       ├── utils.ts                # cn() utility
│       └── i18n.ts                 # Translation dictionary + useTranslation hook
├── src/__tests__/
│   ├── readiness.test.ts           # Unit tests — score calculation
│   └── api.test.ts                 # Unit tests — sanitization + rate limiting
└── jest.config.js
```

### Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Google Gemini 2.5 Flash |
| Icons | Lucide React |
| State | React Context + localStorage |
| Tests | Jest + ts-jest |
| Deployment | Google Cloud Run |

---

## 🔌 Google Services Used

| Service | Purpose |
|---|---|
| **Gemini API (gemini-2.5-flash)** | Core AI intelligence for the election assistant |
| **Google Cloud Run** | Production serverless deployment |
| **Web Speech API** | Browser-native voice input for accessibility |

---

## ⚙️ Environment Variables

Create a `.env.local` file:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional — for Google Maps polling locator (future)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key
```

> **Security note:** The Gemini API key is only ever accessed server-side via Next.js API Routes. It is never exposed to the browser.

---

## 🚀 Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/votexa.git
cd votexa

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local

# 4. Start development server
npm run dev
# → Open http://localhost:3000

# 5. Run tests
npm test
```

---

## ☁️ Deploying to Google Cloud Run

```bash
# Build Docker image
docker build -t gcr.io/YOUR_PROJECT_ID/votexa .

# Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/votexa

# Deploy to Cloud Run
gcloud run deploy votexa \
  --image gcr.io/YOUR_PROJECT_ID/votexa \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here
```

---

## 🧪 Testing

```bash
npm test           # Run all tests
npm run test:watch # Watch mode
```

**Test Coverage:**
- `readiness.test.ts` — 6 tests for readiness score logic (edge cases, 0%, 100%, partial)
- `api.test.ts` — 8 tests for input sanitization (XSS, injection markers, length limits) and rate limiter logic

---

## 🔒 Security

- API key is **server-side only** via Next.js API Routes
- **Input sanitization** strips HTML tags, script blocks, and LLM injection patterns (`[INST]`, etc.)
- **Rate limiting** (20 req/min per IP) prevents abuse
- Security response headers set (`X-Content-Type-Options`, `X-Frame-Options`)
- User input is hard-capped at **1000 characters** before being sent to Gemini
- Gemini temperature set to `0.15` — minimizes hallucination for factual responses

---

## 🌱 Future Scope

- **Firestore integration** — persist user progress across devices
- **Google Maps** — live polling booth locator
- **Google Translate API** — expand to more regional languages
- **Push notifications** — election deadline reminders
- **SMS gateway** — reach non-smartphone users

---

## 📄 License

MIT License — free to use, build upon, and deploy.

---

*Built to empower voters. Always verify official information with your local Election Commission.*
*India: [eci.gov.in](https://eci.gov.in) · USA: [vote.gov](https://vote.gov) · UK: [electoralcommission.org.uk](https://www.electoralcommission.org.uk)*
