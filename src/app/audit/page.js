// app/audit/page.tsx
"use client";

import { useState, useCallback } from "react";
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
              : "bg-[#caff3d]/15 text-black",
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

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AuditPage() {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [detected, setDetected] = useState(null);
  const [domainInfo, setDomainInfo] = useState(null);
  const [config, setConfig] = useState({
    outcome: "",
    protected: [],
    positiveOutcome: "1",
    qualColumn: "",
  });
  const [results, setResults] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [compliance, setCompliance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const processData = useCallback(
    async (parsedData) => {
      setData(parsedData);
      try {
        const res = await fetch("/api/audit/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: parsedData.slice(0, 100) }),
        });
        const det = await res.json();
        setDetected(det.detected);
        if (det.domain) setDomainInfo(det.domain);
        setConfig((prev) => ({
          ...prev,
          outcome: det.detected?.decision_columns?.[0]?.column || "",
          protected: (det.detected?.protected_columns || []).map(
            (c) => c.column
          ),
        }));
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

      const faf = (url, body, cb) =>
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
          .then((r) => r.json())
          .then(cb)
          .catch(() => {});

      faf("/api/audit/explain", { metrics: json.results }, (r) =>
        setExplanation(r.explanation)
      );
      faf("/api/audit/compliance", { metrics: json.results }, (r) =>
        setCompliance(r.compliance)
      );
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
      <div className="max-w-5xl mx-auto px-6 py-10">

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
                  Bias Audit
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
                <div className="flex items-start gap-3 px-4 py-3.5 rounded-lg bg-[#caff3d]/8 border border-[#caff3d]/20">
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
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted border border-border w-fit">
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
                  <span className="w-1.5 h-1.5 rounded-full bg-[#caff3d]" />
                  <span className="text-[11px] font-semibold text-[#caff3d]">
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
                  <div className="flex flex-wrap gap-2">
                    {(detected?.decision_columns || []).map((c) => (
                      <ColBtn
                        key={c.column}
                        label={c.column}
                        active={config.outcome === c.column}
                        suggested
                        onClick={() =>
                          setConfig((p) => ({ ...p, outcome: c.column }))
                        }
                      />
                    ))}
                    {(detected?.feature_columns || [])
                      .filter((c) => c.unique_count <= 10)
                      .filter(
                        (c) =>
                          !detected?.decision_columns?.some(
                            (d) => d.column === c.column
                          )
                      )
                      .map((c) => (
                        <ColBtn
                          key={c.column}
                          label={c.column}
                          active={config.outcome === c.column}
                          onClick={() =>
                            setConfig((p) => ({ ...p, outcome: c.column }))
                          }
                        />
                      ))}
                  </div>

                  {/* Positive outcome input */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      Positive outcome value
                    </label>
                    <input
                      value={config.positiveOutcome}
                      onChange={(e) =>
                        setConfig((p) => ({
                          ...p,
                          positiveOutcome: e.target.value,
                        }))
                      }
                      className="w-24 px-3 py-1.5 rounded-md border border-border
                                 bg-muted text-sm font-mono text-foreground
                                 focus:outline-none focus:ring-2 focus:ring-[#caff3d]/40
                                 focus:border-[#caff3d] transition-all duration-150"
                    />
                    <p className="text-xs text-muted-foreground">
                      e.g.{" "}
                      <code className="font-mono bg-muted px-1 rounded">
                        1
                      </code>
                      ,{" "}
                      <code className="font-mono bg-muted px-1 rounded">
                        hired
                      </code>
                      ,{" "}
                      <code className="font-mono bg-muted px-1 rounded">
                        true
                      </code>
                    </p>
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

                {/* ── Domain tag ──────────────────────────────────── */}
                {results.domain && (
                  <motion.div
                    variants={staggerChild}
                    className="flex items-center gap-2"
                  >
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted border border-border text-xs font-medium text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#caff3d]" />
                      {results.domain.icon} {results.domain.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Domain auto-detected from column names
                    </span>
                  </motion.div>
                )}

                {/* ── Row 1: Score gauge + 4 metric cards ─────────── */}
                <motion.div
                  variants={staggerChild}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                  {/* Score */}
                  <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center justify-center gap-3">
                    <ScoreGauge
                      score={results.fairness_score?.score || 0}
                      label={results.fairness_score?.label}
                    />
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                      Fairness Score
                    </p>
                  </div>

                  {/* 4 metric cards — 3 cols */}
                  <div className="md:col-span-3 grid grid-cols-2 gap-4">
                    <MetricCard
                      icon={<Database className="w-4 h-4" />}
                      title="Dataset Size"
                      value={`${results.dataset_info?.total_rows?.toLocaleString()} rows`}
                      subtitle={`${results.dataset_info?.total_columns} columns`}
                    />
                    <MetricCard
                      icon={<Scale className="w-4 h-4" />}
                      title="Disparate Impact"
                      value={
                        (Object.values(results.per_attribute || {})[0])
                          ?.disparate_impact?.ratio?.toFixed(4) ?? "N/A"
                      }
                      severity={
                        (Object.values(results.per_attribute || {})[0])
                          ?.disparate_impact?.severity
                      }
                      subtitle="EEOC 80% Rule threshold"
                    />
                    <MetricCard
                      icon={<BarChart3 className="w-4 h-4" />}
                      title="Demographic Parity"
                      value={
                        (
                          ((Object.values(results.per_attribute || {})[0])
                            ?.demographic_parity?.difference || 0) * 100
                        ).toFixed(1) + "%"
                      }
                      severity={
                        (Object.values(results.per_attribute || {})[0])
                          ?.demographic_parity?.severity
                      }
                      subtitle="Gap between group approval rates"
                    />
                    <MetricCard
                      icon={<Network className="w-4 h-4" />}
                      title="Proxy Variables"
                      value={String(results.proxies?.length || 0)}
                      severity={
                        results.proxies?.length > 0 ? "WARNING" : "OK"
                      }
                      subtitle="Features encoding protected attrs"
                    />
                  </div>
                </motion.div>

                {/* ── Row 2: Fingerprint + Bar charts ─────────────── */}
                <motion.div
                  variants={staggerChild}
                  className="grid md:grid-cols-2 gap-4"
                >
                  <BiasFingerprint fingerprint={results.fingerprint} />
                  {Object.entries(results.per_attribute || {}).map(
                    ([attr, metrics]) => (
                      <BiasChart
                        key={attr}
                        title={`Approval rates · ${attr}`}
                        data={Object.entries(
                          metrics.disparate_impact?.rates || {}
                        ).map(([group, rate]) => ({ group, rate }))}
                      />
                    )
                  )}
                </motion.div>

                {/* ── Row 3: Fairness Debt ─────────────────────────── */}
                <motion.div variants={staggerChild}>
                  <FairnessDebtCard debt={results.fairness_debt} />
                </motion.div>

                {/* ── Row 4: Proxy variables ───────────────────────── */}
                {results.proxies?.length > 0 && (
                  <motion.div variants={staggerChild}>
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                      <CardHeader
                        icon={<AlertTriangle className="w-3.5 h-3.5" />}
                        title="Proxy Variables Detected"
                        subtitle="These features may indirectly encode protected attributes"
                        right={
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#ff8c42]/10 text-[#ff8c42] border border-[#ff8c42]/25">
                            {results.proxies.length} found
                          </span>
                        }
                      />

                      <div className="divide-y divide-border">
                        {results.proxies.map((p, i) => {
                          const sev = getSev(
                            p.score > 0.6 ? "HIGH" : "MODERATE"
                          );
                          return (
                            <div
                              key={i}
                              className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
                            >
                              {/* Feature → protected */}
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <code className="text-sm font-semibold text-foreground bg-muted px-2 py-0.5 rounded">
                                  {p.feature}
                                </code>
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                <code
                                  className={`text-sm font-medium px-2 py-0.5 rounded border ${sev.bg} ${sev.border} ${sev.text}`}
                                >
                                  {p.protected_attribute}
                                </code>
                              </div>

                              {/* Score bar + badge */}
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${sev.bar}`}
                                    style={{ width: `${p.score * 100}%` }}
                                  />
                                </div>
                                <span
                                  className={`text-xs font-mono font-semibold w-8 text-right ${sev.text}`}
                                >
                                  {p.score.toFixed(2)}
                                </span>
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${sev.badge}`}
                                >
                                  {p.severity}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Row 5: AI Explanation ────────────────────────── */}
                <motion.div variants={staggerChild}>
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    {/* Distinct header for AI section */}
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-black">
                      <div className="w-7 h-7 rounded-lg bg-[#caff3d] flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">
                          AI Explanation
                        </p>
                        <p className="text-xs text-white/50 mt-0.5">
                          Powered by Gemini
                        </p>
                      </div>
                      {/* Purple dot — Gemini color */}
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9a77f8] animate-pulse" />
                        <span className="text-xs text-white/40 font-medium">
                          Live
                        </span>
                      </div>
                    </div>

                    <div className="px-6 py-5">
                      {explanation ? (
                        <div className="space-y-4">
                          <p className="text-base font-semibold text-foreground leading-snug">
                            {explanation.summary}
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {explanation.explanation}
                          </p>

                          {explanation.legal_references?.length > 0 && (
                            <div className="pt-4 border-t border-border">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">
                                Legal references
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {explanation.legal_references.map(
                                  (r, i) => (
                                    <span
                                      key={i}
                                      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border"
                                    >
                                      <Scale className="w-3 h-3" />
                                      {r}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Loading state */
                        <div className="flex items-center gap-4 py-4">
                          <div className="relative w-8 h-8 flex-shrink-0">
                            <div className="absolute inset-0 rounded-full border-2 border-muted" />
                            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#9a77f8] animate-spin" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Generating explanation
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Gemini is analyzing your results...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}