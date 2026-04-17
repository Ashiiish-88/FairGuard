// components/metric-card.tsx
"use client";


const SEVERITY_STYLES = {
  CRITICAL: {
    card: "border-[#ff6b7a]/25 bg-[#ff6b7a]/4",
    value: "text-[#ff6b7a]",
    badge: "bg-[#ff6b7a]/10 text-[#ff6b7a] border-[#ff6b7a]/25",
    icon: "bg-[#ff6b7a]/10",
  },
  HIGH: {
    card: "border-[#ff6b7a]/25 bg-[#ff6b7a]/4",
    value: "text-[#ff6b7a]",
    badge: "bg-[#ff6b7a]/10 text-[#ff6b7a] border-[#ff6b7a]/25",
    icon: "bg-[#ff6b7a]/10",
  },
  WARNING: {
    card: "border-[#ff8c42]/25 bg-[#ff8c42]/4",
    value: "text-[#ff8c42]",
    badge: "bg-[#ff8c42]/10 text-[#ff8c42] border-[#ff8c42]/25",
    icon: "bg-[#ff8c42]/10",
  },
  MODERATE: {
    card: "border-[#ff8c42]/25 bg-[#ff8c42]/4",
    value: "text-[#ff8c42]",
    badge: "bg-[#ff8c42]/10 text-[#ff8c42] border-[#ff8c42]/25",
    icon: "bg-[#ff8c42]/10",
  },
  OK: {
    card: "border-[#caff3d]/25 bg-[#caff3d]/4",
    value: "text-black",
    badge: "bg-[#caff3d]/20 text-black border-[#caff3d]/40",
    icon: "bg-[#caff3d]/15",
  },
  LOW: {
    card: "border-[#caff3d]/25 bg-[#caff3d]/4",
    value: "text-black",
    badge: "bg-[#caff3d]/20 text-black border-[#caff3d]/40",
    icon: "bg-[#caff3d]/15",
  },
}

export default function MetricCard({
  icon,
  title,
  value,
  subtitle,
  severity,
}) {
  const sev =
    severity && SEVERITY_STYLES[severity]
      ? SEVERITY_STYLES[severity]
      : null;

  return (
    <div
      className={[
        "rounded-xl border p-5 transition-all duration-150",
        "hover:shadow-sm",
        sev
          ? sev.card
          : "bg-card border-border hover:border-border/80",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className={[
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
            sev ? sev.icon : "bg-muted",
          ].join(" ")}
        >
          <span className="text-muted-foreground">{icon}</span>
        </div>
        {severity && sev && (
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${sev.badge}`}
          >
            {severity}
          </span>
        )}
      </div>

      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
        {title}
      </p>
      <p
        className={[
          "text-xl font-bold font-mono leading-none",
          sev ? sev.value : "text-foreground",
        ].join(" ")}
      >
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1.5 leading-snug">
          {subtitle}
        </p>
      )}
    </div>
  );
}