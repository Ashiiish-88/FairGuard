// app/compare/page.js
"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCompare,
  Upload,
  Settings2,
  BarChart3,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  FileText,
  Database,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Scale,
} from "lucide-react";
import CsvDropzone from "@/components/csv-dropzone";
import ScoreGauge from "@/components/score-gauge";
import BiasChart from "@/components/bias-chart";
import MetricCard from "@/components/metric-card";

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

// ─── Column button (reused from audit) ───────────────────────────────────────

function ColBtn({ label, active, suggested, onClick }) {
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
        <span className={[
          "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
          active ? "bg-[#caff3d]/20 text-[#caff3d]" : "bg-[#0057ff]/8 text-[#0057ff]",
        ].join(" ")}>
          auto
        </span>
      )}
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ComparePage() {
  const [step, setStep] = useState(0); // 0: upload A, 1: upload B, 2: configure, 3: results
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [labelA, setLabelA] = useState("Model v1");
  const [labelB, setLabelB] = useState("Model v2");
  const [config, setConfig] = useState({ outcome: "", protected: [], positiveOutcome: "1" });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const parseFile = useCallback((file, callback) => {
    if (!file) return;
    if (file.name?.toLowerCase().endsWith(".json")) {
      file.text().then(text => {
        const parsed = JSON.parse(text);
        callback(Array.isArray(parsed) ? parsed : []);
      }).catch(e => setError(`JSON parse error: ${e.message}`));
    } else {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => callback(res.data || []),
        error: (e) => setError(`CSV parse error: ${e.message}`),
      });
    }
  }, []);

  const handleFileA = useCallback((f) => {
    if (!f) return;
    setFileA(f);
    setError(null);
    parseFile(f, (data) => {
      setDataA(data);
      setStep(1);
    });
  }, [parseFile]);

  const handleFileB = useCallback((f) => {
    if (!f) return;
    setFileB(f);
    setError(null);
    parseFile(f, (data) => {
      setDataB(data);
      // Auto-detect columns from dataset A
      if (dataA?.length > 0) {
        const columns = Object.keys(dataA[0]);
        const decisionKw = ["decision", "outcome", "result", "approved", "rejected", "hired", "selected", "label", "target"];
        const protectedKw = ["gender", "sex", "race", "ethnicity", "age", "religion", "disability"];
        const outcomeCol = columns.find(c => decisionKw.some(kw => c.toLowerCase().includes(kw))) || "";
        const protCols = columns.filter(c => protectedKw.some(kw => c.toLowerCase().includes(kw)));
        setConfig(p => ({ ...p, outcome: outcomeCol, protected: protCols }));
      }
      setStep(2);
    });
  }, [parseFile, dataA]);

  const toggleProtected = (col) =>
    setConfig(prev => ({
      ...prev,
      protected: prev.protected.includes(col)
        ? prev.protected.filter(c => c !== col)
        : [...prev.protected, col],
    }));

  // Demo dataset loaders
  const loadDemoA = useCallback(async () => {
    setError(null);
    const res = await fetch("/demo_hiring_data.csv");
    const text = await res.text();
    Papa.parse(text, {
      header: true, skipEmptyLines: true,
      complete: (r) => { setDataA(r.data); setLabelA("Model v1 — Jan 2026 (biased baseline)"); setStep(1); },
    });
  }, []);

  const loadDemoB = useCallback(async () => {
    setError(null);
    const res = await fetch("/demo_hiring_data_v2.csv");
    const text = await res.text();
    Papa.parse(text, {
      header: true, skipEmptyLines: true,
      complete: (r) => {
        const data = r.data;
        setDataB(data);
        setLabelB("Model v2 — Jul 2026 (improved version)");
        if (dataA?.length > 0) {
          const columns = Object.keys(dataA[0]);
          const decisionKw = ["decision", "outcome", "result", "approved", "rejected", "hired", "selected", "label", "target"];
          const protectedKw = ["gender", "sex", "race", "ethnicity", "age", "religion", "disability"];
          const outcomeCol = columns.find(c => decisionKw.some(kw => c.toLowerCase().includes(kw))) || "";
          const protCols = columns.filter(c => protectedKw.some(kw => c.toLowerCase().includes(kw)));
          setConfig(p => ({ ...p, outcome: outcomeCol, protected: protCols }));
        }
        setStep(2);
      },
    });
  }, [dataA]);

  const runCompare = async () => {
    if (!config.outcome || !config.protected.length) {
      setError("Select an outcome column and at least one protected attribute.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/audit/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataset_a: dataA,
          dataset_b: dataB,
          outcome_column: config.outcome,
          protected_columns: config.protected,
          positive_outcome: config.positiveOutcome,
          label_a: labelA,
          label_b: labelB,
        }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setResults(json);
      setStep(3);
    } catch (e) {
      setError(`Compare failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0); setDataA(null); setDataB(null); setFileA(null); setFileB(null);
    setResults(null); setError(null);
    setConfig({ outcome: "", protected: [], positiveOutcome: "1" });
    setLabelA("Model v1"); setLabelB("Model v2");
  };

  const diff = results?.diff;
  const scoreA = results?.results_a?.fairness_score?.score ?? 0;
  const scoreB = results?.results_b?.fairness_score?.score ?? 0;
  const scoreDelta = diff?.score_delta ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1320px] mx-auto px-6 py-10">

        {/* ── Page header ───────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-4">
            <div className="flex items-stretch rounded-md overflow-hidden flex-shrink-0 mt-0.5">
              <div className="bg-[#caff3d] w-10 h-10 flex items-center justify-center">
                <GitCompare className="w-4.5 h-4.5 text-black" />
              </div>
              <div className="bg-black w-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Compare Audits</h1>
              <p className="text-sm text-muted-foreground mt-0.5 max-w-lg">
                Run two datasets through the same pipeline — see which groups improved and which regressed.
              </p>
            </div>
          </div>
          {step > 0 && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                         font-medium text-muted-foreground border border-border bg-card
                         hover:bg-muted hover:text-foreground transition-all duration-150"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Start over
            </button>
          )}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div {...fadeUp} className="mb-6">
              <div className="flex items-start gap-3 px-4 py-3 rounded-lg border bg-[#ff6b7a]/8 border-[#ff6b7a]/20">
                <XCircle className="w-4 h-4 text-[#ff6b7a] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#ff6b7a]">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">

          {/* ═══ STEP 0: Upload A ═══ */}
          {step === 0 && (
            <motion.div key="uploadA" {...fadeUp} className="space-y-4">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                  <div className="flex items-stretch rounded-md overflow-hidden flex-shrink-0">
                    <div className="bg-[#caff3d] w-7 h-7 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-black">A</span>
                    </div>
                    <div className="bg-black w-0.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Upload Dataset A</p>
                    <p className="text-xs text-muted-foreground mt-0.5">The baseline / original model&apos;s output</p>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-muted-foreground">Label:</label>
                    <input
                      value={labelA}
                      onChange={e => setLabelA(e.target.value)}
                      placeholder="e.g., Model v1 — Jan 2026"
                      className="flex-1 px-3 py-1.5 rounded-md border border-border bg-background text-sm
                                 focus:outline-none focus:ring-2 focus:ring-[#04cfff]/40 focus:border-[#04cfff] transition-all"
                    />
                  </div>
                  <CsvDropzone onFileLoaded={handleFileA} file={fileA} />
                  {/* Demo dataset shortcut */}
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Or try a demo dataset</p>
                    <button
                      onClick={loadDemoA}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold
                                 border border-border bg-muted/50 hover:bg-muted text-foreground transition-all"
                    >
                      <Database className="w-3.5 h-3.5 text-[#04cfff]" />
                      📂 Load Model v1 (biased baseline)
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ STEP 1: Upload B ═══ */}
          {step === 1 && (
            <motion.div key="uploadB" {...fadeUp} className="space-y-4">
              {/* Dataset A summary */}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#04cfff]/4 border border-[#04cfff]/20 w-fit">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#04cfff]" />
                <span className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{labelA}</span> — {dataA?.length?.toLocaleString()} rows loaded
                </span>
              </div>

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                  <div className="flex items-stretch rounded-md overflow-hidden flex-shrink-0">
                    <div className="bg-[#9a77f8] w-7 h-7 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">B</span>
                    </div>
                    <div className="bg-black w-0.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Upload Dataset B</p>
                    <p className="text-xs text-muted-foreground mt-0.5">The updated / retrained model&apos;s output</p>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-muted-foreground">Label:</label>
                    <input
                      value={labelB}
                      onChange={e => setLabelB(e.target.value)}
                      placeholder="e.g., Model v2 — Jul 2026"
                      className="flex-1 px-3 py-1.5 rounded-md border border-border bg-background text-sm
                                 focus:outline-none focus:ring-2 focus:ring-[#9a77f8]/40 focus:border-[#9a77f8] transition-all"
                    />
                  </div>
                  <CsvDropzone onFileLoaded={handleFileB} file={fileB} />
                  {/* Demo dataset shortcut */}
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Or try a demo dataset</p>
                    <button
                      onClick={loadDemoB}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold
                                 border border-border bg-muted/50 hover:bg-muted text-foreground transition-all"
                    >
                      <Database className="w-3.5 h-3.5 text-[#9a77f8]" />
                      📂 Load Model v2 (improved version)
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ STEP 2: Configure ═══ */}
          {step === 2 && (
            <motion.div key="configure" {...fadeUp} className="space-y-5">
              {/* Dataset summaries */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#04cfff]/8 border border-[#04cfff]/20 text-xs font-medium">
                  <FileText className="w-3 h-3 text-[#04cfff]" />
                  <span className="text-foreground font-semibold">{labelA}</span> — {dataA?.length} rows
                </span>
                <span className="text-xs text-muted-foreground">vs</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#9a77f8]/8 border border-[#9a77f8]/20 text-xs font-medium">
                  <FileText className="w-3 h-3 text-[#9a77f8]" />
                  <span className="text-foreground font-semibold">{labelB}</span> — {dataB?.length} rows
                </span>
              </div>

              {/* Outcome column */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-3.5 h-3.5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Outcome column</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Same column must exist in both datasets</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {dataA && Object.keys(dataA[0] || {}).map(col => (
                      <ColBtn
                        key={col}
                        label={col}
                        active={config.outcome === col}
                        onClick={() => setConfig(p => ({ ...p, outcome: col }))}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Protected attributes */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Scale className="w-3.5 h-3.5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Protected attributes</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Which dimensions to compare across versions</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {dataA && Object.keys(dataA[0] || {}).filter(c => c !== config.outcome).map(col => (
                      <ColBtn
                        key={col}
                        label={col}
                        active={config.protected.includes(col)}
                        onClick={() => toggleProtected(col)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Run button */}
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-muted-foreground">
                  {config.protected.length > 0 && config.outcome
                    ? `Comparing ${config.protected.length} attribute${config.protected.length !== 1 ? "s" : ""} across both datasets`
                    : "Select outcome and at least one protected attribute"}
                </p>
                <button
                  onClick={runCompare}
                  disabled={!config.outcome || !config.protected.length || loading}
                  className="flex items-stretch rounded-md overflow-hidden
                             disabled:opacity-40 disabled:cursor-not-allowed
                             hover:shadow-md transition-shadow duration-150 group"
                >
                  <span className="bg-[#04cfff] px-3 flex items-center justify-center group-hover:bg-[#00b8e6] transition-colors">
                    {loading ? <Loader2 className="w-3.5 h-3.5 text-black animate-spin" /> : <GitCompare className="w-3.5 h-3.5 text-black" />}
                  </span>
                  <span className="bg-black text-white text-xs font-bold tracking-wider uppercase px-5 py-2.5 flex items-center gap-2 group-hover:bg-[#1a1a1a] transition-colors">
                    {loading ? "Comparing..." : "Compare audits"}
                    {!loading && <ArrowRight className="w-3.5 h-3.5" />}
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ STEP 3: Results ═══ */}
          {step === 3 && results && (
            <motion.div key="results" {...fadeUp}>
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-5"
              >
                {/* Score comparison */}
                <motion.div variants={staggerChild} className="grid grid-cols-3 gap-4 items-center">
                  <div className="bg-card rounded-xl border border-border p-5 text-center">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">{labelA}</p>
                    <ScoreGauge score={scoreA} label={results.results_a?.fairness_score?.label} />
                  </div>

                  {/* Delta */}
                  <div className="flex flex-col items-center gap-2">
                    <div className={[
                      "text-2xl font-bold font-mono",
                      scoreDelta > 0 ? "text-[#caff3d]" : scoreDelta < 0 ? "text-[#ff6b7a]" : "text-muted-foreground",
                    ].join(" ")}>
                      {scoreDelta > 0 ? "+" : ""}{scoreDelta}
                    </div>
                    <span className="text-xs text-muted-foreground">points</span>
                    <div className={[
                      "text-xs font-bold px-3 py-1.5 rounded-full border",
                      diff?.summary?.overall_verdict === "NET IMPROVEMENT"
                        ? "bg-[#caff3d]/10 text-[#65a30d] border-[#caff3d]/30"
                        : diff?.summary?.overall_verdict === "NET REGRESSION"
                        ? "bg-[#ff6b7a]/10 text-[#ff6b7a] border-[#ff6b7a]/25"
                        : "bg-[#ff8c42]/10 text-[#ff8c42] border-[#ff8c42]/25",
                    ].join(" ")}>
                      {diff?.summary?.overall_verdict}
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-5 text-center">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">{labelB}</p>
                    <ScoreGauge score={scoreB} label={results.results_b?.fairness_score?.label} />
                  </div>
                </motion.div>

                {/* Summary headline */}
                <motion.div variants={staggerChild}>
                  <div className={[
                    "rounded-xl p-5 border-2",
                    diff?.summary?.overall_verdict === "NET IMPROVEMENT"
                      ? "bg-[#caff3d]/5 border-[#caff3d]/20"
                      : diff?.summary?.overall_verdict === "NET REGRESSION"
                      ? "bg-[#ff6b7a]/5 border-[#ff6b7a]/20"
                      : "bg-[#ff8c42]/5 border-[#ff8c42]/20",
                  ].join(" ")}>
                    <p className="text-sm font-semibold text-foreground">{diff?.summary?.headline}</p>
                  </div>
                </motion.div>

                {/* Per-attribute comparison */}
                {Object.entries(diff?.per_attribute_diff || {}).map(([attr, attrDiff]) => (
                  <motion.div key={attr} variants={staggerChild}>
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                        <Scale className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{attr}</p>
                        </div>
                        <span className={[
                          "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border",
                          attrDiff.verdict === "IMPROVED"
                            ? "bg-[#caff3d]/10 text-[#65a30d] border-[#caff3d]/30"
                            : attrDiff.verdict === "REGRESSED"
                            ? "bg-[#ff6b7a]/10 text-[#ff6b7a] border-[#ff6b7a]/25"
                            : "bg-muted text-muted-foreground border-border",
                        ].join(" ")}>
                          {attrDiff.verdict === "IMPROVED" && <TrendingUp className="w-3 h-3 inline mr-1" />}
                          {attrDiff.verdict === "REGRESSED" && <TrendingDown className="w-3 h-3 inline mr-1" />}
                          {attrDiff.verdict === "UNCHANGED" && <Minus className="w-3 h-3 inline mr-1" />}
                          {attrDiff.verdict}
                        </span>
                      </div>

                      {/* Group changes table */}
                      <div className="divide-y divide-border">
                        {Object.entries(attrDiff.group_changes || {}).map(([group, change]) => (
                          <div key={group} className="flex items-center gap-4 px-5 py-3">
                            <span className="text-sm font-medium text-foreground w-28 flex-shrink-0">{group}</span>
                            <span className="text-xs font-mono text-muted-foreground w-16 text-right">
                              {((change.rate_a ?? 0) * 100).toFixed(1)}%
                            </span>
                            <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs font-mono text-foreground w-16">
                              {((change.rate_b ?? 0) * 100).toFixed(1)}%
                            </span>
                            <span className={[
                              "text-xs font-bold font-mono",
                              change.direction === "improved" ? "text-[#caff3d]" :
                              change.direction === "regressed" ? "text-[#ff6b7a]" : "text-muted-foreground",
                            ].join(" ")}>
                              {(change.delta ?? 0) > 0 ? "+" : ""}{((change.delta ?? 0) * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Regression warnings */}
                {Object.entries(diff?.per_attribute_diff || {})
                  .filter(([, d]) => d.verdict === "REGRESSED")
                  .map(([attr, d]) => (
                    <motion.div key={`warn-${attr}`} variants={staggerChild}>
                      <div className="flex items-start gap-3 px-5 py-4 rounded-xl border-2 border-[#ff6b7a]/30 bg-[#ff6b7a]/5">
                        <AlertTriangle className="w-5 h-5 text-[#ff6b7a] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-[#ff6b7a]">
                            {attr} bias INCREASED
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Disparate impact delta: {((d.di_delta ?? 0) * 100).toFixed(2)}%. Review this regression before deploying.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
