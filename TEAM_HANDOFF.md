# 🛡️ FAIRGUARD — TEAM HANDOFF GUIDE
> **For:** Om, Gauri, Khushali  
> **From:** Ashish  
> **Date:** April 11, 2026  
> **Status:** Backend + Engine + API = DONE ✅ | Your work starts NOW

---

## 📖 PART 1: WHAT IS FAIRGUARD? (Read This First, Skip Nothing)

### The Problem (In Simple Words)
Companies everywhere are using AI to make decisions about **real people** — who gets hired, who gets a loan, whose social media post gets removed, how much an item costs for YOU vs someone else.

The problem? These AI systems often **learn from biased historical data** and end up discriminating against certain groups — women, minorities, older people, rural communities — without anyone knowing.

**Example:** A hiring AI was trained on 20 years of data where men were mostly hired for senior roles. Now it automatically gives women lower scores — not because they're less qualified, but because the old data was biased.

### What FairGuard Does
FairGuard is a **bias detection and audit platform** that lets anyone upload their dataset or connect their AI system and instantly find out:
1. **Is there bias?** (Yes/No + severity score)
2. **Who is affected?** (Which groups are disadvantaged)
3. **How bad is it legally?** (Actual fine amounts in ₹/€/$)
4. **What does it look like visually?** (Radar chart "fingerprint" of bias)
5. **What should be fixed?** (AI-powered plain English explanation)

### Why FairGuard is Different From Other Hackathon Submissions
Most teams will build: "Upload CSV → see fairness score → hiring only"

**FairGuard is different because:**
- ✅ **Domain-agnostic** — works for hiring, content moderation, pricing, lending, insurance, healthcare (not just hiring)
- ✅ **3 modes** — Audit (upload data), Shield (real-time monitoring), Stress Test (AI penetration testing)
- ✅ **Bias Fingerprint** — a 6-axis radar chart that gives every biased system a unique visual "shape"
- ✅ **Fairness Debt** — translates bias into real legal fines (₹2.5 Cr, €8M) that executives understand
- ✅ **Domain auto-detection** — it figures out what kind of data you uploaded from column names
- ✅ **3 demo datasets** — hiring bias, content moderation bias, algorithmic pricing bias
- ✅ **Audit History** — saves past audits so you can track improvements over time

---

## 📚 PART 2: GLOSSARY — WHAT EVERY TERM MEANS

Read this section carefully. These terms appear everywhere in the code and UI.

### Bias & Fairness Terms

| Term | What It Means | Example |
|------|--------------|---------|
| **AI Bias** | When an AI system treats one group unfairly compared to another | An AI hiring tool rejects 70% of women but only 30% of men with same qualifications |
| **Fairness Score** | A number from 0–100 measuring how fair a system is. Higher = more fair | 90 = very fair, 43 = terrible, needs immediate fixing |
| **Grade** | Letter grade based on fairness score | A (90+), B (70-89), C (50-69), F (below 50) |
| **Protected Attribute** | A characteristic that SHOULD NOT affect decisions — gender, race, age, religion | In a hiring dataset, "gender" is a protected attribute |
| **Outcome Column** | The decision being made — hired/rejected, approved/denied, flagged/unflagged | "hired" column with values 1 (yes) or 0 (no) |
| **Positive Outcome** | The "good" result you want to be equal across groups | hired=1, approved=1, not_flagged=0 |
| **Proxy Feature** | A column that secretly encodes a protected attribute | "zipcode" can encode race because neighborhoods are segregated |

### The 5 Fairness Metrics (The Math FairGuard Runs)

| Metric | What It Measures | Plain English | When It's Bad |
|--------|-----------------|---------------|---------------|
| **Disparate Impact Ratio** | `worst_group_rate / best_group_rate` | If men get hired 80% and women 40%, the ratio is 0.50 | Below 0.8 = legally discriminatory (EEOC "80% Rule") |
| **Demographic Parity Difference** | `best_group_rate - worst_group_rate` | The absolute gap between the best and worst group | Above 0.10 = significant disparity |
| **Equalized Odds** | Same as above but ONLY for equally qualified people | "Among people who scored 90+, is there still a gender gap?" | Yes → bias is in the model, not the qualifications |
| **Proxy Detection** | Statistical correlation between non-protected and protected columns | "Zipcode correlates 0.85 with race" → zipcode is a proxy for race | Correlation above 0.5 = concerning |
| **Intersectional Analysis** | Checks bias when you COMBINE protected attributes | "Women 45+" might face worse bias than "women" or "45+" alone | Rate gap > 15% from average |

### New Features (What You'll Be Working With)

| Feature | What It Is | Visual |
|---------|-----------|--------|
| **Bias Fingerprint** | A radar/spider chart with 6 axes. Each axis represents one dimension of fairness. A perfect system would be a full hexagon. A biased system has "notches" where fairness fails. | 🕸️ Hexagonal spider chart |
| **Fairness Debt** | Converts the fairness score into actual legal fines. If your system scores 43/100, it means you could face ₹2.5 Cr in fines under India DPDP Act + €8M under EU AI Act. Shows per-regulation breakdown. | 🚨 Red card with currency amounts |
| **Domain Auto-Detection** | When you upload a CSV, FairGuard scans column names and automatically detects what domain it is. "hired" → Hiring. "flagged" → Content Moderation. "price" → Pricing. The report language and legal references change accordingly. | 💼/📱/💰 Badge in header |
| **Shield Mode** | Real-time monitoring. AI decisions stream in (simulated) and we calculate fairness metrics on a rolling window. If bias spikes, alerts fire. Uses SSE (Server-Sent Events). | 📊 Live charts + 🚨 alert feed |
| **Stress Test** | AI penetration testing. We generate synthetic diverse candidates with IDENTICAL qualifications but different demographics, then run them through a deliberately biased model to expose discrimination. | 🧪 Bar charts showing bias |

### Architecture Terms

| Term | What It Means |
|------|--------------|
| **Next.js App Router** | Our framework. Pages go in `src/app/`. API routes go in `src/app/api/`. |
| **"use client"** | Put at the top of any page/component that uses React hooks (useState, useEffect, etc.) |
| **API Route** | Server-side code that runs on Vercel. Example: `src/app/api/audit/analyze/route.js` handles POST requests to `/api/audit/analyze` |
| **SSE (Server-Sent Events)** | How Shield Mode sends live data. The server keeps a connection open and pushes data to the browser. Alternative to WebSockets that works on Vercel. |
| **shadcn/ui** | Pre-built UI components (Button, Card, Badge, etc.) already installed. Import from `@/components/ui/` |
| **Recharts** | Chart library. Already used for BarChart, LineChart, RadarChart. Import from `recharts` |
| **Framer Motion** | Animation library. `motion.div` with `initial`/`animate`/`exit` props. Already used everywhere. |
| **PapaParse** | CSV file parser. Runs in the browser. Converts CSV text → array of JS objects |
| **Tailwind CSS** | Utility-first CSS. `className="text-red-400 bg-card/50 p-4 rounded-lg"` instead of writing CSS files |
| **Firebase Firestore** | Google's cloud database. We use it to save audit summaries (NOT installed yet — see Om's tasks) |

---

## 🗂️ PART 3: THE CODEBASE — WHERE EVERYTHING LIVES

```
fairguard/
├── src/
│   ├── app/                          ← PAGES + API ROUTES
│   │   ├── layout.js                 ← Root layout (fonts, Navbar wrapper) 
│   │   ├── globals.css               ← 🎨 DESIGN SYSTEM (Gauri/Khushali edit THIS)
│   │   ├── page.js                   ← Landing page "/"
│   │   ├── audit/page.js             ← Audit Mode "/audit" (upload + results)
│   │   ├── shield/page.js            ← Shield Mode "/shield" (real-time)
│   │   ├── stress/page.js            ← Stress Test "/stress" (pen testing)
│   │   ├── history/page.js           ← Audit History "/history"
│   │   └── api/
│   │       ├── audit/
│   │       │   ├── detect/route.js   ← Column + domain auto-detection
│   │       │   ├── analyze/route.js  ← Full bias analysis engine
│   │       │   ├── explain/route.js  ← Gemini AI explanation
│   │       │   └── compliance/route.js ← Gemini legal check
│   │       ├── shield/
│   │       │   └── stream/route.js   ← SSE real-time stream
│   │       ├── stress/
│   │       │   └── run/route.js      ← Stress test pipeline
│   │       └── history/
│   │           ├── save/route.js     ← Save audit to DB
│   │           └── list/route.js     ← List past audits
│   │
│   ├── components/                   ← REUSABLE UI COMPONENTS
│   │   ├── ui/                       ← shadcn components (DON'T edit these directly)
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── progress.jsx
│   │   │   ├── tabs.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── alert.jsx
│   │   │   └── ... (auto-generated by shadcn CLI)
│   │   │
│   │   ├── navbar.jsx                ← Top navigation bar
│   │   ├── csv-dropzone.jsx          ← File upload (CSV + JSON)
│   │   ├── score-gauge.jsx           ← Animated circle score display
│   │   ├── bias-chart.jsx            ← Bar chart for group rates
│   │   ├── bias-fingerprint.jsx      ← 🕸️ RadarChart (6-axis fingerprint)
│   │   ├── fairness-debt-card.jsx    ← 🚨 Legal exposure card
│   │   ├── metric-card.jsx           ← Single metric display card
│   │   └── alert-feed.jsx            ← Real-time alert list
│   │
│   └── lib/                          ← BACKEND LOGIC (DON'T edit unless assigned)
│       ├── bias-engine.js            ← ⚙️ ALL bias math (650+ lines) — Ashish only
│       ├── gemini.js                 ← 🤖 Gemini API prompts — Om only
│       ├── firebase.js               ← 🔥 Firebase client — Om only
│       └── utils.js                  ← Helpers
│
├── public/                           ← STATIC FILES (demo datasets)
│   ├── demo_hiring_data.csv          ← 100 rows, gender/age bias
│   ├── demo_hiring_data.json         ← Same as above in JSON
│   ├── demo_content_moderation.csv   ← 180 rows, user_demographic bias
│   └── demo_pricing_data.csv         ← 150 rows, zip_type/device bias
│
├── .env.local                        ← API keys (NEVER commit this)
├── package.json
├── Scope_Freeze.md                   ← The full project spec
├── CAPTAIN_UPDATED_STRATEGY.md       ← Original strategy document
└── TEAM_HANDOFF.md                   ← THIS FILE
```

### How Data Flows (The Full Pipeline)

```
USER drops CSV/JSON file in browser
         │
         ▼
   PapaParse (CSV) or JSON.parse (JSON) — RUNS IN BROWSER, data never leaves
         │
         ▼
   POST /api/audit/detect
   → scans column names → auto-classifies columns + detects domain
   → returns: { detected: { decision_columns, protected_columns }, domain: { label, icon } }
         │
         ▼
   User picks outcome column + protected attributes → clicks "Analyze"
         │
         ▼
   POST /api/audit/analyze
   → runs 5 fairness metrics + fingerprint + fairness debt
   → returns: { results: { fairness_score, per_attribute, proxies, fingerprint, fairness_debt } }
         │
         ├──▶ POST /api/audit/explain → Gemini explains in plain English (async)
         ├──▶ POST /api/audit/compliance → Gemini checks laws (async)
         └──▶ POST /api/history/save → saves summary to Firebase (async)
         │
         ▼
   Results page renders:
   ScoreGauge → BiasFingerprint → BiasChart × N → FairnessDebtCard → Proxies → AI Explanation
```

---

## 🎨 PART 4: DESIGN SYSTEM — THE NEW VISUAL IDENTITY

### The Direction: "Brutalist Precision"

**We're moving away from:** Dark purple/blue gradients, glassmorphism, rounded corners everywhere  
**We're moving toward:** Sharp, clinical, authoritative — like a security terminal meets a fintech audit tool

### 🎨 Color Palette

> **Gauri + Khushali: You have FULL artistic freedom on HOW to apply these colors.** The palette below is the starting personality — feel free to refine shades, adjust contrasts, add subtle gradients IF they feel premium. The key constraint is: **it should NOT look like a generic dark-mode dashboard.** Make it feel clinical, precise, premium in light mode skip dark mode for now. 

```css
/* ═══════════════════════════════════════════════════════════════════
   FAIRGUARD DESIGN TOKENS — Captain's Palette
   ═══════════════════════════════════════════════════════════════════ */

:root {
  /* ─── Base ─── */
  --bg-primary:    #F5F7FA;   /* Off-white background (NOT pure white) */
  --bg-secondary:  #EAECF0;   /* Light grey panels */
  --bg-card:       #FFFFFF;   /* Pure white cards */

  /* ─── Deep Navy — authority, depth ─── */
  --navy-900:      #0A1628;   /* Almost black — used for text, headers */
  --navy-800:      #0D2045;   /* Deep navy — navbar, sidebar, section headers */
  --navy-600:      #1A3A6E;   /* Active states, selected items */
  --navy-300:      #3B6CB7;   /* Links, hover states */

  /* ─── Signal Green — THE brand accent ─── */
  --green-500:     #00E676;   /* Neon green — CTAs, passing badges, key metrics */
  --green-400:     #39FF6E;   /* Brighter — hover states */
  --green-900:     #003D1A;   /* Dark green — badge backgrounds on dark */

  /* ─── Status Colors ─── */
  --red-alert:     #FF2D55;   /* CRITICAL bias — hot red */
  --amber-warn:    #FFAA00;   /* WARNING — warm amber */
  --blue-info:     #007AFF;   /* Info badges — iOS blue */

  /* ─── Text ─── */
  --text-primary:  #0A1628;   /* Navy on white — high contrast */
  --text-secondary:#5A6A85;   /* Muted for subtitles */
  --text-inverse:  #F5F7FA;   /* White text on dark backgrounds */
}
```

### Color Usage Rules

| Color | USE for | DON'T use for |
|-------|---------|--------------|
| `--green-500` (#00E676) | CTA buttons ("Analyze Now"), passing badges, chart lines showing improvement, score when > 70 | Headers, body text, backgrounds |
| `--navy-800` (#0D2045) | Navbar background, section headers, primary text | Buttons, badges |
| `--red-alert` (#FF2D55) | Critical flags, failing badges, "CRITICAL" labels, score when < 50 | Normal text, backgrounds |
| `--amber-warn` (#FFAA00) | Warning state, score between 50-70, borderline metrics | Passing states |
| `--bg-primary` (#F5F7FA) | Page background, empty space | Cards (use pure white instead) |
| White (#FFFFFF) | Cards, panels, dropdown menus | Page background (too stark) |

### Typography

```css
--font-heading: 'Geist', sans-serif;       /* All headings — sharp, modern */
--font-body:    'Inter', sans-serif;        /* Body text — currently loaded */
--font-mono:    'JetBrains Mono', monospace; /* ALL numbers, scores, percentages */
```

**Rules:**
- **Every number/score/percentage** → `font-mono` class. Score "43" should look like a readout, not prose.
- **All headings** → Geist font (need to load this — see Khushali task K1)
- **Body text** → Inter (already loaded)

### Shape & Spacing Rules

| Element | Style | Tailwind Class |
|---------|-------|---------------|
| Cards | Sharp corners, 1px border | `rounded-none border border-border` |
| Buttons | Very slight rounding | `rounded-sm` (2-4px) |
| Badges | Slight rounding | `rounded-sm` |
| Inputs | Sharp | `rounded-none` |
| Score Gauge | Circle (keep current) | (SVG, inherently round) |
| Chart containers | Sharp corners | `rounded-none` |

### Chart Color Palette

```javascript
const CHART_COLORS = {
  passing:   '#00E676',  // Signal green — best group
  primary:   '#1A3A6E',  // Navy — dominant data
  warning:   '#FFAA00',  // Amber — borderline
  critical:  '#FF2D55',  // Red — worst group
  neutral:   '#EAECF0',  // Light grey — background
  threshold: '#007AFF',  // Blue dashed — 80% rule line
};
```

> **🎨 Artistic Freedom Note:** Gauri and Khushali — the Captain's palette is a *personality guide*, not a pixel-exact mandate. If you feel a particular shade looks better at a slightly different hue, or if a specific UI element needs a different treatment to feel premium, **go for it**. The goal is: sharp, clinical, premium, not-generic. Trust your design instincts. The only hard rules are:
> - Green = good/passing, Red = bad/failing, Amber = warning
> - Score numbers in monospace font
> - Cards have sharp corners
> - Don't use generic purple/blue gradient (that's what every other team has)

---

## 🔧 PART 5: WHAT'S ALREADY DONE (Ashish Completed)

| Component | Status | What It Does |
|-----------|--------|-------------|
| `bias-engine.js` — 650+ lines | ✅ DONE | All 5 fairness metrics + composite score + domain detection + fingerprint + fairness debt |
| `gemini.js` — 220 lines | ✅ DONE | 5 Gemini prompts (explain, compliance, recommendations, synthetic gen, biased model) with fallbacks |
| `firebase.js` — 140 lines | ✅ DONE | Firestore client with in-memory fallback |
| All API routes (7 routes) | ✅ DONE | detect, analyze, explain, compliance, stream, run, save, list |
| Audit page (full pipeline) | ✅ DONE | CSV + JSON upload → configure → analyze → results with fingerprint + debt |
| Shield page | ✅ DONE | SSE streaming, live charts, alert feed |
| Stress Test page | ✅ DONE | Config form, run test, results with charts |
| History page | ✅ DONE | Stats cards, audit list, empty state |
| Landing page | ✅ DONE | Hero section, stats bar, mode cards |
| 3 demo datasets | ✅ DONE | Hiring CSV/JSON, Content Moderation CSV, Pricing CSV |
| 8 custom components | ✅ DONE | navbar, csv-dropzone, score-gauge, bias-chart, bias-fingerprint, fairness-debt-card, metric-card, alert-feed |

**Everything works end-to-end right now.** You can run `npm run dev` and test every mode.

---

## 📋 PART 6: REMAINING TASKS — DISTRIBUTED BY PERSON

---

### 👨‍💻 OM — AI, Data, Prompts, Firebase Setup

**Om owns:** Gemini prompts, demo data quality, Firebase setup, video script

---

#### O1: Install Firebase SDK
**File:** `package.json` (via terminal)  
**Time:** 5 minutes  
**What to do:**
```bash
npm install firebase
```
That's it. The `firebase.js` client is already written and will auto-connect once env vars are set.

---

#### O2: Set Up Firebase Project + Add Environment Variables
**File:** `.env.local`  
**Time:** 20 minutes  
**What to do:**
1. Go to https://console.firebase.google.com/
2. Create a new project called "fairguard"
3. Enable Firestore Database (start in test mode)
4. Go to Project Settings → General → Your Apps → Add Web App
5. Copy the config values
6. Open `.env.local` and add:
```env
GEMINI_API_KEY=your_actual_gemini_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fairguard-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fairguard-xxxxx
```
7. Restart dev server (`npm run dev`)
8. Run an audit → go to `/history` → verify it saved

---

#### O3: Improve Gemini Prompts for Domain Awareness  
**File:** `src/lib/gemini.js`  
**Time:** 2 hours  
**What to do:**

The current prompts work but are hiring-focused. Update them to be domain-aware.

**In the `explainBias()` function (line 49):**
- The prompt currently says "non-technical HR manager"
- Change it to dynamically reference the detected domain
- Add the domain info to the prompt:
```javascript
// CHANGE the prompt to include domain context:
const prompt = `You are FairGuard, an AI bias auditing assistant.
The system being audited is in the "${metrics.domain?.label || 'decision-making'}" domain.

Given these bias analysis metrics, write a clear, compassionate, plain-English explanation
that a non-technical ${metrics.domain?.domain === 'hiring' ? 'HR manager' : 
  metrics.domain?.domain === 'content_moderation' ? 'Trust & Safety lead' :
  metrics.domain?.domain === 'pricing' ? 'pricing director' : 'decision-maker'} can understand.
...rest of prompt stays the same...
```

**Do the same for `checkCompliance()` (line 94):**
- Include the domain so Gemini references the right laws
- Content moderation → EU Digital Services Act, India IT Act
- Pricing → FTC Act, Consumer Protection Act
- Lending → ECOA, Fair Housing Act

**Do the same for `getRecommendations()` (line 120):**
- Recommendations should be domain-specific
- Hiring: "blind resume screening"
- Content moderation: "equal sensitivity thresholds across demographics"
- Pricing: "remove ZIP code as a pricing factor"

---

#### O4: Improve Demo Dataset Quality
**Files:** `public/demo_content_moderation.csv`, `public/demo_pricing_data.csv`  
**Time:** 1.5 hours  
**What to do:**

The current demo datasets work but could be more realistic:

**Content Moderation CSV:**
- Currently 180 rows, all simple patterns
- Add more variety: some majority users DO get flagged occasionally (10-15%), some minority users DON'T get flagged (add maybe 20%)
- Add more content_types: `meme`, `reel`, `story`, `live_stream`
- Add a `report_count` numeric column (1-10)
- This makes the bias harder to spot instantly = more impressive demo

**Pricing CSV:**
- Currently 150 rows
- Add a `base_price` numeric column (1000-5000) to show the actual price offered
- Add a `discount_applied` column (0/1) — urban users get discounts more often
- Vary the patterns: some rural users ON desktop should get standard pricing
- Add `income_bracket` as a visible column (low/medium/high) — but make it NOT be the decision driver (the bias should come from zip_type, not income)

**Test after editing:** Load each demo in `/audit`, verify columns auto-detect correctly, run analysis, make sure results show clear bias.

---

#### O5: Write Video Script + Help Record
**File:** Create `VIDEO_SCRIPT.md` in project root  
**Time:** 1 hour  
**What to do:**

Write the exact 2-minute demo script following this flow:
1. **(0:00–0:05)** Opening line: "100 companies are deploying AI that makes decisions about people. Most have no idea if that AI is fair."
2. **(0:05–0:40)** Audit Mode — Content moderation CSV → auto-detect → results → fingerprint → "this platform silences minority voices 2.3× more"
3. **(0:40–1:10)** Stress Test — Pricing scenario → bar chart → "Same product, different ZIP codes. 40% price gap."
4. **(1:10–1:40)** Shield Mode — Start monitoring → live chart → bias spike → alert fires → "caught it in real-time"
5. **(1:40–2:00)** Fairness Debt → "₹2.5 Cr legal exposure" → "This isn't a technical problem. It's a business risk." → Logo

---

### 👩‍💻 GAURI — Pages, Layouts, Responsive Design

**Gauri owns:** Page layouts, responsive design, the `/history` page, the project deck

> **🎨 You have artistic freedom.** The color palette and typography in Part 4 are your toolkit. How you arrange elements, the spacing, animations, and overall "feel" is YOUR call. Make it look like a $10M SaaS product, not a hackathon project.

---

#### G1: Apply New Design System to `globals.css`
**File:** `src/app/globals.css`  
**Time:** 2 hours  
**What to do:**

This is the **most important design file**. Currently it has the old dark purple/blue theme. Replace it with the new palette.

**Steps:**
1. Open `src/app/globals.css`
2. Find the `.dark { ... }` section (line 86-118) — this controls ALL colors in dark mode but change it to light mode. skip dark mode for now.  
3. Update the CSS custom properties to match the Captain's palette:

```css
/* ─── You're changing these values inside .dark { } ─── */

/* Instead of generic oklch greys, use the Captain's navy/green system */
--background: #0A1628;           /* Deep navy background */
--foreground: #F5F7FA;           /* Off-white text */
--card: #0D2045;                 /* Navy cards */
--card-foreground: #F5F7FA;
--primary: #00E676;              /* Signal green for primary actions */
--primary-foreground: #0A1628;   /* Dark text on green buttons */
--secondary: #1A3A6E;            /* Mid navy */
--secondary-foreground: #F5F7FA;
--muted: #1A3A6E;
--muted-foreground: #5A6A85;     /* Grey subtitle text */
--accent: #00E676;
--accent-foreground: #0A1628;
--destructive: #FF2D55;          /* Hot red for errors */
--border: rgba(255,255,255,0.08);/* Subtle white borders */
--ring: #00E676;                 /* Focus ring = green */
```

4. Update the utility classes at the bottom:
```css
/* Replace gradient-text with the new green identity */
.gradient-text {
  /* was: purple→blue→cyan gradient */
  /* new: signal green solid OR green→cyan subtle gradient */
  background: linear-gradient(135deg, #00E676 0%, #00B0FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gradient-bg {
  /* was: purple→blue→cyan */
  /* new: navy→green accent */
  background: linear-gradient(135deg, #0D2045 0%, #1A3A6E 100%);
}
```

5. Update chart colors:
```css
--chart-1: #00E676;  /* Green — primary */
--chart-2: #007AFF;  /* Blue — secondary */
--chart-3: #FFAA00;  /* Amber — warning */
--chart-4: #FF2D55;  /* Red — critical */
--chart-5: #1A3A6E;  /* Navy — neutral */
```

6. **Make cards sharp:**
```css
@layer base {
  * {
    @apply border-border outline-ring/50;
    /* ADD: zero border radius globally */
    border-radius: 0 !important;
  }
}
/* Then selectively add back for buttons only */
button, [role="button"] {
  border-radius: 4px !important;
}
```

> ⚠️ **Important:** After editing globals.css, visually check all 5 pages (/, /audit, /shield, /stress, /history). If something looks broken, the CSS variable name might be wrong — check the shadcn docs for the correct variable.

---

#### G2: Polish the Landing Page
**File:** `src/app/page.js`  
**Time:** 1.5 hours  
**What to do:**

Current landing page works but needs the new design feel:

- Update the hero badge from `🟢` emoji to use the new green color
- Update mode cards to use navy-green color scheme instead of purple/blue/cyan
- Update the stats bar numbers (update "4" legal frameworks to "7+" since we now support 7 domain-specific regulation sets)
- Make the stats numbers use `font-mono` class for that instrument-readout feel
- Consider adding a subtle animation — maybe the word "fair." in the headline pulses with the green color
- **Add a 4th mode card** for "📜 History" at the bottom, or rearrange to show 4 cards in a 2×2 grid

**Design decision (your call):**
- Do we keep the 3-column mode card layout, or switch to something more dynamic?
- Should the hero have a background treatment (subtle grid pattern? geometric shapes?) or stay clean?

---

#### G3: Polish the Audit Results Section
**File:** `src/app/audit/page.js`  
**Time:** 2 hours  
**What to do:**

Focus on the **results step (step === 3)** section starting around line 220:

- Make the domain badge more prominent — use navy background with green icon
- The score gauge + 4 metric cards grid looks good but:
  - Make all metric values use `font-mono` class
  - Add a subtle left-border color to each metric card based on severity
- Space between sections — add more breathing room between fingerprint, charts, debt, and explanation
- The AI Explanation card at the bottom — consider adding a subtle typing animation when it loads (optional, for wow factor)

---

#### G4: Polish the History Page
**File:** `src/app/history/page.js`  
**Time:** 1.5 hours  
**What to do:**

Current history page works but looks basic:

- Make the summary stats bar more prominent — maybe full-width with navy background
- Each audit card should feel clickable (even though it doesn't link anywhere yet)
  - Add a subtle hover effect: card lifts slightly, border highlights
- Add a "No results" illustration or icon for the empty state (instead of just text)
- The domain icons (💼, 📱, 💰) are good — make them slightly larger
- Consider a simple filter at the top: "All | Hiring | Content Moderation | Pricing"
- Make scores use `font-mono` class

---

#### G5: Design the Project Deck (10 Slides)
**File:** Create using Google Slides / Canva  
**Time:** 3 hours (do this LAST)  
**What to do:**

Slide outline:
1. **Title:** FairGuard — Know if your AI is fair
2. **Problem:** 3 real-world examples of AI bias (hiring, content moderation, pricing)
3. **Solution:** "One tool, any domain, 60 seconds"
4. **How It Works:** The data flow diagram
5. **Audit Mode:** Screenshot of score + fingerprint
6. **Shield Mode:** Screenshot of live monitoring
7. **Stress Test:** Screenshot of bias exposure
8. **Fairness Debt:** The ₹2.5 Cr number — "not a tech problem, a business risk"
9. **Architecture:** Tech stack diagram
10. **The Impact:** "ANY domain. ANY bias. ONE tool."

---

### 👩‍🎨 KHUSHALI — Components, Charts, Animations, Polish

**Khushali owns:** Component library, chart styling, micro-animations, video recording

> **🎨 You have artistic freedom.** The components below are functional — your job is to make them feel premium. Animations, transitions, hover effects, color transitions — go wild. Make it feel alive.

---

#### K1: Load Geist Font (Headings)
**File:** `src/app/layout.js`  
**Time:** 15 minutes  
**What to do:**

The current layout loads `Inter` and `JetBrains_Mono`. Add `Geist` for headings:

```javascript
import { Inter, JetBrains_Mono } from "next/font/google";
// Geist might not be on Google Fonts yet — check first
// If not available, use Geist from next/font/local or fall back to Inter for headings
// Alternative: use "Plus Jakarta Sans" as the heading font (similar sharp feel)

// If using Google Fonts fallback:
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});
```

Then update the `<html>` tag:
```jsx
<html className={`${inter.variable} ${jetbrainsMono.variable} ${jakarta.variable} dark h-full antialiased`}>
```

And in `globals.css` add:
```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading), var(--font-sans), sans-serif;
}
```

---

#### K2: Update the Navbar Component
**File:** `src/components/navbar.jsx`  
**Time:** 45 minutes  
**What to do:**

- Change logo background from `gradient-bg` to navy: `bg-[#0D2045]`
- Change logo text from `gradient-text` to signal green: `text-[#00E676]`
- Make active tab use green indicator (small green bottom-border or green dot) instead of grey background
- Add a subtle `border-b border-border/50` to the entire navbar
- Make all nav items slightly larger on hover (scale-105 transition)
- On mobile, the text labels hide (`hidden sm:inline`) — keep this but make sure icons are centered

---

#### K3: Update ScoreGauge Component
**File:** `src/components/score-gauge.jsx`  
**Time:** 30 minutes  
**What to do:**

- Update the color mapping (line 12-16) to use the Captain's colors:
  ```javascript
  const getColor = (s) => {
    if (s >= 70) return { stroke: "#00E676", text: "text-[#00E676]" }; // Signal green
    if (s >= 50) return { stroke: "#FFAA00", text: "text-[#FFAA00]" }; // Amber warning
    return { stroke: "#FF2D55", text: "text-[#FF2D55]" }; // Hot red
  };
  ```
- Make the score number use `font-mono` class for that instrument feel
- The background circle stroke could be navy: `stroke="#0D2045"`
- Optional: add a subtle glow around the progress circle (CSS filter or shadow)

---

#### K4: Update BiasChart Component  
**File:** `src/components/bias-chart.jsx`  
**Time:** 30 minutes  
**What to do:**

- Update the `COLORS` object (line 6-11) to Captain's palette:
  ```javascript
  const COLORS = {
    high:      "#00E676",   // Green — fairest group
    low:       "#FF2D55",   // Red — most disadvantaged group
    neutral:   "#1A3A6E",   // Navy — normal bars  
    threshold: "#007AFF",   // Blue — 80% rule line
  };
  ```
- Update grid stroke color: `stroke="#1A3A6E"` (navy instead of grey)
- Update tooltip background to match new card color
- Optional: add a subtle gradient to bars (solid bottom → slightly lighter top)

---

#### K5: Update BiasFingerprint Component
**File:** `src/components/bias-fingerprint.jsx`  
**Time:** 30 minutes  
**What to do:**

- Update colors to Captain's palette:
  - Good score (≥70): fill `#00E676`, stroke `#00E676`
  - Warning (50-69): fill `#FFAA00`, stroke `#FFAA00`  
  - Bad (<50): fill `#FF2D55`, stroke `#FF2D55`
- Change `PolarGrid` stroke from grey to navy: `stroke="#1A3A6E"`
- Make axis labels use the new text color
- Optional: add a second "ideal" radar shape (fully filled to 100) in very faint grey behind the actual shape — so users can see how far they are from perfect

---

#### K6: Update FairnessDebtCard Component
**File:** `src/components/fairness-debt-card.jsx`  
**Time:** 20 minutes  
**What to do:**

- Update the card background to subtle red tint with new red: `bg-[#FF2D55]/5 border-[#FF2D55]/20`
- The currency amount should use `font-mono` for readout feel
- Status badges: NON-COMPLIANT → hot red, WARNING → amber, COMPLIANT → green
- Optional: add a subtle pulse animation to the "CRITICAL RISK" badge

---

#### K7: Update MetricCard Component
**File:** `src/components/metric-card.jsx`  
**Time:** 20 minutes  
**What to do:**

- Update severity badge colors to Captain's palette:
  ```javascript
  const severityColors = {
    CRITICAL: "bg-[#FF2D55]/20 text-[#FF2D55] border-[#FF2D55]/30",
    HIGH:     "bg-[#FFAA00]/20 text-[#FFAA00] border-[#FFAA00]/30",
    OK:       "bg-[#00E676]/20 text-[#00E676] border-[#00E676]/30",
    WARNING:  "bg-[#FFAA00]/20 text-[#FFAA00] border-[#FFAA00]/30",
    MODERATE: "bg-[#FFAA00]/20 text-[#FFAA00] border-[#FFAA00]/30",
  };
  ```
- Make the value `<p>` tag use `font-mono` class
- Add a subtle hover effect: card slightly lifts (`hover:-translate-y-0.5 transition-transform`)

---

#### K8: Update AlertFeed Component
**File:** `src/components/alert-feed.jsx`  
**Time:** 15 minutes  
**What to do:**

- Update the border colors:
  ```javascript
  const borderColors = {
    CRITICAL: "border-l-[#FF2D55]",
    HIGH:     "border-l-[#FFAA00]",
    WARNING:  "border-l-[#FFAA00]",
    INFO:     "border-l-[#007AFF]",
  };
  ```
- Update icon colors to match
- Optional: alerts could have a very subtle background tint matching their severity

---

#### K9: Polish Shield Mode Page
**File:** `src/app/shield/page.js`  
**Time:** 1 hour  
**What to do:**

- Update the "Start Monitoring" button to use signal green: `bg-[#00E676] text-[#0A1628] hover:bg-[#39FF6E]`
- Update the "Stop" button to hot red: `bg-[#FF2D55]`
- Update chart line colors:
  - Fairness score line: `#00E676` (green)
  - Male approval line: `#007AFF` (blue)
  - Female approval line: `#FF2D55` (red — to visually highlight the gap)
  - Threshold reference line: `#FFAA00` (amber)
- Update grid stroke in all charts to navy
- The "Ready to Monitor" empty state — make it more dramatic (larger icon, pulsing green border?)

---

#### K10: Polish Stress Test Page
**File:** `src/app/stress/page.js`  
**Time:** 45 minutes  
**What to do:**

- Decision type cards: selected state should use green border instead of purple: `border-[#00E676]/60 bg-[#00E676]/10`
- Demographic axis buttons: selected → green background: `bg-[#00E676] text-[#0A1628]`
- Candidate count buttons: same treatment
- "Run Penetration Test" button → signal green
- Results metric cards → update to Captain's palette

---

#### K11: Micro-Animations + Loading States
**Files:** Multiple components  
**Time:** 1 hour  
**What to do:**

Add these subtle animations for wow-factor:

1. **Landing page mode cards:** Stagger animation — cards appear one-by-one with 0.1s delay
2. **Audit analyzing step:** Replace the boring spinner with a pulsing green ring + "Scanning [column_name]..." text that cycles through column names
3. **Results appear:** Cards slide up with stagger (each card has 0.05s more delay)
4. **Shield "Start" button:** After clicking, subtle pulse animation on the green button before it changes to red "Stop"
5. **Score gauge:** Already animated, but add a small "pop" at the end of the fill animation

---

#### K12: Create Favicon + OG Image
**Files:** `src/app/favicon.ico`, `public/og-image.png`  
**Time:** 30 minutes  
**What to do:**

- Create a simple favicon: green shield icon on navy background (can use Canva, https://favicon.io, or generate with AI)
- Create an OG image (1200×630px): "FairGuard — Know if your AI is fair" with the signal green on navy theme

---

#### K13: Record Demo Video
**Time:** 1.5 hours (do this LAST after all polish)  
**What to do:**

1. Use OBS Studio or Loom to screen record
2. Follow Om's video script (O5)
3. Record at 1920×1080
4. Show: Audit → Stress → Shield → Debt Card
5. Keep mouse movements smooth and deliberate
6. Om will help with voiceover/narration

---

## 🔀 PART 7: GIT STRATEGY — DON'T BREAK EACH OTHER'S CODE

### Branch Strategy

```
main                          ← Production. Always works. Only merge tested code here.
  │
  ├── om/firebase-setup       ← Om's Firebase + prompt work
  ├── om/demo-data            ← Om's demo dataset improvements  
  │
  ├── gauri/design-system     ← Gauri's globals.css + page layouts
  ├── gauri/landing-polish     ← Gauri's landing page redesign
  ├── gauri/history-polish     ← Gauri's history page redesign
  │
  ├── khushali/components     ← Khushali's component updates
  ├── khushali/animations     ← Khushali's micro-animations
  ├── khushali/shield-stress  ← Khushali's Shield + Stress page updates
```

### Rules

1. **NEVER push directly to `main`.** Always create a branch, test it, then merge.
2. **Pull latest `main` BEFORE creating a branch:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b your-branch-name
   ```
3. **Commit often** with clear messages:
   ```bash
   git commit -m "K4: update BiasChart colors to Captain palette"
   git commit -m "G1: overhaul globals.css with navy/green theme"
   ```
4. **Merge order matters.** Merge in this order to avoid conflicts:
   
   **Round 1:** Om's Firebase → Gauri's globals.css (these don't overlap)  
   **Round 2:** Khushali's component updates (depend on Gauri's new colors)  
   **Round 3:** Everyone's page-level changes  
   **Round 4:** Khushali's animations (last, since they touch everything)

5. **If you get a merge conflict:**
   - DON'T panic
   - Open the conflicted file in VS Code — it shows both versions
   - Keep BOTH people's changes (they usually don't overlap)
   - If unsure, ask in the group chat before resolving

### Who Edits What (Conflict Prevention)

| File | Primary Owner | Others Can Touch? |
|------|--------------|-------------------|
| `globals.css` | **Gauri** | ❌ No — she controls the design system |
| `layout.js` | **Khushali** | ❌ No — she controls fonts |
| `page.js` (landing) | **Gauri** | ❌ No |
| `audit/page.js` | **Gauri** | ❌ No |
| `shield/page.js` | **Khushali** | ❌ No |
| `stress/page.js` | **Khushali** | ❌ No |
| `history/page.js` | **Gauri** | ❌ No |
| `navbar.jsx` | **Khushali** | ❌ No |
| `score-gauge.jsx` | **Khushali** | ❌ No |
| `bias-chart.jsx` | **Khushali** | ❌ No |
| `bias-fingerprint.jsx` | **Khushali** | ❌ No |
| `fairness-debt-card.jsx` | **Khushali** | ❌ No |
| `metric-card.jsx` | **Khushali** | ❌ No |
| `alert-feed.jsx` | **Khushali** | ❌ No |
| `csv-dropzone.jsx` | **Khushali** | ❌ No |
| `gemini.js` | **Om** | ❌ No |
| `firebase.js` | **Om** | ❌ No |
| `bias-engine.js` | **Ashish** | ❌ No |
| Demo CSVs in `public/` | **Om** | ❌ No |
| `.env.local` | **Om** | ❌ No |

**Nobody touches anyone else's files.** If you need a change in someone else's file, message them.

---

## 🚀 PART 8: HOW TO START RIGHT NOW

### Step 1: Clone and Run (Everyone, 5 minutes)
```bash
git clone [repo-url]
cd fairguard
npm install
npm run dev
# Open http://localhost:3000
```

### Step 2: Test the Current App (Everyone, 10 minutes)
1. Go to http://localhost:3000 → see landing page
2. Click "Audit Mode" → click "📱 Content Moderation" demo → click "Analyze for Bias"
3. Scroll through results — see Score Gauge, Bias Fingerprint radar, Fairness Debt card
4. Click "Shield Mode" → click "Start Monitoring" → watch live charts
5. Click "Stress Test" → click "Run Penetration Test" → see results
6. Click "History" → see the audit you just ran saved

### Step 3: Create Your Branch and Start Working
```bash
# Om:
git checkout -b om/firebase-setup

# Gauri:
git checkout -b gauri/design-system

# Khushali:
git checkout -b khushali/components
```

### Step 4: Work Through Your Tasks (in order listed above)

### Step 5: Push and Merge
```bash
git add .
git commit -m "descriptive message"
git push origin your-branch-name
# Then create a Pull Request on GitHub, or merge locally:
git checkout main
git pull origin main
git merge your-branch-name
git push origin main
```

---

## ⏰ TIMELINE

| Day | Who | What |
|-----|-----|------|
| **Today** | Om | O1 + O2 (Firebase setup) + O3 (prompts) |
| **Today** | Gauri | G1 (globals.css overhaul) — this unblocks everyone |
| **Today** | Khushali | K1 (font) + K2 (navbar) + K3 (score gauge) |
| **Tomorrow** | Om | O4 (demo data) + O5 (video script) |
| **Tomorrow** | Gauri | G2 (landing) + G3 (audit results) + G4 (history polish) |
| **Tomorrow** | Khushali | K4-K8 (all remaining components) |
| **Day 3** | Khushali | K9 (shield) + K10 (stress) + K11 (animations) |
| **Day 3** | Gauri | G5 (project deck) |
| **Day 4** | ALL | K12 (favicon) + K13 (record video) + final testing |

---

*"Ashish built the engine. You three make it beautiful, smart, and unforgettable. Go."* 🚀
