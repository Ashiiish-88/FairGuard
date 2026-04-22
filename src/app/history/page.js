// app/history/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  History,
  RefreshCcw,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Database,
  Clock,
  ChevronRight,
  Shield,
  BarChart3,
  Info,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const scoreColor = (s) =>
  s >= 70 ? "text-[#caff3d]"
  : s >= 50 ? "text-[#ff8c42]"
  : "text-[#ff6b7a]";

const scoreBg = (s) =>
  s >= 70 ? "bg-[#caff3d]/10 border-[#caff3d]/25"
  : s >= 50 ? "bg-[#ff8c42]/10 border-[#ff8c42]/25"
  : "bg-[#ff6b7a]/10 border-[#ff6b7a]/25";

const gradeStyle = (g) => ({
  A: "bg-[#caff3d]/12 text-black border-[#caff3d]/30",
  B: "bg-[#caff3d]/8  text-black border-[#caff3d]/20",
  C: "bg-[#ff8c42]/10 text-[#ff8c42] border-[#ff8c42]/25",
  F: "bg-[#ff6b7a]/10 text-[#ff6b7a] border-[#ff6b7a]/25",
}[g] ?? "bg-muted text-muted-foreground border-border");

const riskStyle = (r) => ({
  CRITICAL: "bg-[#ff6b7a]/10 text-[#ff6b7a] border-[#ff6b7a]/25",
  HIGH:     "bg-[#ff8c42]/10 text-[#ff8c42] border-[#ff8c42]/25",
  MODERATE: "bg-[#ff8c42]/8  text-[#ff8c42] border-[#ff8c42]/20",
  LOW:      "bg-[#caff3d]/8  text-black     border-[#caff3d]/20",
}[r] ?? "bg-muted text-muted-foreground border-border");

function formatDate(ts) {
  if (!ts) return "—";
  try {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, {
      month: "short", day: "numeric", year: "numeric",
    });
  } catch { return "—"; }
}

function formatTime(ts) {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
}

// ─── Animation presets ────────────────────────────────────────────────────────

const fadeUp = {
  initial:    { opacity: 0, y: 14 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const staggerChild = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/* Stat card */
function StatCard({
  label,
  value,
  valueClass = "text-foreground",
  sub,
  icon,
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 hover:border-border/80 hover:shadow-sm transition-all duration-150">
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {label}
        </p>
        {icon && (
          <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">{icon}</span>
          </div>
        )}
      </div>
      <p className={`text-2xl font-bold font-mono leading-none ${valueClass}`}>
        {value}
      </p>
      {sub && (
        <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>
      )}
    </div>
  );
}

/* Trend indicator */
function Trend({ audits }) {
  if (audits.length < 2) return null;
  const first = audits[audits.length - 1].fairness_score;
  const last  = audits[0].fairness_score;
  const diff  = last - first;

  if (Math.abs(diff) < 2) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Minus className="w-3 h-3" /> Stable
      </span>
    );
  }
  if (diff > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-[#caff3d] font-semibold">
        <TrendingUp className="w-3 h-3" /> +{diff} pts
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-[#ff6b7a] font-semibold">
      <TrendingDown className="w-3 h-3" /> {diff} pts
    </span>
  );
}

/* Score bar */
function ScoreBar({ score }) {
  const color =
    score >= 70 ? "#caff3d"
    : score >= 50 ? "#ff8c42"
    : "#ff6b7a";

  return (
    <div className="w-full h-1 rounded-full bg-muted overflow-hidden mt-2">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}

/* Flag pill */
function FlagPill({ label }) {
  return (
    <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground uppercase tracking-wide">
      {label.replace(/_/g, " ")}
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [audits,  setAudits]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [storage, setStorage] = useState("");

  const loadAudits = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/history/list");
      const json = await res.json();
      setAudits(json.audits ?? []);
      setStorage(json.storage ?? "");
    } catch {
      setAudits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAudits(); }, []);

  // ── Computed stats ──────────────────────────────────────────────────────────
  const avgScore = audits.length > 0
    ? Math.round(audits.reduce((s, a) => s + (a.fairness_score ?? 0), 0) / audits.length)
    : 0;

  const criticalCount = audits.filter((a) => a.grade === "F").length;

  const flagFreq = {};
  audits.forEach((a) =>
    (a.flags ?? []).forEach((f) => { flagFreq[f] = (flagFreq[f] ?? 0) + 1; })
  );
  const topFlag = Object.entries(flagFreq).sort((a, b) => b[1] - a[1])[0];

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Page header ───────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-4">
            {/* Icon block */}
            <div className="flex items-stretch rounded-md overflow-hidden flex-shrink-0 mt-0.5">
              <div className="bg-[#caff3d] w-10 h-10 flex items-center justify-center">
                <History className="w-4.5 h-4.5 text-black" />
              </div>
              <div className="bg-black w-1" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Audit History
              </h1>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <p className="text-sm text-muted-foreground">
                  Track fairness scores over time · spot patterns · measure improvement
                </p>
                {storage === "memory" && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#ff8c42]/8 border border-[#ff8c42]/20 text-[#ff8c42]">
                    <Info className="w-3 h-3" />
                    In-memory · configure Firebase for persistence
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={loadAudits}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                       font-medium text-muted-foreground border border-border bg-card
                       hover:bg-muted hover:text-foreground disabled:opacity-50
                       transition-all duration-150"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* ── Loading ────────────────────────────────────────────── */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loading"
              {...fadeUp}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-muted" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#caff3d] animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground">Loading audit history...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty state ────────────────────────────────────────── */}
        {!loading && audits.length === 0 && (
          <motion.div key="empty" {...fadeUp}>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="flex flex-col items-center text-center gap-4 py-20 px-8">
                {/* Icon */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <History className="w-7 h-7 text-muted-foreground/40" />
                  </div>
                  <div className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-[#caff3d]/20 border border-[#caff3d]/40 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#caff3d]" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    No audits yet
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                    Run your first audit in Audit Mode. Results are saved here
                    automatically so you can track fairness improvements over time.
                  </p>
                </div>

                <a
                  href="/audit"
                  className="flex items-stretch rounded-md overflow-hidden
                             hover:shadow-md transition-shadow duration-150 group mt-2"
                >
                  <span className="bg-[#caff3d] px-3 flex items-center justify-center group-hover:bg-[#b8f020] transition-colors">
                    <Shield className="w-3.5 h-3.5 text-black" />
                  </span>
                  <span className="bg-black text-white text-xs font-bold tracking-wider uppercase px-5 py-2.5 flex items-center gap-2 group-hover:bg-[#1a1a1a] transition-colors">
                    Run first audit
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Populated state ─────────────────────────────────────── */}
        {!loading && audits.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >

            {/* ── Summary stats ──────────────────────────────────── */}
            <motion.div
              variants={staggerChild}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <StatCard
                label="Total Audits"
                value={audits.length}
                icon={<Database className="w-3.5 h-3.5" />}
                sub={`${audits.length === 1 ? "1 audit" : `${audits.length} audits`} on record`}
              />
              <StatCard
                label="Avg Fairness Score"
                value={`${avgScore}/100`}
                valueClass={scoreColor(avgScore)}
                icon={<BarChart3 className="w-3.5 h-3.5" />}
                sub={avgScore >= 70 ? "Generally fair" : avgScore >= 50 ? "Needs attention" : "Critical issues found"}
              />
              <StatCard
                label="Critical (Grade F)"
                value={criticalCount}
                valueClass={criticalCount > 0 ? "text-[#ff6b7a]" : "text-[#caff3d]"}
                icon={criticalCount > 0
                  ? <AlertTriangle className="w-3.5 h-3.5" />
                  : <CheckCircle2 className="w-3.5 h-3.5" />
                }
                sub={criticalCount > 0 ? "Require immediate action" : "No critical audits"}
              />
              <StatCard
                label="Most Common Issue"
                value={topFlag ? topFlag[0].replace(/_/g, " ") : "—"}
                valueClass="text-foreground text-lg"
                icon={<AlertTriangle className="w-3.5 h-3.5" />}
                sub={topFlag ? `Found in ${topFlag[1]} audit${topFlag[1] > 1 ? "s" : ""}` : "No repeated issues"}
              />
            </motion.div>

            {/* ── Trend banner ───────────────────────────────────── */}
            {audits.length >= 2 && (
              <motion.div variants={staggerChild}>
                <div className="flex items-center gap-4 px-5 py-3.5 rounded-xl border border-border bg-card">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      Score trend across {audits.length} audits
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      First: <span className="font-mono font-semibold">{audits[audits.length - 1].fairness_score}</span>
                      {" "}→ Latest:{" "}
                      <span className="font-mono font-semibold">{audits[0].fairness_score}</span>
                    </p>
                  </div>
                  <Trend audits={audits} />
                </div>
              </motion.div>
            )}

            {/* ── Audit list ─────────────────────────────────────── */}
            <motion.div variants={staggerChild} className="space-y-2.5">
              {/* List header */}
              <div className="flex items-center gap-3 mb-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  All Audits
                </p>
                <div className="flex-1 h-px bg-border" />
                <p className="text-[10px] text-muted-foreground">
                  {audits.length} record{audits.length !== 1 ? "s" : ""}
                </p>
              </div>

              {audits.map((audit, i) => {
                const score   = audit.fairness_score ?? 0;
                const hasRisk =
                  audit.debt_risk_level &&
                  audit.debt_risk_level !== "LOW";

                return (
                  <motion.div
                    key={audit.id ?? i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: i * 0.04,
                      duration: 0.2,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <div className="bg-card rounded-xl border border-border overflow-hidden hover:border-border/80 hover:shadow-sm transition-all duration-150 group">
                      <div className="flex items-stretch">

                        {/* ── Score bar left edge ─────────────────── */}
                        <div
                          className="w-1 flex-shrink-0"
                          style={{
                            background:
                              score >= 70 ? "#caff3d"
                              : score >= 50 ? "#ff8c42"
                              : "#ff6b7a",
                          }}
                        />

                        {/* ── Main content ────────────────────────── */}
                        <div className="flex-1 p-5 flex items-center gap-5 min-w-0">

                          {/* Domain icon */}
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl">
                            <BarChart3 className="w-5 h-5 text-muted-foreground" />
                          </div>

                          {/* Domain + meta */}
                          <div className="flex-1 min-w-0">
                            {/* Row 1: name + grade */}
                            <div className="flex items-center gap-2.5 flex-wrap mb-1">
                              <span className="font-semibold text-sm text-foreground truncate">
                                {audit.domain_label ?? audit.domain ?? "General"}
                              </span>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${gradeStyle(audit.grade)}`}
                              >
                                Grade {audit.grade}
                              </span>
                              {hasRisk && (
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${riskStyle(audit.debt_risk_level)}`}
                                >
                                  {audit.debt_risk_level} risk
                                </span>
                              )}
                            </div>

                            {/* Row 2: dataset meta */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              {audit.dataset_rows && (
                                <>
                                  <Database className="w-3 h-3" />
                                  <span>{audit.dataset_rows.toLocaleString()} rows</span>
                                  <span className="text-border">·</span>
                                </>
                              )}
                              {(audit.protected_attributes ?? []).length > 0 && (
                                <span className="font-mono truncate max-w-[200px]">
                                  {(audit.protected_attributes ?? []).join(", ")}
                                </span>
                              )}
                            </div>

                            {/* Score bar */}
                            <ScoreBar score={score} />

                            {/* Row 3: flags */}
                            {(audit.flags ?? []).length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                                {(audit.flags ?? []).map((f, fi) => (
                                  <FlagPill key={fi} label={f} />
                                ))}
                              </div>
                            )}
                          </div>

                          {/* ── Score + timestamp ─────────────────── */}
                          <div className="text-right flex-shrink-0 flex flex-col items-end gap-1.5">
                            <span
                              className={`text-2xl font-bold font-mono leading-none ${scoreColor(score)}`}
                            >
                              {score}
                              <span className="text-sm text-muted-foreground font-normal">
                                /100
                              </span>
                            </span>

                            {audit.timestamp && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span className="text-[10px]">
                                  {formatDate(audit.timestamp)}
                                </span>
                              </div>
                            )}
                            {audit.timestamp && (
                              <span className="text-[10px] font-mono text-muted-foreground/60">
                                {formatTime(audit.timestamp)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

          </motion.div>
        )}
      </div>
    </div>
  );
}