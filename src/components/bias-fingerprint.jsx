"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
      <p className="font-medium text-sm">{d.axis}</p>
      <p className="text-sm text-muted-foreground">
        Score: <span className="text-foreground font-mono font-semibold">{d.value}/100</span>
      </p>
    </div>
  );
}

export default function BiasFingerprint({ fingerprint, title = "Bias Fingerprint" }) {
  if (!fingerprint?.axes) return null;

  const data = fingerprint.axes;
  const overall = fingerprint.overall ?? 0;

  // Color based on overall score
  const fillColor = overall >= 70 ? "#22c55e" : overall >= 50 ? "#f59e0b" : "#ef4444";
  const strokeColor = overall >= 70 ? "#16a34a" : overall >= 50 ? "#d97706" : "#dc2626";

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          🧬 {title}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          6-axis fairness profile — each axis shows how well the system performs on that dimension (100 = perfect)
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
            <PolarGrid stroke="oklch(0.3 0 0)" />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fill: "oklch(0.6 0 0)", fontSize: 11, fontWeight: 500 }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "oklch(0.4 0 0)", fontSize: 10 }}
              axisLine={false}
              tickCount={5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Fairness"
              dataKey="value"
              stroke={strokeColor}
              fill={fillColor}
              fillOpacity={0.25}
              strokeWidth={2}
              dot={{ r: 4, fill: strokeColor }}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </RadarChart>
        </ResponsiveContainer>
        <div className="text-center mt-2">
          <p className="text-xs text-muted-foreground">
            A full hexagon = perfectly fair system. Notches indicate bias dimensions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
