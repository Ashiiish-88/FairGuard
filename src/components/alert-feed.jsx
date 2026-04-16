"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

const icons = {
  CRITICAL: <AlertCircle className="w-4 h-4 text-[#FF2D55]" />,
  HIGH: <AlertTriangle className="w-4 h-4 text-[#FF2D55]" />,
  WARNING: <AlertTriangle className="w-4 h-4 text-[#FFAA00]" />,
  INFO: <Info className="w-4 h-4 text-[#007AFF]" />,
};

const borderColors = {
  CRITICAL: "border-l-[#FF2D55]",
  HIGH: "border-l-[#FF2D55]",
  WARNING: "border-l-[#FFAA00]",
  INFO: "border-l-[#007AFF]",
};

export default function AlertFeed({ alerts = [], maxItems = 8 }) {
  const displayAlerts = alerts.slice(-maxItems).reverse();

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
      <AnimatePresence initial={false}>
        {displayAlerts.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">No alerts yet</p>
        )}
        {displayAlerts.map((alert, i) => (
          <motion.div
            key={alert.id || `alert-${i}-${alert.message}`}
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className={`bg-card/50 border-l-4 ${borderColors[alert.severity] || borderColors.INFO} py-2.5`}>
              <div className="flex items-start gap-2">
                {icons[alert.severity] || icons.INFO}
                <AlertDescription className="text-sm leading-snug">
                  {alert.message}
                  {alert.timestamp && (
                    <span className="text-xs text-muted-foreground ml-2">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
