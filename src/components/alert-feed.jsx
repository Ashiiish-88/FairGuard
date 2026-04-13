"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";

const severityConfig = {
  high: { icon: AlertTriangle, border: "border-l-[#EF4444]", bg: "bg-[#FEE2E2]/50", iconColor: "text-[#EF4444]" },
  medium: { icon: AlertCircle, border: "border-l-[#F59E0B]", bg: "bg-[#FEF3C7]/50", iconColor: "text-[#F59E0B]" },
  low: { icon: Info, border: "border-l-[#0D9488]", bg: "bg-[#CCFBF1]/50", iconColor: "text-[#0D9488]" },
};

export default function AlertFeed({ alerts = [] }) {
  if (alerts.length === 0) return null;

  return (
    <Card className="bg-white border-[#E5E7EB]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-[#0A0A0A] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
          Alert Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.map((alert, i) => {
          const sev = severityConfig[alert.severity] || severityConfig.low;
          const Icon = sev.icon;
          return (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-md border-l-[3px] ${sev.border} ${sev.bg}`}
            >
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${sev.iconColor}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0A0A0A]">{alert.title}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{alert.message}</p>
              </div>
              {alert.timestamp && (
                <span className="text-[10px] text-[#9CA3AF] whitespace-nowrap" style={{ fontFamily: "var(--font-geist-mono)" }}>
                  {alert.timestamp}
                </span>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
