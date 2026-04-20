// components/bias-fingerprint.tsx
"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// ─── Custom tooltip ────────────────────────────────────────────────────────────

function FingerprintTooltip({
  active,
  payload,
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  const barWidth = Math.round((d.value / 100) * 100);
  const color =
    d.value >= 70 ? "#caff3d" : d.value >= 50 ? "#ff8c42" : "#ff6b7a";

  return (
    <div className="bg-card border border-border rounded-lg px-3.5 py-3 shadow-lg min-w-[160px]">
      <p className="text-xs font-bold text-foreground mb-2 leading-none">
        {d.axis}
      </p>
      {/* Mini progress bar */}
      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1.5">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${barWidth}%`, background: color }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
          Score
        </span>
        <span
          className="text-sm font-bold font-mono"
          style={{ color }}
        >
          {d.value}
          <span className="text-[10px] text-muted-foreground font-normal">
            /100
          </span>
        </span>
      </div>
    </div>
  );
}

// ─── Custom axis tick ──────────────────────────────────────────────────────────

function AxisTick({
  x,
  y,
  payload,
  data,
}) {
  const item = data?.find((d) => d.axis === payload?.value);
  const score = item?.value ?? 0;
  const color =
    score >= 70 ? "#caff3d" : score >= 50 ? "#ff8c42" : "#ff6b7a";

  // Shorten long axis labels
  const short = {
    "Demographic Parity": "Dem. Parity",
    "Equalized Odds": "Eq. Odds",
    "Individual Fairness": "Individual",
    "Intersectional Parity": "Intersect.",
    "Proxy Resistance": "Proxy",
    "Counterfactual Fairness": "Counterfact.",
  };

  const label = short[payload?.value] ?? payload?.value ?? "";

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="middle"
        style={{
          fill: "#64748b",
          fontSize: "10px",
          fontWeight: 600,
          fontFamily: "var(--font-sans, Inter, sans-serif)",
        }}
      >
        {label}
      </text>
      {/* Tiny score dot */}
      <circle cx={0} cy={14} r={3} fill={color} opacity={0.8} />
    </g>
  );
}

// ─── Score dot legend ──────────────────────────────────────────────────────────

function ScoreLegend() {
  const items = [
    { color: "#caff3d", label: "Good (≥70)" },
    { color: "#ff8c42", label: "Moderate (50–69)" },
    { color: "#ff6b7a", label: "Critical (<50)" },
  ];
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: item.color }}
          />
          <span className="text-[10px] text-muted-foreground font-medium">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────



export default function BiasFingerprint({
  fingerprint,
  title = "Bias Fingerprint",
}) {
  if (!fingerprint?.axes) return null;

  const data = fingerprint.axes;
  const overall = fingerprint.overall ?? 0;

  // Radar fill/stroke from your palette
  const radarColor =
    overall >= 70 ? "#caff3d" : overall >= 50 ? "#ff8c42" : "#ff6b7a";

  const radarFill =
    overall >= 70
      ? "rgba(202,255,61,0.12)"
      : overall >= 50
      ? "rgba(255,140,66,0.12)"
      : "rgba(255,107,122,0.12)";

  // Overall score label
  const overallLabel =
    overall >= 90
      ? "Excellent"
      : overall >= 70
      ? "Good"
      : overall >= 50
      ? "Moderate"
      : "Critical";

  const overallStyle =
    overall >= 70
      ? "text-black bg-[#caff3d]/15 border-[#caff3d]/30"
      : overall >= 50
      ? "text-[#ff8c42] bg-[#ff8c42]/10 border-[#ff8c42]/25"
      : "text-[#ff6b7a] bg-[#ff6b7a]/10 border-[#ff6b7a]/25";

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        {/* Icon block — Refold split style */}
        <div className="flex items-stretch rounded-md overflow-hidden flex-shrink-0">
          <div className="bg-[#caff3d] w-7 h-7 flex items-center justify-center">
            {/* Simple hexagon/radar icon via SVG */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
              <polygon points="12 7 17 9.8 17 15.2 12 18 7 15.2 7 9.8" />
            </svg>
          </div>
          <div className="bg-black w-0.5" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            6-axis fairness profile · each axis scores 0–100
          </p>
        </div>

        {/* Overall score badge */}
        <div className="flex-shrink-0 text-right">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${overallStyle}`}
          >
            {overallLabel}
          </span>
          <p
            className="text-lg font-bold font-mono mt-1 leading-none"
            style={{ color: radarColor }}
          >
            {overall}
            <span className="text-[10px] text-muted-foreground font-normal">
              /100
            </span>
          </p>
        </div>
      </div>

      {/* ── Chart ───────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-2">
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="68%"
            data={data}
          >
            {/* Grid — subtle, matches border color */}
            <PolarGrid
              stroke="rgba(0,0,0,0.06)"
              strokeDasharray="3 3"
            />

            {/* Axis labels */}
            <PolarAngleAxis
              dataKey="axis"
              tick={(props) => <AxisTick {...props} data={data} />}
              tickLine={false}
              axisLine={false}
            />

            {/* Radius axis — very subtle */}
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "transparent" }}
              axisLine={false}
              tickLine={false}
              tickCount={4}
            />

            <Tooltip
              content={<FingerprintTooltip />}
              cursor={false}
            />

            <Radar
              name="Fairness"
              dataKey="value"
              stroke={radarColor}
              fill={radarFill}
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, value } = props;
                const c =
                  value >= 70
                    ? "#caff3d"
                    : value >= 50
                    ? "#ff8c42"
                    : "#ff6b7a";
                return (
                  <circle
                    key={`dot-${cx}-${cy}`}
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill={c}
                    stroke={c === "#caff3d" ? "rgba(202,255,61,0.4)" : "transparent"}
                    strokeWidth={4}
                  />
                );
              }}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Per-axis mini breakdown ──────────────────────────────── */}
      <div className="px-5 pb-5 space-y-2">
        <div className="h-px bg-border mb-3" />
        {data.map((item) => {
          const c =
            item.value >= 70
              ? "#caff3d"
              : item.value >= 50
              ? "#ff8c42"
              : "#ff6b7a";
          const textC =
            item.value >= 70
              ? "text-black"
              : item.value >= 50
              ? "text-[#ff8c42]"
              : "text-[#ff6b7a]";

          return (
            <div key={item.axis} className="flex items-center gap-3">
              {/* Label */}
              <span className="text-[11px] text-muted-foreground w-28 flex-shrink-0 truncate font-medium">
                {item.axis}
              </span>
              {/* Bar */}
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${item.value}%`,
                    background: c,
                  }}
                />
              </div>
              {/* Score */}
              <span
                className={`text-[11px] font-bold font-mono w-7 text-right flex-shrink-0 ${textC}`}
              >
                {item.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Footer: legend ──────────────────────────────────────── */}
      <div className="px-5 py-3 border-t border-border bg-muted/30">
        <ScoreLegend />
      </div>
    </div>
  );
}