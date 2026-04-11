"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, History, RefreshCcw } from "lucide-react";

const gradeColors = {
  A: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  B: "bg-green-500/20 text-green-400 border-green-500/30",
  C: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  F: "bg-red-500/20 text-red-400 border-red-500/30",
};

const riskBadge = {
  CRITICAL: "bg-red-500/20 text-red-400 border-red-500/30",
  HIGH: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  MODERATE: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  LOW: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export default function HistoryPage() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storage, setStorage] = useState("");

  const loadAudits = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/history/list");
      const json = await res.json();
      setAudits(json.audits || []);
      setStorage(json.storage || "");
    } catch {
      setAudits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAudits(); }, []);

  // Compute stats
  const avgScore = audits.length > 0
    ? Math.round(audits.reduce((sum, a) => sum + (a.fairness_score || 0), 0) / audits.length)
    : 0;
  const criticalCount = audits.filter(a => a.grade === "F").length;
  const domains = [...new Set(audits.map(a => a.domain_label || a.domain))];
  const commonFlags = {};
  audits.forEach(a => (a.flags || []).forEach(f => { commonFlags[f] = (commonFlags[f] || 0) + 1; }));
  const topFlag = Object.entries(commonFlags).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">📜 Audit History</h1>
          <p className="text-muted-foreground mt-1">
            Track fairness scores over time — see patterns, trends, and repeat issues
            {storage === "memory" && <span className="text-xs ml-2">(in-memory — configure Firebase for persistence)</span>}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadAudits} className="gap-2">
          <RefreshCcw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading audit history...</span>
        </div>
      )}

      {!loading && audits.length === 0 && (
        <Card className="bg-card/50 border-border/50 py-20">
          <CardContent className="flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center">
              <History className="w-10 h-10 text-muted-foreground opacity-30" />
            </div>
            <h3 className="text-xl font-semibold">No audits yet</h3>
            <p className="text-muted-foreground max-w-md">
              Run your first audit in Audit Mode. Results will be saved here automatically so you
              can track fairness improvements over time.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && audits.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Total Audits</p>
                <p className="text-2xl font-bold mt-1">{audits.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Avg Fairness Score</p>
                <p className={`text-2xl font-bold font-mono mt-1 ${avgScore >= 70 ? "text-green-400" : avgScore >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                  {avgScore}/100
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Critical (Grade F)</p>
                <p className="text-2xl font-bold text-red-400 mt-1">{criticalCount}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Most Common Issue</p>
                <p className="text-lg font-semibold mt-1 truncate">
                  {topFlag ? topFlag[0].replace(/_/g, " ") : "—"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Audit List */}
          <div className="space-y-3">
            {audits.map((audit, i) => (
              <motion.div
                key={audit.id || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-card/50 border-border/50 hover:border-border transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between gap-4">
                      {/* Left: Domain + Score */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="text-3xl shrink-0">{audit.domain_icon || "📊"}</div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold truncate">{audit.domain_label || audit.domain || "General"}</span>
                            <Badge variant="outline" className={`text-xs ${gradeColors[audit.grade] || ""}`}>
                              Grade {audit.grade}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{audit.dataset_rows} rows</span>
                            <span>•</span>
                            <span>{(audit.protected_attributes || []).join(", ") || "—"}</span>
                          </div>
                          {audit.flags?.length > 0 && (
                            <div className="flex gap-1.5 mt-2">
                              {audit.flags.map((f, fi) => (
                                <Badge key={fi} variant="outline" className="text-xs">
                                  {f.replace(/_/g, " ")}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Score + Risk */}
                      <div className="text-right shrink-0">
                        <p className={`text-2xl font-bold font-mono ${
                          audit.fairness_score >= 70 ? "text-green-400" :
                          audit.fairness_score >= 50 ? "text-yellow-400" : "text-red-400"
                        }`}>
                          {audit.fairness_score}/100
                        </p>
                        {audit.debt_risk_level && audit.debt_risk_level !== "LOW" && (
                          <Badge variant="outline" className={`text-xs mt-1 ${riskBadge[audit.debt_risk_level] || ""}`}>
                            {audit.debt_risk_level} Risk
                          </Badge>
                        )}
                        {audit.timestamp && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(audit.timestamp).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
