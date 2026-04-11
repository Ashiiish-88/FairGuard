"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, History, RefreshCcw, TrendingUp, AlertTriangle, BarChart3, Search, Clock, ChevronRight, Filter, Database } from "lucide-react";
import Link from "next/link";

const gradeColors = {
  A: "bg-[#00C853]/10 text-[#00C853] border-[#00C853]/20",
  B: "bg-[#00C853]/10 text-[#00C853] border-[#00C853]/20",
  C: "bg-[#FFAA00]/10 text-[#FFAA00] border-[#FFAA00]/20",
  F: "bg-[#FF2D55]/10 text-[#FF2D55] border-[#FF2D55]/20",
};

const riskBadge = {
  CRITICAL: "bg-[#FF2D55]/10 text-[#FF2D55] border-[#FF2D55]/20",
  HIGH: "bg-[#FFAA00]/10 text-[#FFAA00] border-[#FFAA00]/20",
  MODERATE: "bg-[#FFAA00]/10 text-[#FFAA00] border-[#FFAA00]/20",
  LOW: "bg-[#00C853]/10 text-[#00C853] border-[#00C853]/20",
};

const DOMAIN_FILTERS = ["All", "Hiring", "Content Moderation", "Pricing", "Lending", "Other"];

export default function HistoryPage() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storage, setStorage] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

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

  // Filter audits by domain
  const filteredAudits = activeFilter === "All"
    ? audits
    : audits.filter(a => {
        const label = (a.domain_label || a.domain || "").toLowerCase();
        return label.includes(activeFilter.toLowerCase());
      });

  const getScoreColor = (score) => {
    if (score >= 70) return "text-[#00C853]";
    if (score >= 50) return "text-[#FFAA00]";
    return "text-[#FF2D55]";
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-[#0A1628]">
            <Clock className="w-8 h-8 text-[#FFAA00]" />
            Audit History
          </h1>
          <p className="text-[#5A6A85] mt-1">
            Track fairness scores over time — see patterns, trends, and repeat issues
            {storage === "memory" && (
              <Badge className="ml-2 text-xs bg-[#FFAA00]/10 text-[#FFAA00] border-0 font-normal">
                In-memory — configure Firebase for persistence
              </Badge>
            )}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadAudits}
          className="gap-2 bg-white border-[#E2E6ED] text-[#0A1628] hover:bg-[#F5F7FA]"
        >
          <RefreshCcw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24 gap-3 text-[#5A6A85]">
          <Loader2 className="w-6 h-6 animate-spin text-[#007AFF]" />
          <span>Loading audit history...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && audits.length === 0 && (
        <Card className="bg-white border-[#E2E6ED] py-20">
          <CardContent className="flex flex-col items-center text-center gap-5">
            <div className="w-20 h-20 bg-[#F0F2F5] flex items-center justify-center" style={{ borderRadius: '16px' }}>
              <Database className="w-10 h-10 text-[#5A6A85] opacity-40" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0A1628]">No audits yet</h3>
              <p className="text-[#5A6A85] max-w-md mt-2">
                Run your first audit in Audit Mode. Results will be saved here automatically so you
                can track fairness improvements over time.
              </p>
            </div>
            <Link href="/audit">
              <Button className="bg-[#00C853] hover:bg-[#00E676] text-white gap-2 font-semibold mt-2">
                <Search className="w-4 h-4" /> Run Your First Audit
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {!loading && audits.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Summary Stats Bar — Navy Background */}
          <div className="bg-[#0D2045] p-6" style={{ borderRadius: '0px' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-[#8BA3C7] text-sm mb-2">
                  <BarChart3 className="w-4 h-4" /> Total Audits
                </div>
                <p className="text-3xl font-bold text-white font-mono">{audits.length}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-[#8BA3C7] text-sm mb-2">
                  <TrendingUp className="w-4 h-4" /> Avg Score
                </div>
                <p className={`text-3xl font-bold font-mono ${
                  avgScore >= 70 ? "text-[#00E676]" : avgScore >= 50 ? "text-[#FFAA00]" : "text-[#FF2D55]"
                }`}>
                  {avgScore}/100
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-[#8BA3C7] text-sm mb-2">
                  <AlertTriangle className="w-4 h-4" /> Critical (F)
                </div>
                <p className="text-3xl font-bold text-[#FF2D55] font-mono">{criticalCount}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-[#8BA3C7] text-sm mb-2">
                  <Search className="w-4 h-4" /> Top Issue
                </div>
                <p className="text-lg font-semibold text-white truncate mt-1">
                  {topFlag ? topFlag[0].replace(/_/g, " ") : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Domain Filter Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-[#5A6A85] mr-1" />
            {DOMAIN_FILTERS.map((filter) => (
              <Button
                key={filter}
                size="sm"
                variant={activeFilter === filter ? "default" : "outline"}
                className={activeFilter === filter
                  ? "bg-[#0D2045] text-white hover:bg-[#1A3A6E]"
                  : "bg-white border-[#E2E6ED] text-[#5A6A85] hover:border-[#0D2045]/30 hover:text-[#0A1628]"
                }
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Audit List */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredAudits.map((audit, i) => (
                <motion.div
                  key={audit.id || i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Card className="bg-white border-[#E2E6ED] hover:shadow-premium-hover hover:translate-y-[-1px] transition-all duration-200 cursor-pointer group">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between gap-4">
                        {/* Left: Domain + Score */}
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="text-3xl shrink-0 group-hover:scale-110 transition-transform duration-200">
                            {audit.domain_icon || "📊"}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-[#0A1628] truncate">
                                {audit.domain_label || audit.domain || "General"}
                              </span>
                              <Badge variant="outline" className={`text-xs ${gradeColors[audit.grade] || ""}`}>
                                Grade {audit.grade}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#5A6A85]">
                              <span className="font-mono">{audit.dataset_rows} rows</span>
                              <span>•</span>
                              <span>{(audit.protected_attributes || []).join(", ") || "—"}</span>
                            </div>
                            {audit.flags?.length > 0 && (
                              <div className="flex gap-1.5 mt-2 flex-wrap">
                                {audit.flags.map((f, fi) => (
                                  <Badge key={fi} variant="outline" className="text-xs bg-[#F5F7FA] border-[#E2E6ED] text-[#5A6A85] font-normal">
                                    {f.replace(/_/g, " ")}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Score + Risk */}
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <p className={`text-2xl font-bold font-mono ${getScoreColor(audit.fairness_score)}`}>
                              {audit.fairness_score}/100
                            </p>
                            {audit.debt_risk_level && audit.debt_risk_level !== "LOW" && (
                              <Badge variant="outline" className={`text-xs mt-1 ${riskBadge[audit.debt_risk_level] || ""}`}>
                                {audit.debt_risk_level} Risk
                              </Badge>
                            )}
                            {audit.timestamp && (
                              <p className="text-xs text-[#5A6A85] mt-1">
                                {new Date(audit.timestamp).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="w-5 h-5 text-[#5A6A85] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredAudits.length === 0 && activeFilter !== "All" && (
              <div className="text-center py-12 text-[#5A6A85]">
                <p>No audits found for &ldquo;{activeFilter}&rdquo;. Try a different filter.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
