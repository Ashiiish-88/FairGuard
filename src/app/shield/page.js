// app/shield/page.tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Papa from "papaparse";
import CsvDropzone from "@/components/csv-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import MetricCard from "@/components/metric-card";
import AlertFeed from "@/components/alert-feed";
import {
  Play,
  Square,
  Shield,
  RotateCcw,
  ArrowLeft,
  Zap,
  Activity,
  Users,
  BarChart3,
  Bell,
  CheckCircle2,
  XCircle,
  FileText,
  Database,
  Scale,
  Cpu,
  Radio,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

// Your palette colors for group lines
const GROUP_COLORS = [
  "#caff3d", // lime — primary
  "#04cfff", // cyan
  "#9a77f8", // purple
  "#ff8c42", // orange
  "#ff6b7a", // coral
  "#0057ff", // blue
];

const DEMO_DATASETS = [
  { label: "Hiring — CSV",       file: "/demo_hiring_data.csv",        type: "csv" },
  { label: "Hiring — JSON",      file: "/demo_hiring_data.json",       type: "json" },
  { label: "Content Moderation", file: "/demo_content_moderation.csv", type: "csv" },
  { label: "Pricing",            file: "/demo_pricing_data.csv",       type: "csv" },
];

const AI_MODELS = [
  { id: "gemini",    label: "Gemini 2.5 Flash", badge: "Google",  color: "#0057ff" },
  { id: "llama-8b",  label: "Llama 3.1 8B",     badge: "Groq",    color: "#ff8c42" },
  { id: "llama-70b", label: "Llama 3.3 70B",     badge: "Groq",    color: "#9a77f8" },
];

// ─── Animation presets ────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -14 },
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

/* Column selector button — same as audit page for consistency */
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
          : "bg-white text-foreground border-border hover:border-black/40 hover:bg-muted/50",
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

/* Card header row — consistent with audit page */
function CardHeader({
  icon,
  title,
  subtitle,
  right,
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
      <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <span className="text-muted-foreground">{icon}</span>
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

/* Divider with label */
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

/* Live pulse dot */
function LiveDot({ color = "#caff3d" }) {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ background: color }}
      />
      <span
        className="relative inline-flex rounded-full h-2 w-2"
        style={{ background: color }}
      />
    </span>
  );
}

/* Model selector button */
function ModelBtn({
  model,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg",
        "text-sm font-medium border transition-all duration-150",
        active
          ? "bg-black text-[#caff3d] border-black shadow-sm"
          : "bg-card text-muted-foreground border-border hover:border-black/40 hover:text-foreground",
      ].join(" ")}
    >
      <Cpu
        className="w-3.5 h-3.5"
        style={{ color: active ? "#caff3d" : model.color }}
      />
      <span>{model.label}</span>
      <span
        className={[
          "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full",
          active
            ? "bg-[#caff3d]/20 text-[#caff3d]"
            : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        {model.badge}
      </span>
    </button>
  );
}

/* Chart tooltip — uses your card/border tokens */
function ChartTooltip({
  active,
  payload,
  label,
  suffix = "",
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2.5 shadow-lg min-w-[120px]">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
        Batch {label}
      </p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: p.color }}
          />
          <span className="text-muted-foreground">{p.name ?? p.dataKey}:</span>
          <span className="font-semibold font-mono text-foreground">
            {p.value}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ShieldPage() {
  const [isStreaming, setIsStreaming]         = useState(false);
  const [fairnessHistory, setFairnessHistory] = useState([]);
  const [groupHistory, setGroupHistory]       = useState([]);
  const [groupNames, setGroupNames]           = useState([]);
  const [currentMetrics, setCurrentMetrics]   = useState(null);
  const [alerts, setAlerts]                   = useState([]);
  const [totalAnalyzed, setTotalAnalyzed]     = useState(0);
  const [latestDecisions, setLatestDecisions] = useState([]);
  const [selectedModel, setSelectedModel]     = useState("gemini");
  const abortControllerRef                    = useRef(null);
  const [data, setData]                       = useState(null);
  const [file, setFile]                       = useState(null);
  const [domainInfo, setDomainInfo]           = useState(null);
  const [detected, setDetected]               = useState(null);
  const [config, setConfig]                   = useState({
    outcome: "", protected: [],
    positiveOutcome: "1", qualColumn: "",
  });
  const [step, setStep]   = useState(0);
  const [error, setError] = useState(null);

  // ── File handling ─────────────────────────────────────────────────────────

  const handleFile = useCallback(async (f) => {
    if (!f) { setFile(null); setData(null); setDomainInfo(null); return; }
    setFile(f);

    const processData = async (parsedData) => {
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
          protected: (det.detected?.protected_columns || []).map((c) => c.column),
        }));
        setStep(1);
      } catch {}
    };

    if (f.name?.toLowerCase().endsWith(".json")) {
      try {
        const text = await f.text();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) await processData(parsed);
      } catch {}
    } else {
      Papa.parse(f, {
        header: true, skipEmptyLines: true,
        complete: (res) => processData(res.data),
      });
    }
  }, []);

  const loadDemo = async (url, type) => {
    try {
      const res  = await fetch(url);
      const text = await res.text();
      const f    = new File([text], url.split("/").pop(), {
        type: type === "json" ? "application/json" : "text/csv",
      });
      handleFile(f);
    } catch {}
  };

  // ── Stream ────────────────────────────────────────────────────────────────

  const startStream = useCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setIsStreaming(true);
    setFairnessHistory([]);
    setGroupHistory([]);
    setGroupNames([]);
    setAlerts([]);
    setTotalAnalyzed(0);
    setLatestDecisions([]);

    const ac = new AbortController();
    abortControllerRef.current = ac;

    try {
      const res = await fetch(`/api/shield/stream?model=${selectedModel}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_data: data,
          domain: domainInfo?.domain || "hiring",
          config,
        }),
        signal: ac.signal,
      });

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer    = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer      = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const d = JSON.parse(line.substring(6));
            if (d.status === "complete") { setIsStreaming(false); return; }

            setCurrentMetrics(d);
            setTotalAnalyzed(d.total_analyzed);

            setFairnessHistory((prev) => [
              ...prev.slice(-100),
              { batch: d.total_analyzed, score: d.fairness_score },
            ]);

            const genderRates = d.rates?.gender_rates || {};
            const point = { batch: d.total_analyzed };
            for (const [g, rate] of Object.entries(genderRates)) {
              point[g] = Math.round(rate * 1000) / 10;
            }
            setGroupHistory((prev) => [...prev.slice(-100), point]);
            setGroupNames((prev) => {
              const next = Object.keys(genderRates);
              return [...new Set([...prev, ...next])];
            });

            if (d.latest_decisions) setLatestDecisions(d.latest_decisions);
            if (d.alerts?.length) {
              setAlerts((prev) => [
                ...prev,
                ...d.alerts.map((a, i) => ({
                  ...a,
                  id: `${d.total_analyzed}-${i}`,
                  timestamp: new Date().toISOString(),
                })),
              ]);
            }
          } catch {}
        }
      }
    } catch (e) {
      if (e.name !== "AbortError") console.error(e);
    } finally {
      setIsStreaming(false);
    }
  }, [selectedModel, data, domainInfo, config]);

  const stopStream = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsStreaming(false);
  }, []);

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  const canStart =
    isStreaming ||
    (step === 1 && config.outcome && config.protected.length > 0);

  const fairnessScore = currentMetrics?.fairness_score;
  const fairnessSev   =
    fairnessScore < 50 ? "CRITICAL" : fairnessScore < 70 ? "WARNING" : "OK";

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ── Page header ───────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-4">
            {/* Icon block */}
            <div className="flex items-stretch rounded-md overflow-hidden flex-shrink-0 mt-0.5">
              <div className="bg-[#caff3d] w-10 h-10 flex items-center justify-center">
                <Radio className="w-4.5 h-4.5 text-black" />
              </div>
              <div className="bg-black w-1" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  Shield Mode
                </h1>

                {/* Live badge when streaming */}
                <AnimatePresence>
                  {isStreaming && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md
                                 bg-[#caff3d]/10 border border-[#caff3d]/30 text-xs font-semibold text-black"
                    >
                      <LiveDot />
                      LIVE
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Model label when streaming */}
                {currentMetrics?.is_real_model && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md
                                   bg-muted border border-border text-xs font-medium text-muted-foreground">
                    <Cpu className="w-3 h-3" />
                    {currentMetrics?.model_label ?? "Live AI"}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Real-time bias monitoring · AI decisions stream in · bias caught as it happens
              </p>
            </div>
          </div>

          {/* Action button — Refold split style */}
          <button
            onClick={isStreaming ? stopStream : startStream}
            disabled={!isStreaming && !canStart}
            className={[
              "flex items-stretch rounded-md overflow-hidden",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "transition-shadow duration-150 hover:shadow-md group",
            ].join(" ")}
          >
            {isStreaming ? (
              <>
                <span className="bg-[#ff6b7a] px-3 flex items-center justify-center">
                  <Square className="w-3.5 h-3.5 text-white" />
                </span>
                <span className="bg-[#ff6b7a] hover:bg-[#e85d6a] text-white text-xs font-bold tracking-wider uppercase px-5 py-2.5 flex items-center gap-2 transition-colors">
                  Stop monitoring
                </span>
              </>
            ) : (
              <>
                <span className="bg-[#caff3d] px-3 flex items-center justify-center group-hover:bg-[#b8f020] transition-colors">
                  <Play className="w-3.5 h-3.5 text-black" />
                </span>
                <span className="bg-black text-white text-xs font-bold tracking-wider uppercase px-5 py-2.5 flex items-center gap-2 group-hover:bg-[#1a1a1a] transition-colors">
                  Start monitoring
                </span>
              </>
            )}
          </button>
        </div>

        {/* ── Setup panels (pre-stream) ────────────────────────── */}
        <AnimatePresence mode="wait">
          {!isStreaming && !currentMetrics && (
            <motion.div key="setup" {...fadeUp} className="space-y-6 mb-8">

              {/* ── Model selector ──────────────────────────────── */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <CardHeader
                  icon={<Cpu className="w-3.5 h-3.5" />}
                  title="AI model"
                  subtitle="Select the model to generate and monitor decisions"
                />
                <div className="p-5 flex flex-wrap gap-2.5">
                  {AI_MODELS.map((m) => (
                    <ModelBtn
                      key={m.id}
                      model={m}
                      active={selectedModel === m.id}
                      onClick={() => setSelectedModel(m.id)}
                    />
                  ))}
                </div>
              </div>

              {/* ── Step 0: Data source ──────────────────────────── */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  <CardHeader
                    icon={<Database className="w-3.5 h-3.5" />}
                    title="Data source"
                    subtitle="Upload a dataset or select a demo stream to monitor"
                    right={
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Step 1 of 2
                      </span>
                    }
                  />
                  <div className="p-5 space-y-5">
                    <CsvDropzone onFileLoaded={handleFile} file={file} />

                    <Divider label="Or try a demo stream" />

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {DEMO_DATASETS.map((d) => (
                        <button
                          key={d.file + d.type}
                          onClick={() => loadDemo(d.file, d.type)}
                          className="flex items-center gap-2 px-3.5 py-3 rounded-lg
                                     bg-background border border-border text-sm font-medium
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

              {/* ── Step 1: Configure ────────────────────────────── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-4"
                >
                  {/* Back row */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setStep(0)}
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground
                                 hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Change data source
                    </button>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Step 2 of 2
                    </span>
                  </div>

                  {/* Domain notice */}
                  {domainInfo && (
                    <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-[#caff3d]/8 border border-[#caff3d]/20">
                      <Zap className="w-4 h-4 text-[#caff3d] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Domain detected:{" "}
                          <span className="text-black">{domainInfo.label}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Compliance references: {domainInfo.compliance?.join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* File pill */}
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

                  {/* Outcome column */}
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <CardHeader
                      icon={<BarChart3 className="w-3.5 h-3.5" />}
                      title="Outcome column"
                      subtitle="The decision column your model outputs"
                    />
                    <div className="p-5 space-y-4">
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
                          <code className="font-mono bg-muted px-1 rounded">1</code>
                          ,{" "}
                          <code className="font-mono bg-muted px-1 rounded">
                            hired
                          </code>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Protected attributes */}
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <CardHeader
                      icon={<Scale className="w-3.5 h-3.5" />}
                      title="Protected attributes"
                      subtitle="Demographic fields to monitor in the live stream"
                      right={
                        config.protected.length > 0 ? (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#caff3d]/15 text-black border border-[#caff3d]/30">
                            {config.protected.length} selected
                          </span>
                        ) : undefined
                      }
                    />
                    <div className="p-5 space-y-4">
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
                                onClick={() =>
                                  setConfig((prev) => ({
                                    ...prev,
                                    protected: prev.protected.includes(col)
                                      ? prev.protected.filter((c) => c !== col)
                                      : [...prev.protected, col],
                                  }))
                                }
                              />
                            ))}
                      </div>

                      {config.protected.length > 0 && (
                        <div className="flex items-center gap-2 pt-3 border-t border-border">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#caff3d]" />
                          <span className="text-xs text-muted-foreground">
                            Monitoring:{" "}
                            <code className="font-mono text-foreground text-xs">
                              {config.protected.join(", ")}
                            </code>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Empty / ready state ──────────────────────────── */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="flex flex-col items-center text-center gap-4 py-14 px-8">
                  {/* Idle icon */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <Shield className="w-7 h-7 text-muted-foreground/50" />
                    </div>
                    <div className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-[#caff3d]/20 border border-[#caff3d]/40 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#caff3d]" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      {step === 0
                        ? "Load a dataset to begin"
                        : canStart
                        ? "Ready to monitor"
                        : "Select outcome and protected attributes"}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                      Shield Mode streams AI decisions in real-time and monitors fairness
                      metrics on a rolling window. Bias is caught the moment it appears.
                    </p>
                  </div>

                  {/* Step pills */}
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    {[
                      { label: "Upload dataset", done: step >= 1 },
                      { label: "Configure columns", done: canStart },
                      { label: "Start monitoring", done: isStreaming },
                    ].map((s, i) => (
                      <span
                        key={i}
                        className={[
                          "inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border",
                          s.done
                            ? "bg-[#caff3d]/10 border-[#caff3d]/30 text-black font-semibold"
                            : "bg-muted border-border text-muted-foreground",
                        ].join(" ")}
                      >
                        {s.done ? (
                          <CheckCircle2 className="w-3 h-3 text-[#caff3d]" />
                        ) : (
                          <span className="w-3 h-3 rounded-full border border-border flex-shrink-0" />
                        )}
                        {s.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Live dashboard ───────────────────────────────────── */}
        <AnimatePresence>
          {(isStreaming || currentMetrics) && (
            <motion.div
              key="dashboard"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-5"
            >
              {/* ── Row 1: Metric cards ──────────────────────────── */}
              <motion.div
                variants={staggerChild}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <MetricCard
                  icon={<Activity className="w-4 h-4" />}
                  title="Decisions analyzed"
                  value={totalAnalyzed.toLocaleString()}
                  subtitle="Rolling window"
                />
                <MetricCard
                  icon={<Shield className="w-4 h-4" />}
                  title="Fairness score"
                  value={`${currentMetrics?.fairness_score ?? "—"}/100`}
                  severity={fairnessSev}
                  subtitle="Current window"
                />
                {Object.entries(
                  currentMetrics?.rates?.gender_rates || {}
                ).map(([group, rate]) => (
                  <MetricCard
                    key={group}
                    icon={<Users className="w-4 h-4" />}
                    title={`${group} approval`}
                    value={`${(rate * 100).toFixed(0)}%`}
                    subtitle="Live rate"
                  />
                ))}
              </motion.div>

              {/* ── Row 2: Charts ────────────────────────────────── */}
              <motion.div
                variants={staggerChild}
                className="grid md:grid-cols-2 gap-4"
              >
                {/* Fairness trend */}
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <CardHeader
                    icon={<Activity className="w-3.5 h-3.5" />}
                    title="Fairness score trend"
                    subtitle="Rolling window · last 100 batches"
                    right={
                      isStreaming ? (
                        <div className="flex items-center gap-1.5">
                          <LiveDot />
                          <span className="text-[10px] font-semibold text-[#caff3d] uppercase tracking-wider">
                            Live
                          </span>
                        </div>
                      ) : undefined
                    }
                  />
                  <div className="p-5 pt-4">
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={fairnessHistory}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(0,0,0,0.06)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="batch"
                          tick={{ fill: "#9ca3af", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[0, 100]}
                          tick={{ fill: "#9ca3af", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                          width={28}
                        />
                        {/* Threshold line */}
                        <ReferenceLine
                          y={70}
                          stroke="#ff8c42"
                          strokeDasharray="5 3"
                          strokeWidth={1.5}
                          label={{
                            value: "70",
                            position: "right",
                            fill: "#ff8c42",
                            fontSize: 10,
                            fontWeight: 600,
                          }}
                        />
                        <Tooltip
                          content={<ChartTooltip />}
                          cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 1 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#caff3d"
                          strokeWidth={2}
                          dot={false}
                          name="Fairness score"
                          activeDot={{
                            r: 4,
                            fill: "#caff3d",
                            stroke: "rgba(202,255,61,0.3)",
                            strokeWidth: 4,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Group approval rates */}
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <CardHeader
                    icon={<Users className="w-3.5 h-3.5" />}
                    title="Approval rates by group"
                    subtitle="Divergence indicates potential bias"
                    right={
                      groupNames.length > 0 ? (
                        <div className="flex items-center gap-2">
                          {groupNames.map((g, i) => (
                            <div key={g} className="flex items-center gap-1">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{
                                  background:
                                    GROUP_COLORS[i % GROUP_COLORS.length],
                                }}
                              />
                              <span className="text-[10px] text-muted-foreground font-medium">
                                {g}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : undefined
                    }
                  />
                  <div className="p-5 pt-4">
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={groupHistory}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(0,0,0,0.06)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="batch"
                          tick={{ fill: "#9ca3af", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[0, 100]}
                          tick={{ fill: "#9ca3af", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                          width={32}
                          tickFormatter={(v) => `${v}%`}
                        />
                        <Tooltip
                          content={<ChartTooltip suffix="%" />}
                          cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 1 }}
                        />
                        {groupNames.map((group, i) => (
                          <Line
                            key={group}
                            type="monotone"
                            dataKey={group}
                            stroke={GROUP_COLORS[i % GROUP_COLORS.length]}
                            strokeWidth={2}
                            dot={false}
                            name={group}
                            activeDot={{
                              r: 4,
                              fill: GROUP_COLORS[i % GROUP_COLORS.length],
                              stroke: `${GROUP_COLORS[i % GROUP_COLORS.length]}33`,
                              strokeWidth: 4,
                            }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>

              {/* ── Row 3: Latest decisions ──────────────────────── */}
              {latestDecisions.length > 0 && (
                <motion.div variants={staggerChild}>
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <CardHeader
                      icon={<BarChart3 className="w-3.5 h-3.5" />}
                      title="Latest decisions"
                      subtitle="Most recent entries processed by the stream"
                      right={
                        currentMetrics?.is_real_gemini ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-[#9a77f8]/10 text-[#9a77f8] border border-[#9a77f8]/20">
                            <Cpu className="w-3 h-3" />
                            via Gemini
                          </span>
                        ) : undefined
                      }
                    />

                    <div className="p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                        {latestDecisions.map((d, i) => {
                          const approved = d.decision === "APPROVED";
                          return (
                            <div
                              key={i}
                              className={[
                                "flex items-center justify-between gap-2 px-3 py-2.5",
                                "rounded-lg border text-sm transition-colors",
                                approved
                                  ? "bg-[#caff3d]/5 border-[#caff3d]/20"
                                  : "bg-[#ff6b7a]/5 border-[#ff6b7a]/15",
                              ].join(" ")}
                            >
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground text-xs truncate">
                                  {d.name}
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  {d.gender}
                                </p>
                              </div>
                              <span
                                className={[
                                  "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5",
                                  "rounded-full border flex-shrink-0",
                                  approved
                                    ? "bg-[#caff3d]/15 text-black border-[#caff3d]/30"
                                    : "bg-[#ff6b7a]/10 text-[#ff6b7a] border-[#ff6b7a]/25",
                                ].join(" ")}
                              >
                                {approved ? "✓" : "✗"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Row 4: Alert feed ────────────────────────────── */}
              <motion.div variants={staggerChild}>
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <CardHeader
                    icon={<Bell className="w-3.5 h-3.5" />}
                    title="Alert feed"
                    subtitle="Bias events detected in the live stream"
                    right={
                      alerts.length > 0 ? (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#ff6b7a]/10 text-[#ff6b7a] border border-[#ff6b7a]/25">
                          {alerts.length} alert{alerts.length !== 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#caff3d]" />
                          No alerts
                        </span>
                      )
                    }
                  />
                  <div className="p-5">
                    <AlertFeed alerts={alerts} maxItems={10} />
                  </div>
                </div>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}