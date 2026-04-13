"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = {
  high: "#0D9488",
  low: "#EF4444",
  neutral: "#0D9488",
  threshold: "#F59E0B",
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-[#E5E7EB] px-3 py-2 shadow-lg rounded-lg">
      <p className="font-semibold text-sm text-[#0A0A0A]">{d.group}</p>
      <p className="text-sm text-[#6B7280]">
        Rate: <span className="text-[#0A0A0A] font-bold" style={{ fontFamily: "var(--font-geist-mono)" }}>{(d.rate * 100).toFixed(1)}%</span>
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
    <Card className="bg-white border-[#E5E7EB]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-[#0A0A0A]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="group" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
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
