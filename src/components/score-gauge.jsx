"use client";

import { motion } from "framer-motion";

export default function ScoreGauge({ score = 0, size = 200, label = "" }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const offset = circumference - (progress / 100) * circumference;

  const getColor = (s) => {
    if (s >= 90) return { stroke: "#04cfff", text: "text-[#04cfff]", glow: "rgba(13,148,136,0.15)" };
    if (s >= 70) return { stroke: "#caff3d", text: "text-[#caff3d]", glow: "rgba(16,185,129,0.15)" };
    if (s >= 50) return { stroke: "#caff3d", text: "text-[#caff3d]", glow: "rgba(245,158,11,0.15)" };
    return { stroke: "#ff6b7a", text: "text-[#ff6b7a]", glow: "rgba(239,68,68,0.15)" };
  };

  const color = getColor(progress);
  const grade = progress >= 90 ? "A" : progress >= 70 ? "B" : progress >= 50 ? "C" : "F";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#F3F4F6" strokeWidth="8"
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color.stroke} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${color.glow})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-4xl font-extrabold ${color.text}`}
            style={{ fontFamily: "var(--font-heading)" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, type: "spring", stiffness: 200 }}
          >
            {progress}
          </motion.span>
          <span className="text-sm text-[#9CA3AF]" style={{ fontFamily: "var(--font-geist-mono)" }}>/100</span>
          <motion.span
            className={`text-lg font-semibold mt-1 ${color.text}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Grade: {grade}
          </motion.span>
        </div>
      </div>
      {label && <p className="text-sm text-[#9CA3AF] text-center">{label}</p>}
    </div>
  );
}
