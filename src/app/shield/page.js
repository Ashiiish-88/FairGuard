"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MetricCard from "@/components/metric-card";
import AlertFeed from "@/components/alert-feed";
import { Play, Square, Shield } from "lucide-react";

// Dynamic line colors for groups
const GROUP_COLORS = ["#00E676", "#FF2D55", "#007AFF", "#FFAA00", "#A855F7", "#06B6D4"];

export default function ShieldPage() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [fairnessHistory, setFairnessHistory] = useState([]);
  const [groupHistory, setGroupHistory] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [currentMetrics, setCurrentMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [totalAnalyzed, setTotalAnalyzed] = useState(0);
  const [latestDecisions, setLatestDecisions] = useState([]);
  const eventSourceRef = useRef(null);

  const startStream = useCallback(() => {
    if (eventSourceRef.current) eventSourceRef.current.close();

    setIsStreaming(true);
    setFairnessHistory([]);
    setGroupHistory([]);
    setGroupNames([]);
    setAlerts([]);
    setTotalAnalyzed(0);
    setLatestDecisions([]);

    const es = new EventSource("/api/shield/stream");
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const d = JSON.parse(event.data);

        if (d.status === "complete") {
          setIsStreaming(false);
          es.close();
          return;
        }

        setCurrentMetrics(d);
        setTotalAnalyzed(d.total_analyzed);

        // Fairness score history
        setFairnessHistory(prev => [...prev.slice(-100), {
          batch: d.total_analyzed,
          score: d.fairness_score,
        }]);

        // Dynamic group rates — works with ANY number of groups
        const genderRates = d.rates?.gender_rates || {};
        const point = { batch: d.total_analyzed };
        for (const [group, rate] of Object.entries(genderRates)) {
          point[group] = Math.round(rate * 1000) / 10;
        }
        setGroupHistory(prev => [...prev.slice(-100), point]);

        // Track discovered group names
        setGroupNames(prev => {
          const newNames = Object.keys(genderRates);
          const merged = [...new Set([...prev, ...newNames])];
          return merged;
        });

        // Latest individual decisions
        if (d.latest_decisions) {
          setLatestDecisions(d.latest_decisions);
        }

        // Alerts
        if (d.alerts?.length) {
          setAlerts(prev => [...prev, ...d.alerts.map((a, i) => ({
            ...a,
            id: `${d.total_analyzed}-${i}`,
            timestamp: new Date().toISOString(),
          }))]);
        }
      } catch { /* ignore parse errors */ }
    };

    es.onerror = () => {
      setIsStreaming(false);
      es.close();
    };
  }, []);

  const stopStream = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  useEffect(() => {
    return () => { if (eventSourceRef.current) eventSourceRef.current.close(); };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">🛡️ Shield Mode</h1>
          <p className="text-muted-foreground mt-1">Real-time bias monitoring — AI decisions stream in and bias is caught as it happens</p>
        </div>
        <div className="flex items-center gap-3">
          {currentMetrics?.is_real_gemini && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              ✨ Live Gemini API
            </Badge>
          )}
          <Button
            size="lg"
            onClick={isStreaming ? stopStream : startStream}
            className={isStreaming ? "bg-red-500 hover:bg-red-600 text-white" : "gradient-bg text-white"}
          >
            {isStreaming ? <><Square className="w-4 h-4 mr-2" /> Stop</> : <><Play className="w-4 h-4 mr-2" /> Start Monitoring</>}
          </Button>
        </div>
      </div>

      {/* Not started state */}
      {!isStreaming && !currentMetrics && (
        <Card className="bg-card/50 border-border/50 py-20">
          <CardContent className="flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center opacity-30">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Ready to Monitor</h3>
            <p className="text-muted-foreground max-w-md">
              Shield Mode streams AI decisions in real-time and monitors fairness metrics on a rolling window.
              Click &quot;Start Monitoring&quot; to begin. {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Using live Gemini API." : ""}
            </p>
          </CardContent>
        </Card>
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
