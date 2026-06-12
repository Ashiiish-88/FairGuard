"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

const statusColors = {
  "NON-COMPLIANT": "bg-red-500/20 text-red-400 border-red-500/30",
  "WARNING":        "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "COMPLIANT":      "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const statusIcons = {
  "NON-COMPLIANT": "🔴",
  "WARNING":        "🟡",
  "COMPLIANT":      "🟢",
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
    else parts.push(`$${Math.round(exposure.usd / 1000)}K`);
  }
  return parts.length > 0 ? parts.join(" + ") : "—";
}

/** Single expandable debt row showing full legal detail */
function DebtRow({ debt, index }) {
  const [open, setOpen] = useState(false);
  const reg = debt.regulation || debt.name || "Regulation";

  return (
    <div className="border border-border/30 rounded-lg overflow-hidden bg-background/50">
      {/* Collapsed row */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/20 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-base flex-shrink-0">
          {debt.violation_type?.startsWith("CRITICAL") ? "🔴" :
           debt.violation_type?.startsWith("HIGH") ? "🟠" :
           debt.formatted?.includes("redlining") ? "🟠" : "🟡"}
        </span>
        <span className="font-medium text-sm flex-1 min-w-0 truncate">{reg}</span>
        <span className="text-sm font-mono font-semibold text-red-400 flex-shrink-0">
          {debt.formatted || "—"}
        </span>
        <span className="text-xs text-muted-foreground flex-shrink-0 ml-1">
          {debt.jurisdiction}
        </span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="border-t border-border/30 px-4 py-3 space-y-2 bg-muted/10 text-xs">
          {debt.violation_type && (
            <p className="text-yellow-400 font-semibold">{debt.violation_type}</p>
          )}
          {debt.statutory_maximum_note && (
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Statutory max: </span>
              {debt.statutory_maximum_note}
            </p>
          )}
          {debt.exposure_note && (
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Estimate basis: </span>
              {debt.exposure_note}
            </p>
          )}
          {debt.estimated_back_pay_note && (
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Back-pay calc: </span>
              {debt.estimated_back_pay_note}
            </p>
          )}
          {debt.legal_standard && (
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Legal standard: </span>
              {debt.legal_standard}
            </p>
          )}
          {debt.real_cases && (
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Real cases: </span>
              {debt.real_cases}
            </p>
          )}
          {debt.requirement && (
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Requirement: </span>
              {debt.requirement}
            </p>
          )}
          {debt.cfpb_guidance && (
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">CFPB guidance: </span>
              {debt.cfpb_guidance}
            </p>
          )}
          {debt.proxy_warning && (
            <p className={`font-semibold ${debt.proxy_warning.includes("detected") ? "text-orange-400" : "text-emerald-400"}`}>
              {debt.proxy_warning}
            </p>
          )}
          {debt.enforcement_started && (
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Enforcement: </span>
              {debt.enforcement_started}
            </p>
          )}
          {debt.note && (
            <p className="text-muted-foreground italic">{debt.note}</p>
          )}
          {/* Source citation with clickable link */}
          {debt.source && (
            <div className="flex items-center gap-1.5 pt-1 border-t border-border/20">
              <span className="text-muted-foreground/70">Source: </span>
              {debt.source_url ? (
                <a
                  href={debt.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#0057ff] hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  {debt.source}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-muted-foreground">{debt.source}</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FairnessDebtCard({ debt }) {
  if (!debt || debt.risk_level === "LOW") return null;

  const hasExposure =
    debt.total_exposure.inr > 0 ||
    debt.total_exposure.usd > 0 ||
    debt.total_exposure.eur > 0;

  // Use debts[] array if available, fall back to regulations[]
  const debtItems = debt.debts && debt.debts.length > 0 ? debt.debts : null;
  const regItems  = debt.regulations || [];

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
            <div className="flex gap-6 mt-2 text-sm text-muted-foreground flex-wrap">
              <span>👥 ~{debt.affected_people_estimate?.toLocaleString()} people affected</span>
              <span>⏱️ Remediation: {debt.remediation_time}</span>
              {debt.di_ratio_used < 1 && (
                <span className="font-mono text-xs">
                  DI ratio: {debt.di_ratio_used?.toFixed(4)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Per-regulation breakdown — detailed expandable rows */}
        {debtItems && debtItems.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Regulatory Exposure — click each row for full citation
            </p>
            {debtItems.map((d, i) => (
              <DebtRow key={i} debt={d} index={i} />
            ))}
          </div>
        ) : (
          /* Fallback: show regulations[] in old format */
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Regulatory Compliance</p>
            {regItems.map((reg, i) => (
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
        )}

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground italic px-1">
          {debt.disclaimer || "💡 The cost of fixing fairness is typically <0.1% of the legal exposure. Remediation is always cheaper than litigation."}
        </p>
      </CardContent>
    </Card>
  );
}
