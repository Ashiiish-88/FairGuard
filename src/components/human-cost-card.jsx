// components/human-cost-card.jsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Clock, TrendingDown, AlertTriangle, Info, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

export default function HumanCostCard({ humanCost }) {
  const [showMethodology, setShowMethodology] = useState(false);

  if (!humanCost || humanCost.people_harmed <= 0) return null;

  const hasResearch = humanCost.research_context && humanCost.research_context.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-card rounded-xl border-2 border-[#ff6b7a]/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#ff6b7a]/10 bg-[#ff6b7a]/5">
          <div className="w-7 h-7 rounded-lg bg-[#ff6b7a]/10 flex items-center justify-center flex-shrink-0">
            <Users className="w-3.5 h-3.5 text-[#ff6b7a]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Human Cost</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              The real-world impact behind the numbers
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-[#ff6b7a]" />
            <span className="text-[10px] font-bold text-[#ff6b7a] uppercase tracking-wider">Impact</span>
          </div>
        </div>

        {/* Three big numbers */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-3 gap-4 mb-5">
            {/* People harmed */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Users className="w-4 h-4 text-[#ff6b7a]" />
              </div>
              <p className="text-3xl font-bold text-foreground font-mono tracking-tight leading-none">
                {humanCost.people_harmed.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1.5 uppercase tracking-wider font-semibold leading-tight">
                people estimated<br />unjustly rejected
              </p>
            </div>

            {/* Extra job search weeks */}
            <div className="text-center border-x border-border">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Clock className="w-4 h-4 text-[#ff8c42]" />
              </div>
              <p className="text-3xl font-bold text-foreground font-mono tracking-tight leading-none">
                {humanCost.extra_job_search_weeks ?? humanCost.career_delay_years ?? 0}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1.5 uppercase tracking-wider font-semibold leading-tight">
                extra weeks in<br />job search per person
              </p>
            </div>

            {/* Income loss */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <TrendingDown className="w-4 h-4 text-[#ff6b7a]" />
              </div>
              <p className="text-2xl font-bold text-foreground font-mono tracking-tight leading-none">
                {humanCost.income_loss_formatted ?? humanCost.income_loss_formatted_inr ?? "—"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1.5 uppercase tracking-wider font-semibold leading-tight">
                estimated<br />income impact
              </p>
            </div>
          </div>

          {/* Headline statement */}
          {humanCost.headline && (
            <div className="text-center py-4 px-6 mb-4 rounded-lg bg-[#ff6b7a]/5 border border-[#ff6b7a]/15">
              <p className="text-sm font-semibold text-foreground leading-relaxed">
                {`"${humanCost.headline}"`}
              </p>
            </div>
          )}

          {/* Research context — Stanford + Bertrand citations */}
          {hasResearch && (
            <div className="space-y-2 mb-4">
              {humanCost.research_context.map((cite, i) => (
                <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-md bg-[#0057ff]/5 border border-[#0057ff]/15">
                  <span className="text-[#0057ff] text-xs mt-0.5 flex-shrink-0">📖</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{cite}</p>
                </div>
              ))}
            </div>
          )}

          {/* Data sources note */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span>BLS source:</span>
            <a
              href="https://www.bls.gov/cps/cpsaat32.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#0057ff] hover:underline font-medium"
            >
              BLS CPS Table 32, 2024 Annual Averages
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Methodology toggle */}
          <button
            onClick={() => setShowMethodology((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Info className="w-3 h-3" />
            {showMethodology ? "Hide methodology" : "How was this calculated?"}
            {showMethodology ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showMethodology && humanCost.methodology_note && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 px-3 py-2.5 rounded-md bg-muted/50 border border-border text-xs text-muted-foreground leading-relaxed space-y-1"
            >
              <p><span className="font-semibold text-foreground">Methodology:</span> {humanCost.methodology_note}</p>
              {humanCost.extra_job_search_source && (
                <p><span className="font-semibold text-foreground">Job search duration:</span> {humanCost.extra_job_search_source}</p>
              )}
              {humanCost.weekly_earnings_source && (
                <p><span className="font-semibold text-foreground">Earnings data:</span> {humanCost.weekly_earnings_source}</p>
              )}
              <p className="text-muted-foreground/70 italic">{humanCost.disclaimer}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
