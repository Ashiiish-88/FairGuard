"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw, TrendingUp, AlertTriangle, BarChart3, Search, Clock, ChevronRight, Filter, Database, Shield } from "lucide-react";
import Link from "next/link";

const gradeColors = {
  A: "bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20",
  B: "bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20",
  C: "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20",
  F: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
};

const riskBadge = {
  CRITICAL: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
  HIGH: "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20",
  MODERATE: "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20",
  LOW: "bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20",
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
    } catch { setAudits([]); } finally { setLoading(false); }
  };

  useEffect(() => { loadAudits(); }, []);

  const avgScore = audits.length > 0 ? Math.round(audits.reduce((sum, a) => sum + (a.fairness_score || 0), 0) / audits.length) : 0;
  const criticalCount = audits.filter(a => a.grade === "F").length;
  const commonFlags = {};
  audits.forEach(a => (a.flags || []).forEach(f => { commonFlags[f] = (commonFlags[f] || 0) + 1; }));
  const topFlag = Object.entries(commonFlags).sort((a, b) => b[1] - a[1])[0];

  const filteredAudits = activeFilter === "All" ? audits : audits.filter(a => (a.domain_label || a.domain || "").toLowerCase().includes(activeFilter.toLowerCase()));

  const getScoreColor = (score) => {
    if (score >= 70) return "text-[#0D9488]";
    if (score >= 50) return "text-[#F59E0B]";
    return "text-[#EF4444]";
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-[#111827]">
            <Clock className="w-8 h-8 text-[#F59E0B]" /> Audit History
          </h1>
          <p className="text-[#6B7280] mt-1">
            Track fairness scores over time &mdash; see patterns, trends, and repeat issues
            {storage === "memory" && <Badge className="ml-2 text-xs bg-[#F59E0B]/10 text-[#D97706] border-0 font-normal">In-memory &mdash; configure Firebase for persistence</Badge>}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadAudits} className="gap-2 bg-white border-[#E5E7EB] text-[#111827] hover:bg-[#F9FAFB]">
          <RefreshCcw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24 gap-3 text-[#6B7280]">
          <Loader2 className="w-6 h-6 animate-spin text-[#F59E0B]" /> Loading audit history...
        </div>
      )}

      {!loading && audits.length === 0 && (
        <Card className="bg-white border-[#E5E7EB] py-20">
          <CardContent className="flex flex-col items-center text-center gap-5">
            <div className="w-20 h-20 bg-[#F3F4F6] flex items-center justify-center rounded-2xl">
              <Database className="w-10 h-10 text-[#6B7280] opacity-40" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#111827]">No audits yet</h3>
              <p className="text-[#6B7280] max-w-md mt-2">Run your first audit in Audit Mode. Results will be saved here automatically so you can track fairness improvements over time.</p>
            </div>
            <Link href="/audit">
              <button className="group inline-flex items-stretch rounded-md overflow-hidden transition-all duration-150 hover:-translate-y-px hover:shadow-lg">
                <span className="bg-[#F59E0B] px-3.5 py-2.5 flex items-center justify-center text-black group-hover:bg-[#D97706] transition-colors"><Search className="w-3.5 h-3.5" /></span>
                <span className="bg-[#111827] text-white text-[11px] font-bold tracking-[0.12em] uppercase px-5 py-2.5 flex items-center group-hover:bg-[#1f2937] transition-colors">Run Your First Audit</span>
              </button>
            </Link>
          </CardContent>
        </Card>
      )}

      {!loading && audits.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Summary Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-[#6B7280] text-sm mb-2"><BarChart3 className="w-4 h-4" /> Total Audits</div>
                <p className="text-3xl font-bold text-[#111827]" style={{ fontFamily: "var(--font-geist-mono)" }}>{audits.length}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-[#6B7280] text-sm mb-2"><TrendingUp className="w-4 h-4" /> Avg Score</div>
                <p className={`text-3xl font-bold ${avgScore >= 70 ? "text-[#0D9488]" : avgScore >= 50 ? "text-[#F59E0B]" : "text-[#EF4444]"}`} style={{ fontFamily: "var(--font-geist-mono)" }}>{avgScore}/100</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-[#6B7280] text-sm mb-2"><AlertTriangle className="w-4 h-4" /> Critical (F)</div>
                <p className="text-3xl font-bold text-[#EF4444]" style={{ fontFamily: "var(--font-geist-mono)" }}>{criticalCount}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-[#6B7280] text-sm mb-2"><Search className="w-4 h-4" /> Top Issue</div>
                <p className="text-lg font-semibold text-[#111827] truncate mt-1">{topFlag ? topFlag[0].replace(/_/g, " ") : "\u2014"}</p>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-[#6B7280] mr-1" />
            {DOMAIN_FILTERS.map((filter) => (
              <Button key={filter} size="sm" variant={activeFilter === filter ? "default" : "outline"}
                className={activeFilter === filter ? "bg-[#111827] text-white" : "bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#111827]"}
                onClick={() => setActiveFilter(filter)}>{filter}</Button>
            ))}
          </div>

          {/* Audit List */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredAudits.map((audit, i) => (
                <motion.div key={audit.id || i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.04 }}>
                  <Card className="bg-white border-[#E5E7EB] hover:shadow-md hover:translate-y-[-1px] transition-all duration-200 cursor-pointer group">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 bg-[#F3F4F6] flex items-center justify-center rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                            <Shield className="w-5 h-5 text-[#6B7280]" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-[#111827] truncate">{audit.domain_label || audit.domain || "General"}</span>
                              <Badge variant="outline" className={`text-xs ${gradeColors[audit.grade] || ""}`}>Grade {audit.grade}</Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                              <span style={{ fontFamily: "var(--font-geist-mono)" }}>{audit.dataset_rows} rows</span>
                              <span>&bull;</span>
                              <span>{(audit.protected_attributes || []).join(", ") || "\u2014"}</span>
                            </div>
                            {audit.flags?.length > 0 && (
                              <div className="flex gap-1.5 mt-2 flex-wrap">
                                {audit.flags.map((f, fi) => <Badge key={fi} variant="outline" className="text-xs bg-[#F9FAFB] border-[#E5E7EB] text-[#6B7280] font-normal">{f.replace(/_/g, " ")}</Badge>)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${getScoreColor(audit.fairness_score)}`} style={{ fontFamily: "var(--font-geist-mono)" }}>{audit.fairness_score}/100</p>
                            {audit.debt_risk_level && audit.debt_risk_level !== "LOW" && <Badge variant="outline" className={`text-xs mt-1 ${riskBadge[audit.debt_risk_level] || ""}`}>{audit.debt_risk_level} Risk</Badge>}
                            {audit.timestamp && <p className="text-xs text-[#6B7280] mt-1">{new Date(audit.timestamp).toLocaleDateString()}</p>}
                          </div>
                          <ChevronRight className="w-5 h-5 text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredAudits.length === 0 && activeFilter !== "All" && (
              <div className="text-center py-12 text-[#6B7280]"><p>No audits found for &ldquo;{activeFilter}&rdquo;. Try a different filter.</p></div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
