"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BiasChart from "@/components/bias-chart";
import MetricCard from "@/components/metric-card";
import { Loader2, Zap, FlaskConical, RotateCcw, FileSearch, Users, BarChart3 } from "lucide-react";

const DECISION_TYPES = [
  { id: "hiring", label: "Hiring / Resume Screening", icon: <FileSearch className="w-6 h-6" /> },
  { id: "lending", label: "Loan / Credit Approval", icon: <BarChart3 className="w-6 h-6" /> },
  { id: "insurance", label: "Insurance Underwriting", icon: <Users className="w-6 h-6" /> },
];

const DEMOGRAPHIC_AXES = [
  { id: "gender", label: "Gender" },
  { id: "age_group", label: "Age Group" },
  { id: "location_type", label: "Location (Urban/Rural)" },
];

const CANDIDATE_COUNTS = [100, 200, 500];

export default function StressTestPage() {
  const [decisionType, setDecisionType] = useState("hiring");
  const [axes, setAxes] = useState(["gender", "age_group"]);
  const [candidateCount, setCandidateCount] = useState(200);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const toggleAxis = (id) => {
    setAxes(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const runTest = async () => {
    if (axes.length === 0) { setError("Select at least one demographic axis"); return; }
    setLoading(true); setError(null); setResults(null);
    try {
      const res = await fetch("/api/stress/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision_type: decisionType, candidate_count: candidateCount, demographic_axes: axes }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setResults(json);
    } catch (e) {
      setError(`Stress test failed: ${e.message}`);
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-[#0A0A0A]">
          <FlaskConical className="w-8 h-8 text-[#F59E0B]" /> Stress Test
        </h1>
        <p className="text-[#6B7280] mt-1">AI penetration testing &mdash; generate diverse synthetic candidates and expose how models discriminate</p>
      </div>

      <AnimatePresence mode="wait">
        {!results && (
          <motion.div key="config" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <Card className="bg-white border-[#E5E7EB]">
              <CardHeader><CardTitle className="text-lg text-[#0A0A0A]">What are you testing?</CardTitle></CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-3">
                  {DECISION_TYPES.map((t) => (
                    <button key={t.id} onClick={() => setDecisionType(t.id)}
                      className={`p-5 border-2 text-center transition-all duration-200 flex flex-col items-center gap-3 ${decisionType === t.id ? "border-[#F59E0B] bg-[#FEF3C7]/30 shadow-md" : "border-[#E5E7EB] bg-white hover:border-[#F59E0B]/30 hover:shadow-sm"}`}
                      style={{ borderRadius: '8px' }}>
                      <div className={`${decisionType === t.id ? "text-[#D97706]" : "text-[#6B7280]"}`}>{t.icon}</div>
                      <span className="text-sm font-medium text-[#0A0A0A]">{t.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-[#E5E7EB]">
              <CardHeader><CardTitle className="text-lg text-[#0A0A0A]">Demographics to Vary</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {DEMOGRAPHIC_AXES.map((a) => (
                    <Button key={a.id} size="sm" variant={axes.includes(a.id) ? "default" : "outline"}
                      className={axes.includes(a.id) ? "bg-[#0A0A0A] text-white hover:bg-[#1a1a1a]" : "bg-white border-[#E5E7EB] text-[#0A0A0A] hover:border-[#0A0A0A]/30"}
                      onClick={() => toggleAxis(a.id)}>{a.label}</Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-[#E5E7EB]">
              <CardHeader><CardTitle className="text-lg text-[#0A0A0A]">Number of Test Candidates</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {CANDIDATE_COUNTS.map((c) => (
                    <Button key={c} size="sm" variant={candidateCount === c ? "default" : "outline"}
                      className={candidateCount === c ? "bg-[#0A0A0A] text-white hover:bg-[#1a1a1a]" : "bg-white border-[#E5E7EB] text-[#0A0A0A] hover:border-[#0A0A0A]/30"}
                      onClick={() => setCandidateCount(c)}>{c} candidates</Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            {error && <div className="p-4 bg-[#EF4444]/5 border border-[#EF4444]/20 text-[#EF4444] text-sm font-medium" style={{ borderRadius: '8px' }}>{error}</div>}
            <div className="text-center">
              <button className="group inline-flex items-stretch rounded-md overflow-hidden transition-all duration-150 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed" onClick={runTest} disabled={loading}>
                <span className="bg-[#F59E0B] px-4 py-3.5 flex items-center justify-center text-black group-hover:bg-[#D97706] transition-colors">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                </span>
                <span className="bg-[#0A0A0A] text-white text-[12px] font-bold tracking-[0.12em] uppercase px-6 py-3.5 flex items-center group-hover:bg-[#1a1a1a] transition-colors">
                  {loading ? "Running..." : "Run Penetration Test"}
                </span>
              </button>
              <p className="text-xs text-[#6B7280] mt-3">Generates synthetic candidates via Gemini AI, then runs them through a simulated AI model</p>
            </div>
          </motion.div>
        )}
        {results && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#0A0A0A]">Test Results</h2>
              <Button variant="outline" onClick={() => setResults(null)} className="gap-2 bg-white border-[#E5E7EB] text-[#0A0A0A] hover:bg-[#F9FAFB]"><RotateCcw className="w-4 h-4" /> Run New Test</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard title="Candidates Tested" value={results.analysis?.summary?.total_candidates || 0} />
              <MetricCard title="Overall Approval" value={`${((results.analysis?.summary?.overall_approval_rate || 0) * 100).toFixed(1)}%`} />
              <MetricCard title="Status" value={results.analysis?.summary?.bias_detected ? "BIASED" : "FAIR"} severity={results.analysis?.summary?.bias_detected ? "critical" : "ok"} />
              <MetricCard title="Disparate Impact" value={Object.values(results.analysis?.per_demographic || {})[0]?.disparate_impact?.ratio?.toFixed(4) || "N/A"} severity={(Object.values(results.analysis?.per_demographic || {})[0]?.disparate_impact?.severity || "ok").toLowerCase()} />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(results.analysis?.per_demographic || {}).map(([axis, metrics]) => (
                <BiasChart key={axis} title={`Approval Rates by ${axis.replace("_", " ")}`} data={Object.entries(metrics.disparate_impact?.rates || {}).map(([group, rate]) => ({ group, rate }))} />
              ))}
            </div>
            {results.explanation && (
              <Card className="bg-white border-[#E5E7EB] border-l-4 border-l-[#0D9488]">
                <CardHeader><CardTitle className="text-lg text-[#0A0A0A] flex items-center gap-2">AI Analysis <Badge className="text-xs bg-[#0D9488]/10 text-[#0D9488] border-0 font-normal">Powered by Gemini</Badge></CardTitle></CardHeader>
                <CardContent>
                  <p className="font-semibold text-lg mb-3 text-[#0A0A0A]">{results.explanation.summary}</p>
                  <p className="text-[#6B7280] leading-relaxed">{results.explanation.explanation}</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
