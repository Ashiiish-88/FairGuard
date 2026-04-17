"use client";

import { AlertTriangle, Info, XCircle } from "lucide-react";

export default function AlertFeed({ alerts = [], maxItems = 10 }) {
  const displayAlerts = alerts.slice(-maxItems).reverse();

  const severityConfig = {
    critical: { icon: <XCircle className="w-4 h-4" />, color: "text-[#ff6b7a]", bg: "bg-[#ff6b7a]/5", border: "border-[#ff6b7a]/15" },
    warning: { icon: <AlertTriangle className="w-4 h-4" />, color: "text-[#caff3d]", bg: "bg-[#caff3d]/5", border: "border-[#caff3d]/15" },
    info: { icon: <Info className="w-4 h-4" />, color: "text-[#04cfff]", bg: "bg-[#04cfff]/5", border: "border-[#04cfff]/15" },
  };

  if (displayAlerts.length === 0) {
    return <p className="text-sm text-[#9CA3AF] text-center py-8">No alerts yet. Start monitoring to see real-time alerts.</p>;
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {displayAlerts.map((alert) => {
        const sev = severityConfig[alert.severity] || severityConfig.info;
        return (
          <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-md border ${sev.bg} ${sev.border}`}>
            <span className={`mt-0.5 shrink-0 ${sev.color}`}>{sev.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#000000] font-medium">{alert.message}</p>
              {alert.timestamp && (
                <p className="text-xs text-[#9CA3AF] mt-1" style={{ fontFamily: "var(--font-geist-mono)" }}>
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
