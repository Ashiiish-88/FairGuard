// components/score-gauge.tsx
"use client";

import { motion } from "framer-motion";



// Palette-aligned color map
const getColor = (s) => {
  if (s >= 90) return {
    stroke: "#caff3d",
    trackStroke: "rgba(202,255,61,0.12)",
    text: "text-black",
    gradientFrom: "rgba(202,255,61,0.15)",
    gradientTo: "rgba(202,255,61,0)",
    grade: "A",
    gradeStyle: "bg-[#caff3d]/15 text-black border-[#caff3d]/30",
    label: "Excellent",
  };
  if (s >= 70) return {
    stroke: "#04cfff",
    trackStroke: "rgba(4,207,255,0.12)",
    text: "text-[#04cfff]",
    gradientFrom: "rgba(4,207,255,0.15)",
    gradientTo: "rgba(4,207,255,0)",
    grade: "B",
    gradeStyle: "bg-[#04cfff]/10 text-[#04cfff] border-[#04cfff]/25",
    label: "Good",
  };
  if (s >= 50) return {
    stroke: "#ff8c42",
    trackStroke: "rgba(255,140,66,0.12)",
    text: "text-[#ff8c42]",
    gradientFrom: "rgba(255,140,66,0.15)",
    gradientTo: "rgba(255,140,66,0)",
    grade: "C",
    gradeStyle: "bg-[#ff8c42]/10 text-[#ff8c42] border-[#ff8c42]/25",
    label: "Moderate",
  };
  if (s >= 30) return {
    stroke: "#ff8c42",
    trackStroke: "rgba(255,140,66,0.10)",
    text: "text-[#ff8c42]",
    gradientFrom: "rgba(255,140,66,0.12)",
    gradientTo: "rgba(255,140,66,0)",
    grade: "D",
    gradeStyle: "bg-[#ff8c42]/10 text-[#ff8c42] border-[#ff8c42]/25",
    label: "High Bias",
  };
  return {
    stroke: "#ff6b7a",
    trackStroke: "rgba(255,107,122,0.12)",
    text: "text-[#ff6b7a]",
    gradientFrom: "rgba(255,107,122,0.15)",
    gradientTo: "rgba(255,107,122,0)",
    grade: "F",
    gradeStyle: "bg-[#ff6b7a]/10 text-[#ff6b7a] border-[#ff6b7a]/25",
    label: "Critical",
  };
};

export default function ScoreGauge({
  score = 0,
  size = 180,
  label = "",
}) {
  const progress = Math.min(100, Math.max(0, score));
  const color = getColor(progress);

  // Gauge arc — 270° sweep (not full circle)
  // Starts at 135° (bottom-left), sweeps 270° clockwise to 45° (bottom-right)
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // Helper: point on circle
  const pt = (deg) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  // Arc path generator
  const arcPath = (startDeg, endDeg) => {
    const s = pt(startDeg);
    const e = pt(endDeg);
    const sweep = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${sweep} 1 ${e.x} ${e.y}`;
  };

  // Full arc: 135° → 405° (135° + 270°)
  const startAngle = 135;
  const totalAngle = 270;
  const progressAngle = startAngle + (progress / 100) * totalAngle;

  const trackPath = arcPath(startAngle, startAngle + totalAngle);
  const progressPath = arcPath(startAngle, progressAngle);

  // Arc circumference for strokeDasharray
  const arcLength = (totalAngle / 360) * 2 * Math.PI * radius;
  const progressLength = (progress / 100) * arcLength;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>

        {/* Subtle glow behind ring — only on non-white bg usage */}
        <div
          className="absolute inset-4 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color.gradientFrom} 0%, ${color.gradientTo} 70%)`,
          }}
        />

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="relative z-10"
        >
          {/* Track arc */}
          <path
            d={trackPath}
            fill="none"
            stroke={color.trackStroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Progress arc — animated */}
          <motion.path
            d={progressPath}
            fill="none"
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
          />

          {/* End dot glow */}
          {progress > 2 && (
            <motion.circle
              cx={pt(progressAngle).x}
              cy={pt(progressAngle).y}
              r={strokeWidth / 2 + 1}
              fill={color.stroke}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3, duration: 0.3 }}
            />
          )}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          {/* Score number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-end gap-0.5 leading-none"
          >
            <span
              className={`font-bold leading-none tracking-tight ${color.text}`}
              style={{ fontSize: size * 0.22 }}
            >
              {progress}
            </span>
            <span
              className="text-muted-foreground font-medium leading-none mb-1"
              style={{ fontSize: size * 0.09 }}
            >
              /100
            </span>
          </motion.div>

          {/* Grade badge */}
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.35 }}
            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border mt-1.5 ${color.gradeStyle}`}
          >
            {color.label}
          </motion.span>
        </div>
      </div>

      {/* Optional label beneath */}
      {label && (
        <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-[160px]">
          {label}
        </p>
      )}
    </div>
  );
}