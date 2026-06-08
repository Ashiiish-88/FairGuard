// components/human-cost-card.jsx
"use client";

import { motion } from "framer-motion";
import { Users, Clock, TrendingDown, AlertTriangle } from "lucide-react";

export default function HumanCostCard({ humanCost }) {
  if (!humanCost || humanCost.people_harmed <= 0) return null;

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

            {/* Career delay */}
            <div className="text-center border-x border-border">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Clock className="w-4 h-4 text-[#ff8c42]" />
              </div>
              <p className="text-3xl font-bold text-foreground font-mono tracking-tight leading-none">
                {humanCost.career_delay_years}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1.5 uppercase tracking-wider font-semibold leading-tight">
                years avg career<br />delay per person
              </p>
            </div>

            {/* Total years lost */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <TrendingDown className="w-4 h-4 text-[#ff6b7a]" />
              </div>
              <p className="text-3xl font-bold text-foreground font-mono tracking-tight leading-none">
                {humanCost.total_career_years_lost.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1.5 uppercase tracking-wider font-semibold leading-tight">
                total career<br />years lost
              </p>
            </div>
          </div>

          {/* Headline statement */}
          {humanCost.headline && (
            <div className="text-center py-4 px-6 mb-4 rounded-lg bg-[#ff6b7a]/5 border border-[#ff6b7a]/15">
              <p className="text-sm font-semibold text-foreground leading-relaxed">
                &ldquo;{humanCost.people_harmed.toLocaleString()} people may have waited{" "}
                {humanCost.career_delay_years} extra years because of a bias that took 60 seconds to detect.&rdquo;
              </p>
            </div>
          )}

          {/* Income loss */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Estimated income impact:</span>
            <span className="font-bold text-foreground font-mono">{humanCost.income_loss_formatted}</span>
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] text-muted-foreground text-center mt-3 italic">
            {humanCost.disclaimer}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
