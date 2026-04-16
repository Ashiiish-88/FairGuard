"use client";

import { AlertTriangle, Info, XCircle } from "lucide-react";

export default function AlertFeed({ alerts = [], maxItems = 10 }) {
  const displayAlerts = alerts.slice(-maxItems).reverse();

  const severityConfig = {
    critical: { icon: <XCircle className="w-4 h-4" />, color: "text-[#EF4444]", bg: "bg-[#EF4444]/5", border: "border-[#EF4444]/15" },
    warning: { icon: <AlertTriangle className="w-4 h-4" />, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/5", border: "border-[#F59E0B]/15" },
    info: { icon: <Info className="w-4 h-4" />, color: "text-[#0D9488]", bg: "bg-[#0D9488]/5", border: "border-[#0D9488]/15" },
  };

  if (displayAlerts.length === 0) {
    return <p className="text-sm text-[#6B7280] text-center py-8">No alerts yet. Start monitoring to see real-time alerts.</p>;
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {displayAlerts.map((alert) => {
        const sev = severityConfig[alert.severity] || severityConfig.info;
        return (
          <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-md border ${sev.bg} ${sev.border}`}>
            <span className={`mt-0.5 shrink-0 ${sev.color}`}>{sev.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#111827] font-medium">{alert.message}</p>
              {alert.timestamp && (
                <p className="text-xs text-[#6B7280] mt-1" style={{ fontFamily: "var(--font-geist-mono)" }}>
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
