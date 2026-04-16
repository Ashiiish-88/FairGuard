"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = {
  bar: "#1A3A6E",
  low: "#FF2D55",
  grid: "#1A3A6E",
  threshold: "#007AFF",
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
      <p className="font-medium text-sm">{d.group}</p>
      <p className="text-sm text-muted-foreground">
        Rate: <span className="text-foreground font-mono font-semibold">{(d.rate * 100).toFixed(1)}%</span>
      </p>
    </div>
  );
}

export default function BiasChart({ data = [], title = "Approval Rates by Group", threshold = 0.8 }) {
  // data format: [{ group: "Male", rate: 0.75 }, { group: "Female", rate: 0.52 }]
  const maxRate = Math.max(...data.map(d => d.rate), 0);
  const minRate = Math.min(...data.map(d => d.rate), 0);

  const chartData = data.map(d => ({
    ...d,
    ratePercent: Math.round(d.rate * 1000) / 10,
    isDisadvantaged: d.rate === minRate && data.length > 1 && maxRate - minRate > 0.05,
  }));

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
            <XAxis dataKey="group" tick={{ fill: "#5A6A85", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#5A6A85", fontSize: 11 }}
              axisLine={false} tickLine={false}
              tickFormatter={v => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(217 30% 20% / 30%)" }} />
            <ReferenceLine y={threshold * 100} stroke={COLORS.threshold} strokeDasharray="6 4" label={{ value: `${threshold * 100}% threshold`, fill: COLORS.threshold, fontSize: 10, position: "right" }} />
            <Bar dataKey="ratePercent" radius={[2, 2, 0, 0]} maxBarSize={60}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.isDisadvantaged ? COLORS.low : COLORS.bar} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
