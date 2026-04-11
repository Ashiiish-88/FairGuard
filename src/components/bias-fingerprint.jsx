"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-[#E2E6ED] px-3 py-2 shadow-lg" style={{ borderRadius: '8px' }}>
      <p className="font-medium text-sm text-[#0A1628]">{d.axis}</p>
      <p className="text-sm text-[#5A6A85]">
        Score: <span className="text-[#0A1628] font-mono font-semibold">{d.value}/100</span>
      </p>
    </div>
  );
}

export default function BiasFingerprint({ fingerprint, title = "Bias Fingerprint" }) {
  if (!fingerprint?.axes) return null;

  const data = fingerprint.axes;
  const overall = fingerprint.overall ?? 0;

  // Color based on overall score — Captain's palette
  const fillColor = overall >= 70 ? "#00C853" : overall >= 50 ? "#FFAA00" : "#FF2D55";
  const strokeColor = overall >= 70 ? "#00A844" : overall >= 50 ? "#E09500" : "#E0002B";

  // Ideal shape data (100 for all axes)
  const idealData = data.map(d => ({ ...d, ideal: 100 }));

  return (
    <Card className="bg-white border-[#E2E6ED]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-[#0A1628]">
          🧬 {title}
        </CardTitle>
        <p className="text-xs text-[#5A6A85]">
          6-axis fairness profile — each axis shows how well the system performs on that dimension (100 = perfect)
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={idealData}>
            <PolarGrid stroke="#E2E6ED" />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fill: "#5A6A85", fontSize: 11, fontWeight: 500 }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#9CA3AF", fontSize: 10 }}
              axisLine={false}
              tickCount={5}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Ideal shape — faint background */}
            <Radar
              name="Ideal"
              dataKey="ideal"
              stroke="#E2E6ED"
              fill="#F0F2F5"
              fillOpacity={0.4}
              strokeWidth={1}
              strokeDasharray="4 4"
              dot={false}
            />
            {/* Actual fingerprint */}
            <Radar
              name="Fairness"
              dataKey="value"
              stroke={strokeColor}
              fill={fillColor}
              fillOpacity={0.2}
              strokeWidth={2.5}
              dot={{ r: 4, fill: strokeColor, stroke: "#fff", strokeWidth: 2 }}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </RadarChart>
        </ResponsiveContainer>
        <div className="text-center mt-2">
          <p className="text-xs text-[#5A6A85]">
            A full hexagon = perfectly fair system. Notches indicate bias dimensions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
