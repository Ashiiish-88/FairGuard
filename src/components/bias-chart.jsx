"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = {
  high:      "#00C853",   // Green — fairest group
  low:       "#FF2D55",   // Red — most disadvantaged group
  neutral:   "#1A3A6E",   // Navy — normal bars
  threshold: "#007AFF",   // Blue — 80% rule line
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-[#E2E6ED] px-3 py-2 shadow-lg" style={{ borderRadius: '8px' }}>
      <p className="font-medium text-sm text-[#0A1628]">{d.group}</p>
      <p className="text-sm text-[#5A6A85]">
        Rate: <span className="text-[#0A1628] font-mono font-semibold">{(d.rate * 100).toFixed(1)}%</span>
      </p>
    </div>
  );
}

export default function BiasChart({ data = [], title = "Approval Rates by Group", threshold = 0.8 }) {
  const maxRate = Math.max(...data.map(d => d.rate), 0);
  const minRate = Math.min(...data.map(d => d.rate), 0);

  const chartData = data.map(d => ({
    ...d,
    ratePercent: Math.round(d.rate * 1000) / 10,
    isDisadvantaged: d.rate === minRate && data.length > 1 && maxRate - minRate > 0.05,
  }));

  return (
    <Card className="bg-white border-[#E2E6ED]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-[#0A1628]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E6ED" vertical={false} />
            <XAxis dataKey="group" tick={{ fill: "#5A6A85", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#5A6A85", fontSize: 11 }}
              axisLine={false} tickLine={false}
              tickFormatter={v => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
            <ReferenceLine y={threshold * 100} stroke={COLORS.threshold} strokeDasharray="6 4" label={{ value: `${threshold * 100}% threshold`, fill: COLORS.threshold, fontSize: 10, position: "right" }} />
            <Bar dataKey="ratePercent" radius={[4, 4, 0, 0]} maxBarSize={60}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.isDisadvantaged ? COLORS.low : COLORS.neutral} fillOpacity={0.9} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
