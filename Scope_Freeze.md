# 🛡️ FAIRGUARD — FROZEN SCOPE & EXECUTION PLAN

> **Last updated:** April 11, 2026  
> **Rule #1:** If it's not in this document, it doesn't exist. No scope creep.

---

## 🔒 FROZEN SCOPE — What We Are Building

### The Product
**FairGuard** — An AI bias auditing platform with 3 modes, deployed as a **single Next.js serverless app on Vercel**. No separate backend. No Railway. One deploy.

### The 3 Modes (and ONLY these 3)

| Mode | What it does | Core output |
|------|-------------|-------------|
| **Audit Mode** | Upload CSV → auto-detect columns → run 5 fairness metrics → plain English report | Fairness Score (0-100) + Gemini explanation |
| **Shield Mode** | Real-time bias monitoring with live charts + alerts | Streaming fairness dashboard via SSE |
| **Stress Test** | Generate synthetic diverse candidates → run through biased model → expose discrimination | "Holy shit" bar chart revealing bias |

### What We ARE Shipping
- [x] Landing page with 3 mode entry points
- [x] Audit Mode: CSV upload → configure → results dashboard
- [x] Shield Mode: Server-Sent Events (SSE) real-time monitoring
- [x] Stress Test: AI pen testing with synthetic candidates
- [x] Gemini AI explanations (plain English)
- [x] Gemini legal compliance check
- [x] 1 demo dataset (built-in hiring data)
- [x] Vercel deployment (single command)
- [x] GitHub README with screenshots
- [x] 2-minute demo video
- [x] Project deck (10 slides)

### What We Are NOT Shipping (HARD NO)
- ❌ User authentication / accounts
- ❌ PDF certificate generation
- ❌ SHAP feature importance (too complex)
- ❌ Multi-language support
- ❌ Data persistence between sessions (unless Firebase added trivially)
- ❌ Custom model upload
- ❌ Model re-training
- ❌ Mobile app

---

## 🏗️ NEW ARCHITECTURE — Serverless on Vercel

### Before vs After

```
BEFORE (2-service):                     AFTER (1-service):
┌─────────────┐  HTTP   ┌──────────┐   ┌──────────────────────────┐
│ React/Vite  │ ──────→ │ FastAPI  │   │      Next.js App         │
│ (Vercel)    │         │ (Railway)│   │  ┌─────────┐ ┌────────┐ │
└─────────────┘         └──────────┘   │  │ Pages   │ │API     │ │
                                        │  │ (React) │ │Routes  │ │
                                        │  └─────────┘ │(Node)  │ │
                                        │              └────────┘ │
                                        │      VERCEL (free)      │
                                        └──────────────────────────┘
```

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **Next.js 15** (App Router) | SSR, API routes, Vercel-native |
| UI Components | **shadcn/ui** | Pre-built, accessible, customizable |
| Styling | **Tailwind CSS** | Required by shadcn, fast to build |
| Charts | **Recharts** | Already working from v1 |
| Animations | **Framer Motion** | Already working from v1 |
| CSV Parsing | **PapaParse** | Client-side, privacy-first |
| AI | **Google Gemini API** (`@google/generative-ai`) | Explanations, synthetic data, compliance |
| DB (optional) | **Firebase** or **Supabase** | Audit log storage (stretch goal) |
| Deploy | **Vercel** | Free, one-click, serverless |

### Project Structure

```
fairguard/
├── src/
│   ├── app/
│   │   ├── layout.js                 ← Root layout + theme + fonts
│   │   ├── page.js                   ← Landing page
│   │   ├── audit/
│   │   │   └── page.js               ← Audit Mode page
│   │   ├── shield/
│   │   │   └── page.js               ← Shield Mode page
│   │   ├── stress/
│   │   │   └── page.js               ← Stress Test page
│   │   └── api/
│   │       ├── audit/
│   │       │   ├── detect/route.js    ← Column auto-detection
│   │       │   ├── analyze/route.js   ← Full bias analysis
│   │       │   ├── explain/route.js   ← Gemini explanation
│   │       │   └── compliance/route.js ← Legal check
│   │       ├── shield/
│   │       │   └── stream/route.js    ← SSE real-time stream
│   │       └── stress/
│   │           ├── run/route.js       ← Full stress test pipeline
│   │           └── generate/route.js  ← Synthetic candidate gen
│   ├── components/
│   │   ├── ui/                        ← shadcn components (auto-generated)
│   │   ├── navbar.jsx                 ← App navigation
│   │   ├── score-gauge.jsx            ← Animated fairness score ring
│   │   ├── bias-chart.jsx             ← Bar chart for group rates
│   │   ├── alert-feed.jsx             ← Real-time alert list
│   │   ├── csv-dropzone.jsx           ← Drag-drop CSV upload
│   │   ├── column-configurator.jsx    ← Column selection UI
│   │   └── metric-card.jsx            ← Individual metric display
│   └── lib/
│       ├── bias-engine.js             ← JS port of Python bias engine
│       ├── gemini.js                  ← Gemini API wrapper
│       ├── demo-data.js               ← Built-in demo dataset generator
│       └── utils.js                   ← Helpers
├── public/
│   └── demo_hiring_data.csv
├── .env.local                         ← GEMINI_API_KEY
└── package.json
```

> [!IMPORTANT]
> ### Key Technical Decisions
> 1. **WebSocket → SSE (Server-Sent Events):** Vercel doesn't support WebSockets in serverless. Shield Mode uses SSE via `ReadableStream` in Next.js API route. Works perfectly on free tier.
> 2. **Python → JavaScript:** Bias engine rewritten in JS. The math is basic (mean, ratios, chi-square test). No NumPy/Pandas needed — just arrays and reduce.
> 3. **shadcn components we'll install:** `button`, `card`, `badge`, `tabs`, `select`, `alert`, `progress`, `dialog`, `separator`, `dropdown-menu`, `sheet`
> 4. **"use client" pages:** All 3 mode pages are client components (file upload, charts, SSE). Landing can be server component.

---

## 👥 TEAM ROLES

| Person | Role | Focus Area |
|--------|------|-----------|
| **Ashish** | Backend Lead | API routes, bias engine (JS), SSE stream, Firebase/Supabase |
| **Om** | AI Lead | Gemini integration, all prompts, synthetic data, biased model |
| **Gauri** | Frontend — Pages | Landing, Audit, Stress Test pages, page layouts |
| **Khushali** | Frontend — Components | Navbar, ScoreGauge, Charts, Shield page, design system |

---

## 📅 PHASE-BY-PHASE EXECUTION

---

### 🟢 PHASE 1: Foundation (Days 1-2)
> **Goal:** Next.js app scaffolded, shadcn installed, design system set, all pages and API routes have skeleton files. App runs locally with fake data.  
> **Test Criteria:** `npm run dev` works, all 4 pages render, API routes return JSON

---

#### Ashish — Phase 1 Tasks

| # | Task | File(s) | Details |
|---|------|---------|---------|
| P1.1 | Scaffold Next.js app | `./` | `npx create-next-app@latest ./ --js --tailwind --eslint --app --src-dir --import-alias "@/*"` |
| P1.2 | Install shadcn/ui | `components.json` | `npx shadcn@latest init` → choose New York style, dark theme |
| P1.3 | Add shadcn components | `src/components/ui/*` | `npx shadcn@latest add button card badge tabs select alert progress separator` |
| P1.4 | Install extra deps | `package.json` | `npm install recharts papaparse react-dropzone framer-motion @google/generative-ai` |
| P1.5 | Port bias engine to JS | `src/lib/bias-engine.js` | Port all 5 metrics + composite scoring + what-if from Python. Pure math — no deps needed. |
| P1.6 | Create API route skeletons | `src/app/api/*/route.js` | Each returns `{ status: "ok", message: "not implemented" }` |
| P1.7 | Wire up `/api/audit/analyze` | `src/app/api/audit/analyze/route.js` | Import bias-engine, accept POST body, return analysis results |
| P1.8 | Create `.env.local.example` | `.env.local.example` | `GEMINI_API_KEY=your_key_here` |

#### OM — Phase 1 Tasks

| # | Task | File(s) | Details |
|---|------|---------|---------|
| O1.1 | Set up Gemini client | `src/lib/gemini.js` | Use `@google/generative-ai` (official JS SDK). Initialize with `process.env.GEMINI_API_KEY`. Export `getGeminiModel()`. |
| O1.2 | Create explanation prompt | `src/lib/gemini.js` → `explainBias(metrics)` | Takes bias metrics JSON → returns `{summary, explanation, affected_groups, legal_references, urgency}` |
| O1.3 | Create compliance prompt | `src/lib/gemini.js` → `checkCompliance(metrics)` | Returns per-regulation compliance status (EEOC, EU AI Act, India DPDP) |
| O1.4 | Create recommendation prompt | `src/lib/gemini.js` → `getRecommendations(metrics)` | Returns ranked list of actionable fixes |
| O1.5 | Create synthetic gen prompt | `src/lib/gemini.js` → `generateSyntheticCandidates(type, count, axes)` | Generates matched pairs varying demographics |
| O1.6 | Create biased model (JS) | `src/lib/demo-data.js` → `runBiasedModel(candidates)` | Simple JS scoring function with hardcoded bias weights |
| O1.7 | Get Gemini API key | `.env.local` | Go to aistudio.google.com, create key, share with team |

#### GAURI — Phase 1 Tasks

| # | Task | File(s) | Details |
|---|------|---------|---------|
| G1.1 | Create root layout | `src/app/layout.js` | Import Inter font via `next/font`, set dark theme, add Navbar, wrap children |
| G1.2 | Create Landing page | `src/app/page.js` | Hero ("Know if your AI is fair."), 3 mode cards, stat bar. Use shadcn `Card`, `Button`. Link to `/audit`, `/shield`, `/stress` |
| G1.3 | Create Audit page skeleton | `src/app/audit/page.js` | `"use client"` — 4-step flow: Upload → Configure → Analyzing → Results. Placeholder divs. |
| G1.4 | Create Stress Test page skeleton | `src/app/stress/page.js` | `"use client"` — Decision type selector, demographic toggles, Run button. |
| G1.5 | Set up Tailwind theme | `tailwind.config.js`, `globals.css` | FairGuard brand colors: primary purple (#7c3aed), accent blue (#3b82f6), cyan (#06b6d4). |

#### KHUSHALI — Phase 1 Tasks

| # | Task | File(s) | Details |
|---|------|---------|---------|
| K1.1 | Build Navbar | `src/components/navbar.jsx` | Logo + tabs (Home, Audit, Shield, Stress). shadcn `Button` ghost variant. `next/link`. Sticky, glass bg. |
| K1.2 | Build ScoreGauge | `src/components/score-gauge.jsx` | Animated SVG circle (0-100). Color-coded severity. Framer Motion fill animation. |
| K1.3 | Build MetricCard | `src/components/metric-card.jsx` | shadcn `Card` with icon, title, value, severity `Badge`. |
| K1.4 | Build BiasChart | `src/components/bias-chart.jsx` | Recharts BarChart wrapper for group approval rates. Red for disadvantaged. |
| K1.5 | Build AlertFeed | `src/components/alert-feed.jsx` | List of shadcn `Alert` items with animated entry. |
| K1.6 | Create Shield page skeleton | `src/app/shield/page.js` | `"use client"` — Start/Stop, stats grid, chart placeholder, alert feed. |

#### 📋 Phase 1 Test Checklist
```
- [ ] npm run dev starts without errors
- [ ] Landing page renders at /
- [ ] /audit shows upload step
- [ ] /shield shows "Ready to Monitor"
- [ ] /stress shows config form
- [ ] GET /api/audit/analyze returns JSON
- [ ] ScoreGauge renders with hardcoded score
- [ ] Navbar links work between all pages
```

---

### 🟡 PHASE 2: Core Integration (Days 3-5)
> **Goal:** All 3 modes work end-to-end.  
> **Test Criteria:** Upload CSV → get score. Shield streams live. Stress test reveals bias.

---

#### Ashish — Phase 2 Tasks

| # | Task | File(s) | Details |
|---|------|---------|---------|
| P2.1 | Complete `/api/audit/analyze` | `route.js` | Full: parse body → run 5 metrics → compute score → return |
| P2.2 | Build `/api/audit/detect` | `route.js` | Auto-detect columns from first 100 rows |
| P2.3 | Build SSE stream | `src/app/api/shield/stream/route.js` | `export const dynamic = 'force-dynamic'`. ReadableStream with simulated decisions every 500ms. Rolling fairness metrics. SSE format. |
| P2.4 | Build `/api/stress/run` | `route.js` | Call `generateSyntheticCandidates()` → `runBiasedModel()` → run bias analysis → return |
| P2.5 | What-if simulator | `src/lib/bias-engine.js` | Remove features → re-run → return improvement |

#### OM — Phase 2 Tasks

| # | Task | File(s) | Details |
|---|------|---------|---------|
| O2.1 | Wire `/api/audit/explain` | `route.js` | Accept metrics → call `explainBias()` → return |
| O2.2 | Wire `/api/audit/compliance` | `route.js` | Accept metrics → call `checkCompliance()` → return |
| O2.3 | Wire `/api/stress/generate` | `route.js` | Accept config → call `generateSyntheticCandidates()` → return |
| O2.4 | Refine all prompts | `src/lib/gemini.js` | Test with real bias engine output. Tune for best explanations. Error handling + fallbacks. |
| O2.5 | Demo data generator | `src/lib/demo-data.js` | `generateDemoHiringData(n)` + `generateShieldStream(n)` |

#### GAURI — Phase 2 Tasks

| # | Task | File(s) | Details |
|---|------|---------|---------|
| G2.1 | Audit — Upload step | `src/app/audit/page.js` | CsvDropzone → PapaParse → `/api/audit/detect` → advance |
| G2.2 | Audit — Configure step | `src/app/audit/page.js` | Select outcome column, toggle protected attrs, "Analyze" button |
| G2.3 | Audit — Results step | `src/app/audit/page.js` | ScoreGauge, BiasCharts, proxy warnings, Gemini explanation |
| G2.4 | Stress Test integration | `src/app/stress/page.js` | Wire Run button → `/api/stress/run` → show BiasChart results |
| G2.5 | Build CsvDropzone | `src/components/csv-dropzone.jsx` | react-dropzone + shadcn styling. .csv only. |

#### KHUSHALI — Phase 2 Tasks

| # | Task | File(s) | Details |
|---|------|---------|---------|
| K2.1 | Shield Mode — SSE wiring | `src/app/shield/page.js` | `new EventSource('/api/shield/stream')` → update state → render live |
| K2.2 | Live fairness trend chart | Shield page | Recharts LineChart appending data. Threshold line at 70. |
| K2.3 | Gender rate comparison | Shield page | Dual-line chart (Male vs Female %) updating live |
| K2.4 | Shield stat cards | Shield page | 4 MetricCards updating in real-time |
| K2.5 | Explanation panel | `src/components/explanation-panel.jsx` | Reusable Gemini response panel for Audit + Stress |

#### 📋 Phase 2 Test Checklist
```
- [ ] Upload demo CSV → get fairness score
- [ ] Bar charts show per-group rates
- [ ] Gemini explanation appears
- [ ] Shield: Start → live chart updates
- [ ] Shield: alerts on threshold breach
- [ ] Stress Test: Run → bias detected
- [ ] All API routes return proper JSON
```

---

### 🟠 PHASE 3: Polish + Deploy (Days 6-8)
> **Goal:** Production-ready. Deployed. Video recorded.

| Person | Tasks |
|--------|-------|
| **Ashish** | Deploy to Vercel, add env vars, error boundaries, Firebase/Supabase (optional), optimize API routes |
| **Om** | Final prompt tuning, fallback responses, video script, record demo, help with deck |
| **Gauri** | Responsive design, loading/empty states, project deck design, polish Audit results |
| **Khushali** | Micro-animations, favicon/OG image, dark theme polish, chart styling, help record video |

---

### 🔴 PHASE 4: Finalize + Submit (Days 9-10)
> **Goal:** Ship it.

| Person | Tasks |
|--------|-------|
| **Ashish** | GitHub README, final Vercel deployment |
| **Om** | Edit video, review deck narrative |
| **Gauri** | Final UI bug sweep, fill submission form |
| **Khushali** | Screenshot gallery, cross-browser test |
| **ALL** | Final review meeting (30 min) |

---

## ⚡ SHADCN COMPONENTS TO INSTALL

```bash
npx shadcn@latest add button card badge tabs select alert progress separator dropdown-menu sheet dialog
```

**DO NOT install more unless the team agrees.**

---

## 🔑 ENVIRONMENT VARIABLES

```bash
# .env.local
GEMINI_API_KEY=your_gemini_api_key

# Optional (if Firebase/Supabase added)
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

---

## 📏 RULES FOR THE TEAM

1. **Scope is FROZEN.** No new features unless ALL 4 agree it takes < 1 hour.
2. **Work in your lanes.** Ashish = API + engine. Om = Gemini + prompts. Gauri = pages. Khushali = components.
3. **Test after every phase.** Don't start Phase 2 until Phase 1 tests pass.
4. **Commit early, commit often.** Push to `main` at end of each day minimum.
5. **If you're stuck > 30 mins, ask.** Don't waste hackathon time alone.
6. **No TypeScript migration.** Stick with JS.
7. **No additional UI libraries.** shadcn + Recharts + Framer Motion = enough.

---

## 🧠 HOW OUR APP ACTUALLY WORKS — NOTHING IS A STUB

> **Important for teammates:** Every single feature described below is REAL, WORKING code. Not mock data, not hardcoded responses, not placeholder UI. The logic runs real math, the API routes process real requests, and the AI layer talks to real Gemini models (with fallbacks when no API key).

---

### 🔍 AUDIT MODE — Full Pipeline (Not a Stub)

**What happens when a user uploads a CSV:**

```
User drops CSV → PapaParse (browser-side) → JSON array
    ↓
POST /api/audit/detect → auto-classifies columns
    ↓
User picks outcome + protected columns → clicks "Analyze"
    ↓
POST /api/audit/analyze → REAL bias engine runs ALL 5 metrics
    ↓
Results rendered: ScoreGauge + BiasCharts + Proxy Warnings
    ↓
POST /api/audit/explain → Gemini explains in plain English (async)
```

**The Bias Engine (`src/lib/bias-engine.js`) — 300+ lines of real math:**

| Metric | How It's Calculated | What It Means |
|--------|-------------------|---------------|
| **Disparate Impact Ratio** | `min(group_rate) / max(group_rate)` — the EEOC 80% rule | If the ratio is < 0.8, the system is legally discriminatory |
| **Demographic Parity Diff** | `max(group_rate) - min(group_rate)` — absolute gap | How far apart the best and worst groups are |
| **Equalized Odds** | Same as DPD but filtered to qualified candidates only | Even among equally qualified people, is there bias? |
| **Proxy Detection** | Pearson correlation (numeric) or Cramér's V chi-square test (categorical) between every feature and every protected attribute | Finds features like "zipcode" that secretly encode race |
| **Intersectional Analysis** | Cross all 2-way combinations of protected attributes, compute rates for each intersection | "Women 45+" get hired at 28% vs overall 52% |

**Composite Fairness Score (0-100):**
```
Score = (DI_score × 0.30) + (DPD_score × 0.25) + (Proxy_score × 0.25) + (Intersectional_score × 0.20)

Grade A (90+) = FAIR ✅
Grade B (70+) = MINOR ISSUES ⚠️  
Grade C (50+) = SIGNIFICANT BIAS 🔴
Grade F (<50) = CRITICAL — LEGAL RISK 🚨
```

**Column Auto-Detection — how it "just knows":**
- Scans column names against keyword dictionaries: `["hired", "approved", "rejected"]` → decision column, `["gender", "race", "age"]` → protected attribute, `["zipcode", "school"]` → proxy candidate
- Checks unique value count: ≤5 unique values + decision keyword = binary decision column
- Returns with confidence levels: HIGH (keyword match) or MEDIUM (heuristic)

---

### 🛡️ SHIELD MODE — Real SSE, Real Metrics (Not WebSocket, Not Replay)

**How the stream generates data:**
The server doesn't replay a CSV file. It GENERATES synthetic hiring decisions in real-time with embedded bias patterns:

```javascript
// Each batch: 20 decisions with realistic bias
const gender = Math.random() < 0.55 ? "Male" : "Female";
let biasFactor = 0;
if (gender === "Female") biasFactor -= 12;    // Women penalized
if (ageGroup === "45+") biasFactor -= 15;      // Older penalized
if (gender === "Female" && ageGroup === "45+") biasFactor -= 8;  // Compounding

// Bias spike at batches 75-100 (the "holy shit" moment)
if (batchIndex >= 75 && batchIndex <= 100) {
  if (gender === "Female") biasFactor -= 10;  // Extra penalty
}

const hired = (qualificationScore + biasFactor) > 55 ? 1 : 0;
```

**Why this is NOT a stub:**
- After each batch, the SAME `disparateImpactRatio()` and `demographicParityDiff()` from the bias engine run on a **rolling window of 500 decisions**
- Alerts are generated based on real threshold checks (score < 70 = WARNING, score < 50 = CRITICAL)
- The frontend renders Recharts LineCharts that append data points in real-time via `EventSource`

**Why SSE instead of WebSocket:**
Vercel's serverless functions don't support persistent WebSocket connections. SSE via `ReadableStream` is the standard solution — it works identically from the frontend's perspective but is compatible with serverless infrastructure.

---

### 🧪 STRESS TEST — Real Biased Model, Real Analysis (Not Random)

**The biased model is deliberately designed — not random, not trained:**

We don't use sklearn's LogisticRegression (that would need Python). Instead, `runBiasedModel()` is a **scoring function with hardcoded bias weights** that produce EXACTLY the kind of discrimination we want to expose:

```
Base score = qualification × 0.5 + experience × 2
Penalty:  Female = -10 points
Penalty:  Age 45+ = -12 points  
Penalty:  Female AND 45+ = -8 extra points (intersectional)
Noise:    ±8 random points (makes it look realistic)
Decision: score > 40 → Approved, else Rejected
```

**Result:** A woman aged 45+ with the SAME qualifications as a young man gets ~30 fewer points. This creates a dramatic, visually obvious gap in the bar charts — which is the entire point of the Stress Test demo.

**The pipeline runs the FULL bias engine on the results** — not just simple counting. It calculates Disparate Impact, Demographic Parity, and Intersectional Analysis for every demographic axis the user selected. Then Gemini explains it in plain English.

---

### 🤖 GEMINI AI LAYER — 5 Real Prompts with Fallbacks

Every Gemini function has TWO paths:

1. **API key present** → calls `gemini-1.5-flash` with structured JSON prompts → parses response
2. **No API key / API fails** → returns pre-written fallback responses so the app NEVER crashes

| Function | What Gemini Receives | What It Returns |
|----------|---------------------|-----------------|
| `explainBias()` | Full bias metrics JSON | `{summary, explanation, affected_groups, legal_references, urgency}` |
| `checkCompliance()` | Bias metrics | Per-regulation status: EEOC, EU AI Act, India DPDP |
| `getRecommendations()` | Bias metrics | Ranked list of fixes with expected fairness gain |
| `generateSyntheticCandidates()` | Decision type + count + axes | JSON array of matched candidate profiles |
| `runBiasedModel()` | Candidate array | Candidates with decision + confidence (NO API call — runs locally) |

**JSON extraction safety:**
```javascript
function extractJSON(text) {
  if (text.includes("```json")) {
    return JSON.parse(text.split("```json")[1].split("```")[0].trim());
  }
  return JSON.parse(text.trim());
}
```
This handles Gemini's tendency to wrap JSON in markdown code blocks.

---

### 🔒 PRIVACY MODEL — How We Protect User Data

```
1. User drops CSV file into browser
2. PapaParse processes it CLIENT-SIDE → produces JSON array
3. JSON array is sent to /api/audit/analyze (our own Next.js route)
4. Bias engine runs on Vercel serverless function → returns metrics
5. Only METRICS are sent to Gemini (never raw data)

Raw CSV → stays in browser memory
Parsed JSON → sent to our API route (same domain, same Vercel deploy)
Aggregated metrics → sent to Gemini for explanation
```

**Key point for judges:** "Your employee data never leaves your infrastructure. Only statistical summaries reach our AI layer."

---

### 📊 COMPONENT ARCHITECTURE — Why Each Component Exists

| Component | File | Why It Exists (Not a Wrapper for Nothing) |
|-----------|------|------------------------------------------|
| **ScoreGauge** | `score-gauge.jsx` | SVG circle with Framer Motion animation. Color-coded (red→orange→yellow→green→emerald). Shows score 0-100 + grade A/B/C/F. |
| **BiasChart** | `bias-chart.jsx` | Recharts BarChart that accepts `[{group, rate}]` data. Automatically highlights the disadvantaged group in red. Shows 80% threshold line. |
| **MetricCard** | `metric-card.jsx` | shadcn Card wrapper with icon, title, value, subtitle, and severity Badge. Used across ALL pages for consistency. |
| **AlertFeed** | `alert-feed.jsx` | Framer Motion `AnimatePresence` list of alerts. Color-coded borders (red/orange/yellow/blue). Auto-scrolls. Max 8 visible. |
| **CsvDropzone** | `csv-dropzone.jsx` | react-dropzone wrapper with shadcn styling. Drag-active state with purple glow. Shows file info after upload. "Remove" button to reset. |
| **Navbar** | `navbar.jsx` | Sticky top bar with glass effect (`backdrop-blur-xl`). Gradient logo. Active tab highlighting. Uses `next/link` for client-side navigation. |

---

### 🎨 DESIGN SYSTEM — Why It Looks Premium

- **Dark theme forced on** (`<html class="dark">`) — consistent everywhere
- **shadcn/ui** — every interactive element uses the same design language
- **Gradient branding** — purple→blue→cyan gradient on CTAs, text, and logo
- **Glass morphism** — navbar and card backgrounds use `backdrop-blur-xl` + 60% opacity
- **Animated background** — subtle radial gradient mesh behind content via `body::before`
- **Custom scrollbar** — thin 6px dark scrollbar matching the theme
- **Recharts theme override** — axis labels and tooltips match dark theme
- **Inter font** — loaded via `next/font` for zero CLS (Cumulative Layout Shift)

