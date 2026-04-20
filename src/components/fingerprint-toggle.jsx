"use client";

import { useState } from "react";

const BEFORE_VALUES = [40, 65, 30, 55, 25, 70];
const AFTER_VALUES = [80, 85, 75, 82, 78, 88];

function hexPoints(cx, cy, r) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}

function radarPoints(cx, cy, values) {
  return values.map((v, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + v * Math.cos(angle)},${cy + v * Math.sin(angle)}`;
  }).join(" ");
}

function radarDots(cx, cy, values) {
  return values.map((v, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return [cx + v * Math.cos(angle), cy + v * Math.sin(angle)];
  });
}

export default function FingerprintToggle() {
  const [showAfter, setShowAfter] = useState(false);

  const values = showAfter ? AFTER_VALUES : BEFORE_VALUES;
  const shapeColor = showAfter ? "#0057ff" : "#ff6b7a";
  const shapeFill = showAfter ? "rgba(0,87,255,0.15)" : "rgba(255,107,122,0.15)";

  return (
    <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
      {/* Toggle tabs */}
      <div className="flex gap-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md p-1 w-fit mb-7">
        <button
          onClick={() => setShowAfter(false)}
          className={`px-5 py-2 text-[12px] font-semibold rounded transition-all duration-200 ${
            !showAfter
              ? "bg-white shadow-sm border border-[#E5E7EB] text-[#000000]"
              : "text-[#4B5563] hover:text-[#000000]"
          }`}
        >
          Before Fix
        </button>
        <button
          onClick={() => setShowAfter(true)}
          className={`px-5 py-2 text-[12px] font-semibold rounded transition-all duration-200 ${
            showAfter
              ? "bg-white shadow-sm border border-[#E5E7EB] text-[#000000]"
              : "text-[#4B5563] hover:text-[#000000]"
          }`}
        >
          After Fix
        </button>
      </div>

      {/* Radar chart */}
      <div className="h-[260px] flex items-center justify-center">
        <svg viewBox="0 0 300 260" className="w-full h-full max-w-[300px]">
          {/* Hexagonal grid */}
          {[100, 75, 50, 25].map((r) => (
            <polygon key={r} points={hexPoints(150, 130, r)} fill="none" stroke="#E5E7EB" strokeWidth="1" />
          ))}
          {/* Axis labels */}
          {["DP", "EO", "IF", "IP", "PR", "CF"].map((label, i) => {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            const lx = 150 + 115 * Math.cos(angle);
            const ly = 130 + 115 * Math.sin(angle);
            return (
              <text key={label} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                fill="#4B5563" fontSize="9" fontWeight="600" letterSpacing="0.05em">{label}</text>
            );
          })}
          {/* Data shape with CSS transition */}
          <polygon
            points={radarPoints(150, 130, values)}
            fill={shapeFill}
            stroke={shapeColor}
            strokeWidth="2"
            style={{ transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
          {/* Dots */}
          {radarDots(150, 130, values).map((pt, i) => (
            <circle key={i} cx={pt[0]} cy={pt[1]} r="4" fill={shapeColor} stroke="#ffffff" strokeWidth="2"
              style={{ transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
          ))}
        </svg>
      </div>

      {/* Score comparison */}
      <div className="flex items-center gap-5 mt-6 pt-6 border-t border-[#E5E7EB]">
        <div className={`text-center transition-opacity duration-300 ${!showAfter ? "opacity-100" : "opacity-40"}`}>
          <span className="block text-[10px] tracking-[0.12em] text-[#4B5563] mb-1">BEFORE</span>
          <span className="text-[28px] font-extrabold text-[#ff6b7a]" style={{ fontFamily: "var(--font-heading)" }}>43/100</span>
        </div>
        <span className="text-[20px] text-[#9CA3AF]">&rarr;</span>
        <div className={`text-center transition-opacity duration-300 ${showAfter ? "opacity-100" : "opacity-40"}`}>
          <span className="block text-[10px] tracking-[0.12em] text-[#4B5563] mb-1">AFTER</span>
          <span className="text-[28px] font-extrabold text-[#0057ff]" style={{ fontFamily: "var(--font-heading)" }}>79/100</span>
        </div>
        <div className="ml-auto text-right">
          <div className={`text-[13px] font-bold transition-colors duration-300 ${showAfter ? "text-[#0057ff]" : "text-[#000000]"}`}>
            {showAfter ? "+36 points" : "Needs remediation"}
          </div>
          <div className="text-[11px] text-[#4B5563] mt-0.5">
            {showAfter ? "by removing 2 proxy columns" : "2 proxy variables detected"}
          </div>
        </div>
      </div>
    </div>
  );
}