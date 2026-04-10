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
import MetricCard from "@/components/metric-card";
import { Loader2, ArrowRight, RotateCcw } from "lucide-react";

const STEPS = ["Upload", "Configure", "Analyzing", "Results"];

const DEMO_DATASETS = [
  { label: "Hiring Bias (Gender/Age)", file: "/demo_hiring_data.csv" },
];

export default function AuditPage() {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [detected, setDetected] = useState(null);
  const [config, setConfig] = useState({ outcome: "", protected: [], positiveOutcome: "1", qualColumn: "" });
  const [results, setResults] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = useCallback(async (f) => {
    if (!f) { setFile(null); setData(null); return; }
    setFile(f);
    setError(null);

    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        setData(result.data);
        try {
          const res = await fetch("/api/audit/detect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: result.data.slice(0, 100) }),
          });
          const det = await res.json();
          setDetected(det.detected);

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
      },
      error: (e) => setError(`CSV parsing failed: ${e.message}`),
    });
  }, []);

  const loadDemo = async (url) => {
    setError(null);
    try {
      const res = await fetch(url);
      const text = await res.text();
      const f = new File([text], url.split("/").pop(), { type: "text/csv" });
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
    } catch (e) {
      setError(`Analysis failed: ${e.message}`);
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0); setFile(null); setData(null); setDetected(null);
    setResults(null); setExplanation(null); setError(null);
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">🔍 Audit Mode</h1>
          <p className="text-muted-foreground mt-1">Upload a dataset → detect bias → get plain English explanations → fix it</p>
        </div>
        {step > 0 && (
          <Button variant="outline" size="sm" onClick={reset} className="gap-2">
            <RotateCcw className="w-4 h-4" /> Start Over
          </Button>
        )}
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              i <= step ? "gradient-bg text-white" : "bg-muted text-muted-foreground"
            }`}>
              {i + 1}
            </div>
            <span className={`text-sm ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`w-12 h-0.5 ${i < step ? "gradient-bg" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
      )}

      <AnimatePresence mode="wait">
        {/* STEP 0: Upload */}
        {step === 0 && (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <CsvDropzone onFileLoaded={handleFile} file={file} />
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">Try with a demo dataset:</p>
              <div className="flex justify-center gap-3 flex-wrap">
                {DEMO_DATASETS.map((d) => (
                  <Button key={d.file} variant="outline" size="sm" onClick={() => loadDemo(d.file)}>
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
            <Card className="bg-card/50 border-border/50">
              <CardHeader><CardTitle className="text-lg">📊 Outcome Column (the decision)</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(detected?.decision_columns || []).map(c => (
                    <Button key={c.column} size="sm" variant={config.outcome === c.column ? "default" : "outline"} onClick={() => setConfig(prev => ({ ...prev, outcome: c.column }))}>
                      {c.column} <Badge className="ml-1 text-xs" variant="secondary">auto-detected</Badge>
                    </Button>
                  ))}
                  {(detected?.feature_columns || []).filter(c => c.unique_count <= 10).map(c => (
                    <Button key={c.column} size="sm" variant={config.outcome === c.column ? "default" : "outline"} onClick={() => setConfig(prev => ({ ...prev, outcome: c.column }))}>
                      {c.column}
                    </Button>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Positive outcome value:</span>
                  <input
                    className="w-20 px-2 py-1 bg-muted/50 border border-border rounded text-sm"
                    value={config.positiveOutcome}
                    onChange={e => setConfig(prev => ({ ...prev, positiveOutcome: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader><CardTitle className="text-lg">👥 Protected Attributes</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(data ? Object.keys(data[0] || {}) : []).filter(c => c !== config.outcome).map(col => (
                    <Button
                      key={col} size="sm"
                      variant={config.protected.includes(col) ? "default" : "outline"}
                      className={config.protected.includes(col) ? "gradient-bg text-white" : ""}
                      onClick={() => toggleProtected(col)}
                    >
                      {col}
                      {detected?.protected_columns?.some(p => p.column === col) && (
                        <Badge className="ml-1 text-xs" variant="secondary">suggested</Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button size="lg" className="gradient-bg text-white gap-2" onClick={runAnalysis} disabled={!config.outcome || !config.protected.length}>
                Analyze for Bias <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Analyzing */}
        {step === 2 && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 gap-6">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            <div className="text-center">
              <p className="text-xl font-semibold">Analyzing {data?.length?.toLocaleString()} rows...</p>
              <p className="text-muted-foreground mt-1">Running 5 fairness metrics across {config.protected.length} protected attributes</p>
            </div>
            <Progress value={66} className="w-64" />
          </motion.div>
        )}

        {/* STEP 3: Results */}
        {step === 3 && results && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Score + Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card/50 border-border/50 flex items-center justify-center p-8">
                <ScoreGauge score={results.fairness_score?.score || 0} label={results.fairness_score?.label} />
              </Card>
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <MetricCard icon="📊" title="Dataset Size" value={`${results.dataset_info?.total_rows} rows`} subtitle={`${results.dataset_info?.total_columns} columns`} />
                <MetricCard icon="🎯" title="Disparate Impact" value={
                  Object.values(results.per_attribute || {})[0]?.disparate_impact?.ratio?.toFixed(4) || "N/A"
                } severity={Object.values(results.per_attribute || {})[0]?.disparate_impact?.severity} subtitle="EEOC 80% Rule" />
                <MetricCard icon="⚖️" title="Demographic Parity" value={
                  ((Object.values(results.per_attribute || {})[0]?.demographic_parity?.difference || 0) * 100).toFixed(1) + "%"
                } severity={Object.values(results.per_attribute || {})[0]?.demographic_parity?.severity} subtitle="Gap between groups" />
                <MetricCard icon="🔗" title="Proxy Features" value={results.proxies?.length || 0} severity={results.proxies?.length > 0 ? "WARNING" : "OK"} subtitle="Features correlated with protected attrs" />
              </div>
            </div>

            {/* Per-attribute charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(results.per_attribute || {}).map(([attr, metrics]) => (
                <BiasChart
                  key={attr}
                  title={`Approval Rates by ${attr}`}
                  data={Object.entries(metrics.disparate_impact?.rates || {}).map(([group, rate]) => ({ group, rate }))}
                />
              ))}
            </div>

            {/* Proxy warnings */}
            {results.proxies?.length > 0 && (
              <Card className="bg-orange-500/5 border-orange-500/20">
                <CardHeader><CardTitle className="text-lg text-orange-400">⚠️ Proxy Features Detected</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.proxies.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div>
                          <span className="font-mono font-semibold">{p.feature}</span>
                          <span className="text-muted-foreground mx-2">→</span>
                          <span className="text-orange-400">{p.protected_attribute}</span>
                        </div>
                        <Badge variant="outline" className={p.score > 0.6 ? "text-red-400 border-red-500/30" : "text-yellow-400 border-yellow-500/30"}>
                          {p.severity} ({p.score.toFixed(2)})
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Explanation */}
            <Card className="bg-purple-500/5 border-purple-500/20">
              <CardHeader><CardTitle className="text-lg gradient-text">🤖 AI Explanation (Powered by Gemini)</CardTitle></CardHeader>
              <CardContent>
                {explanation ? (
                  <div className="space-y-4">
                    <p className="font-semibold text-lg">{explanation.summary}</p>
                    <p className="text-muted-foreground leading-relaxed">{explanation.explanation}</p>
                    {explanation.legal_references?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {explanation.legal_references.map((r, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{r}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Getting AI explanation...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
