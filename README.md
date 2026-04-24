<p align="center">
  <a href="https://fair-guard.vercel.app">
    <img src="public/Readme_Logo.svg" alt="FairGuard" width="600" />
  </a>
</p>

---

<p align="justify">
<b>Know if your AI is fair.</b>
</p>

<p align="justify">
Most companies deploying AI have no idea whether it discriminates. Not because they don't care — because auditing AI bias traditionally takes 3 weeks, costs ₹5 lakhs, and requires a data science team. FairGuard does it in 60 seconds.
</p>

<p align="justify">
Upload any dataset where an AI makes decisions about people. FairGuard tells you who is being treated unfairly, how bad it is legally, and what to do about it.
</p>

---

**Live demo →** [https://fair-guard.vercel.app](https://fair-guard.vercel.app)

---

## What it actually does

<p align="justify">
FairGuard runs five mathematical fairness tests on your data simultaneously:
</p>

<p align="justify">
<b>Disparate Impact Ratio</b> — the core legal test. Divides the approval rate of the worst-treated group by the best-treated group. If the result is below 0.8, the system is discriminatory under the EEOC 80% Rule. A hiring AI that approves 70% of men but only 40% of women has a ratio of 0.57 — illegal in most jurisdictions.
</p>

<p align="justify">
<b>Demographic Parity Difference</b> — the raw gap between groups. Takes the highest group approval rate minus the lowest. A gap above 30% is flagged as critical.
</p>

<p align="justify">
<b>Equalized Odds</b> — filters to only the most qualified candidates first, then checks if bias persists. This separates "the data was biased" from "the model is biased." If equally qualified women are still rejected more than equally qualified men, the problem is in the model logic itself.
</p>

<p align="justify">
<b>Proxy Detection</b> — finds columns that secretly encode protected attributes. ZIP code correlates with race. Device type correlates with income. Neighborhood risk score correlates with ethnicity. The engine computes Pearson correlation (numeric columns) and Cramér's V chi-square (categorical columns) against every protected attribute. Anything above 0.3 is flagged; above 0.6 is a confirmed proxy.
</p>

<p align="justify">
<b>Intersectional Analysis</b> — checks every two-way combination of protected attributes. A system might treat women fairly and treat older people fairly, but treat older women catastrophically. Single-attribute analysis misses this entirely. FairGuard doesn't.
</p>

<p align="justify">
All five metrics feed into a composite Fairness Score (0–100), a letter grade, and a Bias Fingerprint — a six-axis radar chart showing the unique "shape" of how this system discriminates.
</p>

---

## The three modes

### Audit Mode

<p align="justify">
Upload a CSV or JSON file. FairGuard auto-detects which column is the outcome, which columns are protected attributes, and what domain you're working in (hiring, lending, content moderation, insurance, pricing, healthcare, education). The domain detection adapts the report language and legal references — a content moderation audit references the EU Digital Services Act and India IT Act, not EEOC hiring rules.
</p>

<p align="justify">
Results include the Fairness Score, Bias Fingerprint radar, per-group approval rate charts, proxy variable warnings, a Fairness Debt card showing legal exposure in ₹/€/$, and a plain-English Gemini explanation written for whoever needs to act on it — not for data scientists.
</p>

### Stress Test

<p align="justify">
Counterfactual AI penetration testing. Take a candidate profile — a real rejected row from your uploaded data, or a synthetic profile — clone it six times changing only the name and demographic, then send each clone to a real AI model (Gemini, Llama 3.1 8B via Groq, or Llama 3.3 70B via Groq) and compare the decisions.
</p>

<p align="justify">
Brian Thompson and Lakisha Williams. Same CV. Same qualifications. Same experience. Different names. Watch what the AI does.
</p>

<p align="justify">
This is not a simulation. Each result is a real API call to a live model. When the bar chart shows Brian approved at 83% and Lakisha at 31%, that is Gemini's actual response to identical profiles.
</p>

### Shield Mode

<p align="justify">
Real-time bias monitoring. Upload your dataset, configure which columns to watch, select an AI model, and start the stream. FairGuard generates candidates, sends them to the selected AI one by one, and plots fairness metrics on a live rolling-window chart. Alerts fire the moment the disparity ratio crosses the legal threshold.
</p>

<p align="justify">
The live decisions panel shows actual names and outcomes as they arrive — "Priya Sharma: REJECTED", "James Miller: APPROVED" — making the discrimination visible as it happens rather than in retrospect.
</p>

---

## Why this is different

<p align="justify">
Every other bias tool at a hackathon does the same thing: upload CSV, show a bar chart, suggest removing the gender column. FairGuard does four things that are genuinely uncommon:
</p>

<p align="justify">
<b>Domain agnosticism.</b> The engine doesn't know or care whether you're auditing a hiring model, a loan approval system, a content moderator, or a pricing algorithm. It operates on the structure: protected attribute, outcome, decision. The legal references and plain-English explanations adapt to the domain automatically.
</p>

<p align="justify">
<b>Multi-model comparison.</b> You can run the same counterfactual probe against Gemini, Llama 3.1, and Llama 3.3 and compare the bias profiles. Different models have different bias fingerprints. Showing that is research-level insight in a demo.
</p>

<p align="justify">
<b>Fairness Debt.</b> Every bias finding is converted into estimated legal exposure — actual fine ranges under India DPDP Act 2023, EU AI Act, EEOC, EU Digital Services Act, and others depending on domain. Executives understand risk in rupees. Data scientists understand it in ratios. FairGuard speaks both.
</p>

<p align="justify">
<b>Counterfactual proof over statistical suggestion.</b> Saying "there might be gender bias" is a suggestion. Showing that the same AI approved Brian and rejected Lakisha with identical profiles is proof. The distinction matters when the finding has to go to a legal team or a board.
</p>

---

## Demo datasets

<p align="justify">
Three datasets are included to show FairGuard across different domains. Load any of them from the Audit Mode upload screen.
</p>

<p align="justify">
<b>Hiring</b> (<code>demo_hiring_data.csv</code>) — 120 applicants. Gender and ethnicity bias. White male applicants hired at 73%, Black applicants at 4% despite comparable qualifications. Disparate impact ratio: 0.055. ZIP type flags as a confirmed proxy for ethnicity.
</p>

<p align="justify">
<b>Content Moderation</b> (<code>demo_content_moderation.csv</code>) — 200 posts. Minority racial users flagged at 59%, majority users at 16%. AAVE and non-native English variants carry additional flag penalties. Audit config: outcome = <code>flagged</code>, positive value = <code>1</code>.
</p>

<p align="justify">
<b>Algorithmic Pricing</b> (<code>demo_pricing_data.csv</code>) — 200 transactions. Rural mobile users charged premium pricing 77% of the time; urban desktop users 24%. ZIP income bracket and device type are confirmed proxies for the pricing decision. Audit config: outcome = <code>price_tier</code>, positive value = <code>0</code> (standard pricing is the good outcome).
</p>

<p align="justify">
<b>Lending</b> (<code>demo_lending_data.csv</code>) — 200 loan applications. White applicants approved at 96%, Black applicants at 17% with near-identical credit score distributions across groups. Neighborhood risk score flags as a proxy for race. Disparate impact ratio: 0.177.
</p>

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| Bias engine | Pure JavaScript — no external statistics libraries |
| AI layer | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| Multi-model | Groq API — Llama 3.1 8B Instant, Llama 3.3 70B Versatile |
| Charts | Recharts |
| Animations | Framer Motion |
| File parsing | PapaParse (CSV) + native JSON.parse |
| Database | Firebase Firestore — aggregate metrics only, no raw data |
| Deployment | Vercel |


<p align="justify">
<b>Privacy model.</b> CSV and JSON files are parsed entirely in the browser using PapaParse. Raw data never leaves the user's machine. Only aggregated statistics — group approval rates, metric scores, domain tag — are sent to the API. Gemini receives metric summaries, not individual rows. Firebase stores only the audit summary object, not the underlying dataset.
</p>

---

## Setup

**Prerequisites:** Node.js 18+, a Google Gemini API key, a Groq API key (free at console.groq.com)

```bash
git clone https://github.com/your-org/fairguard
cd fairguard
npm install
```

Create `.env.local` in the project root:

```env
# ═══════════════════════════════════════════════════════
# FairGuard — Environment Variables Example
# ═══════════════════════════════════════════════════════

# ─── Gemini AI ───
GEMINI_API_KEY=your_gemini_api_key_here

# ─── Firebase (Firestore) ───
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# ─── Groq (Multi-Model Penetration Testing) ───
GROQ_API_KEY_3_1=your_groq_llama_3_1_api_key_here
GROQ_API_KEY_3_3=your_groq_llama_3_3_api_key_here

```

## ✨ Key Features

<p align="justify">
Our platform operates in <b>3 distinct modes</b>, providing full coverage from historical data analysis to live monitoring and proactive penetration testing:
</p>

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

<p align="justify">
FairGuard is built entirely on a modern, serverless Next.js architecture, guaranteeing blazing-fast performance and effortless deployment.
</p>

**Framework:** Next.js 15 (App Router)
**Styling & UI:** Tailwind CSS v4, shadcn/ui, Framer Motion
**Data Visualization:** Recharts
**Data Processing (Privacy-first):** PapaParse (client-side CSV parsing)
**AI Engine:** Google Gemini (`@google/generative-ai`)
**Stats/Math Engine:** Pure JavaScript (Zero dependencies needed for complex bias calculations)
**Deployment:** Vercel (Serverless)

---

## 🚀 Getting Started (Bootstrapping)

<p align="justify">
To run FairGuard locally, simply follow these steps.
</p>

### 1. Clone the Repository
```bash
npm run dev
```

<p align="justify">
Open <code>http://localhost:3000</code>. Upload one of the demo CSVs from the <code>public/</code> folder to verify everything is working.
</p>

**To deploy on Vercel:**

```bash
npm i -g vercel
vercel --prod
```

<p align="justify">
Add the same environment variables in the Vercel dashboard under Project → Settings → Environment Variables.
</p>

---

## Project structure

```
fairguard/
├── src/
│   ├── app/
│   │   ├── audit/page.js          ← Audit Mode
│   │   ├── shield/page.js         ← Shield Mode
│   │   ├── stress/page.js         ← Stress Test
│   │   ├── history/page.js        ← Audit history
│   │   └── api/
│   │       ├── audit/             ← detect, analyze, explain, compliance
│   │       ├── shield/stream      ← SSE real-time stream
│   │       ├── stress/run         ← Counterfactual probe
│   │       └── history/           ← Firebase save/list
│   ├── components/
│   │   ├── bias-chart.jsx         ← Group approval rate bar chart
│   │   ├── bias-fingerprint.jsx   ← 6-axis radar chart
│   │   ├── fairness-debt-card.jsx ← Legal exposure calculator
│   │   ├── score-gauge.jsx        ← Animated fairness score ring
│   │   └── alert-feed.jsx         ← Real-time alert list
│   └── lib/
│       ├── bias-engine.js         ← All five fairness metrics
│       ├── gemini.js              ← Gemini + Groq API layer
│       └── firebase.js            ← Firestore client
└── public/
    ├── demo_hiring_data.csv
    ├── demo_content_moderation.csv
    ├── demo_pricing_data.csv
    └── demo_lending_data.csv
```

---

## Built for Google Solution Challenge 2026



## Contributors

**Ashish Prajapati**

**Om Mohite**

**Gauri Baheti**

**Khushali Dukhande**

<p align="justify">

> **Our Privacy Promise:** FairGuard processes your sensitive CSV data entirely within your browser (thanks to PapaParse). We only send generic, aggregated statistical summaries to our internal API and Gemini. Your raw data *never* leaves your machine.

</p>
