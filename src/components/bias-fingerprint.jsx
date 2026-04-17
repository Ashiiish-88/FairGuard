"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

const AXES = [
  { key: "demographic_parity", label: "Demo. Parity" },
  { key: "equalized_odds", label: "Equal. Odds" },
  { key: "individual_fairness", label: "Individual" },
  { key: "intersectional", label: "Intersectional" },
  { key: "proxy_resistance", label: "Proxy Resist." },
  { key: "counterfactual", label: "Counterfactual" },
];

export default function BiasFingerprint({ fingerprint }) {
  const data = AXES.map((ax) => ({
    axis: ax.label,
    value: fingerprint?.[ax.key] ?? 50,
  }));

  return (
    <Card className="bg-white border-[#E5E7EB]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-[#000000]">Bias Fingerprint</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#2a2e39" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: "#64748b", fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Fairness" dataKey="value" stroke="#04cfff" fill="#04cfff" fillOpacity={0.15} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
