import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Search, Zap } from "lucide-react";

const modes = [
  {
    title: "Audit Mode",
    icon: "🔍",
    href: "/audit",
    desc: "Upload any decision-making dataset — hiring, lending, admissions. Get a comprehensive fairness score with bias metrics explained in plain English.",
    features: ["5 fairness metrics", "Proxy detection", "AI explanations"],
    color: "from-purple-500/20 to-purple-600/5",
    border: "hover:border-purple-500/50",
  },
  {
    title: "Shield Mode",
    icon: "🛡️",
    href: "/shield",
    desc: "Monitor AI decisions in real-time. Watch fairness metrics shift live and get instant alerts when bias thresholds are breached.",
    features: ["Real-time streaming", "Live alerts", "Rolling metrics"],
    color: "from-blue-500/20 to-blue-600/5",
    border: "hover:border-blue-500/50",
  },
  {
    title: "Stress Test",
    icon: "🧪",
    href: "/stress",
    desc: "AI penetration testing. We generate synthetic diverse candidates with identical qualifications and expose how your model discriminates.",
    features: ["Synthetic candidates", "Bias exposure", "Intersectional analysis"],
    color: "from-cyan-500/20 to-cyan-600/5",
    border: "hover:border-cyan-500/50",
  },
];

const stats = [
  { value: "60s", label: "Average audit time" },
  { value: "5+", label: "Fairness metrics" },
  { value: "4", label: "Legal frameworks checked" },
  { value: "100%", label: "Privacy-first processing" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm bg-muted/30">
          🟢 AI Bias Detection & Prevention Platform
        </Badge>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl">
          Know if your AI is{" "}
          <span className="gradient-text">fair.</span>
        </h1>

        <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          FairGuard is the bias firewall for AI systems. Upload your data, monitor decisions
          in real-time, or stress-test any AI for hidden discrimination — all in plain English,
          no data science degree required.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <Link href="/audit">
            <Button size="lg" className="gradient-bg text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all text-base px-8 gap-2">
              🔍 Start Audit <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/shield">
            <Button size="lg" variant="outline" className="text-base px-8 gap-2">
              🛡️ Shield Mode
            </Button>
          </Link>
          <Link href="/stress">
            <Button size="lg" variant="outline" className="text-base px-8 gap-2">
              🧪 Stress Test
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-muted/10">
        <div className="max-w-5xl mx-auto py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold gradient-text">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mode Cards */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Three modes. One mission.</h2>
          <p className="text-muted-foreground mt-3 text-lg">Every angle covered — from static datasets to live systems</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {modes.map((mode) => (
            <Link key={mode.href} href={mode.href} className="group">
              <Card className={`h-full bg-gradient-to-b ${mode.color} border-border/50 ${mode.border} transition-all duration-300 group-hover:shadow-lg group-hover:translate-y-[-2px]`}>
                <CardHeader>
                  <div className="text-4xl mb-3">{mode.icon}</div>
                  <CardTitle className="text-xl">{mode.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{mode.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {mode.features.map((f) => (
                      <Badge key={f} variant="outline" className="text-xs bg-background/30">
                        {f}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
