// app/genome/page.js
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dna,
  Cpu,
  Target,
  Loader2,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import MetricCard from "@/components/metric-card";
import GenomeMap from "@/components/genome-map";

// ─── Constants ────────────────────────────────────────────────────────────────

const AI_MODELS = [
  { id: "gemini",    label: "Gemini 2.5 Flash", badge: "Google", accentColor: "#0057ff" },
  { id: "llama-8b",  label: "Llama 3.1 8B",     badge: "Groq",   accentColor: "#ff8c42" },
  { id: "llama-70b", label: "Llama 3.3 70B",     badge: "Groq",   accentColor: "#9a77f8" },
];

const DECISION_TYPES = [
  { id: "hiring",             label: "Hiring",     sublabel: "Resume Screening" },
  { id: "lending",            label: "Lending",    sublabel: "Loan & Credit" },
  { id: "content_moderation", label: "Moderation", sublabel: "Content Review" },
];

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

// ─── Main page ────────────────────────────────────────────────────────────────

export default function GenomePage() {
  const [selectedModel,  setSelectedModel]  = useState("gemini");
  const [decisionType,   setDecisionType]   = useState("hiring");
  const [loading,        setLoading]        = useState(false);
  const [genomeData,     setGenomeData]     = useState(null);
  const [error,          setError]          = useState(null);

  const selectedModelMeta = AI_MODELS.find(m => m.id === selectedModel);

  const runGenome = async () => {
    setLoading(true);
    setError(null);
    setGenomeData(null);
    try {
      const res = await fetch("/api/genome/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ai_model: selectedModel, decision_type: decisionType }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGenomeData(data);
    } catch (e) {
      setError(`Genome probe failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const genome = genomeData?.genome;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Page header ───────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-4">
            <div className="flex items-stretch rounded-md overflow-hidden flex-shrink-0 mt-0.5">
              <div className="bg-[#9a77f8] w-10 h-10 flex items-center justify-center">
                <Dna className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="bg-black w-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Bias Genome
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5 max-w-lg">
                Map any AI&apos;s discrimination fingerprint — systematic probing across
                qualification levels and demographics.
              </p>
            </div>
          </div>

          {genomeData && (
            <button
              onClick={() => setGenomeData(null)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                         font-medium text-muted-foreground border border-border bg-card
                         hover:bg-muted hover:text-foreground transition-all duration-150"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New scan
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">

          {/* ═══ CONFIG ═══ */}
          {!genomeData && !loading && (
            <motion.div key="config" {...fadeUp} className="space-y-4">

              {/* Model selector */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                  <div className="flex items-stretch rounded-md overflow-hidden flex-shrink-0">
                    <div className="bg-[#0057ff] w-7 h-7 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">1</span>
                    </div>
                    <div className="bg-black w-0.5" />
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Cpu className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">AI model to probe</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Which model will receive the 60 test profiles</p>
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-2">
                  {AI_MODELS.map(m => {
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
                        <span className={[
                          "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                          active ? "bg-white/10 text-white/60" : "bg-muted text-muted-foreground",
                        ].join(" ")}>
                          {m.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Domain selector */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                  <div className="flex items-stretch rounded-md overflow-hidden flex-shrink-0">
                    <div className="bg-[#0057ff] w-7 h-7 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">2</span>
                    </div>
                    <div className="bg-black w-0.5" />
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Target className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Decision domain</p>
                    <p className="text-xs text-muted-foreground mt-0.5">What type of decision is the AI making</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex gap-3">
                    {DECISION_TYPES.map(t => {
                      const active = decisionType === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setDecisionType(t.id)}
                          className={[
                            "flex-1 flex flex-col items-center gap-1 py-3 rounded-lg border-2",
                            "transition-all duration-150 cursor-pointer",
                            active
                              ? "border-[#9a77f8]/50 bg-[#9a77f8]/6 shadow-sm"
                              : "border-border bg-background hover:border-[#9a77f8]/30",
                          ].join(" ")}
                        >
                          <span className={`text-sm font-semibold ${active ? "text-[#9a77f8]" : "text-foreground"}`}>
                            {t.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{t.sublabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-lg border bg-[#ff6b7a]/8 border-[#ff6b7a]/20">
                  <AlertTriangle className="w-4 h-4 text-[#ff6b7a] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#ff6b7a]">{error}</p>
                </div>
              )}

              {/* Run button */}
              <div className="flex flex-col items-center gap-3 pt-2">
                <button
                  onClick={runGenome}
                  className="flex items-stretch rounded-md overflow-hidden
                             hover:shadow-lg transition-shadow duration-150 group"
                >
                  <span className="bg-[#9a77f8] px-4 flex items-center justify-center group-hover:bg-[#8b5cf6] transition-colors">
                    <Dna className="w-4 h-4 text-white" />
                  </span>
                  <span className="bg-black text-white text-sm font-bold tracking-wider uppercase px-8 py-3 flex items-center gap-2.5 group-hover:bg-[#1a1a1a] transition-colors min-w-[240px] justify-center">
                    Map Bias Genome
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
                <p className="text-xs text-muted-foreground text-center max-w-md">
                  Sends <span className="font-semibold text-foreground">60</span> profiles
                  (5 qualification levels × 12 demographics) to{" "}
                  <span className="font-semibold text-foreground">{selectedModelMeta?.label}</span>.
                  Takes ~2 minutes.
                </p>
              </div>
            </motion.div>
          )}

          {/* ═══ LOADING ═══ */}
          {loading && (
            <motion.div key="loading" {...fadeUp} className="flex flex-col items-center justify-center py-24 gap-8">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-muted flex items-center justify-center">
                  <Dna className="w-7 h-7 text-[#9a77f8]/40" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#9a77f8] animate-spin" />
              </div>
              <div className="text-center max-w-sm">
                <h2 className="text-xl font-semibold text-foreground">Mapping bias genome</h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Sending 60 probes to <span className="font-medium text-foreground">{selectedModelMeta?.label}</span>...
                </p>
              </div>
              <div className="flex flex-col gap-2.5 w-72">
                {[60, 70, 80, 85, 90].map((q, i) => (
                  <motion.div
                    key={q}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 20, duration: 0.25 }}
                    className="flex items-center gap-2.5"
                  >
                    <Loader2 className="w-3 h-3 text-[#9a77f8] animate-spin flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      Probing qualification level {q}...
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ RESULTS ═══ */}
          {genomeData && genome && (
            <motion.div key="results" {...fadeUp}>
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-5"
              >
                {/* Results header */}
                <motion.div variants={staggerChild} className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-bold text-foreground tracking-tight">Genome Results</h2>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#9a77f8]/8 border border-[#9a77f8]/20 text-xs font-semibold text-[#9a77f8]">
                      <Cpu className="w-3 h-3" />
                      {genomeData.model_label}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted border border-border text-xs font-medium text-muted-foreground">
                      {genomeData.total_probes} probes
                    </span>
                    {!genomeData.used_real_model && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ff8c42]/8 border border-[#ff8c42]/20 text-xs font-semibold text-[#ff8c42]">
                        <AlertTriangle className="w-3 h-3" />
                        Simulated — no API key
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Summary cards */}
                <motion.div variants={staggerChild} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard
                    icon={<Users className="w-4 h-4" />}
                    title="Most discriminated"
                    value={genome.worst_group?.name || genome.worst_group?.key}
                    subtitle={`${genome.worst_group?.approval_pct}% approval`}
                    severity="CRITICAL"
                  />
                  <MetricCard
                    icon={<CheckCircle2 className="w-4 h-4" />}
                    title="Most favored"
                    value={genome.best_group?.name || genome.best_group?.key}
                    subtitle={`${genome.best_group?.approval_pct}% approval`}
                    severity="OK"
                  />
                  <MetricCard
                    icon={<TrendingUp className="w-4 h-4" />}
                    title="Bias spread"
                    value={`${Math.round(genome.overall_bias_spread * 100)}%`}
                    subtitle="Approval gap"
                    severity={genome.genome_severity === "CRITICAL" ? "CRITICAL" : genome.genome_severity === "HIGH" ? "HIGH" : "MODERATE"}
                  />
                  <MetricCard
                    icon={<Zap className="w-4 h-4" />}
                    title="Borderline amplification"
                    value={genome.borderline_amplification ? "YES" : "No"}
                    subtitle={genome.borderline_amplification ? "Bias worse at borderline" : "Consistent across levels"}
                    severity={genome.borderline_amplification ? "CRITICAL" : "OK"}
                  />
                </motion.div>

                {/* Result statement */}
                <motion.div variants={staggerChild}>
                  <div className="bg-black rounded-xl p-6 text-center">
                    <p className="text-white text-base leading-relaxed">
                      <span className="font-bold text-[#caff3d]">{genomeData.model_label}</span> approves{" "}
                      <span className="font-bold text-[#86efac]">
                        {genome.best_group?.name || genome.best_group?.key}
                      </span>{" "}
                      at <span className="font-bold font-mono text-[#86efac]">{genome.best_group?.approval_pct}%</span>{" "}
                      and{" "}
                      <span className="font-bold text-[#fca5a5]">
                        {genome.worst_group?.name || genome.worst_group?.key}
                      </span>{" "}
                      at <span className="font-bold font-mono text-[#fca5a5]">{genome.worst_group?.approval_pct}%</span>{" "}
                      for identical qualifications.
                    </p>
                    <p className="text-white/60 text-sm mt-3 italic">
                      {genome.borderline_amplification_note}
                    </p>
                  </div>
                </motion.div>

                {/* Genome visualization */}
                <motion.div variants={staggerChild}>
                  <GenomeMap genome={genome} />
                </motion.div>

              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
