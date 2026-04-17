"use client";

import Link from "next/link";
import { Shield, Search, ArrowRight, Upload, Cpu, Scale, ChevronRight, Activity, Zap, Clock, Eye, FileSearch, BarChart3, Code2, AlertTriangle } from "lucide-react";
import HiwScroll from "@/components/hiw-scroll";
import FingerprintToggle from "@/components/fingerprint-toggle";
import { motion } from "framer-motion";

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

/* Stripe offsets — Refold staggered pattern [0, 50, 100, 150, 200, 250, 200, 150, 100, 50, 0, 50, 100, 150] */
const stripeOffsets = [0, 50, 100, 150, 200, 250, 200, 150, 100, 50, 0, 50, 100, 150];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ═══ SECTION 1: HERO — Refold Template Fusion ═══ */}
      <section className="sm:h-[450px] h-[550px] w-full bg-base-100 flex relative overflow-clip">
        {/* ── LEFT: Staggered Stripes (Flipped) ── */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:flex overflow-hidden flex-col absolute top-[-100px] left-0 h-[700px] w-[20%] xl:w-[25%] scale-x-[-1] opacity-80 pointer-events-none"
        >
          {stripeOffsets.map((offset, i) => (
            <div
              key={`left-${i}`}
              className="bg-gradient-1 stripe-hover-effect"
              style={{
                width: "100%",
                height: "50px",
                transform: `translateX(${offset}px) scaleX(-1)`,
              }}
            />
          ))}
        </motion.div>

        {/* ── CENTER: Content ── */}
        <div className="sm:w-[60%] w-[90%] m-auto h-full flex flex-col gap-10 justify-center items-center relative z-10">
          <div className="flex flex-col gap-5 items-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#E5E7EB] rounded-full shadow-sm w-fit mb-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#D97706] font-mono">
                AI Fairness Auditor
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-2 text-center text-balance max-w-[800px]"
            >
              Find the bias <span className="relative inline-block">
                <span>hiding</span>
                <span className="absolute bottom-1 left-0 right-0 h-1.5 bg-[#F59E0B] opacity-40 rounded-sm -z-10" />
              </span> in your AI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="body-md text-center text-base-400 max-w-[580px] text-balance"
            >
              FairGuard audits any AI decision system in 60 seconds.
              Detect hidden bias, get plain-English explanations, and
              estimate legal exposure — before your AI harms real people.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-4 w-full justify-center sm:flex-row flex-col px-6"
          >
            {/* Primary Action */}
            <Link href="/audit"
              className="inline-flex items-center justify-center font-bold px-6 py-3 transition-all duration-300 bg-[#0057ff] text-[#ffffff] hover:shadow-[0_0_20px_rgba(0,87,255,0.4)] group rounded-md">
              <span className="text-[12px] tracking-[0.12em] uppercase text-white">RUN FREE AUDIT</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1 text-white" />
            </Link>

            {/* Secondary Action */}
            <Link href="#how-it-works"
              className="inline-flex items-center justify-center px-6 py-3 transition-all duration-300 bg-[#191b20] text-[#f5f3ee] border border-[#eaeaea]/20 hover:bg-[#2e3139] rounded-md font-mono text-[12px] tracking-[0.1em] uppercase">
              SEE HOW IT WORKS
            </Link>
          </motion.div>
        </div>

        {/* ── RIGHT: Staggered Stripes ── */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="hidden lg:flex overflow-hidden flex-col absolute top-[-100px] right-0 h-[700px] w-[20%] xl:w-[25%] opacity-80 pointer-events-none"
        >
          {stripeOffsets.map((offset, i) => (
            <div
              key={`right-${i}`}
              className="bg-gradient-1 stripe-hover-effect"
              style={{
                width: "100%",
                height: "50px",
                transform: `translateX(${offset}px) scaleX(-1)`,
              }}
            />
          ))}
        </motion.div>
      </section>

      {/* ═══ METRICS ROW — Below hero ═══ */}
      <section className="py-12" style={{ background: "#F8F8F9" }}>
        <div className="flex justify-center px-6">
          <div className="flex items-stretch bg-white border border-[#E5E7EB] rounded-xl overflow-hidden w-full max-w-[760px]">
            {stats.map((s, i) => (
              <div key={s.label} className="flex-1 text-center py-7 px-4 relative">
                {i > 0 && (
                  <div className="absolute left-0 top-[20%] bottom-[20%] w-px bg-[#E5E7EB]" />
                )}
                <div className="text-[28px] font-extrabold text-refold-text-dark leading-none mb-2" style={{ fontFamily: "var(--font-heading)" }}>{s.value}</div>
                <div className="text-[13px] text-refold-text-secondary">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white" id="domains">
        <div className="max-w-[1280px] mx-auto">

          {/* Label */}
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-[#D97706]">
              <Shield className="w-3.5 h-3.5" /> THE PROBLEM
            </span>
          </div>

          {/* Heading with blue accents */}
          <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold text-refold-text-dark text-center leading-[1.2] max-w-[900px] mx-auto mb-10 px-6">
            AI bias is invisible. Until it isn&apos;t.{" "}
            <span className="text-[#1D5FDB]">Hiring</span>,{" "}
            <span className="text-[#1D5FDB]">Lending</span> or{" "}
            <span className="text-[#1D5FDB]">Healthcare</span>
          </h2>

          {/* Horizontal rule */}
          <hr className="border-t border-[#E5E7EB] mx-20 mb-0" />

          {/* Row 1: First 3 domains */}
          <div className="grid grid-cols-1 md:grid-cols-3 relative mx-8 md:mx-20 py-12">
            {/* Colored vertical dividers */}
            <div className="hidden md:block absolute left-[33.33%] top-10 bottom-10 w-1 rounded-full bg-[#6EE7B7]" style={{ transform: "translateX(-50%)" }} />
            <div className="hidden md:block absolute left-[66.66%] top-10 bottom-10 w-1 rounded-full bg-[#93C5FD]" style={{ transform: "translateX(-50%)" }} />
            <div className="hidden md:block absolute right-0 top-10 bottom-10 w-1 rounded-full bg-[#FCA5A5]" />

            {domains.slice(0, 3).map((d) => (
              <div key={d.title} className="px-6 md:px-10">
                <div className="w-12 h-12 bg-[#111111] rounded-lg flex items-center justify-center mb-10 text-white">
                  {d.icon}
                </div>
                <h3 className="text-[18px] font-bold text-refold-text-dark mb-3" style={{ fontFamily: "var(--font-heading)" }}>{d.title}</h3>
                <p className="text-[14px] leading-[1.65] text-refold-text-secondary mb-4">{d.body}</p>
                <div className="bg-[#F9FAFB] border-l-[3px] border-l-[#F59E0B] py-2.5 px-3.5 rounded-r mb-4">
                  <span className="block text-[10px] font-bold tracking-[0.12em] text-[#D97706] mb-1">REAL BIAS FOUND</span>
                  <span className="text-[12px] text-refold-text-secondary leading-snug">{d.example}</span>
                </div>
                <Link href={d.href} className="text-[13px] font-semibold text-[#0D9488] inline-flex items-center gap-1 hover:gap-2 transition-all hover:text-[#0F766E]">
                  Audit this model <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Horizontal rule */}
          <hr className="border-t border-[#E5E7EB] mx-20 mb-0" />

          {/* Row 2: Next 3 domains */}
          <div className="grid grid-cols-1 md:grid-cols-3 relative mx-8 md:mx-20 py-12">
            {/* Colored vertical dividers */}
            <div className="hidden md:block absolute left-[33.33%] top-10 bottom-10 w-1 rounded-full bg-[#6EE7B7]" style={{ transform: "translateX(-50%)" }} />
            <div className="hidden md:block absolute left-[66.66%] top-10 bottom-10 w-1 rounded-full bg-[#93C5FD]" style={{ transform: "translateX(-50%)" }} />
            <div className="hidden md:block absolute right-0 top-10 bottom-10 w-1 rounded-full bg-[#FCA5A5]" />

            {domains.slice(3, 6).map((d) => (
              <div key={d.title} className="px-6 md:px-10">
                <div className="w-12 h-12 bg-[#111111] rounded-lg flex items-center justify-center mb-10 text-white">
                  {d.icon}
                </div>
                <h3 className="text-[18px] font-bold text-refold-text-dark mb-3" style={{ fontFamily: "var(--font-heading)" }}>{d.title}</h3>
                <p className="text-[14px] leading-[1.65] text-refold-text-secondary mb-4">{d.body}</p>
                <div className="bg-[#F9FAFB] border-l-[3px] border-l-[#F59E0B] py-2.5 px-3.5 rounded-r mb-4">
                  <span className="block text-[10px] font-bold tracking-[0.12em] text-[#D97706] mb-1">REAL BIAS FOUND</span>
                  <span className="text-[12px] text-refold-text-secondary leading-snug">{d.example}</span>
                </div>
                <Link href={d.href} className="text-[13px] font-semibold text-[#0D9488] inline-flex items-center gap-1 hover:gap-2 transition-all hover:text-[#0F766E]">
                  Audit this model <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══ SECTION 3: HOW IT WORKS — Sticky Scroll ═══ */}
      <section className="py-24 bg-[#F9FAFB]" id="how-it-works">
        <HiwScroll />
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-[540px] mx-auto mb-16">
            <span className="section-label inline-block mb-4">How It Works</span>
            <h2 className="text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-refold-text-dark">
              Three steps to fairness
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* LEFT — Scrollable steps */}
            <div className="space-y-6" id="hiw-steps">
              {/* Step 1: Upload */}
              <div className="hiw-step bg-white border border-[#E5E7EB] rounded-xl p-8 md:p-10" data-step="0">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#FEF3C7] border border-[#F59E0B]/20 rounded-lg flex items-center justify-center text-[#D97706]">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold tracking-[0.2em] text-[#9CA3AF]">01</span>
                    <h3 className="text-[22px] font-bold text-refold-text-dark" style={{ fontFamily: "var(--font-heading)" }}>Upload</h3>
                  </div>
                </div>
                <p className="text-[15px] text-refold-text-secondary leading-[1.7] mb-4">
                  Drop a CSV or JSON of AI decisions. Hiring, lending, pricing &mdash; any domain. Supports up to 100,000 rows.
                </p>
                <p className="text-[13px] text-refold-text-secondary leading-[1.65]">
                  Your data stays in your browser. Nothing is uploaded to any server. Privacy-first architecture ensures zero data leakage.
                </p>
              </div>

              {/* Step 2: Analyze */}
              <div className="hiw-step bg-white border border-[#E5E7EB] rounded-xl p-8 md:p-10" data-step="1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#FEF3C7] border border-[#F59E0B]/20 rounded-lg flex items-center justify-center text-[#D97706]">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold tracking-[0.2em] text-[#9CA3AF]">02</span>
                    <h3 className="text-[22px] font-bold text-refold-text-dark" style={{ fontFamily: "var(--font-heading)" }}>Analyze</h3>
                  </div>
                </div>
                <p className="text-[15px] text-refold-text-secondary leading-[1.7] mb-4">
                  FairGuard computes 5 fairness metrics, detects proxy variables, and maps legal exposure across India DPDP Act, EU AI Act and US EEOC.
                </p>
                <p className="text-[13px] text-refold-text-secondary leading-[1.65]">
                  Generates a fairness score out of 100, identifies affected populations, and calculates potential liability in rupees, euros, and dollars.
                </p>
              </div>

              {/* Step 3: Act */}
              <div className="hiw-step bg-white border border-[#E5E7EB] rounded-xl p-8 md:p-10" data-step="2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#FEF3C7] border border-[#F59E0B]/20 rounded-lg flex items-center justify-center text-[#D97706]">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold tracking-[0.2em] text-[#9CA3AF]">03</span>
                    <h3 className="text-[22px] font-bold text-refold-text-dark" style={{ fontFamily: "var(--font-heading)" }}>Act</h3>
                  </div>
                </div>
                <p className="text-[15px] text-refold-text-secondary leading-[1.7] mb-4">
                  Get plain-English explanations, a 6-axis Bias Fingerprint, and concrete remediation steps. Know exactly what to fix and how.
                </p>
                <p className="text-[13px] text-refold-text-secondary leading-[1.65]">
                  Send it to Gemini with different names representing different demographics. Then analyze what comes back for bias patterns.
                </p>
              </div>
            </div>

            {/* RIGHT — Sticky image panel */}
            <div className="hidden md:block">
              <div className="sticky top-28" id="hiw-panel" style={{ transform: "scale(0.85)", transformOrigin: "top right", maxHeight: "80vh" }}>
                {/* Upload mockup */}
                <div className="hiw-image active rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)]" data-panel="0">
                  <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-5 py-3 flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-[10px] h-[10px] rounded-full bg-[#FF5F57]" />
                      <span className="w-[10px] h-[10px] rounded-full bg-[#FFBD2E]" />
                      <span className="w-[10px] h-[10px] rounded-full bg-[#28C840]" />
                    </div>
                    <span className="flex-1 text-center text-[11px] text-refold-text-secondary" style={{ fontFamily: "var(--font-geist-mono)" }}>fairguard.ai/audit</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-4 h-4 text-[#F59E0B]" />
                      <span className="text-[15px] font-bold text-refold-text-dark">Audit Mode</span>
                    </div>
                    <div className="text-[11px] text-refold-text-secondary mb-5">Upload any dataset (CSV or JSON) → detect bias → get explanations → understand legal risk</div>
                    <div className="flex items-center gap-6 mb-6 text-[11px]">
                      <span className="flex items-center gap-2 text-[#D97706] font-semibold"><Upload className="w-3.5 h-3.5" /> Upload</span>
                      <span className="text-[#9CA3AF]">— Configure</span>
                      <span className="text-[#9CA3AF]">— Analyzing</span>
                      <span className="text-[#9CA3AF]">— Results</span>
                    </div>
                    <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl py-8 text-center bg-[#FAFAFA]">
                      <Upload className="w-8 h-8 text-[#D1D5DB] mx-auto mb-3" />
                      <div className="text-[14px] font-semibold text-refold-text-secondary mb-1">Drag & drop a CSV or JSON file</div>
                      <div className="text-[11px] text-[#9CA3AF]">Up to 100,000 rows • Your data stays in your browser</div>
                    </div>
                    <div className="text-center mt-5 text-[12px] text-refold-text-secondary">Or try with a demo dataset:</div>
                    <div className="flex justify-center gap-2 mt-2 flex-wrap">
                      {["Hiring Bias (CSV)", "Lending (JSON)", "Content Moderation"].map(d => (
                        <span key={d} className="px-3 py-1.5 border border-[#E5E7EB] rounded-md text-[11px] text-refold-text-secondary cursor-pointer hover:border-[#F59E0B] hover:bg-[#FEF3C7] transition">{d}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Analyze mockup — Fairness Debt Report */}
                <div className="hiw-image rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08)]" data-panel="1" style={{ display: "none" }}>
                  <div className="bg-[#0C0E12] border border-[#252932] rounded-2xl overflow-hidden" style={{ fontFamily: "var(--font-geist-mono)" }}>
                    <div className="bg-[#EF4444]/10 border-b border-[#EF4444]/20 px-6 py-3.5">
                      <span className="text-[12px] font-bold tracking-[0.08em] text-[#FCA5A5]">FAIRNESS DEBT REPORT</span>
                    </div>
                    <div className="px-6 py-6 border-b border-[#252932]">
                      <span className="block text-[10px] tracking-[0.15em] text-refold-text-secondary mb-2">FAIRNESS SCORE</span>
                      <span className="text-[36px] font-black text-[#EF4444] leading-none" style={{ fontFamily: "var(--font-heading)" }}>43<span className="text-[16px] text-refold-text-secondary">/100</span></span>
                    </div>
                    <div className="px-6 py-4 border-b border-[#252932]">
                      <div className="flex justify-between text-[13px] py-1.5 text-refold-text-secondary">
                        <span>People Affected</span>
                        <span className="text-refold-text-primary font-semibold">~2,300 applicants</span>
                      </div>
                    </div>
                    <div className="px-6 py-5 border-b border-[#252932]">
                      <span className="block text-[10px] tracking-[0.15em] text-[#FCD34D] font-semibold mb-3.5">LEGAL EXPOSURE</span>
                      {[
                        { reg: "India DPDP Act", amount: "\u20b92.5 Cr", color: "text-[#FCA5A5]" },
                        { reg: "EU AI Act", amount: "\u20ac8M", color: "text-[#FCA5A5]" },
                        { reg: "US EEOC", amount: "$185K", color: "text-[#FCD34D]" },
                      ].map((r) => (
                        <div key={r.reg} className="flex justify-between items-center py-2 text-[13px] text-refold-text-secondary border-b border-white/[0.04] last:border-0">
                          <span>{r.reg}</span>
                          <span className={`font-extrabold text-[15px] ${r.color}`} style={{ fontFamily: "var(--font-heading)" }}>{r.amount}</span>
                        </div>
                      ))}
                    </div>
                    <div className="px-6 py-4 bg-[#10B981]/6">
                      <span className="text-[12px] text-[#6EE7B7] font-semibold">Cost of fix = &lt;0.1% of legal risk</span>
                    </div>
                  </div>
                </div>

                {/* Act mockup — LLM Probe code */}
                <div className="hiw-image rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08)]" data-panel="2" style={{ display: "none" }}>
                  <div className="bg-[#0C0E12] border border-[#252932] rounded-2xl overflow-hidden">
                    <div className="px-4 py-3 bg-[#1C2029] border-b border-[#252932] flex justify-between items-center">
                      <span className="text-[12px] text-refold-text-secondary" style={{ fontFamily: "var(--font-geist-mono)" }}>llm_probe.py</span>
                      <span className="flex items-center gap-1.5 text-[11px] text-refold-text-secondary">
                        <span className="w-[7px] h-[7px] rounded-full bg-[#F59E0B] animate-pulse" /> Analyzing...
                      </span>
                    </div>
                    <div
                      className="px-4 py-4 text-[11px] leading-[1.7] text-[#E2E8F0] overflow-x-auto whitespace-pre"
                      style={{ fontFamily: "var(--font-geist-mono)" }}
                      dangerouslySetInnerHTML={{
                        __html: `<span style="color:#6B7280"># FairGuard LLM Probe</span>
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
                    {/* Results mini-table */}
                    <div className="border-t border-[#252932]">
                      <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2.5 bg-[#1C2029] text-[10px] font-semibold tracking-[0.12em] uppercase text-refold-text-secondary">
                        <span>Name</span>
                        <span>Power Adj</span>
                        <span>Status</span>
                      </div>
                      {[
                        { name: "Brian", pct: "73%", color: "text-[#EF4444]", status: "Biased" },
                        { name: "Anjali", pct: "31%", color: "text-[#6EE7B7]", status: "Biased" },
                        { name: "Kwame", pct: "28%", color: "text-[#6EE7B7]", status: "Biased" },
                      ].map((r) => (
                        <div key={r.name} className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2.5 border-t border-[#252932] items-center text-[12px] text-refold-text-primary">
                          <span>{r.name}</span>
                          <span className={`font-bold ${r.color}`}>{r.pct}</span>
                          <span className="text-[9px] font-semibold tracking-[0.08em] px-2 py-0.5 rounded-full border bg-[#EF4444]/12 text-[#FCA5A5] border-[#EF4444]/20">{r.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
              <h2 className="text-[clamp(30px,3vw,44px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-refold-text-primary mb-5">
                Every biased system leaves a unique shape.
              </h2>
              <p className="text-[16px] text-refold-text-secondary leading-[1.7] mb-9">
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
                      <div className="text-[14px] font-semibold text-refold-text-primary">{axis.name}</div>
                      <div className="text-[12px] text-refold-text-secondary">{axis.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — interactive fingerprint panel */}
            <FingerprintToggle />
          </div>
        </div>
      </section>


      {/* ═══ SECTION 7: STRESS TEST FEATURES ═══ */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <span className="section-label inline-block mb-4">Adversarial Testing</span>
            <h2 className="text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-refold-text-dark mb-4">
              Stress-test before your AI ships
            </h2>
            <p className="text-[16px] text-refold-text-secondary leading-[1.65]">
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
                <h3 className="text-[16px] font-bold text-refold-text-dark mb-2" style={{ fontFamily: "var(--font-heading)" }}>{f.title}</h3>
                <p className="text-[14px] text-refold-text-secondary leading-[1.65]">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/stress" className="inline-flex items-center justify-center font-bold px-6 py-3 transition-all duration-300 bg-[#0057ff] text-[#ffffff] hover:shadow-[0_0_20px_rgba(0,87,255,0.4)] group rounded-md">
              <span className="mr-2 text-white">
                <Zap className="w-4 h-4" />
              </span>
              <span className="text-[12px] tracking-[0.12em] uppercase text-white">
                RUN STRESS TEST
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 8: FINAL CTA — Refold split layout ═══ */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid md:grid-cols-2 min-h-[380px]">
          {/* Left — Content */}
          <div className="py-20 md:py-24 pr-8 flex flex-col justify-center">
            <h2 className="text-[clamp(30px,3.5vw,48px)] font-extrabold leading-[1.12] tracking-[-0.02em] text-refold-text-dark mb-5" style={{ fontFamily: "var(--font-heading)" }}>
              AI <span className="text-[#0D9488] italic">Fairness Audit</span> for{" "}
              <br className="hidden md:block" />
              Every System
            </h2>
            <p className="text-[16px] text-refold-text-secondary leading-[1.7] mb-8 max-w-[460px]">
              FairGuard is the bias firewall for modern AI. Trained on real-world fairness patterns across hiring, lending, and content moderation, it detects discrimination in seconds instead of months.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/audit" className="inline-flex items-center justify-center font-bold px-6 py-3 transition-all duration-300 bg-[#0057ff] text-[#ffffff] hover:shadow-[0_0_20px_rgba(0,87,255,0.4)] group rounded-md">
                <span className="mr-2 text-white">
                  <ArrowRight className="w-4 h-4" />
                </span>
                <span className="text-[12px] tracking-[0.12em] uppercase text-white">
                  RUN FREE AUDIT
                </span>
              </Link>
              <Link href="#how-it-works" className="inline-flex items-center justify-center px-6 py-3 transition-all duration-300 bg-[#191b20] text-[#f5f3ee] border border-[#eaeaea]/20 hover:bg-[#2e3139] rounded-md font-mono text-[12px] tracking-[0.1em] uppercase">
                SEE HOW IT WORKS
              </Link>
            </div>
          </div>

          {/* Right — Horizontal gradient strips */}
          <div className="relative hidden md:block overflow-hidden">
            <div className="absolute inset-0 flex flex-col">
              {[38, 30, 42, 25, 48, 20, 44, 32, 50, 28, 46, 35, 40, 22, 52, 26].map((offset, i) => (
                <div
                  key={i}
                  className="flex-1 w-full"
                  style={{
                    background: `linear-gradient(to right, transparent ${offset}%, #2563EB ${offset + 15}%, #04cfff ${offset + 40}%, #d8ff70 100%)`,
                  }}
                />
              ))}
            </div>
          </div>
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
                <span className="text-[15px] font-bold text-refold-text-dark" style={{ fontFamily: "var(--font-heading)" }}>FairGuard</span>
              </div>
              <p className="text-[14px] text-refold-text-secondary leading-[1.65] max-w-[260px]">
                The bias firewall for AI. Find discrimination before it finds your users.
              </p>
            </div>

            {/* Tools */}
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#9CA3AF] mb-5">Tools</h4>
              <div className="flex flex-col gap-3">
                <Link href="/audit" className="text-[14px] text-refold-text-secondary hover:text-refold-text-dark transition-colors">Bias Audit</Link>
                <Link href="/shield" className="text-[14px] text-refold-text-secondary hover:text-refold-text-dark transition-colors">Shield Mode</Link>
                <Link href="/stress" className="text-[14px] text-refold-text-secondary hover:text-refold-text-dark transition-colors">Stress Test</Link>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#9CA3AF] mb-5">Resources</h4>
              <div className="flex flex-col gap-3">
                <Link href="/history" className="text-[14px] text-refold-text-secondary hover:text-refold-text-dark transition-colors">Audit History</Link>
                <Link href="#domains" className="text-[14px] text-refold-text-secondary hover:text-refold-text-dark transition-colors">Supported Domains</Link>
                <Link href="#how-it-works" className="text-[14px] text-refold-text-secondary hover:text-refold-text-dark transition-colors">How It Works</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#9CA3AF] mb-5">Legal Frameworks</h4>
              <div className="flex flex-col gap-3 text-[14px] text-refold-text-secondary">
                <span>EU AI Act</span>
                <span>India DPDP Act</span>
                <span>US EEOC Guidelines</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E5E7EB] flex items-center justify-between flex-wrap gap-4">
            <span className="text-[13px] text-refold-text-secondary">&copy; 2026 FairGuard. AI fairness, simplified.</span>
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
