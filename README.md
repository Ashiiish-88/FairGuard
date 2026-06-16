<p align="center">
  <a href="[https://fair-guard.vercel.app](https://fairguard-8265436057.asia-south1.run.app)">
    <img src="public/Readme_Logo.svg" alt="FairGuard" width="600" />
  </a>
</p>

<p align="center">
  <strong>The Bias Firewall for AI</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/Gemini_2.5_Flash-Powered-4285F4?logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Vertex_AI-Integrated-34A853?logo=googlecloud&logoColor=white" alt="Vertex AI" />
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/BigQuery-Analytics-669DF6?logo=googlebigquery&logoColor=white" alt="BigQuery" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel" alt="Vercel" />
  <img src="https://img.shields.io/badge/Google_Solution_Challenge-2026-EA4335?logo=google&logoColor=white" alt="Solution Challenge" />
</p>

---

<p align="justify">
<b>Know if your AI is fair.</b>
</p>

<p align="justify">
Most companies deploying AI have no idea whether it discriminates. Not because they don't care — because auditing AI bias traditionally takes 3 weeks, costs ₹5 lakhs, and requires a data science team. FairGuard does it in 60 seconds.
</p>

<p align="justify">
Upload any dataset where an AI makes decisions about people. FairGuard tells you who is being treated unfairly, how bad it is legally, and what to do about it — including <b>auto-generated Python and SQL remediation code</b> and <b>live regulatory news</b> grounded in Google Search.
</p>

---

**Live demo →** [https://fair-guard.vercel.app](https://fair-guard.vercel.app)

---

## 🌍 UN Sustainable Development Goals

FairGuard directly addresses two UN SDGs:

<table>
  <tr>
    <td width="80" align="center"><img src="https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-10.jpg" width="60" alt="SDG 10" /></td>
    <td><b>SDG 10 — Reduced Inequalities</b><br/>AI bias disproportionately affects marginalized groups. A biased hiring model rejects qualified women; a biased lending model denies loans to minorities. FairGuard detects and quantifies this discrimination using five statistical fairness metrics, intersectional analysis, and proxy variable detection — making invisible algorithmic inequalities visible.</td>
  </tr>
  <tr>
    <td width="80" align="center"><img src="https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-16.jpg" width="60" alt="SDG 16" /></td>
    <td><b>SDG 16 — Peace, Justice & Strong Institutions</b><br/>AI governance requires transparent, accountable systems. FairGuard maps every bias finding to real legal frameworks (EEOC 80% Rule, EU AI Act, India DPDP Act 2023), estimates financial exposure, generates verifiable compliance certificates, and uses Gemini with Google Search grounding to cite the latest regulatory enforcement actions.</td>
  </tr>
</table>

---

## ☁️ Google Cloud Services Used

| Google Cloud Product | How FairGuard Uses It |
|---|---|
| **Gemini 2.5 Flash** (via `@google/genai`) | Powers plain-English bias explanations, remediation code generation (Python/SQL), compliance analysis, synthetic candidate generation for stress tests, and domain detection |
| **Vertex AI** | Primary Gemini inference endpoint with service-account auth; automatic fallback to direct Gemini API if credentials aren't present |
| **Vertex AI Model Registry** | Registers FairGuard's bias detection pipeline as a versioned model entry — enabling audit trail of which pipeline version produced each report |
| **Gemini Google Search Grounding** | Enriches compliance reports with **live regulatory news** — e.g., recent EU AI Act enforcement actions or EEOC settlements — cited with sources and dates |
| **BigQuery** | Stores aggregated audit analytics (fairness scores, domain distribution, bias trends over time) for cross-audit analysis |
| **Firebase Firestore** | Persists audit summaries, certificates, and history — no raw user data stored |
| **Firebase Hosting** | Alternative deployment target (alongside Vercel) |
| **Cloud Logging** (structured) | All AI calls (Vertex AI, Gemini API, Groq) are logged with structured JSON including latency, model, fallback events, and error details |

---

## Architecture

```mermaid
graph TB
    subgraph "Frontend — Next.js 16 + React 19"
        UI["React UI + Framer Motion"]
        Charts["Recharts Visualizations"]
        Upload["CSV/JSON Upload (PapaParse)"]
    end

    subgraph "API Layer — Next.js Server Routes"
        Audit["/api/audit/* — Bias Analysis"]
        Stress["/api/stress/run — Counterfactual Probing"]
        Shield["/api/shield/stream — Real-Time SSE"]
        Genome["/api/genome/run — Bias Genome Mapping"]
        Remediate["/api/audit/remediate — Fix Code Gen"]
        RegNews["/api/audit/regulatory-news — Grounded News"]
        Cert["/api/certificate — Compliance Certs"]
        Impact["/api/impact/stats — Aggregate Stats"]
    end

    subgraph "AI Models"
        Gemini["Gemini 2.5 Flash"]
        Grounding["Gemini + Google Search Grounding"]
        Llama8B["Llama 3.1 8B via Groq"]
        Llama70B["Llama 3.3 70B via Groq"]
        BiasEngine["Custom Bias Engine — Disparate Impact, Demographic Parity, Equalized Odds, Proxy Detection, Intersectional Analysis"]
    end

    subgraph "Google Cloud Platform"
        VertexAI["Vertex AI"]
        ModelReg["Vertex AI Model Registry"]
        BigQuery["BigQuery Analytics"]
        Firebase["Firebase Firestore"]
        GeminiAPI["Gemini API (fallback)"]
        CloudLog["Structured Cloud Logging"]
    end

    subgraph "Monitoring"
        Sentry["Sentry Error Tracking"]
    end

    UI --> Audit
    UI --> Stress
    UI --> Shield
    UI --> Genome
    UI --> Remediate
    UI --> RegNews

    Audit --> BiasEngine
    Audit --> Gemini
    Stress --> Gemini
    Stress --> Llama8B
    Stress --> Llama70B
    Genome --> Gemini
    Remediate --> Gemini
    RegNews --> Grounding

    Gemini --> VertexAI
    Gemini -.->|fallback| GeminiAPI
    Cert --> Firebase
    Impact --> Firebase
    Audit --> BigQuery
    Audit --> ModelReg

    Audit --> CloudLog
    Stress --> CloudLog
    Audit --> Sentry
```

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

## The modes

### 🔍 Audit Mode

<p align="justify">
Upload a CSV or JSON file. FairGuard auto-detects which column is the outcome, which columns are protected attributes, and what domain you're working in (hiring, lending, content moderation, insurance, pricing, healthcare, education). The domain detection adapts the report language and legal references — a content moderation audit references the EU Digital Services Act and India IT Act, not EEOC hiring rules.
</p>

<p align="justify">
Results include the Fairness Score, Bias Fingerprint radar, per-group approval rate charts, proxy variable warnings, a Fairness Debt card showing legal exposure in ₹/€/$, a plain-English Gemini explanation, <b>auto-generated Python/SQL remediation code</b>, and <b>live regulatory news</b> from Google Search grounding.
</p>

### 🧪 Stress Test

<p align="justify">
Counterfactual AI penetration testing. Take a candidate profile — a real rejected row from your uploaded data, or a synthetic profile — clone it six times changing only the name and demographic, then send each clone to a real AI model (Gemini, Llama 3.1 8B via Groq, or Llama 3.3 70B via Groq) and compare the decisions.
</p>

<p align="justify">
Brian Thompson and Lakisha Williams. Same CV. Same qualifications. Same experience. Different names. Watch what the AI does.
</p>

<p align="justify">
This is not a simulation. Each result is a real API call to a live model. When the bar chart shows Brian approved at 83% and Lakisha at 31%, that is Gemini's actual response to identical profiles.
</p>

### 🛡️ Shield Mode

<p align="justify">
Real-time bias monitoring. Upload your dataset, configure which columns to watch, select an AI model, and start the stream. FairGuard generates candidates, sends them to the selected AI one by one, and plots fairness metrics on a live rolling-window chart. Alerts fire the moment the disparity ratio crosses the legal threshold.
</p>

### 🧬 Genome Mode

<p align="justify">
Bias Genome Mapping — a comprehensive 36-probe (or 60-probe) matrix testing every combination of demographics × qualification levels. Produces a heatmap showing exactly where the model discriminates most, which demographic intersections are safest/most dangerous, and overall approval patterns.
</p>

### 📊 Impact Dashboard

<p align="justify">
Pre-computed bias audit results on well-known public datasets (COMPAS Recidivism, German Credit, Adult Income Census). Shows real-world impact evidence: "FairGuard detected that Black defendants are scored high-risk at 2.3× the rate of white defendants in the COMPAS dataset." Includes cumulative platform statistics from Firestore.
</p>

---

## Why this is different

<p align="justify">
<b>Domain agnosticism.</b> The engine operates on the structure: protected attribute, outcome, decision. The legal references and explanations adapt to the domain automatically across 7 domains.
</p>

<p align="justify">
<b>Multi-model comparison.</b> Run the same counterfactual probe against Gemini, Llama 3.1, and Llama 3.3 and compare the bias profiles. Different models have different bias fingerprints.
</p>

<p align="justify">
<b>Fairness Debt.</b> Every bias finding is converted into estimated legal exposure — actual fine ranges under India DPDP Act 2023, EU AI Act, EEOC, EU Digital Services Act, and others.
</p>

<p align="justify">
<b>Counterfactual proof over statistical suggestion.</b> Showing that the same AI approved Brian and rejected Lakisha with identical profiles is proof, not a suggestion.
</p>

<p align="justify">
<b>Auto-generated fix code.</b> When bias is detected, Gemini generates actual Python data preprocessing patches, SQL query modifications, and monitoring scripts — not just "remove the gender column" advice.
</p>

<p align="justify">
<b>Live regulatory grounding.</b> Compliance reports cite the latest AI regulation news using Gemini's Google Search grounding — not static legal references from 2023.
</p>

---

## Demo datasets

<p align="justify">
Four datasets are included to show FairGuard across different domains. Load any of them from the Audit Mode upload screen.
</p>

<p align="justify">
<b>Hiring</b> (<code>demo_hiring_data.csv</code>) — 120 applicants. Gender and ethnicity bias. White male applicants hired at 73%, Black applicants at 4% despite comparable qualifications. Disparate impact ratio: 0.055. ZIP type flags as a confirmed proxy for ethnicity.
</p>

<p align="justify">
<b>Content Moderation</b> (<code>demo_content_moderation.csv</code>) — 200 posts. Minority racial users flagged at 59%, majority users at 16%. AAVE and non-native English variants carry additional flag penalties.
</p>

<p align="justify">
<b>Algorithmic Pricing</b> (<code>demo_pricing_data.csv</code>) — 200 transactions. Rural mobile users charged premium pricing 77% of the time; urban desktop users 24%.
</p>

<p align="justify">
<b>Lending</b> (<code>demo_lending_data.csv</code>) — 200 loan applications. White applicants approved at 96%, Black applicants at 17% with near-identical credit score distributions.
</p>

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router + React 19 |
| Bias engine | Pure JavaScript — five statistical fairness metrics, no external statistics libraries |
| AI layer | Google Gemini 2.5 Flash (`@google/genai`) via Vertex AI with direct API fallback |
| Multi-model | Groq API — Llama 3.1 8B Instant, Llama 3.3 70B Versatile |
| Search grounding | Gemini + Google Search for live regulatory citations |
| Charts | Recharts |
| Animations | Framer Motion |
| File parsing | PapaParse (CSV) + native JSON.parse |
| Database | Firebase Firestore — aggregate metrics only, no raw data |
| Analytics | Google BigQuery — cross-audit trend analysis |
| Model registry | Vertex AI Model Registry — pipeline versioning |
| Monitoring | Sentry (error tracking) + GCP structured logging |
| Deployment | Vercel (primary) + Firebase Hosting (alt) |

<p align="justify">
<b>Privacy model.</b> CSV and JSON files are parsed entirely in the browser using PapaParse. Raw data never leaves the user's machine. Only aggregated statistics — group approval rates, metric scores, domain tag — are sent to the API. Gemini receives metric summaries, not individual rows. Firebase stores only the audit summary object, not the underlying dataset.
</p>

---

## Setup

**Prerequisites:** Node.js 18+, a Google Gemini API key, a Groq API key (free at console.groq.com)

```bash
git clone https://github.com/Ashiiish-88/FairGuard.git
cd FairGuard
npm install
```

Create `.env.local` in the project root:

```env
# ═══════════════════════════════════════════════════════
# FairGuard — Environment Variables
# ═══════════════════════════════════════════════════════

# ─── Gemini AI ───
GEMINI_API_KEY=your_gemini_api_key_here

# ─── Firebase (Hosting + Firestore) ───
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

# ─── Google Cloud Platform (optional — Vertex AI + BigQuery) ───
# Leave blank to use direct Gemini API + Firestore only (demo-safe fallback)
GOOGLE_CLOUD_PROJECT=your_gcp_project_id
GOOGLE_CLOUD_LOCATION=us-central1
BIGQUERY_DATASET=fairguard_analytics
GCP_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# ─── Firebase Admin SDK (Server-Side) ───
FIREBASE_CLIENT_EMAIL=your_firebase_admin_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Start the dev server:

```bash
npm run dev
```

---

## Project structure

```
fairguard/
├── src/
│   ├── app/
│   │   ├── audit/page.js          ← Audit Mode
│   │   ├── shield/page.js         ← Shield Mode
│   │   ├── stress/page.js         ← Stress Test
│   │   ├── genome/page.js         ← Bias Genome Mapping
│   │   ├── impact/page.js         ← Impact Dashboard
│   │   ├── compare/page.js        ← Multi-model comparison
│   │   ├── history/page.js        ← Audit history
│   │   ├── verify/[id]/page.js    ← Certificate verification
│   │   └── api/
│   │       ├── audit/             ← detect, analyze, explain, compliance, remediate, regulatory-news, register-model
│   │       ├── shield/stream      ← SSE real-time stream
│   │       ├── stress/run         ← Counterfactual probe
│   │       ├── genome/run         ← Genome mapping
│   │       ├── impact/stats       ← Aggregate statistics
│   │       ├── certificate/       ← Certificate generation
│   │       └── history/           ← Firebase save/list
│   ├── components/
│   │   ├── bias-chart.jsx         ← Group approval rate bar chart
│   │   ├── bias-fingerprint.jsx   ← 6-axis radar chart
│   │   ├── fairness-debt-card.jsx ← Legal exposure calculator
│   │   ├── score-gauge.jsx        ← Animated fairness score ring
│   │   ├── remediation-code.jsx   ← Gemini-generated Python/SQL fix code
│   │   ├── regulatory-news.jsx    ← Grounded AI regulation news
│   │   ├── regulation-panel.jsx   ← Compliance regulation cards
│   │   ├── certificate-card.jsx   ← Audit certificate
│   │   ├── alert-feed.jsx         ← Real-time alert list
│   │   └── navbar.jsx             ← Navigation bar
│   └── lib/
│       ├── bias-engine.js         ← All five fairness metrics
│       ├── gemini.js              ← Gemini + Groq API layer + grounding + remediation
│       ├── vertex-registry.js     ← Vertex AI Model Registry integration
│       ├── firebase.js            ← Firestore client
│       ├── gcp-logger.js          ← Structured Cloud Logging
│       └── regulation-db.js       ← Legal regulation database
└── public/
    ├── demo_hiring_data.csv
    ├── demo_content_moderation.csv
    ├── demo_pricing_data.csv
    └── demo_lending_data.csv
```

---

## Built for Google Solution Challenge 2026

**Team Members:**

- **Ashish Prajapati**
- **Om Mohite**
- **Gauri Baheti**
- **Khushali Dukhande**

---

> **Our Privacy Promise:** FairGuard processes your sensitive CSV data entirely within your browser (thanks to PapaParse). We only send generic, aggregated statistical summaries to our internal API and Gemini. Your raw data *never* leaves your machine.
