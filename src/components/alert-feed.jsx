"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

const icons = {
  CRITICAL: <AlertCircle className="w-4 h-4 text-red-400" />,
  HIGH: <AlertTriangle className="w-4 h-4 text-orange-400" />,
  WARNING: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
  INFO: <Info className="w-4 h-4 text-blue-400" />,
};

const borderColors = {
  CRITICAL: "border-l-red-500",
  HIGH: "border-l-orange-500",
  WARNING: "border-l-yellow-500",
  INFO: "border-l-blue-500",
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
