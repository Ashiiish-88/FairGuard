"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MetricCard from "@/components/metric-card";
import AlertFeed from "@/components/alert-feed";
import { Play, Square, Shield, Activity, AlertTriangle } from "lucide-react";

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
        if (d.status === "complete") { setIsStreaming(false); es.close(); return; }
        setCurrentMetrics(d);
        setTotalAnalyzed(d.total_analyzed);
        setFairnessHistory(prev => [...prev.slice(-100), { batch: d.total_analyzed, score: d.fairness_score }]);
        const maleRate = d.rates?.gender_rates?.Male ?? 0;
        const femaleRate = d.rates?.gender_rates?.Female ?? 0;
        setGenderHistory(prev => [...prev.slice(-100), { batch: d.total_analyzed, male: Math.round(maleRate * 1000) / 10, female: Math.round(femaleRate * 1000) / 10 }]);
        if (d.alerts?.length) {
          setAlerts(prev => [...prev, ...d.alerts.map((a, i) => ({ ...a, id: `${d.total_analyzed}-${i}`, timestamp: new Date().toISOString() }))]);
        }
      } catch { /* ignore */ }
    };
    es.onerror = () => { setIsStreaming(false); es.close(); };
  }, []);

  const stopStream = useCallback(() => {
    if (eventSourceRef.current) { eventSourceRef.current.close(); eventSourceRef.current = null; }
    setIsStreaming(false);
  }, []);

  useEffect(() => { return () => { if (eventSourceRef.current) eventSourceRef.current.close(); }; }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-[#0A0A0A]">
            <Shield className="w-8 h-8 text-[#0D9488]" />
            Shield Mode
            {isStreaming && (
              <Badge className="bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20 gap-1 font-normal">
                <span className="inline-block w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                LIVE
              </Badge>
            )}
          </h1>
          <p className="text-[#6B7280] mt-1">Real-time bias monitoring &mdash; watch AI decisions stream in and catch bias as it happens</p>
        </div>
        <button
          onClick={isStreaming ? stopStream : startStream}
          className="group inline-flex items-stretch rounded-md overflow-hidden transition-all duration-150 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
        >
          {isStreaming ? (
            <>
              <span className="bg-[#EF4444] px-3.5 py-2.5 flex items-center justify-center text-white"><Square className="w-4 h-4" /></span>
              <span className="bg-[#0A0A0A] text-white text-[11px] font-bold tracking-[0.12em] uppercase px-5 py-2.5 flex items-center">Stop</span>
            </>
          ) : (
            <>
              <span className="bg-[#F59E0B] px-3.5 py-2.5 flex items-center justify-center text-black group-hover:bg-[#D97706] transition-colors"><Play className="w-4 h-4" /></span>
              <span className="bg-[#0A0A0A] text-white text-[11px] font-bold tracking-[0.12em] uppercase px-5 py-2.5 flex items-center group-hover:bg-[#1a1a1a] transition-colors">Start Monitoring</span>
            </>
          )}
        </button>
      </div>

      {!isStreaming && !currentMetrics && (
        <Card className="bg-white border-[#E5E7EB] py-20">
          <CardContent className="flex flex-col items-center text-center gap-5">
            <motion.div className="w-20 h-20 bg-[#0D9488]/10 flex items-center justify-center" style={{ borderRadius: '16px' }} animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
              <Shield className="w-10 h-10 text-[#0D9488] opacity-60" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-[#0A0A0A]">Ready to Monitor</h3>
              <p className="text-[#6B7280] max-w-md mt-2">Shield Mode connects to an AI decision pipeline and monitors fairness metrics in real-time. Click &quot;Start Monitoring&quot; to begin the simulated stream.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {(isStreaming || currentMetrics) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Decisions Analyzed" value={totalAnalyzed.toLocaleString()} />
            <MetricCard title="Fairness Score" value={`${currentMetrics?.fairness_score ?? "\u2014"}/100`} severity={currentMetrics?.fairness_score < 50 ? "critical" : currentMetrics?.fairness_score < 70 ? "warning" : "ok"} />
            <MetricCard title="Male Approval" value={`${(((currentMetrics?.rates?.gender_rates?.Male ?? 0)) * 100).toFixed(0)}%`} />
            <MetricCard title="Female Approval" value={`${(((currentMetrics?.rates?.gender_rates?.Female ?? 0)) * 100).toFixed(0)}%`} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white border-[#E5E7EB]">
              <CardHeader className="pb-2"><CardTitle className="text-base text-[#0A0A0A] flex items-center gap-2"><Activity className="w-4 h-4 text-[#0D9488]" /> Fairness Score Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={fairnessHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="batch" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <ReferenceLine y={70} stroke="#F59E0B" strokeDasharray="6 4" label={{ value: "Threshold", fill: "#F59E0B", fontSize: 10 }} />
                    <Line type="monotone" dataKey="score" stroke="#0D9488" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="bg-white border-[#E5E7EB]">
              <CardHeader className="pb-2"><CardTitle className="text-base text-[#0A0A0A]">Gender Approval Rates</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={genderHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="batch" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <Line type="monotone" dataKey="male" stroke="#3B82F6" strokeWidth={2} dot={false} name="Male" />
                    <Line type="monotone" dataKey="female" stroke="#EF4444" strokeWidth={2} dot={false} name="Female" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card className="bg-white border-[#E5E7EB]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-[#0A0A0A]">
                <AlertTriangle className="w-4 h-4 text-[#F59E0B]" /> Alert Feed
                {alerts.length > 0 && <Badge className="text-xs bg-[#EF4444] text-white border-0">{alerts.length}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent><AlertFeed alerts={alerts} maxItems={10} /></CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
