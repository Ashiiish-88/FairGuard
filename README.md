# 🛡️ FairGuard
**The Bias Firewall for AI Systems**

> Know if your AI is fair. Fix it before it hurts someone.

FairGuard is a comprehensive AI bias auditing platform designed to detect, monitor, and expose discrimination in AI decision-making pipelines (like hiring, lending, or admissions). With a privacy-first approach and plain-English AI explanations powered by Gemini, FairGuard bridges the gap between complex statistical fairness metrics and actionable business insights.

## ✨ Key Features

Our platform operates in **3 distinct modes**, providing full coverage from historical data analysis to live monitoring and proactive penetration testing:

- **🔍 Audit Mode (Static Data Scanning)**
  - Upload any CSV dataset (e.g., hiring decisions).
  - FairGuard **auto-detects** decision columns, protected attributes (like gender/age), and potential proxy features (like zipcode matching race).
  - Runs 5 statistical fairness metrics (Disparate Impact, Demographic Parity, Equalized Odds, Proxy Detection, Intersectional Analysis).
  - Uses the **Gemini AI API** to explain complex bias results in plain English and flag legal compliance risks (e.g., EEOC 80% Rule, India DPDP Act).

- **🛡️ Shield Mode (Real-time Monitoring)**
  - Connects to an active AI pipeline (simulated via Server-Sent Events / SSE) to monitor decisions live.
  - Maintains a running fairness score and visualizes gender gap trends over time.
  - Instantly alerts administrators when unfairness thresholds are breached.

- **🧪 Stress Test Mode (AI Bias Pen-Testing)**
  - Point FairGuard at an AI decision endpoint.
  - Gemini generates **hundreds of synthetic candidate profiles** with identical qualifications but varying demographics.
  - Automatically submits these candidates, analyzes the outcomes, and exposes precisely where the model's biases hide (e.g., older women being systematically rejected despite perfect qualifications).

---

## 🛠️ Tech Stack

FairGuard is built entirely on a modern, serverless Next.js architecture, guaranteeing blazing-fast performance and effortless deployment.

**Framework:** Next.js 15 (App Router)
**Styling & UI:** Tailwind CSS v4, shadcn/ui, Framer Motion
**Data Visualization:** Recharts
**Data Processing (Privacy-first):** PapaParse (client-side CSV parsing)
**AI Engine:** Google Gemini (`@google/generative-ai`)
**Stats/Math Engine:** Pure JavaScript (Zero dependencies needed for complex bias calculations)
**Deployment:** Vercel (Serverless)

---

## 🚀 Getting Started (Bootstrapping)

To run FairGuard locally, simply follow these steps.

### 1. Clone the Repository
```bash
git clone <your-repo-link>
cd fairguard
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup
You'll need a Google Gemini API Key to run the AI explanation features.
1. Go to [Google AI Studio](https://aistudio.google.com/) and grab a free API key.
2. Form the root of the `fairguard` project directory, create a `.env.local` file:
```bash
touch .env.local
```
3. Add your key to the file:
```env
GEMINI_API_KEY="your_actual_key_here"
```
*(Note: If you don't enter an API key, the application will not crash. We've built in graceful fallbacks that supply pre-written demographic explanations so your demo keeps running seamlessly!)*

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app is fully responsive and supports an integrated dark mode.

---

## 📂 Project Structure

A high-level view of our Next.js App Router codebase:

```text
fairguard/
├── .env.local                              # Your local environment variables (API keys)
├── public/
│   └── demo_hiring_data.csv                # Sample dataset provided for quick 1-click demos
├── src/
│   ├── app/                                # NEXT.JS APP ROUTER DIRECTORY
│   │   ├── layout.js                       # Root layout (Dark theme + Fonts + Navbar)
│   │   ├── page.js                         # Hero / Landing Page
│   │   ├── globals.css                     # Tailwind / shadcn styling and brand gradients
│   │   ├── audit/page.js                   # 🔍 Audit Mode Page
│   │   ├── shield/page.js                  # 🛡️ Shield Mode Page
│   │   ├── stress/page.js                  # 🧪 Stress Test Mode Page
│   │   └── api/                            # SERVERLESS API ROUTES
│   │       ├── audit/
│   │       │   ├── detect/route.js         # Auto-detects column types from CSV
│   │       │   ├── analyze/route.js        # Runs 5 bias metrics & composite scoring
│   │       │   ├── explain/route.js        # Communicates with Gemini for plain-English explanations
│   │       │   └── compliance/route.js     # Uses Gemini to map bias to legal frameworks
│   │       ├── shield/
│   │       │   └── stream/route.js         # Vercel-compatible SSE stream for real-time monitoring
│   │       └── stress/
│   │           └── run/route.js            # Stress test AI pipeline execution
│   ├── components/                         # REACT COMPONENTS
│   │   ├── ui/                             # shadcn/ui components (Buttons, Cards, Badges, etc.)
│   │   ├── navbar.jsx                      # Main sticky glassmorphism navigation
│   │   ├── score-gauge.jsx                 # Animated SVG circle graph for scoring
│   │   ├── bias-chart.jsx                  # Recharts wrapper for group rate bar charts
│   │   ├── alert-feed.jsx                  # Animated alert notifications panel
│   │   ├── csv-dropzone.jsx                # Drag & drop CSV module
│   │   └── metric-card.jsx                 # Displays individual statistics cleanly
│   └── lib/                                # CORE LOGIC & ENGINES
│       ├── bias-engine.js                  # 🧠 The brain: Pure JS implementation of bias formulas
│       ├── gemini.js                       # 🤖 AI wrapper: Prompts, synthetic generation, and fallbacks
│       └── utils.js                        # Tailwind merge utilities for shadcn
└── tailwind.config.mjs                     # Tailwind theme and brand color configuration
```

---


> **Our Privacy Promise:** FairGuard processes your sensitive CSV data entirely within your browser (thanks to PapaParse). We only send generic, aggregated statistical summaries to our internal API and Gemini. Your raw data *never* leaves your machine.
