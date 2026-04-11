"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MetricCard from "@/components/metric-card";
import AlertFeed from "@/components/alert-feed";
import { Play, Square, Shield, Activity } from "lucide-react";

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
          <h1 className="text-3xl font-bold flex items-center gap-3 text-[#0A1628]">
            <Shield className="w-8 h-8 text-[#00C853]" />
            Shield Mode
            {isStreaming && (
              <Badge className="bg-[#00C853]/10 text-[#00C853] border-[#00C853]/20 gap-1 font-normal">
                <span className="inline-block w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
                LIVE
              </Badge>
            )}
          </h1>
          <p className="text-[#5A6A85] mt-1">Real-time bias monitoring — watch AI decisions stream in and catch bias as it happens</p>
        </div>
        <Button
          size="lg"
          onClick={isStreaming ? stopStream : startStream}
          className={isStreaming
            ? "bg-[#FF2D55] hover:bg-[#E0002B] text-white gap-2 font-semibold"
            : "bg-[#00C853] hover:bg-[#00E676] text-white gap-2 font-semibold shadow-lg shadow-[#00C853]/20"
          }
        >
          {isStreaming
            ? <><Square className="w-4 h-4" /> Stop</>
            : <><Play className="w-4 h-4" /> Start Monitoring</>
          }
        </Button>
      </div>

      {/* Not started state */}
      {!isStreaming && !currentMetrics && (
        <Card className="bg-white border-[#E2E6ED] py-20">
          <CardContent className="flex flex-col items-center text-center gap-5">
            <motion.div
              className="w-20 h-20 bg-[#00C853]/10 flex items-center justify-center"
              style={{ borderRadius: '16px' }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Shield className="w-10 h-10 text-[#00C853] opacity-60" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-[#0A1628]">Ready to Monitor</h3>
              <p className="text-[#5A6A85] max-w-md mt-2">
                Shield Mode connects to an AI decision pipeline and monitors fairness metrics in real-time.
                Click &quot;Start Monitoring&quot; to begin the simulated stream.
              </p>
            </div>
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
            <Card className="bg-white border-[#E2E6ED]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#0A1628] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#00C853]" />
                  Fairness Score Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={fairnessHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E6ED" />
                    <XAxis dataKey="batch" tick={{ fill: "#5A6A85", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#5A6A85", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <ReferenceLine y={70} stroke="#FFAA00" strokeDasharray="6 4" label={{ value: "Threshold", fill: "#FFAA00", fontSize: 10 }} />
                    <Line type="monotone" dataKey="score" stroke="#00C853" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gender Rate Comparison */}
            <Card className="bg-white border-[#E2E6ED]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#0A1628]">Gender Approval Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={genderHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E6ED" />
                    <XAxis dataKey="batch" tick={{ fill: "#5A6A85", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#5A6A85", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E6ED", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <Line type="monotone" dataKey="male" stroke="#007AFF" strokeWidth={2} dot={false} name="Male" />
                    <Line type="monotone" dataKey="female" stroke="#FF2D55" strokeWidth={2} dot={false} name="Female" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          <Card className="bg-white border-[#E2E6ED]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-[#0A1628]">
                🚨 Alert Feed
                {alerts.length > 0 && (
                  <Badge className="text-xs bg-[#FF2D55] text-white border-0">
                    {alerts.length}
                  </Badge>
                )}
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
