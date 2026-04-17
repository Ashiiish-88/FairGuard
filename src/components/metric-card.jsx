"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MetricCard({ title, value, description, severity = "ok" }) {
  const severityStyles = {
    ok: { border: "border-l-[#04cfff]", badge: "bg-[#CCFBF1] text-[#0F766E] border-[#04cfff]/20", label: "PASS" },
    warning: { border: "border-l-[#caff3d]", badge: "bg-gray-50 text-[#000000] border-[#caff3d]/20", label: "WARNING" },
    critical: { border: "border-l-[#ff6b7a]", badge: "bg-[#FEE2E2] text-[#DC2626] border-[#ff6b7a]/20", label: "CRITICAL" },
  };

  const s = severityStyles[severity] || severityStyles.ok;

  return (
    <Card className={`bg-white border-[#E5E7EB] border-l-4 ${s.border} transition-all duration-200 hover:shadow-premium-hover hover:-translate-y-px`}>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-semibold text-[#000000]">{title}</h3>
          <Badge className={`text-[10px] font-bold px-2 py-0.5 border ${s.badge}`}>
            {s.label}
          </Badge>
        </div>
        <p className="text-2xl font-extrabold text-[#000000] mb-1" style={{ fontFamily: "var(--font-geist-mono)" }}>
          {value}
        </p>
        {description && (
          <p className="text-xs text-[#9CA3AF] leading-relaxed">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
