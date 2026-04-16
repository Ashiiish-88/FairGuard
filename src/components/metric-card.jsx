"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const severityColors = {
  CRITICAL: "bg-[#FF2D55]/20 text-[#FF2D55] border-[#FF2D55]/30",
  HIGH: "bg-[#FF2D55]/15 text-[#FF2D55] border-[#FF2D55]/25",
  MODERATE: "bg-[#FFAA00]/20 text-[#FFAA00] border-[#FFAA00]/30",
  OK: "bg-[#00E676]/20 text-[#00E676] border-[#00E676]/30",
  WARNING: "bg-[#FFAA00]/20 text-[#FFAA00] border-[#FFAA00]/30",
};

export default function MetricCard({ icon, title, value, subtitle, severity, className = "" }) {
  return (
    <Card className={`bg-card/50 backdrop-blur-sm border-border/50 hover:border-border transition-colors ${className}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              {icon && <span className="text-lg">{icon}</span>}
              <p className="text-sm text-muted-foreground font-medium truncate">{title}</p>
            </div>
            <p className="text-2xl font-bold font-mono tracking-tight">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
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
