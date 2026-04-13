"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FairnessDebtCard({ debtData }) {
  if (!debtData) return null;

  const { overallScore = 0, grade = "?", totalPeopleAffected = 0, regulations = [], unfairFeatures = [] } = debtData;

  const gradeColor = grade === "A" ? "bg-[#CCFBF1] text-[#0F766E] border-[#0D9488]/20"
    : grade === "B" ? "bg-[#CCFBF1] text-[#0F766E] border-[#0D9488]/20"
    : grade === "C" ? "bg-[#FEF3C7] text-[#D97706] border-[#F59E0B]/20"
    : "bg-[#FEE2E2] text-[#DC2626] border-[#EF4444]/20";

  const riskLevel = overallScore >= 70 ? "LOW" : overallScore >= 50 ? "MODERATE" : "CRITICAL";
  const riskColor = riskLevel === "LOW" ? "bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20"
    : riskLevel === "MODERATE" ? "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20"
    : "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20";

  return (
    <Card className={`bg-white border-[#E5E7EB] border-l-4 ${overallScore < 50 ? "border-l-[#EF4444]" : overallScore < 70 ? "border-l-[#F59E0B]" : "border-l-[#0D9488]"}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-[#0A0A0A] flex items-center gap-2">
            Fairness Debt Report
          </CardTitle>
          <Badge className={`text-xs font-bold px-2 py-0.5 border ${riskColor} ${riskLevel === "CRITICAL" ? "animate-pulse" : ""}`}>
            {riskLevel} RISK
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score section */}
        <div className="flex items-center gap-4 pb-4 border-b border-[#E5E7EB]">
          <div>
            <span className="text-xs text-[#6B7280] font-semibold tracking-wide">FAIRNESS SCORE</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-extrabold ${overallScore >= 70 ? "text-[#0D9488]" : overallScore >= 50 ? "text-[#F59E0B]" : "text-[#EF4444]"}`}
                style={{ fontFamily: "var(--font-geist-mono)" }}>
                {overallScore}
              </span>
              <span className="text-sm text-[#9CA3AF]">/100</span>
            </div>
          </div>
          <Badge className={`text-sm font-bold px-3 py-1 border ${gradeColor}`}>
            Grade: {grade}
          </Badge>
        </div>

        {/* People affected */}
        {totalPeopleAffected > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#6B7280]">People Affected</span>
            <span className="font-semibold text-[#0A0A0A]" style={{ fontFamily: "var(--font-geist-mono)" }}>
              ~{totalPeopleAffected.toLocaleString()}
            </span>
          </div>
        )}

        {/* Legal exposure */}
        {regulations.length > 0 && (
          <div className="pt-3 border-t border-[#E5E7EB]">
            <span className="text-[10px] font-bold tracking-[0.12em] text-[#D97706] mb-3 block">LEGAL EXPOSURE</span>
            <div className="space-y-2">
              {regulations.map((r, i) => (
                <div key={i} className="flex justify-between items-center py-1.5 border-b border-[#F3F4F6] last:border-0">
                  <span className="text-sm text-[#6B7280]">{r.name}</span>
                  <span className={`text-sm font-bold ${r.risk === "high" ? "text-[#EF4444]" : "text-[#F59E0B]"}`}
                    style={{ fontFamily: "var(--font-geist-mono)" }}>
                    {r.maxPenalty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unfair features */}
        {unfairFeatures.length > 0 && (
          <div className="pt-3 border-t border-[#E5E7EB]">
            <span className="text-[10px] font-bold tracking-[0.12em] text-[#6B7280] mb-3 block">FEATURES DRIVING UNFAIRNESS</span>
            <div className="flex flex-wrap gap-2">
              {unfairFeatures.map((f, i) => (
                <Badge key={i} variant="outline" className="text-xs bg-[#FEF3C7] border-[#F59E0B]/20 text-[#D97706] font-medium">
                  {f}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
