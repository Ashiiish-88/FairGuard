import Link from "next/link";
import { Shield, Search, ArrowRight, Upload, Cpu, Scale, ChevronRight, Activity, Zap, Clock, Eye, FileSearch, BarChart3, Code2, AlertTriangle } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   LANDING PAGE — FairGuard v2
   Design: Refold structure × ToDesktop panels × Amber/Teal palette
   ═══════════════════════════════════════════════════════════════════ */

const domains = [
  {
    icon: <FileSearch className="w-5 h-5" />,
    iconBg: "bg-[#FEF3C7]",
    title: "Hiring & Recruitment",
    body: "Resume screening AIs that penalize career gaps, women\u2019s college names, or certain ZIP codes.",
    example: "Women rejected 2.1\u00d7 more despite equal qualifications",
    href: "/audit?domain=hiring",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    iconBg: "bg-[#CCFBF1]",
    title: "Content Moderation",
    body: "Moderation systems that silence marginalized voices at 2.3\u00d7 the rate of majority groups.",
    example: "Black activists\u2019 posts flagged 2.3\u00d7 more than identical posts",
    href: "/audit?domain=content",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    iconBg: "bg-[#FEF3C7]",
    title: "Algorithmic Pricing",
    body: "Surveillance pricing that charges more based on ZIP code, device type, or browsing history as wealth proxies.",
    example: "Rural users charged \u20b93,400 vs \u20b92,100 for same hotel room",
    href: "/audit?domain=pricing",
  },
  {
    icon: <Activity className="w-5 h-5" />,
    iconBg: "bg-red-50",
    title: "Healthcare & Triage",
    body: "Medical algorithms that use cost as a proxy for health need, systematically under-treating minority patients.",
    example: "Black patients received $1,800 less care at same illness level",
    href: "/audit?domain=healthcare",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    iconBg: "bg-red-50",
    title: "Lending & Credit",
    body: "Credit-scoring systems that penalize applicants for where they live or which language they speak at home.",
    example: "Minority applicants denied at 1.8\u00d7 the rate with identical financials",
    href: "/audit?domain=lending",
  },
  {
    icon: <Code2 className="w-5 h-5" />,
    iconBg: "bg-[#CCFBF1]",
    title: "LLM Response Bias",
    body: "Large language models that generate biased performance reviews, job descriptions, or scores based on names.",
    example: "\u201cBrian\u201d gets \u201cleadership\u201d adjectives; \u201cAnjali\u201d gets \u201cteam player\u201d",
    href: "/audit?domain=llm",
    isNew: true,
  },
];

const howItWorks = [
  { step: "01", title: "Upload", desc: "Drop a CSV or JSON of AI decisions. Hiring, lending, pricing \u2014 any domain.", icon: <Upload className="w-5 h-5" /> },
  { step: "02", title: "Analyze", desc: "FairGuard computes 5 fairness metrics, detects proxy variables, and maps legal exposure.", icon: <Cpu className="w-5 h-5" /> },
  { step: "03", title: "Act", desc: "Get plain-English explanations, a 6-axis Bias Fingerprint, and concrete remediation steps.", icon: <Scale className="w-5 h-5" /> },
];

const stats = [
  { value: "60s", label: "Time to insight" },
  { value: "5+", label: "Fairness metrics" },
  { value: "7+", label: "Legal frameworks" },
  { value: "100%", label: "Privacy-first" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ═══ SECTION 1: HERO ═══ */}
      <section className="relative overflow-hidden bg-white">
        {/* Background elements */}
        <div className="absolute top-[-100px] right-[-100px] w-[700px] h-[700px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 65%)" }} />
        <div className="absolute bottom-[-150px] left-[-100px] w-[500px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(13,148,136,0.06) 0%, transparent 65%)" }} />
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: "radial-gradient(circle, #E5E7EB 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* LEFT — Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FEF3C7] border border-[#F59E0B]/20 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse-amber" />
                <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#D97706]">AI Fairness Auditor</span>
              </div>

              {/* Headline */}
              <h1 className="text-[clamp(44px,5.5vw,72px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#0A0A0A] mb-6">
                Find the bias{" "}
                <span className="relative inline-block">
                  <span>hiding</span>
                  <span className="absolute bottom-1 left-0 right-0 h-1.5 bg-[#F59E0B] opacity-40 rounded-sm -z-10" />
                </span>
                <br />in your AI
              </h1>

              {/* Body */}
              <p className="text-[17px] leading-[1.7] text-[#374151] max-w-[480px] mb-9">
                FairGuard audits any AI decision system in 60 seconds. Upload your data, detect hidden bias, get plain-English explanations and legal exposure estimates &mdash; before your AI harms real people.
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-4 flex-wrap mb-12">
                <Link href="/audit" className="group inline-flex items-stretch rounded-md overflow-hidden transition-all duration-150 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]">
                  <span className="bg-[#F59E0B] px-4 py-3.5 flex items-center justify-center text-black group-hover:bg-[#D97706] transition-colors">
                    <Shield className="w-4 h-4" />
                  </span>
                  <span className="bg-[#0A0A0A] text-white text-[12px] font-bold tracking-[0.12em] uppercase px-6 py-3.5 flex items-center group-hover:bg-[#1a1a1a] transition-colors">
                    RUN FREE AUDIT
                  </span>
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.1em] uppercase px-6 py-3.5 rounded-md border-[1.5px] border-[#D1D5DB] text-[#0A0A0A] hover:border-[#F59E0B] hover:bg-[#FEF3C7] transition-all duration-200 hover:-translate-y-px"
                >
                  SEE HOW IT WORKS
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Proof stats */}
              <div className="inline-flex items-center gap-6 px-6 py-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                {stats.map((s, i) => (
                  <div key={s.label} className="flex items-center gap-6">
                    <div className="text-center">
                      <span className="block text-[22px] font-extrabold text-[#0A0A0A] tracking-[-0.02em]" style={{ fontFamily: "var(--font-heading)" }}>{s.value}</span>
                      <span className="text-[11px] text-[#6B7280] font-medium">{s.label}</span>
                    </div>
                    {i < stats.length - 1 && <div className="w-px h-9 bg-[#E5E7EB]" />}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Dashboard Mockup (ToDesktop style) */}
            <div className="relative">
              <div className="bg-[#0C0E12] border border-[#252932] rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.18),0_0_80px_rgba(245,158,11,0.06)]">
                {/* Window chrome */}
                <div className="bg-[#13161C] border-b border-[#252932] px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-[10px] h-[10px] rounded-full bg-[#FF5F57]" />
                    <span className="w-[10px] h-[10px] rounded-full bg-[#FFBD2E]" />
                    <span className="w-[10px] h-[10px] rounded-full bg-[#28C840]" />
                  </div>
                  <span className="flex-1 text-center text-[11px] text-[#94A3B8]" style={{ fontFamily: "var(--font-geist-mono)" }}>fairguard.ai/audit</span>
                </div>

                {/* Mock body */}
                <div className="p-7 space-y-5">
                  {/* Score ring mock */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-[120px] h-[120px]">
                      <svg viewBox="0 0 120 120" className="w-full h-full">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="#1C2029" strokeWidth="8" />
                        <circle cx="60" cy="60" r="52" fill="none" stroke="#EF4444" strokeWidth="8" strokeDasharray="326" strokeDashoffset="187" strokeLinecap="round" transform="rotate(-90 60 60)" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[32px] font-extrabold text-[#EF4444] leading-none" style={{ fontFamily: "var(--font-heading)" }}>43</span>
                        <span className="text-[12px] text-[#94A3B8]">/100</span>
                      </div>
                    </div>
                    <span className="inline-block text-[11px] font-semibold px-3.5 py-1.5 rounded-full bg-[#EF4444]/12 text-[#FCA5A5] border border-[#EF4444]/20">CRITICAL BIAS DETECTED</span>
                  </div>

                  {/* Flags */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-3.5 py-2.5 bg-[#EF4444]/6 border border-[#EF4444]/15 rounded-md">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#FCA5A5] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-[#F1F5F9]">Gender Bias</div>
                        <div className="text-[10px] text-[#94A3B8]" style={{ fontFamily: "var(--font-geist-mono)" }}>Women rejected 2.1x more</div>
                      </div>
                      <span className="text-[9px] font-bold tracking-[0.1em] text-[#94A3B8]">HIGH</span>
                    </div>
                    <div className="flex items-center gap-3 px-3.5 py-2.5 bg-[#F59E0B]/6 border border-[#F59E0B]/15 rounded-md">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#FCD34D] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-[#F1F5F9]">Proxy Detected</div>
                        <div className="text-[10px] text-[#94A3B8]" style={{ fontFamily: "var(--font-geist-mono)" }}>zip_code &rarr; race (87%)</div>
                      </div>
                      <span className="text-[9px] font-bold tracking-[0.1em] text-[#94A3B8]">MED</span>
                    </div>
                    <div className="flex items-center gap-3 px-3.5 py-2.5 bg-[#F59E0B]/6 border border-[#F59E0B]/15 rounded-md">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#FCD34D] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-[#F1F5F9]">Age Discrimination</div>
                        <div className="text-[10px] text-[#94A3B8]" style={{ fontFamily: "var(--font-geist-mono)" }}>50+ rejected 1.6x more</div>
                      </div>
                      <span className="text-[9px] font-bold tracking-[0.1em] text-[#94A3B8]">MED</span>
                    </div>
                  </div>

                  {/* Legal exposure */}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#F59E0B]/8 border border-[#F59E0B]/20 rounded-md">
                    <span className="text-[11px] font-semibold tracking-[0.05em] text-[#FCD34D]">LEGAL EXPOSURE</span>
                    <span className="text-[18px] font-extrabold text-[#FBBF24]" style={{ fontFamily: "var(--font-heading)" }}>{"\u20b9"}2.5 Cr</span>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -right-5 bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-[12px] font-semibold text-[#374151] shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center gap-2 animate-float-1">
                <Search className="w-3.5 h-3.5 text-[#F59E0B]" /> Proxy variable detected
              </div>
              <div className="absolute bottom-10 -left-7 bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-[12px] font-semibold text-[#374151] shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center gap-2 animate-float-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" /> 0 false positives
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2: DOMAINS ═══ */}
      <section className="py-28 bg-white" id="domains">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-[640px] mx-auto mb-16">
            <span className="section-label inline-block mb-4">6 Domains Supported</span>
            <h2 className="text-[clamp(32px,3.5vw,46px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#0A0A0A] mb-5">
              Bias hides everywhere.{" "}
              <span className="text-[#D97706]">FairGuard finds it.</span>
            </h2>
            <p className="text-[17px] text-[#374151] leading-[1.65]">
              Not just hiring. Not just loans. Any system that makes decisions about humans &mdash; FairGuard audits it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {domains.map((d) => (
              <div
                key={d.title}
                className="relative group bg-white border border-[#E5E7EB] rounded-lg p-7 cursor-pointer transition-all duration-220 hover:border-[rgba(245,158,11,0.3)] hover:shadow-[0_0_0_1px_rgba(245,158,11,0.15),0_8px_32px_rgba(245,158,11,0.06),0_4px_16px_rgba(0,0,0,0.04)] hover:-translate-y-[3px]"
              >
                {d.isNew && (
                  <span className="absolute top-4 right-4 bg-[#CCFBF1] text-[#0F766E] text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full">NEW</span>
                )}
                <div className={`w-[52px] h-[52px] ${d.iconBg} flex items-center justify-center rounded-md mb-4 text-[#374151]`}>
                  {d.icon}
                </div>
                <h3 className="text-[17px] font-bold text-[#0A0A0A] mb-2.5" style={{ fontFamily: "var(--font-heading)" }}>{d.title}</h3>
                <p className="text-[14px] text-[#6B7280] leading-[1.65] mb-4">{d.body}</p>
                <div className="bg-[#F9FAFB] border-l-[3px] border-l-[#F59E0B] py-2.5 px-3.5 rounded-r mb-4">
                  <span className="block text-[10px] font-bold tracking-[0.12em] text-[#D97706] mb-1">REAL BIAS FOUND</span>
                  <span className="text-[12px] text-[#374151] leading-snug">{d.example}</span>
                </div>
                <Link href={d.href} className="text-[13px] font-semibold text-[#0D9488] inline-flex items-center gap-1 transition-all duration-150 group-hover:gap-2 hover:text-[#0F766E]">
                  Audit this model <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: HOW IT WORKS ═══ */}
      <section className="py-24 bg-[#F9FAFB]" id="how-it-works">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-[540px] mx-auto mb-16">
            <span className="section-label inline-block mb-4">How It Works</span>
            <h2 className="text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#0A0A0A]">
              Three steps to fairness
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map((s) => (
              <div key={s.step} className="bg-white border border-[#E5E7EB] rounded-lg p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-5 bg-[#FEF3C7] border border-[#F59E0B]/20 rounded-lg flex items-center justify-center text-[#D97706]">
                  {s.icon}
                </div>
                <span className="block text-[10px] font-bold tracking-[0.2em] text-[#9CA3AF] mb-2">{s.step}</span>
                <h3 className="text-[20px] font-bold text-[#0A0A0A] mb-3" style={{ fontFamily: "var(--font-heading)" }}>{s.title}</h3>
                <p className="text-[14px] text-[#6B7280] leading-[1.65]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: BIAS FINGERPRINT (DARK) ═══ */}
      <section className="relative py-28 bg-[#0C0E12] overflow-hidden">
        <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            {/* Left text */}
            <div>
              <span className="section-label-dark inline-block mb-5">Bias Fingerprint</span>
              <h2 className="text-[clamp(30px,3vw,44px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#F1F5F9] mb-5">
                Every biased system leaves a unique shape.
              </h2>
              <p className="text-[16px] text-[#94A3B8] leading-[1.7] mb-9">
                FairGuard renders a 6-axis radar chart &mdash; your AI&apos;s Bias Fingerprint. Each axis measures a different dimension of fairness. The shape tells the story instantly.
              </p>

              <div className="space-y-3.5">
                {[
                  { color: "bg-[#EF4444]", name: "Demographic Parity", desc: "Equal outcomes across groups" },
                  { color: "bg-[#F59E0B]", name: "Equalized Odds", desc: "Equal error rates across groups" },
                  { color: "bg-[#0D9488]", name: "Individual Fairness", desc: "Similar inputs \u2192 similar outputs" },
                  { color: "bg-[#10B981]", name: "Intersectional Parity", desc: "Fairness at group intersections" },
                  { color: "bg-[#3B82F6]", name: "Proxy Resistance", desc: "No hidden proxy discrimination" },
                  { color: "bg-[#8B5CF6]", name: "Counterfactual Fairness", desc: "Protected change \u2192 same outcome" },
                ].map((axis) => (
                  <div key={axis.name} className="flex items-start gap-3.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${axis.color} mt-1.5 shrink-0`} />
                    <div>
                      <div className="text-[14px] font-semibold text-[#F1F5F9]">{axis.name}</div>
                      <div className="text-[12px] text-[#94A3B8]">{axis.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — fingerprint panel */}
            <div className="bg-[#13161C] border border-[#252932] rounded-2xl p-8">
              <div className="flex gap-1 bg-[#1C2029] rounded-md p-1 w-fit mb-7">
                <button className="px-5 py-2 bg-[#F59E0B] text-black text-[12px] font-semibold rounded" style={{ borderRadius: "4px" }}>Before Fix</button>
                <button className="px-5 py-2 text-[#94A3B8] text-[12px] font-semibold" style={{ borderRadius: "4px" }}>After Fix</button>
              </div>

              {/* Placeholder radar */}
              <div className="h-[260px] flex items-center justify-center">
                <svg viewBox="0 0 300 260" className="w-full h-full max-w-[300px]">
                  {/* Hexagonal grid */}
                  {[100, 75, 50, 25].map((r) => (
                    <polygon key={r} points={hexPoints(150, 130, r)} fill="none" stroke="#252932" strokeWidth="1" />
                  ))}
                  {/* Actual shape (biased - before fix) */}
                  <polygon
                    points={radarPoints(150, 130, [40, 65, 30, 55, 25, 70])}
                    fill="rgba(239,68,68,0.15)"
                    stroke="#EF4444"
                    strokeWidth="2"
                  />
                  {/* Dots */}
                  {radarDots(150, 130, [40, 65, 30, 55, 25, 70]).map((pt, i) => (
                    <circle key={i} cx={pt[0]} cy={pt[1]} r="4" fill="#EF4444" stroke="#0C0E12" strokeWidth="2" />
                  ))}
                </svg>
              </div>

              <div className="flex items-center gap-5 mt-6 pt-6 border-t border-[#252932]">
                <div className="text-center">
                  <span className="block text-[10px] tracking-[0.12em] text-[#94A3B8] mb-1">BEFORE</span>
                  <span className="text-[28px] font-extrabold text-[#EF4444]" style={{ fontFamily: "var(--font-heading)" }}>43/100</span>
                </div>
                <span className="text-[20px] text-[#94A3B8]">&rarr;</span>
                <div className="text-center">
                  <span className="block text-[10px] tracking-[0.12em] text-[#94A3B8] mb-1">AFTER</span>
                  <span className="text-[28px] font-extrabold text-[#10B981]" style={{ fontFamily: "var(--font-heading)" }}>79/100</span>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-[13px] font-bold text-[#10B981]">+36 points</div>
                  <div className="text-[11px] text-[#94A3B8]">by removing 2 proxy columns</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: FAIRNESS DEBT ═══ */}
      <section className="py-28 bg-[#F9FAFB]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            {/* Left — Dark debt card */}
            <div className="bg-[#0C0E12] border border-[#252932] rounded-2xl overflow-hidden" style={{ fontFamily: "var(--font-geist-mono)" }}>
              <div className="bg-[#EF4444]/10 border-b border-[#EF4444]/20 px-6 py-3.5">
                <span className="text-[12px] font-bold tracking-[0.08em] text-[#FCA5A5]">FAIRNESS DEBT REPORT</span>
              </div>
              <div className="px-6 py-6 border-b border-[#252932]">
                <span className="block text-[10px] tracking-[0.15em] text-[#94A3B8] mb-2">FAIRNESS SCORE</span>
                <span className="text-[48px] font-black text-[#EF4444] leading-none" style={{ fontFamily: "var(--font-heading)" }}>43<span className="text-[20px] text-[#94A3B8]">/100</span></span>
              </div>
              <div className="px-6 py-4 border-b border-[#252932]">
                <div className="flex justify-between text-[13px] py-1.5 text-[#94A3B8]">
                  <span>People Affected</span>
                  <span className="text-[#F1F5F9] font-semibold">~2,300 applicants</span>
                </div>
              </div>
              <div className="px-6 py-5 border-b border-[#252932]">
                <span className="block text-[10px] tracking-[0.15em] text-[#FCD34D] font-semibold mb-3.5">LEGAL EXPOSURE</span>
                {[
                  { reg: "India DPDP Act", amount: "\u20b92.5 Cr", color: "text-[#FCA5A5]" },
                  { reg: "EU AI Act", amount: "\u20ac8M", color: "text-[#FCA5A5]" },
                  { reg: "US EEOC", amount: "$185K", color: "text-[#FCD34D]" },
                ].map((r) => (
                  <div key={r.reg} className="flex justify-between items-center py-2 text-[13px] text-[#94A3B8] border-b border-white/[0.04] last:border-0">
                    <span>{r.reg}</span>
                    <span className={`font-extrabold text-[15px] ${r.color}`} style={{ fontFamily: "var(--font-heading)" }}>{r.amount}</span>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-[#10B981]/6">
                <span className="text-[12px] text-[#6EE7B7] font-semibold">Cost of fix = &lt;0.1% of legal risk</span>
              </div>
            </div>

            {/* Right — Text */}
            <div>
              <span className="section-label inline-block mb-4">The Business Case</span>
              <h2 className="text-[clamp(30px,3vw,44px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#0A0A0A] mb-5">
                Bias isn&apos;t just wrong.{" "}
                <span className="text-[#D97706]">It&apos;s expensive.</span>
              </h2>
              <p className="text-[17px] text-[#374151] leading-[1.7] mb-4">
                FairGuard translates your fairness score into language executives understand. Not disparate impact ratios &mdash; rupees, euros, and dollars of potential liability.
              </p>
              <p className="text-[17px] text-[#374151] leading-[1.7] mb-8">
                Because the ROI of fairness should never be in doubt.
              </p>
              <Link href="/audit" className="group inline-flex items-stretch rounded-md overflow-hidden transition-all duration-150 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]">
                <span className="bg-[#F59E0B] px-4 py-3.5 flex items-center justify-center text-black group-hover:bg-[#D97706] transition-colors">
                  <Scale className="w-4 h-4" />
                </span>
                <span className="bg-[#0A0A0A] text-white text-[12px] font-bold tracking-[0.12em] uppercase px-6 py-3.5 flex items-center group-hover:bg-[#1a1a1a] transition-colors">
                  CALCULATE YOUR DEBT
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6: LLM PROBE (DARK — Visual Only) ═══ */}
      <section className="py-28 bg-[#13161C] border-t border-[#252932]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left — text + table */}
            <div>
              <span className="section-label-dark inline-block mb-5">LLM Bias Probe</span>
              <h2 className="text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#F1F5F9] mb-5">
                We used Google&apos;s AI to find bias in AI.
              </h2>
              <p className="text-[16px] text-[#94A3B8] leading-[1.7] mb-8">
                Enter a prompt template. FairGuard sends it to Gemini with different names representing different demographics. Then analyzes what comes back.
              </p>

              {/* Results table */}
              <div className="border border-[#252932] rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2.5 bg-[#1C2029] text-[10px] font-semibold tracking-[0.12em] uppercase text-[#94A3B8]">
                  <span>Name</span>
                  <span>Power Adjectives</span>
                  <span>Status</span>
                </div>
                {[
                  { name: "Brian (White/Male)", pct: "73%", pctColor: "text-[#EF4444]", status: "Biased", statusClass: "bg-[#EF4444]/12 text-[#FCA5A5] border-[#EF4444]/20" },
                  { name: "Anjali (South Asian/Female)", pct: "31%", pctColor: "text-[#6EE7B7]", status: "Biased", statusClass: "bg-[#EF4444]/12 text-[#FCA5A5] border-[#EF4444]/20" },
                  { name: "Kwame (African/Male)", pct: "28%", pctColor: "text-[#6EE7B7]", status: "Biased", statusClass: "bg-[#EF4444]/12 text-[#FCA5A5] border-[#EF4444]/20" },
                  { name: "Wei (Asian/Male)", pct: "44%", pctColor: "text-[#F59E0B]", status: "Moderate", statusClass: "bg-[#F59E0B]/12 text-[#FCD34D] border-[#F59E0B]/20" },
                ].map((r) => (
                  <div key={r.name} className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 border-t border-[#252932] items-center text-[13px] text-[#F1F5F9]">
                    <span>{r.name}</span>
                    <span className={`font-bold ${r.pctColor}`} style={{ fontFamily: "var(--font-geist-mono)" }}>{r.pct}</span>
                    <span className={`text-[10px] font-semibold tracking-[0.08em] px-2.5 py-1 rounded-full border ${r.statusClass}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Code block */}
            <div className="bg-[#0C0E12] border border-[#252932] rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-[#1C2029] border-b border-[#252932] flex justify-between items-center">
                <span className="text-[12px] text-[#94A3B8]" style={{ fontFamily: "var(--font-geist-mono)" }}>llm_probe.py</span>
                <span className="flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
                  <span className="w-[7px] h-[7px] rounded-full bg-[#F59E0B] animate-pulse" /> Analyzing...
                </span>
              </div>
              <div
                className="px-5 py-6 text-[12.5px] leading-[1.8] text-[#E2E8F0] overflow-x-auto whitespace-pre"
                style={{ fontFamily: "var(--font-geist-mono)" }}
                dangerouslySetInnerHTML={{ __html: `<span style="color:#6B7280"># FairGuard LLM Probe</span>
<span style="color:#93C5FD">template</span> = <span style="color:#6EE7B7">"Write a review for {name}"</span>

<span style="color:#6B7280"># Generate responses</span>
names = [<span style="color:#6EE7B7">"Brian"</span>, <span style="color:#6EE7B7">"Anjali"</span>, <span style="color:#6EE7B7">"Kwame"</span>, <span style="color:#6EE7B7">"Wei"</span>]
responses = gemini.generate(template, names)

<span style="color:#6B7280"># Analyze adjectives</span>
bias_result = fairguard.analyze_text(
  responses,
  check=[<span style="color:#6EE7B7">"power_words"</span>, <span style="color:#6EE7B7">"sentiment"</span>]
)

<span style="display:block;background:rgba(16,185,129,0.08);padding:0 4px;margin:0 -4px;color:#6EE7B7">+ BIAS DETECTED: 2.4x gap in adjectives</span>
<span style="display:block;background:rgba(239,68,68,0.08);padding:0 4px;margin:0 -4px;color:#FCA5A5">- "Brian" -> "demonstrates strong leadership"</span>
<span style="display:block;background:rgba(239,68,68,0.08);padding:0 4px;margin:0 -4px;color:#FCA5A5">- "Anjali" -> "dedicated team player"</span>` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 7: STRESS TEST FEATURES ═══ */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <span className="section-label inline-block mb-4">Adversarial Testing</span>
            <h2 className="text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#0A0A0A] mb-4">
              Stress-test before your AI ships
            </h2>
            <p className="text-[16px] text-[#374151] leading-[1.65]">
              Generate synthetic candidates with identical qualifications but different demographics. Expose how your model discriminates.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: <Zap className="w-5 h-5" />, title: "Synthetic Candidates", desc: "Gemini generates diverse profiles with controlled qualifications to isolate bias signals." },
              { icon: <BarChart3 className="w-5 h-5" />, title: "Disparate Impact Analysis", desc: "Computes the 4/5ths rule across every demographic axis with statistical significance." },
              { icon: <AlertTriangle className="w-5 h-5" />, title: "Intersectional Testing", desc: "Finds bias at intersections — e.g., older women in rural areas rejected most." },
            ].map((f) => (
              <div key={f.title} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-7">
                <div className="w-10 h-10 bg-[#FEF3C7] border border-[#F59E0B]/20 rounded-lg flex items-center justify-center text-[#D97706] mb-5">
                  {f.icon}
                </div>
                <h3 className="text-[16px] font-bold text-[#0A0A0A] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{f.title}</h3>
                <p className="text-[14px] text-[#6B7280] leading-[1.65]">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/stress" className="group inline-flex items-stretch rounded-md overflow-hidden transition-all duration-150 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]">
              <span className="bg-[#F59E0B] px-4 py-3.5 flex items-center justify-center text-black group-hover:bg-[#D97706] transition-colors">
                <Zap className="w-4 h-4" />
              </span>
              <span className="bg-[#0A0A0A] text-white text-[12px] font-bold tracking-[0.12em] uppercase px-6 py-3.5 flex items-center group-hover:bg-[#1a1a1a] transition-colors">
                RUN STRESS TEST
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 8: FINAL CTA (AMBER) ═══ */}
      <section className="py-20 bg-[#F59E0B]">
        <div className="max-w-[640px] mx-auto px-6 text-center">
          <h2 className="text-[clamp(28px,3.5vw,44px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#0A0A0A] mb-4">
            Run your first audit free.
          </h2>
          <p className="text-[17px] text-[#78350F] leading-[1.65] mb-8">
            The warning before the law does. Upload your data, find the bias, fix it &mdash; in 60 seconds.
          </p>
          <Link href="/audit" className="group inline-flex items-stretch rounded-md overflow-hidden transition-all duration-150 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]">
            <span className="bg-[#0A0A0A] text-[#F59E0B] px-4 py-3.5 flex items-center justify-center group-hover:bg-[#1a1a1a] transition-colors">
              <Shield className="w-4 h-4" />
            </span>
            <span className="bg-white text-[#0A0A0A] text-[12px] font-bold tracking-[0.12em] uppercase px-6 py-3.5 flex items-center transition-colors">
              START AUDIT
            </span>
          </Link>
        </div>
      </section>

      {/* ═══ SECTION 9: FOOTER ═══ */}
      <footer className="bg-white border-t border-[#E5E7EB] py-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-[#0A0A0A] flex items-center justify-center rounded-md">
                  <Shield className="w-3.5 h-3.5 text-[#F59E0B]" />
                </div>
                <span className="text-[15px] font-bold text-[#0A0A0A]" style={{ fontFamily: "var(--font-heading)" }}>FairGuard</span>
              </div>
              <p className="text-[14px] text-[#6B7280] leading-[1.65] max-w-[260px]">
                The bias firewall for AI. Find discrimination before it finds your users.
              </p>
            </div>

            {/* Tools */}
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#9CA3AF] mb-5">Tools</h4>
              <div className="flex flex-col gap-3">
                <Link href="/audit" className="text-[14px] text-[#6B7280] hover:text-[#0A0A0A] transition-colors">Bias Audit</Link>
                <Link href="/shield" className="text-[14px] text-[#6B7280] hover:text-[#0A0A0A] transition-colors">Shield Mode</Link>
                <Link href="/stress" className="text-[14px] text-[#6B7280] hover:text-[#0A0A0A] transition-colors">Stress Test</Link>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#9CA3AF] mb-5">Resources</h4>
              <div className="flex flex-col gap-3">
                <Link href="/history" className="text-[14px] text-[#6B7280] hover:text-[#0A0A0A] transition-colors">Audit History</Link>
                <Link href="#domains" className="text-[14px] text-[#6B7280] hover:text-[#0A0A0A] transition-colors">Supported Domains</Link>
                <Link href="#how-it-works" className="text-[14px] text-[#6B7280] hover:text-[#0A0A0A] transition-colors">How It Works</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#9CA3AF] mb-5">Legal Frameworks</h4>
              <div className="flex flex-col gap-3 text-[14px] text-[#6B7280]">
                <span>EU AI Act</span>
                <span>India DPDP Act</span>
                <span>US EEOC Guidelines</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E5E7EB] flex items-center justify-between flex-wrap gap-4">
            <span className="text-[13px] text-[#6B7280]">&copy; 2026 FairGuard. AI fairness, simplified.</span>
            <span className="inline-flex items-center gap-1.5 bg-[#10B981]/8 border border-[#10B981]/20 rounded-full px-3.5 py-1.5 text-[12px] text-[#10B981] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" style={{ animation: "pulse-green 2s ease-in-out infinite" }} />
              All systems operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══ SVG Helper functions for radar chart ═══ */
function hexPoints(cx, cy, r) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}

function radarPoints(cx, cy, values) {
  return values.map((v, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const r = v;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}

function radarDots(cx, cy, values) {
  return values.map((v, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return [cx + v * Math.cos(angle), cy + v * Math.sin(angle)];
  });
}
