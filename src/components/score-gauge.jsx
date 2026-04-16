"use client";

import { motion } from "framer-motion";

export default function ScoreGauge({ score = 0, size = 200, label = "" }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const offset = circumference - (progress / 100) * circumference;

  const getColor = (s) => {
    if (s >= 70) return { stroke: "#00E676", text: "text-[#00E676]", bg: "from-[#00E676]/20" };
    if (s >= 50) return { stroke: "#FFAA00", text: "text-[#FFAA00]", bg: "from-[#FFAA00]/20" };
    return { stroke: "#FF2D55", text: "text-[#FF2D55]", bg: "from-[#FF2D55]/20" };
  };

  const color = getColor(progress);
  const grade = progress >= 90 ? "A" : progress >= 70 ? "B" : progress >= 50 ? "C" : "F";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#1A3A6E" strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color.stroke} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-4xl font-bold font-mono ${color.text}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {progress}
          </motion.span>
          <span className="text-sm text-muted-foreground font-mono">/100</span>
          <span className={`text-lg font-semibold mt-1 ${color.text}`}>Grade: {grade}</span>
        </div>
      </div>
      {label && <p className="text-sm text-muted-foreground text-center">{label}</p>}
    </div>
  );
}
