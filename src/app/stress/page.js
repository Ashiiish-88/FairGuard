"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BiasChart from "@/components/bias-chart";
import MetricCard from "@/components/metric-card";
import { Loader2, Zap, FlaskConical, RotateCcw } from "lucide-react";

const DECISION_TYPES = [
  { id: "hiring", label: "Hiring / Resume Screening", icon: "💼" },
  { id: "lending", label: "Loan / Credit Approval", icon: "🏦" },
  { id: "insurance", label: "Insurance Underwriting", icon: "🏥" },
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
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("/api/stress/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision_type: decisionType,
          candidate_count: candidateCount,
          demographic_axes: axes,
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-[#0A1628]">
          <FlaskConical className="w-8 h-8 text-[#FF2D55]" />
          Stress Test
        </h1>
        <p className="text-[#5A6A85] mt-1">AI penetration testing — generate diverse synthetic candidates and expose how models discriminate</p>
      </div>

      {/* Config */}
      <AnimatePresence mode="wait">
        {!results && (
          <motion.div key="config" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            {/* Decision Type */}
            <Card className="bg-white border-[#E2E6ED]">
              <CardHeader><CardTitle className="text-lg text-[#0A1628]">🎯 What are you testing?</CardTitle></CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-3">
                  {DECISION_TYPES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setDecisionType(t.id)}
                      className={`p-5 border-2 text-center transition-all duration-200 ${
                        decisionType === t.id
                          ? "border-[#00C853] bg-[#00C853]/5 shadow-md"
                          : "border-[#E2E6ED] bg-white hover:border-[#0D2045]/20 hover:shadow-sm"
                      }`}
                      style={{ borderRadius: '8px' }}
                    >
                      <span className="text-3xl block mb-2">{t.icon}</span>
                      <span className="text-sm font-medium text-[#0A1628]">{t.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Demo Axes */}
            <Card className="bg-white border-[#E2E6ED]">
              <CardHeader><CardTitle className="text-lg text-[#0A1628]">👤 Demographics to Vary</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {DEMOGRAPHIC_AXES.map((a) => (
                    <Button key={a.id} size="sm"
                      variant={axes.includes(a.id) ? "default" : "outline"}
                      className={axes.includes(a.id)
                        ? "bg-[#0D2045] text-white hover:bg-[#1A3A6E]"
                        : "bg-white border-[#E2E6ED] text-[#0A1628] hover:border-[#0D2045]/30"
                      }
                      onClick={() => toggleAxis(a.id)}>
                      {a.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Candidate Count */}
            <Card className="bg-white border-[#E2E6ED]">
              <CardHeader><CardTitle className="text-lg text-[#0A1628]">📊 Number of Test Candidates</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {CANDIDATE_COUNTS.map((c) => (
                    <Button key={c} size="sm"
                      variant={candidateCount === c ? "default" : "outline"}
                      className={candidateCount === c
                        ? "bg-[#0D2045] text-white hover:bg-[#1A3A6E]"
                        : "bg-white border-[#E2E6ED] text-[#0A1628] hover:border-[#0D2045]/30"
                      }
                      onClick={() => setCandidateCount(c)}>
                      {c} candidates
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {error && (
              <div className="p-4 bg-[#FF2D55]/5 border border-[#FF2D55]/20 text-[#FF2D55] text-sm font-medium" style={{ borderRadius: '8px' }}>
                {error}
              </div>
            )}

            <div className="text-center">
              <Button
                size="lg"
                className="bg-[#00C853] hover:bg-[#00E676] text-white gap-2 px-10 font-semibold shadow-lg shadow-[#00C853]/20"
                onClick={runTest}
                disabled={loading}
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Running...</>
                  : <><Zap className="w-4 h-4" /> Run Penetration Test</>
                }
              </Button>
              <p className="text-xs text-[#5A6A85] mt-3">Generates synthetic candidates via Gemini AI, then runs them through a simulated AI model</p>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {results && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#0A1628]">Test Results</h2>
              <Button
                variant="outline"
                onClick={() => setResults(null)}
                className="gap-2 bg-white border-[#E2E6ED] text-[#0A1628] hover:bg-[#F5F7FA]"
              >
                <RotateCcw className="w-4 h-4" /> Run New Test
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard icon="👥" title="Candidates Tested" value={results.analysis?.summary?.total_candidates || 0} />
              <MetricCard icon="✅" title="Overall Approval" value={`${((results.analysis?.summary?.overall_approval_rate || 0) * 100).toFixed(1)}%`} />
              <MetricCard icon="🔴" title="Status" value={results.analysis?.summary?.bias_detected ? "BIASED" : "FAIR"}
                severity={results.analysis?.summary?.bias_detected ? "CRITICAL" : "OK"} />
              <MetricCard icon="📏" title="Disparate Impact" value={
                Object.values(results.analysis?.per_demographic || {})[0]?.disparate_impact?.ratio?.toFixed(4) || "N/A"
              } severity={Object.values(results.analysis?.per_demographic || {})[0]?.disparate_impact?.severity} />
            </div>

            {/* Per-demographic charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(results.analysis?.per_demographic || {}).map(([axis, metrics]) => (
                <BiasChart
                  key={axis}
                  title={`Approval Rates by ${axis.replace("_", " ")}`}
                  data={Object.entries(metrics.disparate_impact?.rates || {}).map(([group, rate]) => ({ group, rate }))}
                />
              ))}
            </div>

            {/* AI Explanation */}
            {results.explanation && (
              <Card className="bg-white border-[#E2E6ED] border-l-4 border-l-[#007AFF]">
                <CardHeader>
                  <CardTitle className="text-lg text-[#0A1628] flex items-center gap-2">
                    <span>🤖</span> AI Analysis
                    <Badge className="text-xs bg-[#007AFF]/10 text-[#007AFF] border-0 font-normal">Powered by Gemini</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-lg mb-3 text-[#0A1628]">{results.explanation.summary}</p>
                  <p className="text-[#5A6A85] leading-relaxed">{results.explanation.explanation}</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
