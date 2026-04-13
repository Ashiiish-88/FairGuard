"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MetricCard({ title, value, description, severity = "ok" }) {
  const severityStyles = {
    ok: { border: "border-l-[#0D9488]", badge: "bg-[#CCFBF1] text-[#0F766E] border-[#0D9488]/20", label: "PASS" },
    warning: { border: "border-l-[#F59E0B]", badge: "bg-[#FEF3C7] text-[#D97706] border-[#F59E0B]/20", label: "WARNING" },
    critical: { border: "border-l-[#EF4444]", badge: "bg-[#FEE2E2] text-[#DC2626] border-[#EF4444]/20", label: "CRITICAL" },
  };

  const s = severityStyles[severity] || severityStyles.ok;

  return (
    <Card className={`bg-white border-[#E5E7EB] border-l-4 ${s.border} transition-all duration-200 hover:shadow-premium-hover hover:-translate-y-px`}>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-semibold text-[#0A0A0A]">{title}</h3>
          <Badge className={`text-[10px] font-bold px-2 py-0.5 border ${s.badge}`}>
            {s.label}
          </Badge>
        </div>
        <p className="text-2xl font-extrabold text-[#0A0A0A] mb-1" style={{ fontFamily: "var(--font-geist-mono)" }}>
          {value}
        </p>
        {description && (
          <p className="text-xs text-[#6B7280] leading-relaxed">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
