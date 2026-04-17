"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Papa from "papaparse";
import CsvDropzone from "@/components/csv-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MetricCard from "@/components/metric-card";
import AlertFeed from "@/components/alert-feed";
import { Play, Square, Shield, RotateCcw } from "lucide-react";

// Dynamic line colors for groups
const GROUP_COLORS = ["#00E676", "#FF2D55", "#007AFF", "#FFAA00", "#A855F7", "#06B6D4"];

const DEMO_DATASETS = [
  { label: "Hiring Bias (CSV)", file: "/demo_hiring_data.csv", type: "csv" },
  { label: "Hiring Bias (JSON)", file: "/demo_hiring_data.json", type: "json" },
  { label: "Content Moderation", file: "/demo_content_moderation.csv", type: "csv" },
  { label: "Algorithmic Pricing", file: "/demo_pricing_data.csv", type: "csv" },
];

const AI_MODELS = [
  { id: "gemini",    label: "Gemini 2.5 Flash",  badge: "Google",  color: "#007AFF" },
  { id: "llama-8b",  label: "Llama 3.1 8B",      badge: "Groq ⚡", color: "#FFAA00" },
  { id: "llama-70b", label: "Llama 3.3 70B",      badge: "Groq ⚡", color: "#A855F7" },
];

export default function ShieldPage() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [fairnessHistory, setFairnessHistory] = useState([]);
  const [groupHistory, setGroupHistory] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [currentMetrics, setCurrentMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [totalAnalyzed, setTotalAnalyzed] = useState(0);
  const [latestDecisions, setLatestDecisions] = useState([]);
  const [selectedModel, setSelectedModel] = useState("gemini");
  const abortControllerRef = useRef(null);
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [domainInfo, setDomainInfo] = useState(null);
  const [detected, setDetected] = useState(null);
  const [config, setConfig] = useState({ outcome: "", protected: [], positiveOutcome: "1", qualColumn: "" });
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);

  const handleFile = useCallback(async (f) => {
    if (!f) { setFile(null); setData(null); setDomainInfo(null); return; }
    setFile(f);
    
    const isJson = f.name?.toLowerCase().endsWith(".json");
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
        
        const autoOutcome = det.detected?.decision_columns?.[0]?.column || "";
        const autoProtected = (det.detected?.protected_columns || []).map(c => c.column);
        setConfig(prev => ({ ...prev, outcome: autoOutcome, protected: autoProtected }));
        setStep(1);
      } catch (e) {}
    
    };

    if (isJson) {
      try {
        const text = await f.text();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) processData(parsed);
      } catch(e) {}
    } else {
      Papa.parse(f, {
        header: true, skipEmptyLines: true,
        complete: (res) => processData(res.data)
      });
    }
  }, []);

  const loadDemo = async (url, type) => {
    try {
      const res = await fetch(url);
      const text = await res.text();
      const ext = type === "json" ? ".json" : ".csv";
      const mimeType = type === "json" ? "application/json" : "text/csv";
      const f = new File([text], url.split("/").pop(), { type: mimeType });
      handleFile(f);
    } catch (e) {}
  };

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
        body: JSON.stringify({ source_data: data, domain: domainInfo?.domain || "hiring", config: config }),
        signal: ac.signal
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        
        let lines = buffer.split('\n\n');
        buffer = lines.pop(); // keep remainder
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const d = JSON.parse(line.substring(6));

              if (d.status === "complete") {
                setIsStreaming(false);
                return;
              }

              setCurrentMetrics(d);
              setTotalAnalyzed(d.total_analyzed);

              setFairnessHistory(prev => [...prev.slice(-100), {
                batch: d.total_analyzed,
                score: d.fairness_score,
              }]);

              const genderRates = d.rates?.gender_rates || {};
              const point = { batch: d.total_analyzed };
              for (const [group, rate] of Object.entries(genderRates)) {
                point[group] = Math.round(rate * 1000) / 10;
              }
              setGroupHistory(prev => [...prev.slice(-100), point]);

              setGroupNames(prev => {
                const newNames = Object.keys(genderRates);
                return [...new Set([...prev, ...newNames])];
              });

              if (d.latest_decisions) setLatestDecisions(d.latest_decisions);

              if (d.alerts?.length) {
                setAlerts(prev => [...prev, ...d.alerts.map((a, i) => ({
                  ...a,
                  id: `${d.total_analyzed}-${i}`,
                  timestamp: new Date().toISOString(),
                }))]);
              }
            } catch (e) {}
          }
        }
      }
    } catch (e) {
      if (e.name !== "AbortError") console.error(e);
    } finally {
      setIsStreaming(false);
    }
  }, [selectedModel, data, domainInfo]);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  useEffect(() => {
    return () => { if (abortControllerRef.current) abortControllerRef.current.abort(); };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">🛡️ Shield Mode</h1>
          <p className="text-muted-foreground mt-1">Real-time bias monitoring — AI decisions stream in and bias is caught as it happens</p>
        </div>
        <div className="flex items-center gap-3">
          {currentMetrics?.is_real_model && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              ✨ {currentMetrics?.model_label || "Live AI"}
            </Badge>
          )}
          <Button
            size="lg"
            onClick={isStreaming ? stopStream : startStream}
            disabled={!isStreaming && (!currentMetrics && (step === 0 || !config.outcome || config.protected.length === 0))}
            className={isStreaming ? "bg-red-500 hover:bg-red-600 text-white" : "gradient-bg text-white disabled:opacity-50"}
          >
            {isStreaming ? <><Square className="w-4 h-4 mr-2" /> Stop</> : <><Play className="w-4 h-4 mr-2" /> Start Monitoring</>}
          </Button>
        </div>
      </div>

      {/* AI Model Selector */}
      {!isStreaming && !currentMetrics && (
        <div className="flex flex-wrap gap-2 mb-6">
          {AI_MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m.id)}
              className={`px-4 py-2 text-sm font-medium border-2 transition-all ${
                selectedModel === m.id
                  ? "border-[#00E676]/60 bg-[#00E676]/10 text-foreground"
                  : "border-border/50 bg-card/30 text-muted-foreground hover:border-border"
              }`}
            >
              {m.label}
              <span className="ml-2 text-xs opacity-60">{m.badge}</span>
            </button>
          ))}
        </div>
      )}

      
      
      {/* Upload CSV UI */}
      {!isStreaming && !currentMetrics && step === 0 && (
        <div className="mb-8 bg-card/50 border-border/50 py-8 px-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-center">1. Select Data Stream</h2>
          <CsvDropzone onFileLoaded={handleFile} file={file} />
          {domainInfo && (
            <div className="mt-4 flex items-center justify-center">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                Detected Domain: {domainInfo.label}
              </Badge>
            </div>
          )}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">Or intercept decisions from a demo stream:</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {DEMO_DATASETS.map((d) => (
                <Button key={d.file + d.type} variant="outline" size="sm" onClick={() => loadDemo(d.file, d.type)}>
                  {d.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Configure UI */}
      {!isStreaming && !currentMetrics && step === 1 && (
        <div className="mb-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">2. Configure Inputs</h2>
            <Button variant="ghost" size="sm" onClick={() => setStep(0)}><RotateCcw className="w-4 h-4 mr-2" /> Back</Button>
          </div>

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
                  className="w-20 px-2 py-1 bg-muted/50 border border-border rounded text-sm outline-none"
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
                    onClick={() => setConfig(prev => ({
                      ...prev,
                      protected: prev.protected.includes(col) ? prev.protected.filter(c => c !== col) : [...prev.protected, col]
                    }))}
                  >
                    {col}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Select the demographic fields (gender, age, location) to intercept in the stream.</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Live Dashboard */}
      {(isStreaming || currentMetrics) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Dynamic stat cards — renders per group */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard icon="📊" title="Decisions Analyzed" value={totalAnalyzed.toLocaleString()} />
            <MetricCard icon="⚖️" title="Fairness Score" value={`${currentMetrics?.fairness_score ?? "—"}/100`}
              severity={currentMetrics?.fairness_score < 50 ? "CRITICAL" : currentMetrics?.fairness_score < 70 ? "WARNING" : "OK"} />
            {/* Dynamic group rate cards */}
            {Object.entries(currentMetrics?.rates?.gender_rates || {}).map(([group, rate]) => (
              <MetricCard key={group} icon="👤" title={`${group} Approval`}
                value={`${(rate * 100).toFixed(0)}%`} />
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Fairness Trend */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2"><CardTitle className="text-base">Fairness Score Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={fairnessHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="batch" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <ReferenceLine y={70} stroke="#FFAA00" strokeDasharray="6 4" label={{ value: "Threshold", fill: "#FFAA00", fontSize: 10 }} />
                    <Line type="monotone" dataKey="score" stroke="#00E676" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Dynamic Group Approval Rates */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2"><CardTitle className="text-base">Approval Rates by Group</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={groupHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="batch" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip contentStyle={{ background: "#0D2045", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#F5F7FA" }} />
                    {/* Dynamic lines — one per group discovered */}
                    {groupNames.map((group, i) => (
                      <Line key={group} type="monotone" dataKey={group}
                        stroke={GROUP_COLORS[i % GROUP_COLORS.length]}
                        strokeWidth={2} dot={false} name={group} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Latest Decisions — shows name-level detail from Gemini */}
          {latestDecisions.length > 0 && (
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  📋 Latest Decisions
                  {currentMetrics?.is_real_gemini && (
                    <Badge variant="outline" className="text-xs text-green-400 border-green-500/30">via Gemini</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                  {latestDecisions.map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-background/50 border border-border/30 text-sm">
                      <div>
                        <span className="font-medium">{d.name}</span>
                        <span className="text-muted-foreground text-xs ml-1">({d.gender})</span>
                      </div>
                      <Badge variant={d.decision === "APPROVED" ? "default" : "destructive"}
                        className={d.decision === "APPROVED"
                          ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                          : "text-xs"
                        }>
                        {d.decision}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alerts */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                🚨 Alert Feed
                {alerts.length > 0 && <Badge variant="destructive" className="text-xs">{alerts.length}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AlertFeed alerts={alerts} maxItems={10} />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
