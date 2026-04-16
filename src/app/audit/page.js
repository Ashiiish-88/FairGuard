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
  { label: "Hiring Bias (CSV)", file: "/demo_hiring_data.csv", type: "csv" },
  { label: "Hiring Bias (JSON)", file: "/demo_hiring_data.json", type: "json" },
  { label: "Content Moderation", file: "/demo_content_moderation.csv", type: "csv" },
  { label: "Algorithmic Pricing", file: "/demo_pricing_data.csv", type: "csv" },
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
      const autoOutcome = det.detected?.decision_columns?.[0]?.column || "";
      const autoProtected = (det.detected?.protected_columns || []).map(c => c.column);
      setConfig(prev => ({ ...prev, outcome: autoOutcome, protected: autoProtected }));
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
      try {
        const text = await f.text();
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed) || parsed.length === 0) { setError("JSON file must contain an array of objects."); return; }
        await processData(parsed);
      } catch (e) { setError(`JSON parsing failed: ${e.message}`); }
    } else {
      Papa.parse(f, {
        header: true, skipEmptyLines: true,
        complete: async (result) => { await processData(result.data); },
        error: (e) => setError(`CSV parsing failed: ${e.message}`),
      });
    }
  }, [processData]);

  const loadDemo = async (url, type) => {
    setError(null);
    try {
      const res = await fetch(url);
      const text = await res.text();
      const f = new File([text], url.split("/").pop(), { type: type === "json" ? "application/json" : "text/csv" });
      handleFile(f);
    } catch (e) { setError(`Failed to load demo: ${e.message}`); }
  };

  const runAnalysis = async () => {
    if (!config.outcome || !config.protected.length) { setError("Select an outcome column and at least one protected attribute"); return; }
    setStep(2); setLoading(true); setError(null);
    try {
      const res = await fetch("/api/audit/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, outcome_column: config.outcome, protected_columns: config.protected, positive_outcome: config.positiveOutcome, qualification_column: config.qualColumn || null }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setResults(json.results);
      setStep(3);
      fetch("/api/audit/explain", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ metrics: json.results }) })
        .then(r => r.json()).then(r => setExplanation(r.explanation)).catch(() => {});
      fetch("/api/history/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ results: json.results }) }).catch(() => {});
    } catch (e) { setError(`Analysis failed: ${e.message}`); setStep(1); } finally { setLoading(false); }
  };

  const reset = () => {
    setStep(0); setFile(null); setData(null); setDetected(null);
    setResults(null); setExplanation(null); setError(null); setDomainInfo(null);
    setConfig({ outcome: "", protected: [], positiveOutcome: "1", qualColumn: "" });
  };

  const toggleProtected = (col) => {
    setConfig(prev => ({ ...prev, protected: prev.protected.includes(col) ? prev.protected.filter(c => c !== col) : [...prev.protected, col] }));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-[#111827]">
            <FileSearch className="w-8 h-8 text-[#F59E0B]" />
            Audit Mode
            {domainInfo && <Badge className="text-sm bg-[#111827] text-white font-normal gap-1.5 px-3 py-1">{domainInfo.label}</Badge>}
          </h1>
          <p className="text-[#6B7280] mt-1">Upload any dataset (CSV or JSON) &rarr; detect bias &rarr; get plain English explanations &rarr; understand legal risk</p>
        </div>
        {step > 0 && (
          <Button variant="outline" size="sm" onClick={reset} className="gap-2 bg-white border-[#E5E7EB] text-[#111827] hover:bg-[#F9FAFB]">
            <RotateCcw className="w-4 h-4" /> Start Over
          </Button>
        )}
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-9 h-9 flex items-center justify-center text-sm font-bold transition-all duration-300 rounded-lg ${
              i < step ? "bg-[#0D9488] text-white" : i === step ? "bg-[#111827] text-white shadow-md" : "bg-[#F3F4F6] text-[#6B7280]"
            }`}>
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : STEP_ICONS[i]}
            </div>
            <span className={`text-sm font-medium ${i <= step ? "text-[#111827]" : "text-[#6B7280]"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`w-12 h-0.5 mx-1 transition-colors ${i < step ? "bg-[#0D9488]" : "bg-[#E5E7EB]"}`} />}
          </div>
        ))}
      </div>

      {error && <div className="mb-6 p-4 bg-[#EF4444]/5 border border-[#EF4444]/20 text-[#EF4444] text-sm font-medium rounded-lg">{error}</div>}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <CsvDropzone onFileLoaded={handleFile} file={file} />
            <div className="mt-8 text-center">
              <p className="text-sm text-[#6B7280] mb-4 font-medium">Or try with a demo dataset:</p>
              <div className="flex justify-center gap-3 flex-wrap">
                {DEMO_DATASETS.map((d) => (
                  <Button key={d.file + d.type} variant="outline" size="sm" onClick={() => loadDemo(d.file, d.type)}
                    className="bg-white border-[#E5E7EB] text-[#111827] hover:border-[#F59E0B]/40 hover:bg-[#FEF3C7]/30 transition-all">{d.label}</Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="configure" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            {domainInfo && (
              <Card className="bg-[#F9FAFB] border-[#E5E7EB]">
                <CardContent className="py-4 flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-[#111827]">Detected domain: <span className="text-[#D97706]">{domainInfo.label}</span></p>
                    <p className="text-xs text-[#6B7280]">Compliance checks will reference: {domainInfo.compliance?.join(", ")}</p>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card className="bg-white border-[#E5E7EB]">
              <CardHeader><CardTitle className="text-lg text-[#111827]">Outcome Column (the decision)</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(detected?.decision_columns || []).map(c => (
                    <Button key={c.column} size="sm" variant={config.outcome === c.column ? "default" : "outline"}
                      className={config.outcome === c.column ? "bg-[#111827] text-white" : "bg-white border-[#E5E7EB] text-[#111827]"}
                      onClick={() => setConfig(prev => ({ ...prev, outcome: c.column }))}>
                      {c.column} <Badge className="ml-1 text-xs bg-[#0D9488]/15 text-[#0D9488] border-0">auto</Badge>
                    </Button>
                  ))}
                  {(detected?.feature_columns || []).filter(c => c.unique_count <= 10).map(c => (
                    <Button key={c.column} size="sm" variant={config.outcome === c.column ? "default" : "outline"}
                      className={config.outcome === c.column ? "bg-[#111827] text-white" : "bg-white border-[#E5E7EB] text-[#111827]"}
                      onClick={() => setConfig(prev => ({ ...prev, outcome: c.column }))}>{c.column}</Button>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-[#6B7280]">Positive outcome value:</span>
                  <input className="w-20 px-3 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] font-mono rounded focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/30 transition-colors"
                    value={config.positiveOutcome} onChange={e => setConfig(prev => ({ ...prev, positiveOutcome: e.target.value }))} />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-[#E5E7EB]">
              <CardHeader><CardTitle className="text-lg text-[#111827]">Protected Attributes</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(data ? Object.keys(data[0] || {}) : []).filter(c => c !== config.outcome).map(col => (
                    <Button key={col} size="sm" variant={config.protected.includes(col) ? "default" : "outline"}
                      className={config.protected.includes(col) ? "bg-[#111827] text-white" : "bg-white border-[#E5E7EB] text-[#111827]"}
                      onClick={() => toggleProtected(col)}>
                      {col}
                      {detected?.protected_columns?.some(p => p.column === col) && <Badge className="ml-1 text-xs bg-[#F59E0B]/15 text-[#D97706] border-0">suggested</Badge>}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <button className="group inline-flex items-stretch rounded-md overflow-hidden transition-all duration-150 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={runAnalysis} disabled={!config.outcome || !config.protected.length}>
                <span className="bg-[#F59E0B] px-4 py-3 flex items-center justify-center text-black group-hover:bg-[#D97706] transition-colors"><BarChart3 className="w-4 h-4" /></span>
                <span className="bg-[#111827] text-white text-[12px] font-bold tracking-[0.12em] uppercase px-6 py-3 flex items-center group-hover:bg-[#1f2937] transition-colors">Analyze for Bias <ArrowRight className="w-3.5 h-3.5 ml-2" /></span>
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="w-16 h-16 flex items-center justify-center bg-[#F59E0B]/10 rounded-2xl animate-pulse">
              <Loader2 className="w-8 h-8 text-[#F59E0B] animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-[#111827]">Analyzing {data?.length?.toLocaleString()} rows...</p>
              <p className="text-[#6B7280] mt-2">Running 5 fairness metrics across {config.protected.length} protected attributes</p>
            </div>
            <Progress value={66} className="w-64 h-2" />
          </motion.div>
        )}

        {step === 3 && results && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            {results.domain && (
              <div className="flex items-center gap-3">
                <Badge className="text-sm px-4 py-1.5 bg-[#111827] text-white font-medium">{results.domain.label}</Badge>
                <span className="text-xs text-[#6B7280]">Domain auto-detected from column names</span>
              </div>
            )}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white border-[#E5E7EB] flex items-center justify-center p-8">
                <ScoreGauge score={results.fairness_score?.score || 0} label={results.fairness_score?.label} />
              </Card>
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <MetricCard title="Dataset Size" value={`${results.dataset_info?.total_rows} rows`} description={`${results.dataset_info?.total_columns} columns`} />
                <MetricCard title="Disparate Impact" value={Object.values(results.per_attribute || {})[0]?.disparate_impact?.ratio?.toFixed(4) || "N/A"}
                  severity={(Object.values(results.per_attribute || {})[0]?.disparate_impact?.severity || "ok").toLowerCase()} description="EEOC 80% Rule" />
                <MetricCard title="Demographic Parity" value={((Object.values(results.per_attribute || {})[0]?.demographic_parity?.difference || 0) * 100).toFixed(1) + "%"}
                  severity={(Object.values(results.per_attribute || {})[0]?.demographic_parity?.severity || "ok").toLowerCase()} description="Gap between groups" />
                <MetricCard title="Proxy Features" value={results.proxies?.length || 0}
                  severity={results.proxies?.length > 0 ? "warning" : "ok"} description="Correlated with protected attrs" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <BiasFingerprint fingerprint={results.fingerprint} />
              {Object.entries(results.per_attribute || {}).map(([attr, metrics]) => (
                <BiasChart key={attr} title={`Approval Rates by ${attr}`}
                  data={Object.entries(metrics.disparate_impact?.rates || {}).map(([group, rate]) => ({ group, rate }))} />
              ))}
            </div>
            <FairnessDebtCard debtData={results.fairness_debt} />
            {results.proxies?.length > 0 && (
              <Card className="bg-[#F59E0B]/5 border-[#F59E0B]/20 border-l-4 border-l-[#F59E0B]">
                <CardHeader><CardTitle className="text-lg text-[#111827]">Proxy Features Detected</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.proxies.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white border border-[#E5E7EB] rounded-md">
                        <div>
                          <span className="font-mono font-semibold text-[#111827]">{p.feature}</span>
                          <span className="text-[#6B7280] mx-2">&rarr;</span>
                          <span className="text-[#D97706] font-medium">{p.protected_attribute}</span>
                        </div>
                        <Badge variant="outline" className={`font-mono ${p.score > 0.6 ? "text-[#EF4444] border-[#EF4444]/30 bg-[#EF4444]/5" : "text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/5"}`}>
                          {p.severity} ({p.score.toFixed(2)})
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            <Card className="bg-white border-[#E5E7EB] border-l-4 border-l-[#0D9488]">
              <CardHeader>
                <CardTitle className="text-lg text-[#111827] flex items-center gap-2">
                  AI Explanation <Badge className="text-xs bg-[#0D9488]/10 text-[#0D9488] border-0 font-normal">Powered by Gemini</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {explanation ? (
                  <div className="space-y-4">
                    <p className="font-semibold text-lg text-[#111827]">{explanation.summary}</p>
                    <p className="text-[#6B7280] leading-relaxed">{explanation.explanation}</p>
                    {explanation.legal_references?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#E5E7EB]">
                        {explanation.legal_references.map((r, i) => <Badge key={i} variant="outline" className="text-xs bg-[#F9FAFB] border-[#E5E7EB] text-[#6B7280]">{r}</Badge>)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-[#6B7280]">
                    <Loader2 className="w-4 h-4 animate-spin text-[#0D9488]" /> Getting AI explanation...
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
