"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BiasChart from "@/components/bias-chart";
import MetricCard from "@/components/metric-card";
import { Loader2, Zap } from "lucide-react";

const DECISION_TYPES = [
  { id: "hiring", label: "Hiring / Resume Screening", icon: "💼" },
  { id: "lending", label: "Loan / Credit Approval", icon: "🏦" },
  { id: "insurance", label: "Insurance Underwriting", icon: "🏥" },
  { id: "content_moderation", label: "Content Moderation", icon: "📱" },
];

const DEMOGRAPHIC_AXES = [
  { id: "gender", label: "Gender" },
  { id: "age_group", label: "Age Group" },
  { id: "location_type", label: "Location (Urban/Rural)" },
];

const CANDIDATE_COUNTS = [30, 60, 100];

export default function StressTestPage() {
  const [decisionType, setDecisionType] = useState("hiring");
  const [axes, setAxes] = useState(["gender"]);
  const [candidateCount, setCandidateCount] = useState(30);
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

  const usedRealGemini = results?.analysis?.summary?.used_real_gemini;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">🧪 Stress Test</h1>
        <p className="text-muted-foreground mt-1">
          Counterfactual testing — same CV, different name. Does Gemini treat Brian and Lakisha equally?
        </p>
      </div>

      {/* Config */}
      <AnimatePresence mode="wait">
        {!results && (
          <motion.div key="config" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            {/* Decision Type */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader><CardTitle className="text-lg">🎯 What are you testing?</CardTitle></CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-4 gap-3">
                  {DECISION_TYPES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setDecisionType(t.id)}
                      className={`p-5 border-2 text-center transition-all ${
                        decisionType === t.id
                          ? "border-[#00E676]/60 bg-[#00E676]/10 shadow-lg shadow-[#00E676]/10"
                          : "border-border/50 bg-card/30 hover:border-border"
                      }`}
                    >
                      <span className="text-3xl block mb-2">{t.icon}</span>
                      <span className="text-sm font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Demographics */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader><CardTitle className="text-lg">👤 Demographics to Vary</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {DEMOGRAPHIC_AXES.map((a) => (
                    <Button key={a.id} size="sm" variant={axes.includes(a.id) ? "default" : "outline"}
                      className={axes.includes(a.id) ? "bg-[#00E676] text-[#0A1628] hover:bg-[#39FF6E]" : ""}
                      onClick={() => toggleAxis(a.id)}>
                      {a.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Candidate Count */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader><CardTitle className="text-lg">📊 Number of Test Profiles</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {CANDIDATE_COUNTS.map((c) => (
                    <Button key={c} size="sm" variant={candidateCount === c ? "default" : "outline"}
                      className={candidateCount === c ? "bg-[#00E676] text-[#0A1628] hover:bg-[#39FF6E]" : ""}
                      onClick={() => setCandidateCount(c)}>
                      {c} candidates
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Each candidate is sent to Gemini individually — larger counts take longer but produce stronger evidence.
                </p>
              </CardContent>
            </Card>

            {error && <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

            <div className="text-center">
              <Button size="lg" className="bg-[#00E676] text-[#0A1628] hover:bg-[#39FF6E] gap-2 px-10" onClick={runTest} disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Probing Gemini...</> : <><Zap className="w-4 h-4" /> Run Counterfactual Probe</>}
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Clones identical profiles with different names and demographics, then sends each to Gemini for a real APPROVE/REJECT decision
              </p>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {results && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">Probe Results</h2>
                {usedRealGemini && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    ✨ Real Gemini API Responses
                  </Badge>
                )}
                {!usedRealGemini && (
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    ⚠️ Simulated Model (no API key)
                  </Badge>
                )}
              </div>
              <Button variant="outline" onClick={() => setResults(null)}>Run New Test</Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard icon="👥" title="Profiles Tested" value={results.analysis?.summary?.total_candidates || 0} />
              <MetricCard icon="✅" title="Overall Approval" value={`${((results.analysis?.summary?.overall_approval_rate || 0) * 100).toFixed(1)}%`} />
              <MetricCard icon="🔴" title="Bias Status" value={results.analysis?.summary?.bias_detected ? "BIASED" : "FAIR"}
                severity={results.analysis?.summary?.bias_detected ? "CRITICAL" : "OK"} />
              <MetricCard icon="📏" title="Disparate Impact" value={
                Object.values(results.analysis?.per_demographic || {})[0]?.disparate_impact?.ratio?.toFixed(4) || "N/A"
              } severity={Object.values(results.analysis?.per_demographic || {})[0]?.disparate_impact?.severity} />
            </div>

            {/* ═══ COUNTERFACTUAL PROOF TABLE ═══ */}
            {results.analysis?.counterfactual_pairs?.length > 0 && (
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">🔄 Counterfactual Proof — Same CV, Different Name</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Each row group shows the SAME qualifications sent to {usedRealGemini ? "Gemini" : "the simulated model"} with only the name changed.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.analysis.counterfactual_pairs.map((group, gi) => (
                    <div key={gi} className="border border-border/30 overflow-hidden">
                      <div className="bg-muted/30 px-4 py-2 text-sm font-medium font-mono">
                        Profile #{gi + 1} — Identical qualifications
                      </div>
                      <div className="divide-y divide-border/20">
                        {group.map((person, pi) => (
                          <div key={pi} className="flex items-center justify-between px-4 py-3">
                            <div>
                              <span className="font-semibold">{person.name}</span>
                              <span className="text-muted-foreground text-sm ml-2">
                                ({person.gender}, {person.ethnicity})
                              </span>
                            </div>
                            <Badge variant={person.decision === "Approved" ? "default" : "destructive"}
                              className={person.decision === "Approved"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : ""
                              }>
                              {person.decision} {person.confidence != null ? `(${(person.confidence * 100).toFixed(0)}%)` : ""}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Per-demographic bar charts */}
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
              <Card className="bg-[#00E676]/5 border-[#00E676]/20">
                <CardHeader><CardTitle className="text-lg gradient-text">🤖 AI Analysis</CardTitle></CardHeader>
                <CardContent>
                  <p className="font-semibold text-lg mb-3">{results.explanation.summary}</p>
                  <p className="text-muted-foreground leading-relaxed">{results.explanation.explanation}</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
