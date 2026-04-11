"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import CsvDropzone from "@/components/csv-dropzone";
import ScoreGauge from "@/components/score-gauge";
import BiasChart from "@/components/bias-chart";
import BiasFingerprint from "@/components/bias-fingerprint";
import FairnessDebtCard from "@/components/fairness-debt-card";
import MetricCard from "@/components/metric-card";
import { Loader2, ArrowRight, RotateCcw, CheckCircle2, Upload, Settings, BarChart3, FileSearch } from "lucide-react";

const STEPS = ["Upload", "Configure", "Analyzing", "Results"];

const STEP_ICONS = [
  <Upload key="u" className="w-4 h-4" />,
  <Settings key="s" className="w-4 h-4" />,
  <Loader2 key="l" className="w-4 h-4" />,
  <BarChart3 key="b" className="w-4 h-4" />,
];

const DEMO_DATASETS = [
  { label: "💼 Hiring Bias (CSV)", file: "/demo_hiring_data.csv", type: "csv" },
  { label: "💼 Hiring Bias (JSON)", file: "/demo_hiring_data.json", type: "json" },
  { label: "📱 Content Moderation", file: "/demo_content_moderation.csv", type: "csv" },
  { label: "💰 Algorithmic Pricing", file: "/demo_pricing_data.csv", type: "csv" },
];

export default function AuditPage() {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [detected, setDetected] = useState(null);
  const [domainInfo, setDomainInfo] = useState(null);
  const [config, setConfig] = useState({ outcome: "", protected: [], positiveOutcome: "1", qualColumn: "" });
  const [results, setResults] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [compliance, setCompliance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processData = useCallback(async (parsedData) => {
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

      // Auto-fill config
      const autoOutcome = det.detected?.decision_columns?.[0]?.column || "";
      const autoProtected = (det.detected?.protected_columns || []).map(c => c.column);
      setConfig(prev => ({
        ...prev,
        outcome: autoOutcome,
        protected: autoProtected,
      }));
      setStep(1);
    } catch (e) {
      setError(`Column detection failed: ${e.message}`);
    }
  }, []);

  const handleFile = useCallback(async (f) => {
    if (!f) { setFile(null); setData(null); setDomainInfo(null); return; }
    setFile(f);
    setError(null);

    const isJson = f.name?.toLowerCase().endsWith(".json");

    if (isJson) {
      // Parse JSON
      try {
        const text = await f.text();
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          setError("JSON file must contain an array of objects (rows).");
          return;
        }
        await processData(parsed);
      } catch (e) {
        setError(`JSON parsing failed: ${e.message}`);
      }
    } else {
      // Parse CSV
      Papa.parse(f, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
          await processData(result.data);
        },
        error: (e) => setError(`CSV parsing failed: ${e.message}`),
      });
    }
  }, [processData]);

  const loadDemo = async (url, type) => {
    setError(null);
    try {
      const res = await fetch(url);
      const text = await res.text();
      const ext = type === "json" ? ".json" : ".csv";
      const mimeType = type === "json" ? "application/json" : "text/csv";
      const f = new File([text], url.split("/").pop(), { type: mimeType });
      handleFile(f);
    } catch (e) {
      setError(`Failed to load demo: ${e.message}`);
    }
  };

  const runAnalysis = async () => {
    if (!config.outcome || !config.protected.length) {
      setError("Select an outcome column and at least one protected attribute");
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

      // Fire and forget: get Gemini explanation
      fetch("/api/audit/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics: json.results }),
      })
        .then(r => r.json())
        .then(r => setExplanation(r.explanation))
        .catch(() => {});

      // Fire and forget: get compliance check
      fetch("/api/audit/compliance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics: json.results }),
      })
        .then(r => r.json())
        .then(r => setCompliance(r.compliance))
        .catch(() => {});

      // Fire and forget: save to audit history
      fetch("/api/history/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: json.results }),
      }).catch(() => {});
    } catch (e) {
      setError(`Analysis failed: ${e.message}`);
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0); setFile(null); setData(null); setDetected(null);
    setResults(null); setExplanation(null); setCompliance(null);
    setError(null); setDomainInfo(null);
    setConfig({ outcome: "", protected: [], positiveOutcome: "1", qualColumn: "" });
  };

  const toggleProtected = (col) => {
    setConfig(prev => ({
      ...prev,
      protected: prev.protected.includes(col)
        ? prev.protected.filter(c => c !== col)
        : [...prev.protected, col],
    }));
  };

  const getSeverityBorderColor = (severity) => {
    if (severity === "CRITICAL") return "border-l-[#FF2D55]";
    if (severity === "HIGH" || severity === "WARNING") return "border-l-[#FFAA00]";
    if (severity === "OK") return "border-l-[#00C853]";
    return "border-l-[#E2E6ED]";
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-[#0A1628]">
            <FileSearch className="w-8 h-8 text-[#007AFF]" />
            Audit Mode
            {domainInfo && (
              <Badge className="text-sm bg-[#0D2045] text-white font-normal gap-1.5 px-3 py-1">
                {domainInfo.icon} {domainInfo.label}
              </Badge>
            )}
          </h1>
          <p className="text-[#5A6A85] mt-1">Upload any dataset (CSV or JSON) → detect bias → get plain English explanations → understand legal risk</p>
        </div>
        {step > 0 && (
          <Button variant="outline" size="sm" onClick={reset} className="gap-2 bg-white border-[#E2E6ED] text-[#0A1628] hover:bg-[#F5F7FA]">
            <RotateCcw className="w-4 h-4" /> Start Over
          </Button>
        )}
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-9 h-9 flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              i < step
                ? "bg-[#00C853] text-white"
                : i === step
                  ? "bg-[#0D2045] text-white shadow-md"
                  : "bg-[#F0F2F5] text-[#5A6A85]"
            }`} style={{ borderRadius: '8px' }}>
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : STEP_ICONS[i]}
            </div>
            <span className={`text-sm font-medium ${i <= step ? "text-[#0A1628]" : "text-[#5A6A85]"}`}>{s}</span>
            {i < STEPS.length - 1 && (
              <div className={`w-12 h-0.5 mx-1 transition-colors ${i < step ? "bg-[#00C853]" : "bg-[#E2E6ED]"}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[#FF2D55]/5 border border-[#FF2D55]/20 text-[#FF2D55] text-sm font-medium" style={{ borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* STEP 0: Upload */}
        {step === 0 && (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <CsvDropzone onFileLoaded={handleFile} file={file} />
            <div className="mt-8 text-center">
              <p className="text-sm text-[#5A6A85] mb-4 font-medium">Or try with a demo dataset:</p>
              <div className="flex justify-center gap-3 flex-wrap">
                {DEMO_DATASETS.map((d) => (
                  <Button
                    key={d.file + d.type}
                    variant="outline"
                    size="sm"
                    onClick={() => loadDemo(d.file, d.type)}
                    className="bg-white border-[#E2E6ED] text-[#0A1628] hover:border-[#00C853]/40 hover:bg-[#00C853]/5 transition-all"
                  >
                    {d.label}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 1: Configure */}
        {step === 1 && (
          <motion.div key="configure" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            {/* Domain detection badge */}
            {domainInfo && (
              <Card className="bg-[#0D2045] border-0 text-white">
                <CardContent className="py-4 flex items-center gap-3">
                  <span className="text-2xl">{domainInfo.icon}</span>
                  <div>
                    <p className="font-semibold">Detected domain: <span className="text-[#00E676]">{domainInfo.label}</span></p>
                    <p className="text-xs text-[#8BA3C7]">Compliance checks will reference: {domainInfo.compliance?.join(", ")}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white border-[#E2E6ED]">
              <CardHeader><CardTitle className="text-lg text-[#0A1628]">📊 Outcome Column (the decision)</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(detected?.decision_columns || []).map(c => (
                    <Button
                      key={c.column}
                      size="sm"
                      variant={config.outcome === c.column ? "default" : "outline"}
                      className={config.outcome === c.column ? "bg-[#0D2045] text-white hover:bg-[#1A3A6E]" : "bg-white border-[#E2E6ED] text-[#0A1628] hover:border-[#0D2045]/30"}
                      onClick={() => setConfig(prev => ({ ...prev, outcome: c.column }))}
                    >
                      {c.column} <Badge className="ml-1 text-xs bg-[#00C853]/15 text-[#00C853] border-0">auto</Badge>
                    </Button>
                  ))}
                  {(detected?.feature_columns || []).filter(c => c.unique_count <= 10).map(c => (
                    <Button
                      key={c.column}
                      size="sm"
                      variant={config.outcome === c.column ? "default" : "outline"}
                      className={config.outcome === c.column ? "bg-[#0D2045] text-white hover:bg-[#1A3A6E]" : "bg-white border-[#E2E6ED] text-[#0A1628]"}
                      onClick={() => setConfig(prev => ({ ...prev, outcome: c.column }))}
                    >
                      {c.column}
                    </Button>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-[#5A6A85]">Positive outcome value:</span>
                  <input
                    className="w-20 px-3 py-1.5 bg-[#F5F7FA] border border-[#E2E6ED] text-sm text-[#0A1628] font-mono focus:outline-none focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853]/30 transition-colors"
                    value={config.positiveOutcome}
                    onChange={e => setConfig(prev => ({ ...prev, positiveOutcome: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E2E6ED]">
              <CardHeader><CardTitle className="text-lg text-[#0A1628]">👥 Protected Attributes</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(data ? Object.keys(data[0] || {}) : []).filter(c => c !== config.outcome).map(col => (
                    <Button
                      key={col} size="sm"
                      variant={config.protected.includes(col) ? "default" : "outline"}
                      className={config.protected.includes(col) ? "bg-[#0D2045] text-white hover:bg-[#1A3A6E]" : "bg-white border-[#E2E6ED] text-[#0A1628] hover:border-[#0D2045]/30"}
                      onClick={() => toggleProtected(col)}
                    >
                      {col}
                      {detected?.protected_columns?.some(p => p.column === col) && (
                        <Badge className="ml-1 text-xs bg-[#007AFF]/15 text-[#007AFF] border-0">suggested</Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                size="lg"
                className="bg-[#00C853] hover:bg-[#00E676] text-white gap-2 font-semibold shadow-lg shadow-[#00C853]/20 transition-all"
                onClick={runAnalysis}
                disabled={!config.outcome || !config.protected.length}
              >
                Analyze for Bias <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Analyzing */}
        {step === 2 && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="w-16 h-16 flex items-center justify-center bg-[#00C853]/10 animate-pulse-green" style={{ borderRadius: '16px' }}>
              <Loader2 className="w-8 h-8 text-[#00C853] animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-[#0A1628]">Analyzing {data?.length?.toLocaleString()} rows...</p>
              <p className="text-[#5A6A85] mt-2">Running 5 fairness metrics across {config.protected.length} protected attributes</p>
            </div>
            <Progress value={66} className="w-64 h-2" />
          </motion.div>
        )}

        {/* STEP 3: Results */}
        {step === 3 && results && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            {/* Domain Badge */}
            {results.domain && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <Badge className="text-sm px-4 py-1.5 bg-[#0D2045] text-white font-medium">
                  {results.domain.icon} {results.domain.label}
                </Badge>
                <span className="text-xs text-[#5A6A85]">Domain auto-detected from column names</span>
              </motion.div>
            )}

            {/* Score + Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                <Card className="bg-white border-[#E2E6ED] flex items-center justify-center p-8">
                  <ScoreGauge score={results.fairness_score?.score || 0} label={results.fairness_score?.label} />
                </Card>
              </motion.div>
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                {[
                  {
                    icon: "📊", title: "Dataset Size",
                    value: `${results.dataset_info?.total_rows} rows`,
                    subtitle: `${results.dataset_info?.total_columns} columns`,
                    delay: 0.15
                  },
                  {
                    icon: "🎯", title: "Disparate Impact",
                    value: Object.values(results.per_attribute || {})[0]?.disparate_impact?.ratio?.toFixed(4) || "N/A",
                    severity: Object.values(results.per_attribute || {})[0]?.disparate_impact?.severity,
                    subtitle: "EEOC 80% Rule",
                    delay: 0.2
                  },
                  {
                    icon: "⚖️", title: "Demographic Parity",
                    value: ((Object.values(results.per_attribute || {})[0]?.demographic_parity?.difference || 0) * 100).toFixed(1) + "%",
                    severity: Object.values(results.per_attribute || {})[0]?.demographic_parity?.severity,
                    subtitle: "Gap between groups",
                    delay: 0.25
                  },
                  {
                    icon: "🔗", title: "Proxy Features",
                    value: results.proxies?.length || 0,
                    severity: results.proxies?.length > 0 ? "WARNING" : "OK",
                    subtitle: "Correlated with protected attrs",
                    delay: 0.3
                  },
                ].map((metric, i) => (
                  <motion.div key={metric.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: metric.delay }}>
                    <MetricCard icon={metric.icon} title={metric.title} value={metric.value} severity={metric.severity} subtitle={metric.subtitle} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bias Fingerprint + Per-attribute charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <BiasFingerprint fingerprint={results.fingerprint} />
              </motion.div>
              {Object.entries(results.per_attribute || {}).map(([attr, metrics], i) => (
                <motion.div key={attr} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }}>
                  <BiasChart
                    title={`Approval Rates by ${attr}`}
                    data={Object.entries(metrics.disparate_impact?.rates || {}).map(([group, rate]) => ({ group, rate }))}
                  />
                </motion.div>
              ))}
            </div>

            {/* Fairness Debt Score */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <FairnessDebtCard debt={results.fairness_debt} />
            </motion.div>

            {/* Proxy warnings */}
            {results.proxies?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Card className="bg-[#FFAA00]/5 border-[#FFAA00]/20 border-l-4 border-l-[#FFAA00]">
                  <CardHeader><CardTitle className="text-lg text-[#0A1628]">⚠️ Proxy Features Detected</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {results.proxies.map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white border border-[#E2E6ED]" style={{ borderRadius: '6px' }}>
                          <div>
                            <span className="font-mono font-semibold text-[#0A1628]">{p.feature}</span>
                            <span className="text-[#5A6A85] mx-2">→</span>
                            <span className="text-[#FFAA00] font-medium">{p.protected_attribute}</span>
                          </div>
                          <Badge variant="outline" className={`font-mono ${p.score > 0.6 ? "text-[#FF2D55] border-[#FF2D55]/30 bg-[#FF2D55]/5" : "text-[#FFAA00] border-[#FFAA00]/30 bg-[#FFAA00]/5"}`}>
                            {p.severity} ({p.score.toFixed(2)})
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* AI Explanation */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <Card className="bg-white border-[#E2E6ED] border-l-4 border-l-[#007AFF]">
                <CardHeader>
                  <CardTitle className="text-lg text-[#0A1628] flex items-center gap-2">
                    <span className="text-xl">🤖</span> AI Explanation
                    <Badge className="text-xs bg-[#007AFF]/10 text-[#007AFF] border-0 font-normal">Powered by Gemini</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {explanation ? (
                    <div className="space-y-4">
                      <p className="font-semibold text-lg text-[#0A1628]">{explanation.summary}</p>
                      <p className="text-[#5A6A85] leading-relaxed">{explanation.explanation}</p>
                      {explanation.legal_references?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#E2E6ED]">
                          {explanation.legal_references.map((r, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-[#F5F7FA] border-[#E2E6ED] text-[#5A6A85]">{r}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-[#5A6A85]">
                      <Loader2 className="w-4 h-4 animate-spin text-[#007AFF]" />
                      <span>Getting AI explanation...</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
