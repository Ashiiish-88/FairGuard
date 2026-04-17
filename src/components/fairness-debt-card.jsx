"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FairnessDebtCard({ debtData }) {
  if (!debtData) return null;

  const riskColors = {
    CRITICAL: { border: "border-l-[#ff6b7a]", badge: "bg-[#ff6b7a]/10 text-[#ff6b7a] border-[#ff6b7a]/20", bg: "bg-[#FEF2F2]" },
    HIGH: { border: "border-l-[#caff3d]", badge: "bg-[#caff3d]/10 text-[#000000] border-[#caff3d]/20", bg: "bg-white" },
    MODERATE: { border: "border-l-[#caff3d]", badge: "bg-[#caff3d]/10 text-[#000000] border-[#caff3d]/20", bg: "bg-white" },
    LOW: { border: "border-l-[#04cfff]", badge: "bg-[#04cfff]/10 text-[#04cfff] border-[#04cfff]/20", bg: "bg-[#F0FDFA]" },
  };

  const risk = riskColors[debtData.risk_level] || riskColors.MODERATE;

  return (
    <Card className={`bg-white border-[#E5E7EB] border-l-4 ${risk.border}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-[#000000]">Fairness Debt Score</CardTitle>
          <Badge variant="outline" className={`text-xs font-bold ${risk.badge}`}>{debtData.risk_level}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-[#9CA3AF] mb-1">Debt Score</p>
            <p className="text-3xl font-bold text-[#000000]" style={{ fontFamily: "var(--font-geist-mono)" }}>{debtData.score ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-[#9CA3AF] mb-1">People Affected</p>
            <p className="text-xl font-semibold text-[#000000]">{debtData.people_affected?.toLocaleString() ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-[#9CA3AF] mb-1">Estimated Legal Exposure</p>
            <div className="space-y-1">
              {debtData.legal_exposure ? (
                Object.entries(debtData.legal_exposure).map(([framework, amount]) => (
                  <div key={framework} className="flex justify-between text-sm">
                    <span className="text-[#9CA3AF]">{framework}</span>
                    <span className="font-semibold text-[#000000]" style={{ fontFamily: "var(--font-geist-mono)" }}>{amount}</span>
                  </div>
                ))
              ) : (
                <span className="text-sm text-[#9CA3AF]">N/A</span>
              )}
            </div>
          </div>
        </div>
        {debtData.recommendation && (
          <div className="mt-4 p-3 bg-white border border-[#E5E7EB] rounded-md">
            <p className="text-sm text-[#9CA3AF]">{debtData.recommendation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
