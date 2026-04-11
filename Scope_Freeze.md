# 🛡️ FAIRGUARD v2 — FROZEN SCOPE & EXECUTION PLAN

> **Last updated:** April 11, 2026  
> **Rule #1:** If it's not in this document, it doesn't exist. No scope creep.

---

## 🔒 FROZEN SCOPE — What We Are Building

### The Product
**FairGuard** — A domain-agnostic AI bias auditing platform with 3 modes, deployed as a **single Next.js serverless app on Vercel**. No separate backend. No Railway. One deploy.

**FairGuard is NOT a "hiring bias tool."** It audits ANY CSV or JSON dataset where decisions are made about humans — hiring, lending, content moderation, algorithmic pricing, education, insurance.

### The 3 Modes (and ONLY these 3)

| Mode | What it does | Core output |
|------|-------------|-------------|
| **Audit Mode** | Upload CSV/JSON → auto-detect columns + domain → run 5 fairness metrics → plain English report → Bias Fingerprint radar → Fairness Debt Score | Fairness Score (0-100) + Fingerprint + Legal Exposure |
| **Shield Mode** | Real-time bias monitoring with live charts + alerts | Streaming fairness dashboard via SSE |
| **Stress Test** | Generate synthetic diverse candidates → run through biased model → expose discrimination | "Holy shit" bar chart revealing bias |

### What We ARE Shipping
- [x] Landing page with 3 mode entry points
- [x] Audit Mode: CSV/JSON upload → configure → results dashboard
- [x] Shield Mode: Server-Sent Events (SSE) real-time monitoring
- [x] Stress Test: AI pen testing with synthetic candidates
- [x] Gemini AI explanations (plain English)
- [x] Gemini legal compliance check
- [x] **JSON file support** (alongside CSV)
- [x] **Domain auto-detection** (hiring, content moderation, pricing, lending, etc.)
- [x] **Bias Fingerprint** (6-axis radar chart — the visual identity)
- [x] **Fairness Debt Score** (legal exposure in ₹/€/$ — the business angle)
- [x] **3 demo datasets** — hiring, content moderation, pricing
- [x] **Firebase Firestore** — audit history persistence
- [x] `/history` page — audit log with trend tracking
- [x] Vercel deployment (single command)
- [x] GitHub README with screenshots
- [x] 2-minute demo video
- [x] Project deck (10 slides)

### What We Are NOT Shipping (HARD NO)
- ❌ User authentication / accounts
- ❌ PDF certificate generation
- ❌ SHAP feature importance (too complex)
- ❌ Multi-language support
- ❌ Custom model upload
- ❌ Model re-training
- ❌ Mobile app
- ❌ LLM Bias Probe (Tier 2 stretch — only if ALL Tier 1 done)

---

## 🏗️ ARCHITECTURE — Serverless on Vercel + Firebase

```
┌──────────────────────────────────────────────────────────────────────┐
│                    FAIRGUARD v2 — COMPLETE MAP                        │
│                      Deploy: Vercel (free tier)                       │
│                                                                        │
│  PAGES (React, "use client")         API ROUTES (Node.js serverless)  │
│  /           Landing (Server)        POST /api/audit/detect           │
│  /audit      CSV/JSON Upload         POST /api/audit/analyze          │
│  /shield     SSE Dashboard           POST /api/audit/explain          │
│  /stress     Pen Test                POST /api/audit/compliance       │
│  /history    Audit History [NEW]     GET  /api/shield/stream          │
│                                      POST /api/stress/run             │
│                                      POST /api/history/save   [NEW]   │
│                                      GET  /api/history/list   [NEW]   │
│                                                                        │
│  LIB (Pure JS, zero deps)           EXTERNAL SERVICES                 │
│  bias-engine.js  — 5 metrics +      @google/generative-ai (Gemini)   │
│    composite scoring + fingerprint   Firebase Firestore (audit log)    │
│    + fairness debt + domain detect                                     │
│  gemini.js — AI layer + fallbacks                                      │
│  firebase.js — Firestore client [NEW]                                 │
│  utils.js — helpers                                                    │
│                                                                        │
│  PRIVACY: CSV/JSON parsed in browser → only JSON sent to API          │
│           Raw data NEVER leaves the user's machine                    │
│           Only aggregate metrics stored in Firebase                    │
└──────────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **Next.js 15** (App Router) | SSR, API routes, Vercel-native |
| UI Components | **shadcn/ui** | Pre-built, accessible, customizable |
| Styling | **Tailwind CSS v4** | Required by shadcn, fast to build |
| Charts | **Recharts** (inc. RadarChart) | Already working + has Radar for fingerprint |
| Animations | **Framer Motion** | Already working from v1 |
| File Parsing | **PapaParse** (CSV) + native `JSON.parse` (JSON) | Client-side, privacy-first |
| AI | **Google Gemini API** (`@google/generative-ai`) | Explanations, synthetic data, compliance |
| Database | **Firebase Firestore** | Audit log storage, trend tracking |
| Deploy | **Vercel** | Free, one-click, serverless |

### Project Structure

```
fairguard/
├── src/
│   ├── app/
│   │   ├── layout.js                 ← Root layout + theme + fonts
│   │   ├── page.js                   ← Landing page
│   │   ├── audit/
│   │   │   └── page.js               ← Audit Mode page (CSV + JSON)
│   │   ├── shield/
│   │   │   └── page.js               ← Shield Mode page
│   │   ├── stress/
│   │   │   └── page.js               ← Stress Test page
│   │   ├── history/
│   │   │   └── page.js               ← Audit History page [NEW]
│   │   └── api/
│   │       ├── audit/
│   │       │   ├── detect/route.js    ← Column + domain auto-detection
│   │       │   ├── analyze/route.js   ← Full bias analysis
│   │       │   ├── explain/route.js   ← Gemini explanation
│   │       │   └── compliance/route.js ← Legal check
│   │       ├── shield/
│   │       │   └── stream/route.js    ← SSE real-time stream
│   │       ├── stress/
│   │       │   └── run/route.js       ← Full stress test pipeline
│   │       └── history/
│   │           ├── save/route.js      ← Save audit to Firestore [NEW]
│   │           └── list/route.js      ← List past audits [NEW]
│   ├── components/
│   │   ├── ui/                        ← shadcn components (auto-generated)
│   │   ├── navbar.jsx                 ← App navigation (+ History link)
│   │   ├── score-gauge.jsx            ← Animated fairness score ring
│   │   ├── bias-chart.jsx             ← Bar chart for group rates
│   │   ├── bias-fingerprint.jsx       ← RadarChart (6-axis) [NEW]
│   │   ├── fairness-debt-card.jsx     ← Legal exposure calculator [NEW]
│   │   ├── alert-feed.jsx             ← Real-time alert list
│   │   ├── file-dropzone.jsx          ← Drag-drop CSV/JSON upload [RENAMED]
│   │   ├── column-configurator.jsx    ← Column selection UI
│   │   └── metric-card.jsx            ← Individual metric display
│   └── lib/
│       ├── bias-engine.js             ← JS bias engine (5 metrics + fingerprint + debt + domain)
│       ├── gemini.js                  ← Gemini API wrapper
│       ├── firebase.js                ← Firebase Firestore client [NEW]
│       └── utils.js                   ← Helpers
├── public/
│   ├── demo_hiring_data.csv
│   ├── demo_hiring_data.json          ← [NEW]
│   ├── demo_content_moderation.csv    ← [NEW]
│   └── demo_pricing_data.csv          ← [NEW]
├── .env.local                         ← GEMINI_API_KEY + FIREBASE_*
└── package.json
```

> [!IMPORTANT]
> ### Key Technical Decisions
> 1. **CSV + JSON support:** PapaParse for CSV, native `JSON.parse` for JSON. Both produce the same array-of-objects format for the bias engine.
> 2. **Domain auto-detection:** Column name pattern matching detects the domain (hiring, lending, moderation, pricing, education, insurance, healthcare). Report language adapts accordingly.
> 3. **Bias Fingerprint:** 6-axis `Recharts.RadarChart` — Representation, Demographic Parity, Equalized Odds, Proxy Freedom, Intersectional Parity, Individual Fairness. The visual identity of the deck.
> 4. **Fairness Debt Score:** Converts bias severity → legal exposure in real currency (₹/€/$) using regulation-specific fine scales. The B2B angle.
> 5. **Firebase:** Store only aggregated metrics (score, grade, flagsList, domain). NEVER store raw data. Free tier sufficient.
> 6. **WebSocket → SSE:** Vercel doesn't support WebSockets in serverless. Shield Mode uses SSE via `ReadableStream`.

---

## 👥 TEAM ROLES

| Person | Role | Focus Area |
|--------|------|-----------| 
| **Ashish** | Backend Lead + Architect | API routes, bias engine (JS), SSE stream, Fingerprint/Debt logic, Firebase integration, domain auto-detect, JSON support, Vercel deploy |
| **Om** | AI Lead | Gemini integration, all prompts, synthetic data, biased model, demo datasets (content moderation + pricing CSVs), video script |
| **Gauri** | Frontend — Pages | Landing, Audit, Stress Test, History pages, page layouts, responsive design, deck design |
| **Khushali** | Frontend — Components | Navbar, ScoreGauge, BiasFingerprint radar, FairnessDebtCard, Charts, Shield page, design system, video recording |

---

## 📅 PHASE-BY-PHASE EXECUTION

---

### 🟢 PHASE 1: Foundation (Days 1-2)
> **Goal:** Next.js app scaffolded, shadcn installed, design system set, all pages and API routes have skeleton files. App runs locally with working logic.  
> **Test Criteria:** `npm run dev` works, all 5 pages render, API routes return real JSON

---

#### Ashish — Phase 1 Tasks

| # | Task | File(s) | Details |
|---|------|---------|---------| 
| P1.1 | ~~Scaffold Next.js app~~ | ~~`./`~~ | ✅ DONE |
| P1.2 | ~~Install shadcn/ui~~ | ~~`components.json`~~ | ✅ DONE |
| P1.3 | ~~Add shadcn components~~ | ~~`src/components/ui/*`~~ | ✅ DONE |
| P1.4 | ~~Install extra deps~~ | ~~`package.json`~~ | ✅ DONE |
| P1.5 | ~~Port bias engine to JS~~ | ~~`src/lib/bias-engine.js`~~ | ✅ DONE (430 lines, 5 metrics + composite) |
| P1.6 | ~~Create API route skeletons~~ | ~~`src/app/api/*/route.js`~~ | ✅ DONE (all working) |
| P1.7 | ~~Wire up `/api/audit/analyze`~~ | ~~`route.js`~~ | ✅ DONE |
| P1.8 | Add domain auto-detection | `src/lib/bias-engine.js` | Detect domain from column names: hired→hiring, flagged→moderation, approved→lending, price→pricing |
| P1.9 | Add Bias Fingerprint computation | `src/lib/bias-engine.js` | `computeBiasFingerprint()` — 6-axis scores for RadarChart |
| P1.10 | Add Fairness Debt computation | `src/lib/bias-engine.js` | `computeFairnessDebt()` — legal exposure calculator |
| P1.11 | Add JSON support to detect route | `src/app/api/audit/detect/route.js` | Accept JSON array same as CSV-parsed data |
| P1.12 | Install Firebase SDK | `package.json` | `npm install firebase` |
| P1.13 | Create Firebase client | `src/lib/firebase.js` | Firestore client with `saveAudit()` and `listAudits()` |
| P1.14 | Create history API routes | `src/app/api/history/*/route.js` | `POST /api/history/save` + `GET /api/history/list` |

#### Om — Phase 1 Tasks

| # | Task | File(s) | Details |
|---|------|---------|---------|
| O1.1 | ~~Set up Gemini client~~ | ~~`src/lib/gemini.js`~~ | ✅ DONE |
| O1.2 | ~~Create explanation prompt~~ | ~~`src/lib/gemini.js`~~ | ✅ DONE |
| O1.3 | ~~Create compliance prompt~~ | ~~`src/lib/gemini.js`~~ | ✅ DONE |
| O1.4 | ~~Create recommendation prompt~~ | ~~`src/lib/gemini.js`~~ | ✅ DONE |
| O1.5 | ~~Create synthetic gen prompt~~ | ~~`src/lib/gemini.js`~~ | ✅ DONE |
| O1.6 | ~~Create biased model (JS)~~ | ~~`src/lib/gemini.js`~~ | ✅ DONE |
| O1.7 | Create content moderation demo CSV | `public/demo_content_moderation.csv` | 300+ rows, columns: post_id, user_group, content_type, language_variant, flagged, action_taken, reviewer_type |
| O1.8 | Create pricing demo CSV | `public/demo_pricing_data.csv` | 300+ rows, columns: product_id, customer_zip, device_type, membership_tier, age_group, gender, price_offered, approved |
| O1.9 | Create hiring JSON demo | `public/demo_hiring_data.json` | JSON version of existing hiring CSV |

#### Gauri — Phase 1 Tasks

| # | Task | File(s) | Details |
|---|------|---------|---------| 
| G1.1 | ~~Create root layout~~ | ~~`src/app/layout.js`~~ | ✅ DONE |
| G1.2 | ~~Create Landing page~~ | ~~`src/app/page.js`~~ | ✅ DONE |
| G1.3 | ~~Create Audit page~~ | ~~`src/app/audit/page.js`~~ | ✅ DONE (fully wired) |
| G1.4 | ~~Create Stress Test page~~ | ~~`src/app/stress/page.js`~~ | ✅ DONE |
| G1.5 | Create History page skeleton | `src/app/history/page.js` | `"use client"` — List of past audits, fairness score trends, domain badges |

#### Khushali — Phase 1 Tasks

| # | Task | File(s) | Details |
|---|------|---------|---------|
| K1.1 | ~~Build Navbar~~ | ~~`src/components/navbar.jsx`~~ | ✅ DONE |
| K1.2 | ~~Build ScoreGauge~~ | ~~`src/components/score-gauge.jsx`~~ | ✅ DONE |
| K1.3 | ~~Build MetricCard~~ | ~~`src/components/metric-card.jsx`~~ | ✅ DONE |
| K1.4 | ~~Build BiasChart~~ | ~~`src/components/bias-chart.jsx`~~ | ✅ DONE |
| K1.5 | ~~Build AlertFeed~~ | ~~`src/components/alert-feed.jsx`~~ | ✅ DONE |
| K1.6 | ~~Create Shield page~~ | ~~`src/app/shield/page.js`~~ | ✅ DONE |
| K1.7 | Build BiasFingerprint | `src/components/bias-fingerprint.jsx` | Recharts RadarChart, 6 axes, color-coded, animated |
| K1.8 | Build FairnessDebtCard | `src/components/fairness-debt-card.jsx` | Legal exposure display: per-regulation fines + total |

#### 📋 Phase 1 Test Checklist
```
- [x] npm run dev starts without errors
- [x] Landing page renders at /
- [x] /audit shows upload step
- [x] /shield shows "Ready to Monitor"
- [x] /stress shows config form
- [x] GET /api/audit/analyze returns JSON
- [x] ScoreGauge renders with hardcoded score
- [x] Navbar links work between all pages
- [ ] /history page renders
- [ ] JSON upload works alongside CSV
- [ ] Domain auto-detection returns domain tag
- [ ] Bias Fingerprint data computes correctly
- [ ] Fairness Debt data computes correctly
- [ ] Firebase save/list routes work
```

---

### 🟡 PHASE 2: Core Integration (Days 3-5)
> **Goal:** All 3 modes work end-to-end. New features (Fingerprint, Debt, History) wired.  
> **Test Criteria:** Upload CSV/JSON → get score + fingerprint + debt. Shield streams. Stress test reveals bias. History persists.

---

#### Ashish — Phase 2 Tasks

| # | Task | File(s) | Details |
|---|------|---------|---------| 
| P2.1 | ~~Complete `/api/audit/analyze`~~ | ~~`route.js`~~ | ✅ DONE |
| P2.2 | ~~Build `/api/audit/detect`~~ | ~~`route.js`~~ | ✅ DONE |
| P2.3 | ~~Build SSE stream~~ | ~~`route.js`~~ | ✅ DONE |
| P2.4 | ~~Build `/api/stress/run`~~ | ~~`route.js`~~ | ✅ DONE |
| P2.5 | Wire fingerprint + debt into analyze response | `route.js` | Return fingerprint + debt alongside existing results |
| P2.6 | Wire domain detection into detect response | `route.js` | Return `{ detected, domain }` |
| P2.7 | Auto-save audits to Firebase | After analyze completes | Fire-and-forget save to Firestore |
| P2.8 | Wire history page to Firebase | `/api/history/list` | Return last 20 audits sorted by timestamp |

#### Om — Phase 2 Tasks

| # | Task | File(s) | Details |
|---|------|---------|---------| 
| O2.1 | ~~Wire `/api/audit/explain`~~ | ~~`route.js`~~ | ✅ DONE |
| O2.2 | ~~Wire `/api/audit/compliance`~~ | ~~`route.js`~~ | ✅ DONE |
| O2.3 | ~~Wire `/api/stress/generate`~~ | ~~`route.js`~~ | ✅ DONE |
| O2.4 | Refine all prompts | `src/lib/gemini.js` | Test with real bias engine output. Tune for best explanations. |
| O2.5 | ~~Demo data generator~~ | ~~`src/lib/gemini.js`~~ | ✅ DONE |

#### Gauri — Phase 2 Tasks

| # | Task | File(s) | Details |
|---|------|---------|---------| 
| G2.1 | ~~Audit — Upload step~~ | ~~`audit/page.js`~~ | ✅ DONE |
| G2.2 | ~~Audit — Configure step~~ | ~~`audit/page.js`~~ | ✅ DONE |
| G2.3 | ~~Audit — Results step~~ | ~~`audit/page.js`~~ | ✅ DONE |
| G2.4 | ~~Stress Test integration~~ | ~~`stress/page.js`~~ | ✅ DONE |
| G2.5 | Add Bias Fingerprint to Audit results | `audit/page.js` | Render `<BiasFingerprint>` in results section |
| G2.6 | Add Fairness Debt to Audit results | `audit/page.js` | Render `<FairnessDebtCard>` in results section |
| G2.7 | Add domain badge to Audit results | `audit/page.js` | Show detected domain (e.g., "Hiring", "Content Moderation") |
| G2.8 | Wire History page | `history/page.js` | Fetch from `/api/history/list`, display cards with scores + domains |

#### Khushali — Phase 2 Tasks

| # | Task | File(s) | Details |
|---|------|---------|---------| 
| K2.1 | ~~Shield Mode — SSE wiring~~ | ~~`shield/page.js`~~ | ✅ DONE |
| K2.2 | ~~Live fairness trend chart~~ | ~~Shield page~~ | ✅ DONE |
| K2.3 | ~~Gender rate comparison~~ | ~~Shield page~~ | ✅ DONE |
| K2.4 | ~~Shield stat cards~~ | ~~Shield page~~ | ✅ DONE |
| K2.5 | Update FileDropzone for JSON | `file-dropzone.jsx` | Accept .csv and .json |
| K2.6 | Add History link to Navbar | `navbar.jsx` | New tab: 📜 History → /history |

#### 📋 Phase 2 Test Checklist
```
- [x] Upload demo CSV → get fairness score
- [x] Bar charts show per-group rates
- [x] Gemini explanation appears
- [x] Shield: Start → live chart updates
- [x] Shield: alerts on threshold breach
- [x] Stress Test: Run → bias detected
- [x] All API routes return proper JSON
- [ ] Upload JSON → same results as CSV
- [ ] Bias Fingerprint radar renders
- [ ] Fairness Debt shows ₹/€/$ exposure
- [ ] Domain badge appears (hiring/moderation/pricing)
- [ ] History page shows past audits
- [ ] Content moderation demo works end-to-end
- [ ] Pricing demo works end-to-end
```

---

### 🟠 PHASE 3: Polish + Deploy (Days 6-8)
> **Goal:** Production-ready. Deployed. Video recorded.

| Person | Tasks |
|--------|-------|
| **Ashish** | Deploy to Vercel, add env vars, error boundaries, final API route optimization |
| **Om** | Final prompt tuning, fallback responses, video script, record demo, help with deck |
| **Gauri** | Responsive design, loading/empty states, project deck design, polish Audit results |
| **Khushali** | Micro-animations, favicon/OG image, chart styling, help record video |

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

## ⚡ DEPENDENCIES TO INSTALL

```bash
# Already installed:
# recharts, papaparse, react-dropzone, framer-motion, @google/generative-ai, lucide-react, shadcn/ui

# New:
npm install firebase
```

---

## 🔑 ENVIRONMENT VARIABLES

```bash
# .env.local
GEMINI_API_KEY=your_gemini_api_key

# Firebase (for audit history)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

---

## 📏 RULES FOR THE TEAM

1. **Scope is FROZEN.** No new features unless ALL 4 agree it takes < 1 hour.
2. **Work in your lanes.** Ashish = API + engine. Om = Gemini + prompts + data. Gauri = pages. Khushali = components.
3. **Test after every phase.** Don't start Phase 2 until Phase 1 tests pass.
4. **Commit early, commit often.** Push to `main` at end of each day minimum.
5. **If you're stuck > 30 mins, ask.** Don't waste hackathon time alone.
6. **No TypeScript migration.** Stick with JS.
7. **No additional UI libraries.** shadcn + Recharts + Framer Motion = enough.
8. **ALL logic must be WORKING — no stubs, no mocks, no placeholders.**

---

## 🧠 HOW OUR APP ACTUALLY WORKS — NOTHING IS A STUB

> **Important for teammates:** Every single feature described below is REAL, WORKING code. Not mock data, not hardcoded responses, not placeholder UI. The logic runs real math, the API routes process real requests, and the AI layer talks to real Gemini models (with fallbacks when no API key).

---

### 🔍 AUDIT MODE — Full Pipeline (Not a Stub)

**What happens when a user uploads a CSV or JSON:**

```
User drops CSV/JSON → PapaParse (CSV) or JSON.parse (JSON) → JSON array
    ↓
POST /api/audit/detect → auto-classifies columns + detects domain
    ↓
User picks outcome + protected columns → clicks "Analyze"
    ↓
POST /api/audit/analyze → REAL bias engine runs ALL 5 metrics
    + computes BiasFingerprint (6-axis)
    + computes FairnessDebt (legal exposure)
    ↓
Results rendered: ScoreGauge + BiasFingerprint Radar + BiasCharts + FairnessDebtCard + Proxy Warnings
    ↓
POST /api/audit/explain → Gemini explains in plain English (async)
POST /api/history/save → Firebase persists audit summary (async)
```

**The Bias Engine (`src/lib/bias-engine.js`) — 500+ lines of real math:**

| Metric | How It's Calculated | What It Means |
|--------|-------------------|---------------|
| **Disparate Impact Ratio** | `min(group_rate) / max(group_rate)` — the EEOC 80% rule | If the ratio is < 0.8, the system is legally discriminatory |
| **Demographic Parity Diff** | `max(group_rate) - min(group_rate)` — absolute gap | How far apart the best and worst groups are |
| **Equalized Odds** | Same as DPD but filtered to qualified candidates only | Even among equally qualified people, is there bias? |
| **Proxy Detection** | Pearson correlation (numeric) or Cramér's V chi-square test (categorical) | Finds features like "zipcode" that secretly encode race |
| **Intersectional Analysis** | Cross all 2-way combinations of protected attributes | "Women 45+" get hired at 28% vs overall 52% |
| **Bias Fingerprint** [NEW] | 6-axis normalized scores: Representation, Demographic Parity, Equalized Odds, Proxy Freedom, Intersectional Parity, Counterfactual Fairness | Visual "shape" unique to each biased system |
| **Fairness Debt** [NEW] | Bias severity × regulation fine scales × affected population estimate | "Your system has ₹2.5 Cr legal exposure affecting ~2,300 people" |

**Domain Auto-Detection — how it knows the context:**
- Scans column names against domain keyword dictionaries
- `["hired", "interview", "resume"]` → **Hiring**
- `["flagged", "moderation", "content", "post"]` → **Content Moderation**
- `["price", "pricing", "cost", "discount"]` → **Pricing**
- `["approved", "loan", "credit", "mortgage"]` → **Lending**
- `["grade", "score", "student", "gpa"]` → **Education**
- `["claim", "premium", "policy", "coverage"]` → **Insurance**
- Report language and compliance checks adapt to detected domain

---

### 🛡️ SHIELD MODE — Real SSE, Real Metrics (Not WebSocket, Not Replay)

Unchanged from v1 — see original doc. Full working SSE with rolling window bias analysis and spike detection at batches 75-100.

---

### 🧪 STRESS TEST — Real Biased Model, Real Analysis (Not Random)

Unchanged from v1 — see original doc. Full working synthetic candidate generation + biased scoring function + real bias engine analysis.

---

### 🤖 GEMINI AI LAYER — 5 Real Prompts with Fallbacks

Unchanged from v1. Every function has API path + fallback path.

---

### 🔒 PRIVACY MODEL — How We Protect User Data

```
1. User drops CSV/JSON file into browser
2. PapaParse/JSON.parse processes it CLIENT-SIDE → produces JSON array
3. JSON array is sent to /api/audit/analyze (our own Next.js route)
4. Bias engine runs on Vercel serverless function → returns metrics
5. Only METRICS are sent to Gemini (never raw data)
6. Only AGGREGATE SUMMARY saved to Firebase (score, grade, domain, flags)

Raw CSV/JSON → stays in browser memory
Parsed JSON → sent to our API route (same domain, same Vercel deploy)
Aggregated metrics → sent to Gemini for explanation
Summary only → saved to Firebase for history
```

---

### 🗄️ FIREBASE — What We Store (Privacy-First)

```javascript
// Firestore document structure — no raw data ever
{
  audit_id: "auto-generated",
  timestamp: serverTimestamp(),
  domain: "hiring",                    // auto-detected
  fairness_score: 43,                  // 0-100
  grade: "F",                          // A/B/C/F
  label: "CRITICAL — LEGAL RISK 🚨",
  dataset_rows: 500,
  dataset_columns: 12,
  protected_attributes: ["gender", "age_group"],
  flags: ["gender_bias", "proxy_detection", "intersectional_gap"],
  fingerprint: { representation: 72, demographic_parity: 45, ... },
  debt_total_inr: 25000000,            // ₹2.5 Cr
  organization_tag: "AcmeCorp"         // optional, user-provided
}
```

---

### 📊 COMPONENT ARCHITECTURE

| Component | File | Purpose |
|-----------|------|---------|
| **ScoreGauge** | `score-gauge.jsx` | SVG circle with Framer Motion animation. Color-coded. Score 0-100 + grade. |
| **BiasFingerprint** [NEW] | `bias-fingerprint.jsx` | Recharts RadarChart with 6 axes. The visual identity screenshot. |
| **FairnessDebtCard** [NEW] | `fairness-debt-card.jsx` | Legal exposure calculator: per-regulation fines + total + affected people count. |
| **BiasChart** | `bias-chart.jsx` | Recharts BarChart for group approval rates. Red for disadvantaged. 80% threshold line. |
| **MetricCard** | `metric-card.jsx` | shadcn Card with icon, title, value, subtitle, severity Badge. |
| **AlertFeed** | `alert-feed.jsx` | Framer Motion animated alert list. Color-coded. Auto-scrolls. |
| **FileDropzone** [UPDATED] | `file-dropzone.jsx` | react-dropzone for CSV + JSON. Drag-active state. Shows file info. |
| **Navbar** [UPDATED] | `navbar.jsx` | Sticky top bar. Now includes History link. |

---

## 🎯 DEMO DATASETS — 3 Domains

### 1. Hiring (existing + JSON version)
- `demo_hiring_data.csv` — 200 rows, gender/age bias
- `demo_hiring_data.json` — Same data as JSON array

### 2. Content Moderation [NEW]
- `demo_content_moderation.csv` — 300+ rows
- Columns: `post_id, user_demographic, content_type, language_variant, flagged, action_taken`
- Bias: minority users' posts flagged at 2.3× the rate of majority users

### 3. Algorithmic Pricing [NEW]
- `demo_pricing_data.csv` — 300+ rows
- Columns: `customer_id, zip_type, device_type, age_group, gender, price_tier, approved`
- Bias: rural + mobile users get higher prices; ZIP code proxies race

---

## 🎬 DEMO SCRIPT — The 2-Minute Playbook

1. **(0:00–0:30)** Audit Mode — drop the **content moderation CSV** → watch domain auto-detect → show Bias Fingerprint radar → "this platform silences minority voices 2.3× more"
2. **(0:30–1:00)** Stress Test — run a **pricing bias** scenario → bar chart shows 40% price gap by location proxy
3. **(1:00–1:30)** Shield Mode — start monitoring → watch live fairness score drop → alerts fire at bias spike → "caught it in real-time"
4. **(1:30–2:00)** Fairness Debt Score → show ₹2.5 Cr legal exposure → "This isn't a technical problem, it's a business risk" → logo
