"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function BiasChart({ title, data = [] }) {
  return (
    <Card className="bg-white border-[#E5E7EB]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-[#000000]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2e39" />
            <XAxis dataKey="group" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 1]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
            <Tooltip
              contentStyle={{ background: "#fff", border: "1px solid #2a2e39", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              formatter={(v) => [`${(v * 100).toFixed(1)}%`, "Rate"]}
            />
            <ReferenceLine y={0.8} stroke="#caff3d" strokeDasharray="6 4" label={{ value: "80% Rule", fill: "#caff3d", fontSize: 10 }} />
            <Bar dataKey="rate" fill="#04cfff" radius={[4, 4, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
