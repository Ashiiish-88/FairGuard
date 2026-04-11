import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Search, Zap, Clock, Scale, Eye, ChevronRight } from "lucide-react";

const modes = [
  {
    title: "Audit Mode",
    icon: "🔍",
    href: "/audit",
    desc: "Upload any decision-making dataset — hiring, lending, content moderation, pricing. Get a comprehensive fairness score with bias metrics explained in plain English.",
    features: ["5 fairness metrics", "Proxy detection", "AI explanations", "Bias Fingerprint"],
    iconColor: "text-[#007AFF]",
    accent: "border-l-[#007AFF]",
    hoverBorder: "hover:border-[#007AFF]/40",
  },
  {
    title: "Shield Mode",
    icon: "🛡️",
    href: "/shield",
    desc: "Monitor AI decisions in real-time via SSE streaming. Watch fairness metrics shift live and get instant alerts on threshold breaches.",
    features: ["Real-time streaming", "Live alerts", "Rolling metrics"],
    iconColor: "text-[#00C853]",
    accent: "border-l-[#00C853]",
    hoverBorder: "hover:border-[#00C853]/40",
  },
  {
    title: "Stress Test",
    icon: "🧪",
    href: "/stress",
    desc: "AI penetration testing. We generate synthetic diverse candidates with identical qualifications and expose how your model discriminates.",
    features: ["Synthetic candidates", "Bias exposure", "Intersectional analysis"],
    iconColor: "text-[#FF2D55]",
    accent: "border-l-[#FF2D55]",
    hoverBorder: "hover:border-[#FF2D55]/40",
  },
  {
    title: "Audit History",
    icon: "📜",
    href: "/history",
    desc: "Track fairness improvements over time. View past audits, compare scores across domains, and identify recurring bias patterns.",
    features: ["Trend tracking", "Domain insights", "Score comparison"],
    iconColor: "text-[#FFAA00]",
    accent: "border-l-[#FFAA00]",
    hoverBorder: "hover:border-[#FFAA00]/40",
  },
];

const stats = [
  { value: "60s", label: "Average audit time", icon: <Clock className="w-4 h-4" /> },
  { value: "5+", label: "Fairness metrics", icon: <Scale className="w-4 h-4" /> },
  { value: "7+", label: "Legal frameworks", icon: <Eye className="w-4 h-4" /> },
  { value: "100%", label: "Privacy-first", icon: <Shield className="w-4 h-4" /> },
];

const trustedDomains = [
  { label: "Hiring", icon: "💼" },
  { label: "Content Moderation", icon: "📱" },
  { label: "Algorithmic Pricing", icon: "💰" },
  { label: "Lending", icon: "🏦" },
  { label: "Education", icon: "🎓" },
  { label: "Insurance", icon: "🛡️" },
  { label: "Healthcare", icon: "🏥" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-[#00C853]/8 via-[#007AFF]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <Badge
          variant="outline"
          className="relative mb-6 px-4 py-1.5 text-sm font-medium bg-white border-[#00C853]/30 text-[#0A1628]"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-[#00C853] mr-2 animate-pulse" />
          AI Bias Detection & Prevention Platform
        </Badge>

        <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl">
          Know if your AI is{" "}
          <span className="gradient-text">fair.</span>
        </h1>

        <p className="relative mt-6 text-base sm:text-lg text-[#5A6A85] max-w-2xl leading-relaxed">
          FairGuard is the bias firewall for AI systems. Upload your data, monitor decisions
          in real-time, or stress-test any AI for hidden discrimination — all in plain English,
          no data science degree required.
        </p>

        <div className="relative flex flex-wrap items-center justify-center gap-3 mt-10">
          <Link href="/audit">
            <Button
              size="lg"
              className="bg-[#00C853] hover:bg-[#00E676] text-white shadow-lg shadow-[#00C853]/20 hover:shadow-[#00C853]/30 transition-all duration-300 text-base px-8 gap-2 font-semibold"
            >
              Start Audit <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/shield">
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 gap-2 bg-white border-[#E2E6ED] hover:border-[#0D2045]/30 hover:bg-[#F5F7FA] text-[#0A1628] font-medium"
            >
              🛡️ Shield Mode
            </Button>
          </Link>
          <Link href="/stress">
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 gap-2 bg-white border-[#E2E6ED] hover:border-[#0D2045]/30 hover:bg-[#F5F7FA] text-[#0A1628] font-medium"
            >
              🧪 Stress Test
            </Button>
          </Link>
        </div>
      </section>

      {/* ═══ DOMAIN TICKER ═══ */}
      <section className="border-y border-[#E2E6ED] bg-white/60">
        <div className="max-w-5xl mx-auto py-5 px-6">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-[#5A6A85] uppercase tracking-wider mr-3">Works for</span>
            {trustedDomains.map((d) => (
              <Badge
                key={d.label}
                variant="outline"
                className="text-xs bg-white border-[#E2E6ED] text-[#5A6A85] font-normal px-3 py-1"
              >
                {d.icon} {d.label}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="bg-[#0D2045]">
        <div className="max-w-5xl mx-auto py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2">
              <div className="text-[#00C853]/60 mb-1">{s.icon}</div>
              <p className="text-3xl font-bold text-white font-mono tracking-tight">
                {s.value}
              </p>
              <p className="text-sm text-[#8BA3C7]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ MODE CARDS ═══ */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628]">
            Four modes. One mission.
          </h2>
          <p className="text-[#5A6A85] mt-3 text-lg max-w-xl mx-auto">
            Every angle covered — from static datasets to live systems to historical trends
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {modes.map((mode, index) => (
            <Link key={mode.href} href={mode.href} className="group">
              <Card
                className={`h-full bg-white border-[#E2E6ED] ${mode.hoverBorder} border-l-4 ${mode.accent} transition-all duration-300 group-hover:shadow-premium-hover group-hover:translate-y-[-2px]`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{mode.icon}</span>
                    <CardTitle className="text-xl font-bold text-[#0A1628]">
                      {mode.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-[#5A6A85] leading-relaxed">
                    {mode.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {mode.features.map((f) => (
                      <Badge
                        key={f}
                        variant="outline"
                        className="text-xs bg-[#F5F7FA] border-[#E2E6ED] text-[#5A6A85] font-normal"
                      >
                        {f}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-[#00C853] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-1">
                    Get started <ChevronRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ CTA FOOTER ═══ */}
      <section className="bg-[#0D2045] py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ANY domain. ANY bias. ONE tool.
          </h2>
          <p className="text-[#8BA3C7] text-lg mb-8 max-w-xl mx-auto">
            FairGuard works for hiring, lending, content moderation, pricing, education, insurance — any AI decision system.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/audit">
              <Button
                size="lg"
                className="bg-[#00C853] hover:bg-[#00E676] text-white text-base px-8 gap-2 font-semibold shadow-lg shadow-[#00C853]/20"
              >
                Start Your First Audit <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
