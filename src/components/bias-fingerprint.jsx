"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-[#E5E7EB] px-3 py-2 shadow-lg rounded-lg">
      <p className="font-semibold text-sm text-[#0A0A0A]">{d.axis}</p>
      <p className="text-sm text-[#6B7280]">
        Score: <span className="text-[#0A0A0A] font-bold" style={{ fontFamily: "var(--font-geist-mono)" }}>{d.value}/100</span>
      </p>
    </div>
  );
}

export default function BiasFingerprint({ fingerprint, title = "Bias Fingerprint" }) {
  if (!fingerprint?.axes) return null;

  const data = fingerprint.axes;
  const overall = fingerprint.overall ?? 0;

  const fillColor = overall >= 70 ? "#0D9488" : overall >= 50 ? "#F59E0B" : "#EF4444";
  const strokeColor = overall >= 70 ? "#0F766E" : overall >= 50 ? "#D97706" : "#DC2626";

  const idealData = data.map(d => ({ ...d, ideal: 100 }));

  return (
    <Card className="bg-white border-[#E5E7EB]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-[#0A0A0A]">
          {title}
        </CardTitle>
        <p className="text-xs text-[#6B7280]">
          6-axis fairness profile — each axis shows how well the system performs on that dimension (100 = perfect)
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={idealData}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: "#6B7280", fontSize: 11, fontWeight: 500 }} tickLine={false} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#9CA3AF", fontSize: 10 }} axisLine={false} tickCount={5} />
            <Tooltip content={<CustomTooltip />} />
            <Radar name="Ideal" dataKey="ideal" stroke="#E5E7EB" fill="#F3F4F6" fillOpacity={0.4} strokeWidth={1} strokeDasharray="4 4" dot={false} />
            <Radar name="Fairness" dataKey="value" stroke={strokeColor} fill={fillColor} fillOpacity={0.2} strokeWidth={2.5} dot={{ r: 4, fill: strokeColor, stroke: "#fff", strokeWidth: 2 }} animationDuration={1200} animationEasing="ease-out" />
          </RadarChart>
        </ResponsiveContainer>
        <div className="text-center mt-2">
          <p className="text-xs text-[#6B7280]">A full hexagon = perfectly fair system. Notches indicate bias dimensions.</p>
        </div>
      </CardContent>
    </Card>
  );
}
