"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MetricCard from "@/components/metric-card";
import AlertFeed from "@/components/alert-feed";
import { Play, Square, Shield } from "lucide-react";

export default function ShieldPage() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [fairnessHistory, setFairnessHistory] = useState([]);
  const [genderHistory, setGenderHistory] = useState([]);
  const [currentMetrics, setCurrentMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [totalAnalyzed, setTotalAnalyzed] = useState(0);
  const eventSourceRef = useRef(null);

  const startStream = useCallback(() => {
    if (eventSourceRef.current) eventSourceRef.current.close();

    setIsStreaming(true);
    setFairnessHistory([]);
    setGenderHistory([]);
    setAlerts([]);
    setTotalAnalyzed(0);

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

        setFairnessHistory(prev => [...prev.slice(-100), {
          batch: d.total_analyzed,
          score: d.fairness_score,
        }]);

        const maleRate = d.rates?.gender_rates?.Male ?? 0;
        const femaleRate = d.rates?.gender_rates?.Female ?? 0;
        setGenderHistory(prev => [...prev.slice(-100), {
          batch: d.total_analyzed,
          male: Math.round(maleRate * 1000) / 10,
          female: Math.round(femaleRate * 1000) / 10,
        }]);

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
          <p className="text-muted-foreground mt-1">Real-time bias monitoring — watch AI decisions stream in and catch bias as it happens</p>
        </div>
        <Button
          size="lg"
          onClick={isStreaming ? stopStream : startStream}
          className={isStreaming ? "bg-red-500 hover:bg-red-600 text-white" : "gradient-bg text-white"}
        >
          {isStreaming ? <><Square className="w-4 h-4 mr-2" /> Stop</> : <><Play className="w-4 h-4 mr-2" /> Start Monitoring</>}
        </Button>
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
              Shield Mode connects to an AI decision pipeline and monitors fairness metrics in real-time.
              Click &quot;Start Monitoring&quot; to begin the simulated stream.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Live Dashboard */}
      {(isStreaming || currentMetrics) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard icon="📊" title="Decisions Analyzed" value={totalAnalyzed.toLocaleString()} />
            <MetricCard icon="⚖️" title="Fairness Score" value={`${currentMetrics?.fairness_score ?? "—"}/100`}
              severity={currentMetrics?.fairness_score < 50 ? "CRITICAL" : currentMetrics?.fairness_score < 70 ? "WARNING" : "OK"} />
            <MetricCard icon="👨" title="Male Approval" value={`${(((currentMetrics?.rates?.gender_rates?.Male ?? 0)) * 100).toFixed(0)}%`} />
            <MetricCard icon="👩" title="Female Approval" value={`${(((currentMetrics?.rates?.gender_rates?.Female ?? 0)) * 100).toFixed(0)}%`} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Fairness Trend */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2"><CardTitle className="text-base">Fairness Score Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={fairnessHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
                    <XAxis dataKey="batch" tick={{ fill: "oklch(0.5 0 0)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "oklch(0.5 0 0)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <ReferenceLine y={70} stroke="#eab308" strokeDasharray="6 4" label={{ value: "Threshold", fill: "#eab308", fontSize: 10 }} />
                    <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gender Rate Comparison */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2"><CardTitle className="text-base">Gender Approval Rates</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={genderHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
                    <XAxis dataKey="batch" tick={{ fill: "oklch(0.5 0 0)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "oklch(0.5 0 0)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip contentStyle={{ background: "oklch(0.18 0 0)", border: "1px solid oklch(0.3 0 0)", borderRadius: "8px" }} />
                    <Line type="monotone" dataKey="male" stroke="#3b82f6" strokeWidth={2} dot={false} name="Male" />
                    <Line type="monotone" dataKey="female" stroke="#ec4899" strokeWidth={2} dot={false} name="Female" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

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
