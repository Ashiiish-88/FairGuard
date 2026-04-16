"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, History, RefreshCcw, ChevronDown } from "lucide-react";

const DOMAIN_FILTERS = ["All", "Hiring", "Content Moderation", "Pricing"];

const gradeColors = {
  A: "bg-[#00E676]/20 text-[#00E676] border-[#00E676]/30",
  B: "bg-[#00E676]/15 text-[#00E676] border-[#00E676]/25",
  C: "bg-[#FFAA00]/20 text-[#FFAA00] border-[#FFAA00]/30",
  F: "bg-[#FF2D55]/20 text-[#FF2D55] border-[#FF2D55]/30",
};

const riskBadge = {
  CRITICAL: "bg-[#FF2D55]/20 text-[#FF2D55] border-[#FF2D55]/30",
  HIGH: "bg-[#FF2D55]/15 text-[#FF2D55] border-[#FF2D55]/25",
  MODERATE: "bg-[#FFAA00]/20 text-[#FFAA00] border-[#FFAA00]/30",
  LOW: "bg-[#00E676]/20 text-[#00E676] border-[#00E676]/30",
};

function scoreColor(score) {
  if (score >= 70) return "text-[#00E676]";
  if (score >= 50) return "text-[#FFAA00]";
  return "text-[#FF2D55]";
}

export default function HistoryPage() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storage, setStorage] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);

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

  // Filter audits by domain
  const filteredAudits = useMemo(() => {
    if (domainFilter === "All") return audits;
    return audits.filter(a => {
      const label = (a.domain_label || a.domain || "").toLowerCase();
      return label.includes(domainFilter.toLowerCase());
    });
  }, [audits, domainFilter]);

  // Compute stats from filtered audits
  const avgScore = filteredAudits.length > 0
    ? Math.round(filteredAudits.reduce((sum, a) => sum + (a.fairness_score || 0), 0) / filteredAudits.length)
    : 0;
  const criticalCount = filteredAudits.filter(a => a.grade === "F").length;
  const commonFlags = {};
  filteredAudits.forEach(a => (a.flags || []).forEach(f => { commonFlags[f] = (commonFlags[f] || 0) + 1; }));
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
        <div className="flex items-center gap-3">
          {/* Domain Filter Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              {domainFilter}
              <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
            </Button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border shadow-xl py-1 min-w-[180px]">
                {DOMAIN_FILTERS.map((d) => (
                  <button
                    key={d}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-secondary/50 ${
                      domainFilter === d ? "text-[#00E676] font-semibold" : "text-foreground"
                    }`}
                    onClick={() => { setDomainFilter(d); setFilterOpen(false); }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={loadAudits} className="gap-2">
            <RefreshCcw className="w-4 h-4" /> Refresh
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading audit history...</span>
        </div>
      )}

      {!loading && filteredAudits.length === 0 && (
        <Card className="bg-card/50 border-border/50 py-20">
          <CardContent className="flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center">
              <History className="w-10 h-10 text-muted-foreground opacity-30" />
            </div>
            <h3 className="text-xl font-semibold">
              {domainFilter !== "All" ? `No ${domainFilter} audits found` : "No audits yet"}
            </h3>
            <p className="text-muted-foreground max-w-md">
              {domainFilter !== "All"
                ? "Try selecting a different domain filter or run a new audit."
                : "Run your first audit in Audit Mode. Results will be saved here automatically so you can track fairness improvements over time."}
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && filteredAudits.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Summary Stats — Navy Background Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-[#1A3A6E]/30 border border-[#1A3A6E]/50 rounded-none">
            <div>
              <p className="text-sm text-muted-foreground">Total Audits</p>
              <p className="text-2xl font-bold font-mono mt-1">{filteredAudits.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Fairness Score</p>
              <p className={`text-2xl font-bold font-mono mt-1 ${scoreColor(avgScore)}`}>
                {avgScore}/100
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical (Grade F)</p>
              <p className="text-2xl font-bold font-mono text-[#FF2D55] mt-1">{criticalCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Most Common Issue</p>
              <p className="text-lg font-semibold mt-1 truncate">
                {topFlag ? topFlag[0].replace(/_/g, " ") : "—"}
              </p>
            </div>
          </div>

          {/* Audit List */}
          <div className="space-y-3">
            {filteredAudits.map((audit, i) => (
              <motion.div
                key={audit.id || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-card/50 border-border/50 hover:border-[#00E676]/30 hover:bg-card/70 transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between gap-4">
                      {/* Left: Domain + Score */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="text-3xl shrink-0 group-hover:scale-110 transition-transform">{audit.domain_icon || "📊"}</div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold truncate">{audit.domain_label || audit.domain || "General"}</span>
                            <Badge variant="outline" className={`text-xs ${gradeColors[audit.grade] || ""}`}>
                              Grade {audit.grade}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="font-mono">{audit.dataset_rows} rows</span>
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
                        <p className={`text-2xl font-bold font-mono ${scoreColor(audit.fairness_score)}`}>
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
