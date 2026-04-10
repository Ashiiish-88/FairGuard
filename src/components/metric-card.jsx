"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const severityColors = {
  CRITICAL: "bg-red-500/20 text-red-400 border-red-500/30",
  HIGH: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  MODERATE: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  OK: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  WARNING: "bg-orange-500/20 text-orange-400 border-orange-500/30",
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
            <p className="text-2xl font-bold tracking-tight">{value}</p>
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
