"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  "NON-COMPLIANT": "bg-red-500/20 text-red-400 border-red-500/30",
  "WARNING": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "COMPLIANT": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const statusIcons = {
  "NON-COMPLIANT": "🔴",
  "WARNING": "🟡",
  "COMPLIANT": "🟢",
};

function formatTopExposure(exposure) {
  const parts = [];
  if (exposure.inr > 0) {
    if (exposure.inr >= 10000000) parts.push(`₹${(exposure.inr / 10000000).toFixed(1)} Cr`);
    else if (exposure.inr >= 100000) parts.push(`₹${(exposure.inr / 100000).toFixed(1)} L`);
    else parts.push(`₹${exposure.inr.toLocaleString()}`);
  }
  if (exposure.eur > 0) {
    if (exposure.eur >= 1000000) parts.push(`€${(exposure.eur / 1000000).toFixed(1)}M`);
    else parts.push(`€${exposure.eur.toLocaleString()}`);
  }
  if (exposure.usd > 0) {
    if (exposure.usd >= 1000000) parts.push(`$${(exposure.usd / 1000000).toFixed(1)}M`);
    else parts.push(`$${exposure.usd.toLocaleString()}`);
  }
  return parts.length > 0 ? parts.join(" + ") : "—";
}

export default function FairnessDebtCard({ debt }) {
  if (!debt || debt.risk_level === "LOW") return null;

  const hasExposure =
    debt.total_exposure.inr > 0 ||
    debt.total_exposure.usd > 0 ||
    debt.total_exposure.eur > 0;

  return (
    <Card className="bg-red-500/5 border-red-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            🚨 Fairness Debt Report
          </CardTitle>
          <Badge
            variant="outline"
            className={
              debt.risk_level === "CRITICAL"
                ? "bg-red-500/20 text-red-400 border-red-500/30"
                : debt.risk_level === "HIGH"
                ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            }
          >
            {debt.risk_level} RISK
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Top-line exposure */}
        {hasExposure && (
          <div className="p-4 bg-background/50 rounded-lg border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Estimated Legal Exposure</p>
            <p className="text-2xl font-bold font-mono text-red-400">
              {formatTopExposure(debt.total_exposure)}
            </p>
            <div className="flex gap-6 mt-2 text-sm text-muted-foreground">
              <span>👥 ~{debt.affected_people_estimate.toLocaleString()} people affected</span>
              <span>⏱️ Remediation: {debt.remediation_time}</span>
            </div>
          </div>
        )}

        {/* Per-regulation breakdown */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Regulatory Compliance</p>
          {debt.regulations.map((reg, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{statusIcons[reg.status] || "⚪"}</span>
                  <span className="font-medium text-sm truncate">{reg.name}</span>
                </div>
                {reg.description && (
                  <p className="text-xs text-muted-foreground ml-6 mt-0.5">{reg.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {reg.exposure !== "—" && reg.exposure !== "Check local regulations" && (
                  <span className="text-sm font-mono font-semibold text-red-400">{reg.exposure}</span>
                )}
                <Badge variant="outline" className={`text-xs ${statusColors[reg.status] || ""}`}>
                  {reg.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-xs text-muted-foreground italic px-1">
          💡 The cost of fixing fairness is typically {"<"}0.1% of the legal exposure. Remediation is always cheaper than litigation.
        </p>
      </CardContent>
    </Card>
  );
}
