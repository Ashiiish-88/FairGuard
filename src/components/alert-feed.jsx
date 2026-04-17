// components/alert-feed.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, XCircle, Info, Clock } from "lucide-react";



const alertConfig = {
  critical: {
    border: "border-[#ff6b7a]/25",
    bg: "bg-[#ff6b7a]/5",
    icon: <XCircle className="w-3.5 h-3.5 text-[#ff6b7a] flex-shrink-0 mt-0.5" />,
    dot: "bg-[#ff6b7a]",
    text: "text-[#ff6b7a]",
  },
  warning: {
    border: "border-[#ff8c42]/25",
    bg: "bg-[#ff8c42]/5",
    icon: <AlertTriangle className="w-3.5 h-3.5 text-[#ff8c42] flex-shrink-0 mt-0.5" />,
    dot: "bg-[#ff8c42]",
    text: "text-[#ff8c42]",
  },
  info: {
    border: "border-[#0057ff]/20",
    bg: "bg-[#0057ff]/5",
    icon: <Info className="w-3.5 h-3.5 text-[#0057ff] flex-shrink-0 mt-0.5" />,
    dot: "bg-[#0057ff]",
    text: "text-[#0057ff]",
  },
};

const getConfig = (alert) => {
  const sev = (alert.severity ?? alert.type ?? "warning").toLowerCase();
  if (sev.includes("critical") || sev.includes("high")) return alertConfig.critical;
  if (sev.includes("info"))                               return alertConfig.info;
  return alertConfig.warning;
};

function formatTime(ts) {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function AlertFeed({ alerts, maxItems = 10 }) {
  const visible = [...alerts].reverse().slice(0, maxItems);

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-2">
        <div className="w-8 h-8 rounded-full bg-[#caff3d]/10 border border-[#caff3d]/20 flex items-center justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-[#caff3d]" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          No alerts detected
        </p>
        <p className="text-xs text-muted-foreground/60">
          Monitoring is running cleanly
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {visible.map((alert) => {
          const cfg = getConfig(alert);
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className={[
                "flex items-start gap-3 px-4 py-3 rounded-lg border",
                cfg.bg, cfg.border,
              ].join(" ")}
            >
              {cfg.icon}

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground leading-relaxed">
                  {alert.message}
                </p>
              </div>

              {alert.timestamp && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Clock className="w-3 h-3 text-muted-foreground/50" />
                  <span className="text-[10px] font-mono text-muted-foreground/60">
                    {formatTime(alert.timestamp)}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {alerts.length > maxItems && (
        <p className="text-[11px] text-center text-muted-foreground pt-1">
          +{alerts.length - maxItems} earlier alerts
        </p>
      )}
    </div>
  );
}