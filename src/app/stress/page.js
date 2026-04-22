// app/stress/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Papa from "papaparse";
import { motion, AnimatePresence } from "framer-motion";
import BiasChart from "@/components/bias-chart";
import MetricCard from "@/components/metric-card";
import {
  Loader2,
  Zap,
  FlaskConical,
  RotateCcw,
  Cpu,
  Users,
  Target,
  Hash,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Scale,
  ArrowRight,
  Upload,
  Database,
  FileText,
  Trash2,
  Info,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const DECISION_TYPES = [
  {
    id: "hiring",
    label: "Hiring",
    sublabel: "Resume Screening",
    description: "Does the AI treat Brian and Lakisha equally with the same CV?",
  },
  {
    id: "lending",
    label: "Lending",
    sublabel: "Loan & Credit",
    description: "Same financial profile, different names — same approval rate?",
  },
  {
    id: "insurance",
    label: "Insurance",
    sublabel: "Underwriting",
    description: "Identical risk profiles across demographic groups.",
  },
  {
    id: "content_moderation",
    label: "Moderation",
    sublabel: "Content Review",
    description: "Same post content — is it flagged differently by group?",
  },
];

const DEMOGRAPHIC_AXES = [
  { id: "gender",        label: "Gender",             desc: "Male / Female / Non-binary" },
  { id: "age_group",     label: "Age Group",           desc: "20s / 30s / 40s / 50s+" },
  { id: "location_type", label: "Location",            desc: "Urban / Rural / Suburban" },
];

const CANDIDATE_COUNTS = [
  { value: 30,  label: "30",  sublabel: "Quick test" },
  { value: 60,  label: "60",  sublabel: "Standard"   },
  { value: 100, label: "100", sublabel: "Deep probe"  },
];

const AI_MODELS = [
  { id: "gemini",    label: "Gemini 2.5 Flash", badge: "Google", accentColor: "#0057ff" },
  { id: "llama-8b",  label: "Llama 3.1 8B",     badge: "Groq",   accentColor: "#ff8c42" },
  { id: "llama-70b", label: "Llama 3.3 70B",     badge: "Groq",   accentColor: "#9a77f8" },
];

// ─── Animation presets ────────────────────────────────────────────────────────

const fadeUp = {
  initial:    { opacity: 0, y: 14 },
  animate:    { opacity: 1, y: 0  },
  exit:       { opacity: 0, y: -14 },
  transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const staggerChild = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22 } },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/* Numbered section header */
function SectionStep({
  number,
  icon,
  title,
  subtitle,
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
      {/* Step number — blue accent */}
      <div className="flex items-stretch rounded-md overflow-hidden flex-shrink-0">
        <div className="bg-[#0057ff] w-7 h-7 flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">{number}</span>
        </div>
        <div className="bg-black w-0.5" />
      </div>

      <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <span className="text-muted-foreground">{icon}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

/* Inline alert */
function Alert({ message }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-lg border bg-[#ff6b7a]/8 border-[#ff6b7a]/20">
      <XCircle className="w-4 h-4 text-[#ff6b7a] mt-0.5 flex-shrink-0" />
      <p className="text-sm text-[#ff6b7a]">{message}</p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function StressTestPage() {
  const [decisionType,   setDecisionType]   = useState("hiring");
  const [axes,           setAxes]           = useState(["gender"]);
  const [candidateCount, setCandidateCount] = useState(30);
  const [loading,        setLoading]        = useState(false);
  const [results,        setResults]        = useState(null);
  const [error,          setError]          = useState(null);
  const [selectedModel,  setSelectedModel]  = useState("gemini");

  // ── Data source state ──────────────────────────────────────────────────────
  const [sourceDataInfo, setSourceDataInfo] = useState(null); // { rowCount, cols, from: "audit"|"upload" }
  const fileInputRef = useRef(null);

  // Check sessionStorage for audit-imported data on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("fairguard_source_data");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSourceDataInfo({
            rowCount: parsed.length,
            cols: Object.keys(parsed[0] || {}).length,
            from: "audit",
          });
        }
      }
    } catch {}
  }, []);

  const handleCsvUpload = useCallback((e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        if (!Array.isArray(res.data) || res.data.length === 0) return;
        try {
          sessionStorage.setItem("fairguard_source_data", JSON.stringify(res.data.slice(0, 200)));
          setSourceDataInfo({
            rowCount: res.data.length,
            cols: Object.keys(res.data[0] || {}).length,
            from: "upload",
          });
        } catch {}
      },
    });
    // Reset input so the same file can be re-selected
    e.target.value = "";
  }, []);

  const clearSourceData = useCallback(() => {
    try { sessionStorage.removeItem("fairguard_source_data"); } catch {}
    setSourceDataInfo(null);
  }, []);

  const toggleAxis = (id) =>
    setAxes((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );

  const runTest = async () => {
    if (axes.length === 0) {
      setError("Select at least one demographic axis.");
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);

    let sourceData = null;
    try {
      const stored = sessionStorage.getItem("fairguard_source_data");
      if (stored) sourceData = JSON.parse(stored);
    } catch(e) {}

    try {
      const res = await fetch("/api/stress/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision_type:     decisionType,
          candidate_count:   candidateCount,
          demographic_axes:  axes,
          ai_model:          selectedModel,
          source_data:       sourceData,
        }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setResults(json);
    } catch (e) {
      setError(`Stress test failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const usedRealModel = results?.analysis?.summary?.used_real_model;
  const modelLabel    = results?.analysis?.summary?.model_label ?? selectedModel;
  const selectedModelMeta = AI_MODELS.find((m) => m.id === selectedModel);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Page header ───────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-4">
            {/* Icon block — blue for stress test (analytical/probing) */}
            <div className="flex items-stretch rounded-md overflow-hidden flex-shrink-0 mt-0.5">
              <div className="bg-[#caff3d] w-10 h-10 flex items-center justify-center">
                <FlaskConical className="w-4.5 h-4.5 text-black" />
              </div>
              <div className="bg-black w-1" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Stress Test
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5 max-w-lg">
                Counterfactual probing — identical profiles, different names.
                Does the AI treat Brian and Lakisha equally?
              </p>
            </div>
          </div>

          {results && (
            <button
              onClick={() => setResults(null)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                         font-medium text-muted-foreground border border-border bg-card
                         hover:bg-muted hover:text-foreground transition-all duration-150"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Run new test
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">

          {/* ══════════════════════════════════════════════════════
              CONFIG PANEL
          ══════════════════════════════════════════════════════ */}
          {!results && (
            <motion.div key="config" {...fadeUp} className="space-y-4">

              {/* ── 0. Data source ──────────────────────────────── */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                  {/* Step 0 marker */}
                  <div className="flex items-stretch rounded-md overflow-hidden flex-shrink-0">
                    <div className="bg-[#9a77f8] w-7 h-7 flex items-center justify-center">
                      <Database className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-black w-0.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Data source</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Optionally probe real rejected profiles from your audit — or use synthetic
                    </p>
                  </div>
                  {sourceDataInfo && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#9a77f8]/10 text-[#9a77f8] border border-[#9a77f8]/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {sourceDataInfo.from === "audit" ? "From audit" : "Uploaded"}
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  {sourceDataInfo ? (
                    /* Loaded data pill */
                    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-[#9a77f8]/6 border border-[#9a77f8]/20">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#9a77f8] flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {sourceDataInfo.rowCount.toLocaleString()} rows ·{" "}
                            {sourceDataInfo.cols} columns
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {sourceDataInfo.from === "audit"
                              ? "Imported from Audit Mode — top rejected profiles will be used as base profiles"
                              : "Uploaded CSV — real rejected rows become counterfactual base profiles"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={clearSourceData}
                        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-[#ff6b7a] transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear
                      </button>
                    </div>
                  ) : (
                    /* Upload prompt */
                    <>
                      <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-muted/50 border border-border">
                        <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          <span className="font-semibold text-foreground">Using synthetic profiles</span> — 5
                          hardcoded base CVs with varying qualifications. Or upload a CSV / run an
                          Audit first to probe real rejected candidates.
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed
                                     border-[#9a77f8]/40 bg-[#9a77f8]/4 text-sm font-medium text-[#9a77f8]
                                     hover:border-[#9a77f8]/70 hover:bg-[#9a77f8]/8 transition-all duration-150"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Upload CSV
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv"
                          className="hidden"
                          onChange={handleCsvUpload}
                        />
                        <span className="text-xs text-muted-foreground">
                          or go to{" "}
                          <a href="/audit" className="font-semibold text-foreground underline underline-offset-2 hover:text-[#9a77f8] transition-colors">
                            Audit Mode
                          </a>
                          {" "}first — it auto-saves data here
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <SectionStep
                  number={1}
                  icon={<Target className="w-3.5 h-3.5" />}
                  title="What are you testing?"
                  subtitle="Choose the AI decision domain to probe"
                />
                <div className="p-5">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {DECISION_TYPES.map((t) => {
                      const active = decisionType === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setDecisionType(t.id)}
                          className={[
                            "flex flex-col items-start gap-2 p-4 rounded-lg border-2",
                            "text-left transition-all duration-150 cursor-pointer group",
                            active
                              ? "border-[#0057ff]/50 bg-[#0057ff]/6 shadow-sm"
                              : "border-border bg-background hover:border-[#0057ff]/30 hover:bg-[#0057ff]/3",
                          ].join(" ")}
                        >
                          {/* Labels */}
                          <div>
                            <p className={`text-sm font-semibold leading-none ${active ? "text-[#0057ff]" : "text-foreground"}`}>
                              {t.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {t.sublabel}
                            </p>
                          </div>

                          {/* Description — shown on active */}
                          <AnimatePresence>
                            {active && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-[11px] text-[#0057ff]/70 leading-relaxed"
                              >
                                {t.description}
                              </motion.p>
                            )}
                          </AnimatePresence>

                          {/* Active check */}
                          {active && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0057ff] ml-auto self-end" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── 2. Demographics ───────────────────────────── */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <SectionStep
                  number={2}
                  icon={<Users className="w-3.5 h-3.5" />}
                  title="Demographics to vary"
                  subtitle="Which attributes will be swapped across identical profiles"
                  
                />
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {DEMOGRAPHIC_AXES.map((a) => {
                      const active = axes.includes(a.id);
                      return (
                        <button
                          key={a.id}
                          onClick={() => toggleAxis(a.id)}
                          className={[
                            "flex items-center gap-3 px-4 py-3 rounded-lg border-2",
                            "text-left transition-all duration-150 cursor-pointer flex-1",
                            active
                              ? "border-[#caff3d]/60 bg-[#caff3d]/8 shadow-sm"
                              : "border-border bg-background hover:border-[#caff3d]/30",
                          ].join(" ")}
                        >
                          {/* Checkbox */}
                          <div
                            className={[
                              "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                              active
                                ? "bg-[#caff3d] border-[#caff3d]"
                                : "border-border bg-background",
                            ].join(" ")}
                          >
                            {active && (
                              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                <path
                                  d="M1 3L3 5L7 1"
                                  stroke="black"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>

                          <div>
                            <p className={`text-sm font-semibold ${active ? "text-foreground" : "text-foreground"}`}>
                              {a.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {a.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {axes.length > 0 && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#caff3d]" />
                      <span className="text-xs text-muted-foreground">
                        Probing:{" "}
                        <code className="font-mono text-foreground text-xs">
                          {axes.join(", ")}
                        </code>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── 3 & 4: Count + Model — side by side ──────── */}
              <div className="grid sm:grid-cols-2 gap-4">

                {/* Profile count */}
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <SectionStep
                    number={3}
                    icon={<Hash className="w-3.5 h-3.5" />}
                    title="Test profiles"
                    subtitle="Profiles per demographic group"
                  />
                  <div className="p-5 space-y-3">
                    <div className="flex gap-2">
                      {CANDIDATE_COUNTS.map((c) => {
                        const active = candidateCount === c.value;
                        return (
                          <button
                            key={c.value}
                            onClick={() => setCandidateCount(c.value)}
                            className={[
                              "flex-1 flex flex-col items-center gap-0.5 py-3 rounded-lg border-2",
                              "transition-all duration-150 cursor-pointer",
                              active
                                ? "border-[#caff3d]/60 bg-[#caff3d]/8"
                                : "border-border bg-background hover:border-[#caff3d]/30",
                            ].join(" ")}
                          >
                            <span className={`text-lg font-bold font-mono leading-none ${active ? "text-black" : "text-foreground"}`}>
                              {c.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {c.sublabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Larger counts take longer but produce stronger statistical evidence.
                    </p>
                  </div>
                </div>

                {/* AI model */}
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <SectionStep
                    number={4}
                    icon={<Cpu className="w-3.5 h-3.5" />}
                    title="AI model to probe"
                    subtitle="Which model receives the test profiles"
                  />
                  <div className="p-5 flex flex-col gap-2">
                    {AI_MODELS.map((m) => {
                      const active = selectedModel === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedModel(m.id)}
                          className={[
                            "flex items-center gap-3 px-3.5 py-2.5 rounded-lg border-2",
                            "text-left transition-all duration-150 cursor-pointer w-full",
                            active
                              ? "border-black/80 bg-black shadow-sm"
                              : "border-border bg-background hover:border-black/30",
                          ].join(" ")}
                        >
                          <Cpu
                            className="w-3.5 h-3.5 flex-shrink-0"
                            style={{ color: active ? m.accentColor : "#9ca3af" }}
                          />
                          <span className={`text-sm font-medium flex-1 text-left ${active ? "text-[#caff3d]" : "text-foreground"}`}>
                            {m.label}
                          </span>
                          <span
                            className={[
                              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                              active
                                ? "bg-white/10 text-white/60"
                                : "bg-muted text-muted-foreground",
                            ].join(" ")}
                          >
                            {m.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── Error ─────────────────────────────────────── */}
              {error && <Alert message={error} />}

              {/* ── Run button ────────────────────────────────── */}
              <div className="flex flex-col items-center gap-3 pt-2">
                <button
                  onClick={runTest}
                  disabled={loading || axes.length === 0}
                  className="flex items-stretch rounded-md overflow-hidden
                             disabled:opacity-40 disabled:cursor-not-allowed
                             hover:shadow-lg transition-shadow duration-150 group"
                >
                  <span className="bg-[#caff3d] px-4 flex items-center justify-center group-hover:bg-[#b8f020] transition-colors">
                    {loading ? (
                      <Loader2 className="w-4 h-4 text-black animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4 text-black" />
                    )}
                  </span>
                  <span className="bg-black text-white text-sm font-bold tracking-wider uppercase px-8 py-3 flex items-center gap-2.5 group-hover:bg-[#1a1a1a] transition-colors min-w-[240px] justify-center">
                    {loading
                      ? `Probing ${selectedModelMeta?.label ?? "AI"}...`
                      : "Run counterfactual probe"}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </span>
                </button>

                <p className="text-xs text-muted-foreground text-center max-w-sm">
                  Sends{" "}
                  <span className="font-semibold text-foreground">{candidateCount}</span>{" "}
                  identical profiles with different names to{" "}
                  <span className="font-semibold text-foreground">
                    {selectedModelMeta?.label ?? "the AI"}
                  </span>{" "}
                  — one real APPROVE / REJECT decision per profile.
                </p>
              </div>

            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════
              RESULTS PANEL
          ══════════════════════════════════════════════════════ */}
          {results && (
            <motion.div
              key="results"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-5"
            >

              {/* ── Results header ──────────────────────────────── */}
              <motion.div variants={staggerChild} className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-foreground tracking-tight">
                    Probe Results
                  </h2>

                  {usedRealModel ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md
                                     bg-[#0057ff]/8 border border-[#0057ff]/20 text-xs font-semibold text-[#0057ff]">
                      <Cpu className="w-3 h-3" />
                      {modelLabel}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md
                                     bg-[#ff8c42]/8 border border-[#ff8c42]/20 text-xs font-semibold text-[#ff8c42]">
                      <AlertTriangle className="w-3 h-3" />
                      Simulated — no API key
                    </span>
                  )}

                  {/* Data source badge */}
                  {results.analysis?.summary?.source === "counterfactual_from_csv" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md
                                     bg-[#9a77f8]/8 border border-[#9a77f8]/20 text-xs font-semibold text-[#9a77f8]">
                      <FileText className="w-3 h-3" />
                      Real CSV profiles
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md
                                     bg-muted border border-border text-xs font-medium text-muted-foreground">
                      <Database className="w-3 h-3" />
                      Synthetic profiles
                    </span>
                  )}
                </div>


                <button
                  onClick={() => setResults(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                             font-medium text-muted-foreground border border-border bg-card
                             hover:bg-muted hover:text-foreground transition-all duration-150"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New test
                </button>
              </motion.div>

              {/* ── Summary metric cards ─────────────────────────── */}
              <motion.div
                variants={staggerChild}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <MetricCard
                  icon={<Users className="w-4 h-4" />}
                  title="Profiles tested"
                  value={String(results.analysis?.summary?.total_candidates ?? 0)}
                  subtitle="Counterfactual pairs"
                />
                <MetricCard
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  title="Overall approval"
                  value={`${((results.analysis?.summary?.overall_approval_rate ?? 0) * 100).toFixed(1)}%`}
                  subtitle="Across all groups"
                />
                <MetricCard
                  icon={<AlertTriangle className="w-4 h-4" />}
                  title="Bias status"
                  value={results.analysis?.summary?.bias_detected ? "BIASED" : "FAIR"}
                  severity={results.analysis?.summary?.bias_detected ? "CRITICAL" : "OK"}
                  subtitle="EEOC 80% rule"
                />
                <MetricCard
                  icon={<Scale className="w-4 h-4" />}
                  title="Disparate impact"
                  value={
                    (Object.values(results.analysis?.per_demographic ?? {})[0])
                      ?.disparate_impact?.ratio?.toFixed(4) ?? "N/A"
                  }
                  severity={
                    (Object.values(results.analysis?.per_demographic ?? {})[0])
                      ?.disparate_impact?.severity
                  }
                  subtitle="Minority ÷ majority rate"
                />
              </motion.div>

              {/* ── Counterfactual proof table ───────────────────── */}
              {results.analysis?.counterfactual_pairs?.length > 0 && (
                <motion.div variants={staggerChild}>
                  <div className="bg-card rounded-xl border border-border overflow-hidden">

                    {/* Card header — blue for evidence/data */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-[#0057ff]/4">
                      <div className="flex items-stretch rounded-md overflow-hidden flex-shrink-0">
                        <div className="bg-[#0057ff] w-7 h-7 flex items-center justify-center">
                          <ChevronRight className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="bg-black w-0.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          Counterfactual Proof
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Same CV, different name — sent to{" "}
                          <span className="font-medium text-foreground">
                            {usedRealModel ? modelLabel : "simulated model"}
                          </span>
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0057ff]/10 text-[#0057ff] border border-[#0057ff]/20">
                        {results.analysis.counterfactual_pairs.length} profiles
                      </span>
                    </div>

                    {/* Table */}
                    <div className="divide-y divide-border">
                      {results.analysis.counterfactual_pairs.map(
                        (group, gi) => (
                          <div key={gi} className="overflow-hidden">
                            {/* Group header */}
                            <div className="flex items-center gap-3 px-5 py-2 bg-muted/40 border-b border-border">
                              <code className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                Profile #{gi + 1}
                              </code>
                              <div className="flex-1 h-px bg-border" />
                              <span className="text-[10px] text-muted-foreground">
                                Identical qualifications
                              </span>
                            </div>

                            {/* Persons in this group */}
                            <div className="divide-y divide-border/50">
                              {group.map((person, pi) => {
                                const approved = person.decision === "Approved";
                                return (
                                  <div
                                    key={pi}
                                    className={[
                                      "flex items-center gap-4 px-5 py-3.5 transition-colors",
                                      "hover:bg-muted/20",
                                    ].join(" ")}
                                  >
                                    {/* Status bar left edge */}
                                    <div
                                      className={`w-0.5 h-8 rounded-full flex-shrink-0 ${
                                        approved ? "bg-[#caff3d]" : "bg-[#ff6b7a]"
                                      }`}
                                    />

                                    {/* Name + demo */}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-foreground">
                                        {person.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        {[person.gender, person.ethnicity]
                                          .filter(Boolean)
                                          .join(" · ")}
                                      </p>
                                    </div>

                                    {/* Confidence */}
                                    {person.confidence != null && (
                                      <div className="text-right flex-shrink-0">
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                          Confidence
                                        </p>
                                        <p className="text-sm font-bold font-mono text-foreground">
                                          {(person.confidence * 100).toFixed(0)}%
                                        </p>
                                      </div>
                                    )}

                                    {/* Decision badge */}
                                    <span
                                      className={[
                                        "text-[10px] font-bold uppercase tracking-wider px-3 py-1.5",
                                        "rounded-full border flex-shrink-0 flex items-center gap-1.5",
                                        approved
                                          ? "bg-[#caff3d]/12 text-black border-[#caff3d]/30"
                                          : "bg-[#ff6b7a]/10 text-[#ff6b7a] border-[#ff6b7a]/25",
                                      ].join(" ")}
                                    >
                                      {approved ? (
                                        <CheckCircle2 className="w-3 h-3" />
                                      ) : (
                                        <XCircle className="w-3 h-3" />
                                      )}
                                      {person.decision}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Per-demographic bar charts ───────────────────── */}
              {Object.keys(results.analysis?.per_demographic ?? {}).length > 0 && (
                <motion.div
                  variants={staggerChild}
                  className="grid md:grid-cols-2 gap-4"
                >
                  {Object.entries(results.analysis.per_demographic).map(
                    ([axis, metrics]) => (
                      <BiasChart
                        key={axis}
                        title={`Approval rates · ${axis.replace(/_/g, " ")}`}
                        data={Object.entries(
                          metrics.disparate_impact?.rates ?? {}
                        ).map(([group, rate]) => ({ group, rate }))}
                      />
                    )
                  )}
                </motion.div>
              )}

              {/* ── AI Analysis card ─────────────────────────────── */}
              {results.explanation && (
                <motion.div variants={staggerChild}>
                  <div className="bg-card rounded-xl border border-border overflow-hidden">

                    {/* Header — dark with blue + sparkles */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-black">
                      <div className="w-7 h-7 rounded-lg bg-[#0057ff] flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">
                          AI Analysis
                        </p>
                        <p className="text-xs text-white/40 mt-0.5">
                          {usedRealModel ? modelLabel : "Simulated"} interpretation
                        </p>
                      </div>
                      {/* Purple dot — Gemini AI color */}
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9a77f8] animate-pulse" />
                        <span className="text-xs text-white/40 font-medium">
                          Gemini
                        </span>
                      </div>
                    </div>

                    <div className="px-5 py-5 space-y-3">
                      <p className="text-base font-semibold text-foreground leading-snug">
                        {results.explanation.summary}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {results.explanation.explanation}
                      </p>

                      {/* Bias verdict pill */}
                      <div className="pt-3 border-t border-border">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            Verdict
                          </span>
                          <span
                            className={[
                              "inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider",
                              "px-3 py-1.5 rounded-full border",
                              results.analysis?.summary?.bias_detected
                                ? "bg-[#ff6b7a]/10 text-[#ff6b7a] border-[#ff6b7a]/25"
                                : "bg-[#caff3d]/12 text-black border-[#caff3d]/30",
                            ].join(" ")}
                          >
                            {results.analysis?.summary?.bias_detected ? (
                              <XCircle className="w-3 h-3" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                            {results.analysis?.summary?.bias_detected
                              ? "Bias detected"
                              : "No significant bias"}
                          </span>

                          {/* Tested domain badge */}
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                            {DECISION_TYPES.find((d) => d.id === decisionType)?.icon}{" "}
                            {DECISION_TYPES.find((d) => d.id === decisionType)?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}