// components/regulation-panel.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, ChevronDown, ChevronUp, ExternalLink, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { REGULATION_DB } from "@/lib/regulation-db";

/**
 * RegulationPanel — Collapsible panel showing full legal context
 * below Fairness Debt card in Audit Mode results.
 * Shows only regulations relevant to the detected domain.
 */
export default function RegulationPanel({ auditResults }) {
  const [open, setOpen] = useState(false);
  const [expandedReg, setExpandedReg] = useState(null);

  const domain = auditResults?.domain?.domain || "general";
  const diRatio = auditResults?.per_attribute
    ? Math.min(...Object.values(auditResults.per_attribute).map(a => a.disparate_impact?.ratio ?? 1))
    : 1;
  const score = auditResults?.fairness_score?.score ?? 0;
  const proxyCount = auditResults?.proxies?.length ?? 0;

  // Filter to domain-relevant regulations
  const relevantRegs = Object.values(REGULATION_DB).filter(
    (r) => r.domains.includes(domain) || r.domains.includes("all")
  );

  if (relevantRegs.length === 0) return null;

  function getRegStatus(reg) {
    if (reg.id === "eu_ai_act") {
      if (!["hiring", "lending", "insurance", "education", "healthcare"].includes(domain)) return "N/A";
      return diRatio < 0.8 ? "RISK" : score >= 70 ? "DOCUMENTED" : "RISK";
    }
    if (reg.id === "gdpr_art22") return score >= 70 ? "DOCUMENTED" : "RISK";
    if (reg.id === "eeoc_title_vii") return diRatio >= 0.8 ? "COMPLIANT" : "NON-COMPLIANT";
    if (reg.id === "nyc_ll_144") return "AUDIT COMPLETED";
    if (reg.id === "dpdp_act") return score >= 70 ? "DOCUMENTED" : "RISK";
    if (reg.id === "ecoa") return proxyCount === 0 ? "NO PROXIES" : "PROXY RISK";
    return "CHECK";
  }

  const statusColor = {
    "COMPLIANT":       "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "DOCUMENTED":      "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "AUDIT COMPLETED": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "NO PROXIES":      "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "NON-COMPLIANT":   "text-red-400 bg-red-500/10 border-red-500/20",
    "RISK":            "text-orange-400 bg-orange-500/10 border-orange-500/20",
    "PROXY RISK":      "text-orange-400 bg-orange-500/10 border-orange-500/20",
    "N/A":             "text-muted-foreground bg-muted/50 border-border",
    "CHECK":           "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Toggle header */}
      <button
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/20 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-stretch rounded-md overflow-hidden flex-shrink-0">
          <div className="bg-[#0057ff] w-7 h-7 flex items-center justify-center">
            <Scale className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="bg-black w-0.5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Legal Regulation Reference</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {relevantRegs.length} regulations apply to this {domain} AI system — click to expand
          </p>
        </div>
        <span className="text-xs font-semibold text-[#0057ff] mr-2">
          Domain: {domain}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="divide-y divide-border/50">
              {relevantRegs.map((reg) => {
                const status = getRegStatus(reg);
                const isExpanded = expandedReg === reg.id;
                return (
                  <div key={reg.id}>
                    {/* Regulation row */}
                    <button
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-muted/10 transition-colors"
                      onClick={() => setExpandedReg(isExpanded ? null : reg.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">{reg.name}</span>
                          <span className="text-[10px] text-muted-foreground">{reg.jurisdiction}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{reg.full_name}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border flex-shrink-0 ${
                          statusColor[status] || "text-muted-foreground bg-muted border-border"
                        }`}
                      >
                        {status}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>

                    {/* Expanded regulation detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-4 space-y-3 bg-muted/5">
                            {/* Articles / requirements */}
                            {reg.articles && (
                              <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                                  Key Articles
                                </p>
                                <div className="space-y-1.5">
                                  {reg.articles.map((art) => (
                                    <div key={art.article} className="flex items-start gap-2 text-xs">
                                      <span className="font-mono font-bold text-[#0057ff] flex-shrink-0 w-12">
                                        Art. {art.article}
                                      </span>
                                      <div>
                                        <span className="font-semibold text-foreground">{art.title}: </span>
                                        <span className="text-muted-foreground">{art.requirement}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Requirements list */}
                            {reg.requirements && (
                              <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                                  Requirements
                                </p>
                                <ul className="space-y-1">
                                  {reg.requirements.map((req, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                      <CheckCircle2 className="w-3 h-3 text-[#0057ff] flex-shrink-0 mt-0.5" />
                                      {req}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Real cases (EEOC) */}
                            {reg.real_cases && (
                              <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                                  Real Enforcement Cases
                                </p>
                                <div className="space-y-2">
                                  {reg.real_cases.map((c, i) => (
                                    <div key={i} className="text-xs">
                                      <span className="font-semibold text-foreground">{c.case}</span>
                                      {" "}
                                      <span className="text-orange-400 font-bold">{c.settlement}</span>
                                      {" "}
                                      <span className="text-muted-foreground">({c.year}) — {c.note}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* FairGuard satisfies note */}
                            {reg.fairguard_satisfies && (
                              <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-emerald-500/5 border border-emerald-500/20 text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <p className="text-emerald-400 font-medium">{reg.fairguard_note}</p>
                              </div>
                            )}

                            {/* Your audit vs this regulation */}
                            <div className="pt-2 border-t border-border/30">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                                Your Audit vs This Regulation
                              </p>
                              <div className="flex items-center gap-2">
                                {status === "COMPLIANT" || status === "DOCUMENTED" || status === "AUDIT COMPLETED" || status === "NO PROXIES" ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-xs text-emerald-400 font-semibold">
                                      Audit addresses this regulation&apos;s core requirement
                                    </span>
                                  </>
                                ) : status === "N/A" ? (
                                  <span className="text-xs text-muted-foreground">
                                    Not applicable to {domain} domain
                                  </span>
                                ) : (
                                  <>
                                    <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                                    <span className="text-xs text-orange-400 font-semibold">
                                      Improvement needed before full compliance
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Official citation + link */}
                            <div className="flex items-center gap-1.5 text-[10px]">
                              <span className="text-muted-foreground/70">Citation: {reg.citation}</span>
                            </div>
                            <a
                              href={reg.official_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-[#0057ff] hover:underline font-medium"
                            >
                              Official source
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
