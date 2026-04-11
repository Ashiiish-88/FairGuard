"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const severityColors = {
  CRITICAL: "bg-[#FF2D55]/10 text-[#FF2D55] border-[#FF2D55]/20",
  HIGH:     "bg-[#FFAA00]/10 text-[#FFAA00] border-[#FFAA00]/20",
  MODERATE: "bg-[#FFAA00]/10 text-[#FFAA00] border-[#FFAA00]/20",
  OK:       "bg-[#00C853]/10 text-[#00C853] border-[#00C853]/20",
  WARNING:  "bg-[#FFAA00]/10 text-[#FFAA00] border-[#FFAA00]/20",
};

const severityLeftBorder = {
  CRITICAL: "border-l-[#FF2D55]",
  HIGH:     "border-l-[#FFAA00]",
  MODERATE: "border-l-[#FFAA00]",
  OK:       "border-l-[#00C853]",
  WARNING:  "border-l-[#FFAA00]",
};

export default function MetricCard({ icon, title, value, subtitle, severity, className = "" }) {
  return (
    <Card className={`bg-white border-[#E2E6ED] hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-200 border-l-[3px] ${severityLeftBorder[severity] || "border-l-[#E2E6ED]"} ${className}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              {icon && <span className="text-lg">{icon}</span>}
              <p className="text-sm text-[#5A6A85] font-medium truncate">{title}</p>
            </div>
            <p className="text-2xl font-bold font-mono tracking-tight text-[#0A1628]">{value}</p>
            {subtitle && <p className="text-xs text-[#5A6A85] mt-1">{subtitle}</p>}
          </div>
          {severity && (
            <Badge variant="outline" className={`shrink-0 text-xs ${severityColors[severity] || severityColors.OK}`}>
              {severity}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
