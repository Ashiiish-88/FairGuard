"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FairnessDebtCard({ debtData }) {
  if (!debtData) return null;

  const riskColors = {
    CRITICAL: { border: "border-l-[#EF4444]", badge: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20", bg: "bg-[#FEF2F2]" },
    HIGH: { border: "border-l-[#F59E0B]", badge: "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20", bg: "bg-[#FFFBEB]" },
    MODERATE: { border: "border-l-[#F59E0B]", badge: "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20", bg: "bg-[#FFFBEB]" },
    LOW: { border: "border-l-[#0D9488]", badge: "bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20", bg: "bg-[#F0FDFA]" },
  };

  const risk = riskColors[debtData.risk_level] || riskColors.MODERATE;

  return (
    <Card className={`bg-white border-[#E5E7EB] border-l-4 ${risk.border}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-[#111827]">Fairness Debt Score</CardTitle>
          <Badge variant="outline" className={`text-xs font-bold ${risk.badge}`}>{debtData.risk_level}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Debt Score</p>
            <p className="text-3xl font-bold text-[#111827]" style={{ fontFamily: "var(--font-geist-mono)" }}>{debtData.score ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">People Affected</p>
            <p className="text-xl font-semibold text-[#111827]">{debtData.people_affected?.toLocaleString() ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Estimated Legal Exposure</p>
            <div className="space-y-1">
              {debtData.legal_exposure ? (
                Object.entries(debtData.legal_exposure).map(([framework, amount]) => (
                  <div key={framework} className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">{framework}</span>
                    <span className="font-semibold text-[#111827]" style={{ fontFamily: "var(--font-geist-mono)" }}>{amount}</span>
                  </div>
                ))
              ) : (
                <span className="text-sm text-[#6B7280]">N/A</span>
              )}
            </div>
          </div>
        </div>
        {debtData.recommendation && (
          <div className="mt-4 p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <p className="text-sm text-[#6B7280]">{debtData.recommendation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
