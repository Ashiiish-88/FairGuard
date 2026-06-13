// app/audit/page.tsx
"use client";

import { useState, useCallback, useMemo } from "react";
import Papa from "papaparse";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Settings2,
  ScanLine,
  BarChart3,
  RotateCcw,
  ArrowRight,
  ChevronRight,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  Sparkles,
  Scale,
  Network,
  Info,
  Database,
  Zap,
} from "lucide-react";
import CsvDropzone from "@/components/csv-dropzone";
import ScoreGauge from "@/components/score-gauge";
import BiasChart from "@/components/bias-chart";
import BiasFingerprint from "@/components/bias-fingerprint";
import FairnessDebtCard from "@/components/fairness-debt-card";
import MetricCard from "@/components/metric-card";
import HumanCostCard from "@/components/human-cost-card";
import CertificateCard from "@/components/certificate-card";
import RegulationPanel from "@/components/regulation-panel";
import RemediationCode from "@/components/remediation-code";
import RegulatoryNews from "@/components/regulatory-news";

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  {
    icon: <Upload className="w-3.5 h-3.5" />,
    label: "Upload",
    description: "Load your dataset",
  },
  {
    icon: <Settings2 className="w-3.5 h-3.5" />,
    label: "Configure",
    description: "Select columns",
  },
  {
    icon: <ScanLine className="w-3.5 h-3.5" />,
    label: "Analyzing",
    description: "Running metrics",
  },
  {
    icon: <BarChart3 className="w-3.5 h-3.5" />,
    label: "Results",
    description: "View bias report",
  },
];

const DEMO_DATASETS = [
  {
    label: "Hiring — CSV",
    file: "/demo_hiring_data.csv",
    type: "csv",
  },
  {
    label: "Hiring — JSON",
    file: "/demo_hiring_data.json",
    type: "json",
  },
  {
    label: "Content Moderation",
    file: "/demo_content_moderation.csv",
    type: "csv",
  },
  {
    label: "Algorithmic Pricing",
    file: "/demo_pricing_data.csv",
    type: "csv",
  },
  {
    label: "Lending & Credit",
    file: "/demo_lending_data.csv",
    type: "csv",
  },
];

const ANALYSIS_STEPS = [
  "Parsing dataset structure",
  "Running disparate impact test",
  "Detecting proxy variables",
  "Computing bias fingerprint",
  "Generating legal exposure report",
];

// ─── Severity config using YOUR palette ───────────────────────────────────────

const SEVERITY = {
  CRITICAL: {
    text: "text-[#ff6b7a]",
    bg: "bg-[#ff6b7a]/8",
    border: "border-[#ff6b7a]/20",
    badge: "bg-[#ff6b7a]/10 text-[#ff6b7a] border-[#ff6b7a]/25",
    bar: "bg-[#ff6b7a]",
    dot: "bg-[#ff6b7a]",
  },
  HIGH: {
    text: "text-[#ff6b7a]",
    bg: "bg-[#ff6b7a]/8",
    border: "border-[#ff6b7a]/20",
    badge: "bg-[#ff6b7a]/10 text-[#ff6b7a] border-[#ff6b7a]/25",
    bar: "bg-[#ff6b7a]",
    dot: "bg-[#ff6b7a]",
  },
  WARNING: {
    text: "text-[#ff8c42]",
    bg: "bg-[#ff8c42]/8",
    border: "border-[#ff8c42]/20",
    badge: "bg-[#ff8c42]/10 text-[#ff8c42] border-[#ff8c42]/25",
    bar: "bg-[#ff8c42]",
    dot: "bg-[#ff8c42]",
  },
  MODERATE: {
    text: "text-[#ff8c42]",
    bg: "bg-[#ff8c42]/8",
    border: "border-[#ff8c42]/20",
    badge: "bg-[#ff8c42]/10 text-[#ff8c42] border-[#ff8c42]/25",
    bar: "bg-[#ff8c42]",
    dot: "bg-[#ff8c42]",
  },
  OK: {
    text: "text-[#caff3d]",
    bg: "bg-[#caff3d]/8",
    border: "border-[#caff3d]/20",
    badge: "bg-[#caff3d]/10 text-[#caff3d] border-[#caff3d]/25",
    bar: "bg-[#caff3d]",
    dot: "bg-[#caff3d]",
  },
  LOW: {
    text: "text-[#caff3d]",
    bg: "bg-[#caff3d]/8",
    border: "border-[#caff3d]/20",
    badge: "bg-[#caff3d]/10 text-[#caff3d] border-[#caff3d]/25",
    bar: "bg-[#caff3d]",
    dot: "bg-[#caff3d]",
  },
}

const getSev = (key) =>
  SEVERITY[key ?? "WARNING"] ?? SEVERITY.WARNING;

// ─── Animation presets ────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
  transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const staggerChild = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22 } },
};

// ─── Reusable sub-components ──────────────────────────────────────────────────

/* Step indicator */
function StepIndicator({ current }) {
  return (
    <nav className="flex items-center gap-0 mb-10">
      {STEPS.map((s, i) => {
        const state =
          i < current ? "done" : i === current ? "active" : "pending";

        return (
          <div key={s.label} className="flex items-center">
            <div className="flex items-center gap-2.5">
              {/* Node */}
              <div
                className={[
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  "transition-all duration-300 text-xs font-semibold",
                  state === "done"
                    ? "bg-black text-[#caff3d]"
                    : state === "active"
                    ? "bg-[#caff3d] text-black ring-4 ring-[#caff3d]/20"
                    : "bg-muted text-muted-foreground border border-border",
                ].join(" ")}
              >
                {state === "done" ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  s.icon
                )}
              </div>

              {/* Label */}
              <div className="hidden sm:block">
                <p
                  className={[
                    "text-xs font-semibold leading-none",
                    state === "pending"
                      ? "text-muted-foreground"
                      : "text-foreground",
                  ].join(" ")}
                >
                  {s.label}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">
                  {s.description}
                </p>
              </div>
            </div>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div className="mx-3 sm:mx-5">
                <div
                  className={[
                    "h-px transition-all duration-500",
                    "w-8 sm:w-14",
                    i < current ? "bg-black" : "bg-border",
                  ].join(" ")}
                />
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* Column selector button */
function ColBtn({
  label,
  active,
  suggested,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 px-3 py-2 rounded-md",
        "text-sm border transition-all duration-150 cursor-pointer",
        active
          ? "bg-black text-[#caff3d] border-black shadow-sm"
          : "bg-white text-foreground border-border",
        !active && "hover:border-black/40 hover:bg-muted/50",
      ].join(" ")}
    >
      <code className="text-xs font-mono">{label}</code>
      {suggested && (
        <span
          className={[
            "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
            active
              ? "bg-[#caff3d]/20 text-[#caff3d]"
              : "bg-[#0057ff]/8 text-[#0057ff]",
          ].join(" ")}
        >
          auto
        </span>
      )}
    </button>
  );
}

/* Card section header row */
function CardHeader({
  icon,
  title,
  subtitle,
  right,
}) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
      <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <span className="text-foreground">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  );
}

/* Inline alert */
function Alert({
  type,
  message,
}) {
  const cfg = {
    error: {
      bg: "bg-[#ff6b7a]/8",
      border: "border-[#ff6b7a]/20",
      text: "text-[#ff6b7a]",
      Icon: XCircle,
    },
    warning: {
      bg: "bg-[#ff8c42]/8",
      border: "border-[#ff8c42]/20",
      text: "text-[#ff8c42]",
      Icon: AlertTriangle,
    },
    info: {
      bg: "bg-[#0057ff]/8",
      border: "border-[#0057ff]/20",
      text: "text-[#0057ff]",
      Icon: Info,
    },
  }[type];

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${cfg.bg} ${cfg.border}`}
    >
      <cfg.Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.text}`} />
      <p className={`text-sm ${cfg.text}`}>{message}</p>
    </div>
  );
}

/* Thin divider with label */
function Divider({ label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderMarkdown(str) {
  if (!str) return "";
  let html = str.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/\n\n/g, '<br/><br/>');
  return html;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AuditPage() {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [detected, setDetected] = useState(null);
  const [domainInfo, setDomainInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "evidence" | "legal" | "fixit"
  const [config, setConfig] = useState({
    outcome: "",
    protected: [],
    positiveOutcome: "1",
    qualColumn: "",
  });
  const [results, setResults] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [compliance, setCompliance] = useState(null);
  const [remediationCode, setRemediationCode] = useState(null);
  const [remediationLoading, setRemediationLoading] = useState(false);
  const [regulatoryNews, setRegulatoryNews] = useState(null);
  const [newsLoading, setNewsLoading] = useState(false);
  const [registryInfo, setRegistryInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const processData = useCallback(
    async (parsedData) => {
      setData(parsedData);
      try {
        sessionStorage.setItem("fairguard_source_data", JSON.stringify(parsedData.slice(0, 200))); // Store a sample for stress test
        const res = await fetch("/api/audit/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: parsedData.slice(0, 100) }),
        });
        const det = await res.json();
        setDetected(det.detected);
        if (det.domain) setDomainInfo(det.domain);
        setConfig((prev) => {
          const outcomeCol = det.detected?.decision_columns?.[0];
          // Pick the most semantically positive unique value (not just first)
          const positiveKeywords = ["1", "true", "hired", "approved", "yes", "flagged", "removed", "selected", "granted", "allowed"];
          const uniqueVals = (outcomeCol?.unique_values || []).map(String);
          const guessedPositive =
            uniqueVals.find((v) => positiveKeywords.includes(v.toLowerCase())) ??
            uniqueVals[0] ??
            "1";
          return {
            ...prev,
            outcome: outcomeCol?.column || "",
            positiveOutcome: guessedPositive,
            protected: (det.detected?.protected_columns || []).map(
              (c) => c.column
            ),
          };
        });
        setStep(1);
      } catch (e) {
        setError(`Column detection failed: ${e.message}`);
      }
    },
    []
  );

  const handleFile = useCallback(
    async (f) => {
      if (!f) {
        setFile(null);
        setData(null);
        setDomainInfo(null);
        return;
      }
      setFile(f);
      setError(null);

      if (f.name?.toLowerCase().endsWith(".json")) {
        try {
          const text = await f.text();
          const parsed = JSON.parse(text);
          if (!Array.isArray(parsed) || parsed.length === 0) {
            setError("JSON must contain an array of row objects.");
            return;
          }
          await processData(parsed);
        } catch (e) {
          setError(`JSON parse error: ${e.message}`);
        }
      } else {
        Papa.parse(f, {
          header: true,
          skipEmptyLines: true,
          complete: async (res) =>
            await processData(res.data),
          error: (e) => setError(`CSV parse error: ${e.message}`),
        });
      }
    },
    [processData]
  );

  const loadDemo = async (url, type) => {
    setError(null);
    try {
      const res = await fetch(url);
      const text = await res.text();
      const f = new File([text], url.split("/").pop(), {
        type: type === "json" ? "application/json" : "text/csv",
      });
      handleFile(f);
    } catch (e) {
      setError(`Demo load failed: ${e.message}`);
    }
  };

  const runAnalysis = async () => {
    if (!config.outcome || !config.protected.length) {
      setError(
        "Select an outcome column and at least one protected attribute."
      );
      return;
    }
    setStep(2);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/audit/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data,
          outcome_column: config.outcome,
          protected_columns: config.protected,
          positive_outcome: config.positiveOutcome,
          qualification_column: config.qualColumn || null,
        }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setResults(json.results);
      setStep(3);

      const faf = (url, body, cb, errCb) =>
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
          .then((r) => r.json())
          .then(cb)
          .catch((err) => {
            if (errCb) errCb(err);
          });

      faf("/api/audit/explain", { metrics: json.results }, (r) =>
        setExplanation(r.explanation)
      );
      faf("/api/audit/compliance", { metrics: json.results }, (r) =>
        setCompliance(r.compliance)
      );

      // Fetch Remediation Code & Regulatory News
      setRemediationLoading(true);
      setNewsLoading(true);

      faf(
        "/api/audit/remediate",
        { metrics: json.results },
        (r) => {
          if (r && r.code) setRemediationCode(r.code);
          setRemediationLoading(false);
        },
        () => setRemediationLoading(false)
      );

      faf(
        "/api/audit/regulatory-news",
        {
          domain: json.results.domain?.label || "General",
          regulations: json.results.domain?.compliance || [],
        },
        (r) => {
          setRegulatoryNews(r);
          setNewsLoading(false);
        },
        () => setNewsLoading(false)
      );

      // Register model in Vertex AI Model Registry
      fetch("/api/audit/register-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: json.results.domain?.label || "General",
          fairnessScore: json.results.fairness_score?.score || 0,
        }),
      })
        .then((r) => r.json())
        .then((r) => {
          console.log("Vertex AI Model Registry registration:", r);
          setRegistryInfo(r);
        })
        .catch((e) => {
          console.error("Vertex AI Model Registry registration error:", e);
          setRegistryInfo({ status: "error", error: e.message });
        });

      faf("/api/history/save", { results: json.results }, () => {});
    } catch (e) {
      setError(`Analysis failed: ${e.message}`);
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setFile(null);
    setData(null);
    setDetected(null);
    setResults(null);
    setExplanation(null);
    setCompliance(null);
    setRemediationCode(null);
    setRemediationLoading(false);
    setRegulatoryNews(null);
    setNewsLoading(false);
    setRegistryInfo(null);
    setError(null);
    setDomainInfo(null);
    setConfig({
      outcome: "",
      protected: [],
      positiveOutcome: "1",
      qualColumn: "",
    });
  };

  const toggleProtected = (col) =>
    setConfig((prev) => ({
      ...prev,
      protected: prev.protected.includes(col)
        ? prev.protected.filter((c) => c !== col)
        : [...prev.protected, col],
    }));

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1320px] mx-auto px-6 py-10">

        {/* ── Page header ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-4">
            {/* Icon block — Refold split-button style */}
            <div className="flex-shrink-0 mt-0.5">
              <div className="flex items-stretch rounded-md overflow-hidden">
                <div className="bg-[#caff3d] w-10 h-10 flex items-center justify-center">
                  <Shield className="w-4.5 h-4.5 text-black" />
                </div>
                <div className="bg-black w-1" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  Audit Mode
                </h1>
                {domainInfo && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted border border-border text-xs font-medium text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#caff3d]" />
                    {domainInfo.label}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Upload any decision dataset · detect hidden bias · understand
                legal risk
              </p>
            </div>
          </div>

          {step > 0 && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg
                         text-sm font-medium text-muted-foreground border border-border
                         bg-card hover:bg-muted hover:text-foreground
                         transition-all duration-150"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Start over
            </button>
          )}
        </div>

        {/* ── Step indicator ──────────────────────────────────────── */}
        <StepIndicator current={step} />

        {/* ── Error ───────────────────────────────────────────────── */}
        <AnimatePresence>
          {error && (
            <motion.div {...fadeUp} className="mb-6">
              <Alert type="error" message={error} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Step panels ─────────────────────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* ═══ STEP 0: Upload ════════════════════════════════════ */}
          {step === 0 && (
            <motion.div key="upload" {...fadeUp} className="space-y-8">

              <CsvDropzone onFileLoaded={handleFile} file={file} />

              {/* Demo datasets */}
              <div className="space-y-3">
                <Divider label="Or try a demo dataset" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {DEMO_DATASETS.map((d) => (
                    <button
                      key={d.file + d.type}
                      onClick={() => loadDemo(d.file, d.type)}
                      className="flex items-center gap-2 px-3.5 py-3 rounded-lg
                                 bg-card border border-border text-sm font-medium
                                 text-muted-foreground text-left
                                 hover:border-black hover:text-foreground
                                 hover:bg-muted/50 transition-all duration-150 group"
                    >
                      <FileText className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground group-hover:text-[#caff3d] transition-colors" />
                      <span className="truncate">{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ STEP 1: Configure ═════════════════════════════════ */}
          {step === 1 && (
            <motion.div key="configure" {...fadeUp} className="space-y-5">

              {/* Domain notice */}
              {domainInfo && (
                <div className="flex items-start gap-3 px-4 py-3.5 rounded-lg bg-[#0057ff]/6 border border-[#0057ff]/20">
                  <Zap className="w-4 h-4 text-[#caff3d] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Domain detected:{" "}
                      <span className="text-black">{domainInfo.label}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Compliance references:{" "}
                      {domainInfo.compliance?.join(", ")}
                    </p>
                  </div>
                </div>
              )}

              {/* Dataset pill */}
              {data && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0057ff]/4 border border-[#0057ff]/20 w-fit">
                  <Database className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {data.length.toLocaleString()}
                    </span>{" "}
                    rows ·{" "}
                    <span className="font-semibold text-foreground">
                      {Object.keys(data[0] || {}).length}
                    </span>{" "}
                    columns
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0057ff]" />
                  <span className="text-[11px] font-semibold text-[#0057ff]">
                    Ready
                  </span>
                </div>
              )}

              {/* ── Outcome column card ── */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <CardHeader
                  icon={<BarChart3 className="w-3.5 h-3.5" />}
                  title="Outcome column"
                  subtitle="The column containing your model's decision — hired, approved, flagged, etc."
                />
                <div className="p-6 space-y-5">
                  {/* PRIMARY — only auto-detected decision columns get the "auto" badge */}
                  <div className="flex flex-wrap gap-2">
                    {(detected?.decision_columns || []).length > 0 ? (
                      (detected.decision_columns).map((c) => (
                        <ColBtn
                          key={c.column}
                          label={c.column}
                          active={config.outcome === c.column}
                          suggested
                          onClick={() => {
                            const positiveKeywords = ["1", "true", "hired", "approved", "yes",
                              "flagged", "removed", "selected", "granted", "allowed", "accepted"];
                            const uniqueVals = (c.unique_values || []).map(String);
                            const guessedPositive =
                              uniqueVals.find((v) => positiveKeywords.includes(v.toLowerCase())) ??
                              uniqueVals[0] ?? "1";
                            setConfig((p) => ({ ...p, outcome: c.column, positiveOutcome: guessedPositive }));
                          }}
                        />
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        No decision column auto-detected — select one below.
                      </p>
                    )}
                  </div>

                  {/* SECONDARY — other low-cardinality feature cols, clearly labelled as manual override */}
                  {(() => {
                    const primarySet   = new Set((detected?.decision_columns  || []).map((c) => c.column));
                    const proxySet     = new Set((detected?.proxy_candidates   || []).map((c) => c.column));
                    const protectedSet = new Set((detected?.protected_columns  || []).map((c) => c.column));
                    const secondaryCols = (detected?.feature_columns || []).filter(
                      (c) =>
                        c.unique_count <= 8 &&
                        !primarySet.has(c.column) &&
                        !proxySet.has(c.column) &&
                        !protectedSet.has(c.column)
                    );
                    if (secondaryCols.length === 0) return null;
                    return (
                      <div className="pt-3 border-t border-border space-y-2">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                          Other columns — manual override
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {secondaryCols.map((c) => (
                            <ColBtn
                              key={c.column}
                              label={c.column}
                              active={config.outcome === c.column}
                              onClick={() => {
                                const allVals = data
                                  ? [...new Set(data.map((r) => String(r[c.column])))]
                                  : [];
                                const positiveKeywords = ["1", "true", "yes", "approved",
                                  "hired", "flagged", "selected", "granted", "allowed", "accepted"];
                                const guessedPositive =
                                  allVals.find((v) => positiveKeywords.includes(v.toLowerCase())) ??
                                  allVals[0] ?? "1";
                                setConfig((p) => ({ ...p, outcome: c.column, positiveOutcome: guessedPositive }));
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Positive outcome input + live match preview */}
                  <div className="flex flex-col gap-2 pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                        Positive outcome value
                      </label>
                      <input
                        value={config.positiveOutcome}
                        onChange={(e) =>
                          setConfig((p) => ({ ...p, positiveOutcome: e.target.value }))
                        }
                        className="w-24 px-3 py-1.5 rounded-md border border-border
                                   bg-muted text-sm font-mono text-foreground
                                   focus:outline-none focus:ring-2 focus:ring-[#caff3d]/40
                                   focus:border-[#caff3d] transition-all duration-150"
                      />
                      <p className="text-xs text-muted-foreground">
                        e.g.{" "}
                        <code className="font-mono bg-muted px-1 rounded">1</code>,{" "}
                        <code className="font-mono bg-muted px-1 rounded">hired</code>,{" "}
                        <code className="font-mono bg-muted px-1 rounded">true</code>
                      </p>
                    </div>

                    {/* Live match preview — catches wrong column/value BEFORE running the full analysis */}
                    {config.outcome && config.positiveOutcome && data && (() => {
                      const matches = data.filter(
                        (r) => String(r[config.outcome]) === String(config.positiveOutcome)
                      ).length;
                      const pct = ((matches / data.length) * 100).toFixed(1);
                      const isZero = matches === 0;
                      return (
                        <div
                          className={[
                            "flex items-center gap-2 px-3 py-2 rounded-md text-xs border",
                            isZero
                              ? "bg-[#ff6b7a]/8 border-[#ff6b7a]/20 text-[#ff6b7a]"
                              : "bg-[#caff3d]/6 border-[#caff3d]/20 text-foreground",
                          ].join(" ")}
                        >
                          {isZero ? (
                            <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#caff3d] flex-shrink-0" />
                          )}
                          {isZero ? (
                            <span>
                              <strong>No rows match</strong> — approval rates will show 0%.
                              Check the outcome column and value above.
                            </span>
                          ) : (
                            <span>
                              <strong className="font-mono">{matches.toLocaleString()}</strong> of{" "}
                              <strong className="font-mono">{data.length.toLocaleString()}</strong>{" "}
                              rows are positive outcomes ({pct}%)
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* ── Protected attributes card ── */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <CardHeader
                  icon={<Scale className="w-3.5 h-3.5" />}
                  title="Protected attributes"
                  subtitle="Characteristics that should not influence your model's decisions"
                  right={
                    config.protected.length > 0 ? (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#caff3d]/15 text-black border border-[#caff3d]/30">
                        {config.protected.length} selected
                      </span>
                    ) : undefined
                  }
                />
                <div className="p-6 space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Select columns representing gender, age, race, or ZIP code.
                    Columns tagged{" "}
                    <span className="font-semibold text-black">auto</span> are
                    suggested by FairGuard&apos;s detection engine.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data &&
                      Object.keys(data[0] || {})
                        .filter((c) => c !== config.outcome)
                        .map((col) => (
                          <ColBtn
                            key={col}
                            label={col}
                            active={config.protected.includes(col)}
                            suggested={detected?.protected_columns?.some(
                              (p) => p.column === col
                            )}
                            onClick={() => toggleProtected(col)}
                          />
                        ))}
                  </div>

                  {config.protected.length > 0 && (
                    <div className="flex items-center gap-2 pt-3 border-t border-border">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#caff3d]" />
                      <span className="text-xs text-muted-foreground">
                        Auditing:{" "}
                        <code className="font-mono text-foreground text-xs">
                          {config.protected.join(", ")}
                        </code>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Run button row ── */}
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-muted-foreground">
                  {config.protected.length > 0 && config.outcome
                    ? `Running 5 metrics across ${config.protected.length} attribute${config.protected.length !== 1 ? "s" : ""}`
                    : "Select outcome and at least one protected attribute to continue"}
                </p>

                {/* Refold-style split button */}
                <button
                  onClick={runAnalysis}
                  disabled={!config.outcome || !config.protected.length}
                  className="flex items-stretch rounded-md overflow-hidden
                             disabled:opacity-40 disabled:cursor-not-allowed
                             hover:shadow-md transition-shadow duration-150 group"
                >
                  <span className="bg-[#caff3d] px-3 flex items-center justify-center group-hover:bg-[#b8f020] transition-colors">
                    <Zap className="w-3.5 h-3.5 text-black" />
                  </span>
                  <span className="bg-black text-white text-xs font-bold tracking-wider uppercase px-5 py-2.5 flex items-center gap-2 group-hover:bg-[#1a1a1a] transition-colors">
                    Analyze for bias
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ STEP 2: Analyzing ═════════════════════════════════ */}
          {step === 2 && (
            <motion.div
              key="analyzing"
              {...fadeUp}
              className="flex flex-col items-center justify-center py-24 gap-8"
            >
              {/* Spinner ring */}
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-muted flex items-center justify-center">
                  <Shield className="w-7 h-7 text-muted-foreground/40" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#caff3d] animate-spin" />
              </div>

              {/* Text */}
              <div className="text-center max-w-sm">
                <h2 className="text-xl font-semibold text-foreground">
                  Analyzing {data?.length?.toLocaleString()} rows
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Running 5 fairness metrics across{" "}
                  <span className="font-medium text-foreground">
                    {config.protected.length}
                  </span>{" "}
                  protected attribute
                  {config.protected.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Animated checklist */}
              <div className="flex flex-col gap-2.5 w-72">
                {ANALYSIS_STEPS.map((label, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.28, duration: 0.25 }}
                    className="flex items-center gap-2.5"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.28 + 0.1, type: "spring" }}
                      className="w-1.5 h-1.5 rounded-full bg-[#caff3d] flex-shrink-0"
                    />
                    <span className="text-xs text-muted-foreground">
                      {label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ STEP 3: Results ═══════════════════════════════════ */}
          {step === 3 && results && (
            <motion.div key="results" {...fadeUp}>
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-5"
              >

                {/* ── VERDICT CARD ─────────────────────────────────── */}
                {(() => {
                  const score = results.fairness_score?.score ?? 0;
                  const label = results.fairness_score?.label ?? "Unknown";
                  const biased = score < 70;
                  const scoreColor = score >= 70 ? "#caff3d" : score >= 50 ? "#ff8c42" : "#ff6b7a";
                  return (
                    <motion.div variants={staggerChild}>
                      <div className="bg-black rounded-xl overflow-hidden border border-white/8">
                        <div className="flex items-center gap-6 px-6 py-5 flex-wrap">
                          <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center" style={{ borderColor: scoreColor }}>
                              <span className="text-xl font-black font-mono" style={{ color: scoreColor }}>{score}</span>
                            </div>
                            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Score</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-lg font-black tracking-tight" style={{ color: scoreColor }}>
                                {biased ? "⚠ Bias Detected" : "✓ Passes Fairness Checks"}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border" style={{ color: scoreColor, borderColor: `${scoreColor}40`, backgroundColor: `${scoreColor}12` }}>
                                {label}
                              </span>
                            </div>
                            <p className="text-sm text-white/50">
                              {biased
                                ? "Statistically significant disparate impact detected. Legal exposure under EU AI Act Art. 9 and EEOC 80% rule."
                                : "No statistically significant bias detected across monitored protected attributes at current thresholds."}
                            </p>
                          </div>
                          <div className="flex gap-5 flex-shrink-0">
                            <div className="text-center">
                              <p className="text-xl font-black font-mono text-white">{results.dataset_info?.total_rows?.toLocaleString()}</p>
                              <p className="text-[10px] text-white/40 uppercase tracking-wider">Rows</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xl font-black font-mono text-white">{Object.keys(results.per_attribute || {}).length}</p>
                              <p className="text-[10px] text-white/40 uppercase tracking-wider">Attributes</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xl font-black font-mono" style={{ color: scoreColor }}>
                                {(Object.values(results.per_attribute || {})[0])?.disparate_impact?.ratio?.toFixed(2) ?? "N/A"}
                              </p>
                              <p className="text-[10px] text-white/40 uppercase tracking-wider">DI Ratio</p>
                            </div>
                          </div>
                        </div>
                        {/* Meta row */}
                        <div className="flex items-center gap-4 px-6 py-2.5 border-t border-white/6 flex-wrap">
                          {results.domain && (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-white/40">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#caff3d]" />
                              {results.domain.icon} {results.domain.label}
                            </span>
                          )}
                          {registryInfo && (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-white/40">
                              <Database className="w-3 h-3 text-[#caff3d]" />
                              {registryInfo.status === "success" ? `Vertex AI · ID: ${registryInfo.modelId?.split("/").pop()}` : registryInfo.status === "skipped" ? "Demo Mode" : "Registry Failed"}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* ── 4-TAB NAV ────────────────────────────────────── */}
                <motion.div variants={staggerChild}>
                  <div className="flex items-center gap-0 border-b border-border">
                    {[
                      { id: "overview", label: "Overview",  icon: <BarChart3 className="w-3.5 h-3.5" /> },
                      { id: "evidence", label: "Evidence",  icon: <Network className="w-3.5 h-3.5" /> },
                      { id: "legal",    label: "Legal",     icon: <Scale className="w-3.5 h-3.5" /> },
                      { id: "fixit",    label: "Fix It",    icon: <Sparkles className="w-3.5 h-3.5" />, highlight: (results?.fairness_score?.score ?? 100) < 75 },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={[
                          "flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-150",
                          activeTab === tab.id ? "border-[#caff3d] text-foreground" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                          tab.highlight && activeTab !== tab.id ? "text-[#ff8c42]" : "",
                        ].join(" ")}
                      >
                        {tab.icon}{tab.label}
                        {tab.highlight && <span className="w-1.5 h-1.5 rounded-full bg-[#ff8c42]" />}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* ── TAB: OVERVIEW ─────────────────────────────────── */}
                {activeTab === "overview" && (
                  <motion.div key="tab-overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center justify-center gap-3">
                        <ScoreGauge score={results.fairness_score?.score || 0} label={results.fairness_score?.label} />
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Fairness Score</p>
                      </div>
                      <div className="md:col-span-3 grid grid-cols-2 gap-4">
                        <MetricCard icon={<Database className="w-4 h-4" />} title="Dataset Size" value={`${results.dataset_info?.total_rows?.toLocaleString()} rows`} subtitle={`${results.dataset_info?.total_columns} columns`} />
                        <div className="space-y-1">
                          <MetricCard icon={<Scale className="w-4 h-4" />} title="Disparate Impact" value={(Object.values(results.per_attribute || {})[0])?.disparate_impact?.ratio?.toFixed(4) ?? "N/A"} severity={(Object.values(results.per_attribute || {})[0])?.disparate_impact?.severity} subtitle="EEOC 80% Rule threshold" />
                          {(() => { const sig = Object.values(results.per_attribute || {})[0]?.disparate_impact?.statistical_significance; if (!sig) return null; return (<p className={`text-[10px] font-mono px-3 py-1 rounded border ${sig.is_highly_significant ? "text-red-400 bg-red-500/5 border-red-500/20" : sig.is_significant ? "text-orange-400 bg-orange-500/5 border-orange-500/20" : "text-muted-foreground bg-muted border-border"}`}>{sig.p_value_display} · Fisher&apos;s Exact · n={sig.sample_size}</p>); })()}
                        </div>
                        <MetricCard icon={<BarChart3 className="w-4 h-4" />} title="Demographic Parity" value={(((Object.values(results.per_attribute || {})[0])?.demographic_parity?.difference || 0) * 100).toFixed(1) + "%"} severity={(Object.values(results.per_attribute || {})[0])?.demographic_parity?.severity} subtitle="Gap between group approval rates" />
                        <MetricCard icon={<Network className="w-4 h-4" />} title="Proxy Variables" value={String(results.proxies?.length || 0)} valueClass={(results.proxies?.length || 0) > 0 ? "text-[#0057ff]" : undefined} severity={results.proxies?.length > 0 ? "WARNING" : "OK"} subtitle="Features encoding protected attrs" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 items-start">
                      <BiasFingerprint fingerprint={results.fingerprint} />
                      {Object.entries(results.per_attribute || {}).map(([attr, metrics]) => {
                        const diRates = metrics.disparate_impact?.rates || {};
                        const dpdRates = metrics.demographic_parity?.rates || {};
                        const ratesObj = Object.keys(diRates).length > 0 ? diRates : dpdRates;
                        const chartData = Object.entries(ratesObj).map(([group, rate]) => ({ group, rate }));
                        if (chartData.length === 0) return null;
                        return <BiasChart key={attr} title={`Approval rates · ${attr}`} data={chartData} />;
                      })}
                    </div>
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-black">
                        <div className="w-7 h-7 rounded-lg bg-[#caff3d] flex items-center justify-center flex-shrink-0"><Sparkles className="w-3.5 h-3.5 text-black" /></div>
                        <div className="flex-1"><p className="text-sm font-semibold text-white">AI Explanation</p><p className="text-xs text-white/50 mt-0.5">Powered by Gemini</p></div>
                        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#9a77f8] animate-pulse" /><span className="text-xs text-white/40 font-medium">Live</span></div>
                      </div>
                      <div className="px-6 py-5">
                        {explanation ? (
                          <div className="space-y-4">
                            <p className="text-base font-semibold text-foreground leading-snug whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: renderMarkdown(explanation.summary) }} />
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: renderMarkdown(explanation.explanation) }} />
                            {explanation.legal_references?.length > 0 && (
                              <div className="pt-4 border-t border-border">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Legal references</p>
                                <div className="flex flex-wrap gap-2">
                                  {explanation.legal_references.map((r, i) => (<span key={i} className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-[#0057ff]/8 text-[#0057ff] border border-[#0057ff]/20"><Scale className="w-3 h-3" />{r}</span>))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 py-4">
                            <div className="relative w-8 h-8 flex-shrink-0"><div className="absolute inset-0 rounded-full border-2 border-muted" /><div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#9a77f8] animate-spin" /></div>
                            <div><p className="text-sm font-medium text-foreground">Generating explanation</p><p className="text-xs text-muted-foreground mt-0.5">Gemini is analyzing your results...</p></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── TAB: EVIDENCE ─────────────────────────────────── */}
                {activeTab === "evidence" && (
                  <motion.div key="tab-evidence" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-5">
                    <BiasFingerprint fingerprint={results.fingerprint} />
                    {Object.entries(results.per_attribute || {}).map(([attr, metrics]) => {
                      const diRates = metrics.disparate_impact?.rates || {};
                      const dpdRates = metrics.demographic_parity?.rates || {};
                      const ratesObj = Object.keys(diRates).length > 0 ? diRates : dpdRates;
                      const chartData = Object.entries(ratesObj).map(([group, rate]) => ({ group, rate }));
                      if (chartData.length === 0) return null;
                      return <BiasChart key={attr} title={`Approval rates · ${attr}`} data={chartData} />;
                    })}
                    {results.proxies?.length > 0 && (
                      <div className="bg-card rounded-xl border border-border overflow-hidden">
                        <CardHeader icon={<AlertTriangle className="w-3.5 h-3.5" />} title="Proxy Variables Detected" subtitle="These features may indirectly encode protected attributes" right={<span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#ff8c42]/10 text-[#ff8c42] border border-[#ff8c42]/25">{results.proxies.length} found</span>} />
                        <div className="divide-y divide-border">
                          {results.proxies.map((p, i) => {
                            const sev = getSev(p.score > 0.6 ? "HIGH" : "MODERATE");
                            return (
                              <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <code className="text-sm font-semibold text-foreground bg-muted px-2 py-0.5 rounded">{p.feature}</code>
                                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                  <code className={`text-sm font-medium px-2 py-0.5 rounded border ${sev.bg} ${sev.border} ${sev.text}`}>{p.protected_attribute}</code>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                  <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full ${sev.bar}`} style={{ width: `${p.score * 100}%` }} /></div>
                                  <span className={`text-xs font-mono font-semibold w-8 text-right ${sev.text}`}>{p.score.toFixed(2)}</span>
                                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${sev.badge}`}>{p.severity}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── TAB: LEGAL ────────────────────────────────────── */}
                {activeTab === "legal" && (
                  <motion.div key="tab-legal" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-5">
                    <FairnessDebtCard debt={results.fairness_debt} />
                    <RegulationPanel auditResults={results} />
                    {results.human_cost && <HumanCostCard humanCost={results.human_cost} />}
                    {(regulatoryNews || newsLoading) && <RegulatoryNews news={regulatoryNews} loading={newsLoading} />}
                  </motion.div>
                )}

                {/* ── TAB: FIX IT ───────────────────────────────────── */}
                {activeTab === "fixit" && (
                  <motion.div key="tab-fixit" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-5">
                    {(results?.fairness_score?.score ?? 100) < 75 ? (
                      <>
                        {(remediationCode || remediationLoading) && <RemediationCode code={remediationCode} loading={remediationLoading} />}
                        <CertificateCard auditResults={results} />
                      </>
                    ) : (
                      <div className="space-y-5">
                        <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-[#caff3d]/8 border border-[#caff3d]/20">
                          <CheckCircle2 className="w-5 h-5 text-[#65a30d] flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">System passes fairness thresholds</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Score ≥ 75 — no remediation code needed. Generate a compliance certificate below.</p>
                          </div>
                        </div>
                        <CertificateCard auditResults={results} />
                      </div>
                    )}
                  </motion.div>
                )}

              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}