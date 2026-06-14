// components/genome-map.jsx
"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const QUAL_LABELS = {
  60: "60 — Borderline",
  70: "70 — Average",
  80: "80 — Strong",
  85: "85 — Very Strong",
  90: "90 — Excellent",
};

function getCellColor(rate) {
  if (rate > 0.75) return { bg: "rgba(202,255,61,0.15)", text: "#86efac" };
  if (rate >= 0.50) return { bg: "rgba(251,191,36,0.15)", text: "#fde68a" };
  return { bg: "rgba(239,68,68,0.15)", text: "#fca5a5" };
}

function formatGroupLabel(key) {
  const parts = key.split("_");
  // e.g. "male_western_young" → "M·W·Y", "female_indian_senior" → "F·I·S"
  const gender = parts[0] === "male" ? "♂" : "♀";
  const ethnicity = (parts[1] || "").charAt(0).toUpperCase();
  const age = (parts[2] || "").charAt(0).toUpperCase();
  return `${gender}${ethnicity}${age}`;
}

function formatGroupLabelFull(key) {
  const parts = key.split("_");
  const gender = parts[0] === "male" ? "Male" : "Female";
  const ethnicity = (parts[1] || "").charAt(0).toUpperCase() + (parts[1] || "").slice(1);
  const age = parts[2] === "senior" ? "45+" : "25-35";
  return `${gender}, ${ethnicity}, ${age}`;
}

export default function GenomeMap({ genome }) {
  if (!genome) return null;

  const qualLevels = [60, 70, 80, 85, 90];
  const groupKeys = useMemo(() => Object.keys(genome.group_rates || {}), [genome]);

  // Build lookup: by_qual[qual][demoKey] = { approved, total }
  const byQual = useMemo(() => {
    const result = {};
    for (const [q, data] of Object.entries(genome.by_qualification || {})) {
      result[q] = {};
      for (const [dk, stats] of Object.entries(data.rates_by_group || {})) {
        result[q][dk] = stats.total > 0 ? stats.approved / stats.total : 0;
      }
    }
    return result;
  }, [genome]);

  return (
    <div className="space-y-6">
      {/* Grid visualization */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <div className="flex items-stretch rounded-md overflow-hidden flex-shrink-0">
            <div className="bg-[#9a77f8] w-7 h-7 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">🧬</span>
            </div>
            <div className="bg-black w-0.5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Discrimination Heatmap</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Approval rates across {qualLevels.length} qualification levels × {groupKeys.length} demographic groups
            </p>
          </div>
        </div>

        <div className="p-5 overflow-x-auto">
          {/* Column headers */}
          <div className="flex gap-0.5 mb-1 ml-[100px]">
            {groupKeys.map(key => (
              <div
                key={key}
                className="flex-1 min-w-[52px] text-center"
                title={formatGroupLabelFull(key)}
              >
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  {formatGroupLabel(key)}
                </span>
              </div>
            ))}
          </div>

          {/* Grid rows */}
          <div className="space-y-0.5">
            {qualLevels.map((qual) => {
              const isBorderline = (qual === 80 || qual === 85) && genome.borderline_amplification;
              return (
                <div key={qual} className="flex items-center gap-0.5 relative">
                  {/* Row label */}
                  <div className="w-[100px] flex-shrink-0 text-right pr-3">
                    <span className="text-[11px] font-semibold text-foreground font-mono">{qual}</span>
                  </div>

                  {/* Cells */}
                  {groupKeys.map(gk => {
                    const rate = byQual[qual]?.[gk] ?? genome.group_rates[gk]?.approval_rate ?? 0;
                    const pct = Math.round(rate * 100);
                    const { bg, text } = getCellColor(rate);

                    return (
                      <motion.div
                        key={`${qual}-${gk}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: Math.random() * 0.3 }}
                        className="flex-1 min-w-[52px] h-10 rounded-sm flex items-center justify-center relative"
                        style={{ background: bg }}
                        title={`${formatGroupLabelFull(gk)} at qual ${qual}: ${pct}%`}
                      >
                        <span className="text-xs font-bold font-mono" style={{ color: text }}>
                          {pct}%
                        </span>
                      </motion.div>
                    );
                  })}

                  {/* Borderline amplification overlay */}
                  {isBorderline && (
                    <div className="absolute inset-0 ml-[100px] rounded-sm pointer-events-none border-2 border-[#ff6b7a]/30 bg-[#ff6b7a]/5 flex items-center justify-end pr-2">
                      <span className="text-[9px] font-bold text-[#ff6b7a] bg-white/90 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Bias peaks here
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(202,255,61,0.15)" }} />
              <span className="text-[10px] text-muted-foreground">{'>'} 75% approved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(251,191,36,0.15)" }} />
              <span className="text-[10px] text-muted-foreground">50–75%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(239,68,68,0.15)" }} />
              <span className="text-[10px] text-muted-foreground">{'<'} 50%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Approval rate bar chart — overall by group */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Overall Approval Rate by Group</p>
          <p className="text-xs text-muted-foreground mt-0.5">Across all qualification levels</p>
        </div>
        <div className="p-5 space-y-2.5">
          {groupKeys.map(key => {
            const rate = genome.group_rates[key];
            if (!rate) return null;
            const pct = rate.approval_pct;
            const isBest = key === genome.best_group?.key;
            const isWorst = key === genome.worst_group?.key;
            const barColor = pct > 75 ? "#caff3d" : pct >= 50 ? "#fbbf24" : "#ff6b7a";

            return (
              <div key={key} className="flex items-center gap-3">
                <div className="w-[140px] flex-shrink-0 text-right">
                  <span className="text-xs font-medium text-foreground" title={formatGroupLabelFull(key)}>
                    {formatGroupLabelFull(key)}
                  </span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-5 bg-muted rounded-sm overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-sm"
                      style={{ background: barColor }}
                    />
                  </div>
                  <span className="text-xs font-bold font-mono w-10 text-right text-foreground">{pct}%</span>
                  {isBest && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#caff3d]/15 text-[#65a30d] border border-[#caff3d]/30">
                      BEST
                    </span>
                  )}
                  {isWorst && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#ff6b7a]/10 text-[#ff6b7a] border border-[#ff6b7a]/25">
                      WORST
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
