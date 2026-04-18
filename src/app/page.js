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
    iconBg: "bg-gray-50",
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
    iconBg: "bg-gray-50",
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
      <section className="sm:h-[450px] h-[550px] w-full bg-white flex relative overflow-x-clip">
        {/* ── LEFT: Staggered Stripes (Flipped) ── */}
        <motion.div
          animate={{ x: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:flex flex-col absolute top-[-100px] -left-[10%] h-[700px] w-[30%] xl:w-[35%] scale-x-[-1] opacity-80 pointer-events-none"
        >
          {stripeOffsets.map((offset, i) => (
            <div
              key={`left-${i}`}
              className="stripe-hover-effect"
              style={{
                width: "120%",
                height: "50px",
                background: "linear-gradient(to right, #2563EB 0%, #04cfff 60%, #caff3d 85%, transparent 100%)",
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
              <span className="w-2 h-2 rounded-full bg-[#caff3d] animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#000000] font-mono">
                AI Fairness Auditor
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-2 text-center text-balance max-w-[800px] text-black"
            >
              Find the bias <span className="relative inline-block">
                <span>hiding</span>
                <span className="absolute bottom-1 left-0 right-0 h-1.5 bg-[#caff3d] opacity-40 rounded-sm -z-10" />
              </span> in your AI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="body-md text-center text-black max-w-[580px] text-balance"
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
            {/* Primary Action — split block style */}
            <Link href="/audit"
              className="inline-flex items-stretch rounded-md overflow-hidden font-bold transition-all duration-150 hover:shadow-lg group">
              <span className="bg-[#caff3d] px-3 flex items-center justify-center group-hover:bg-[#d4ff5c] transition-colors">
                <ArrowRight className="w-4 h-4 text-black" />
              </span>
              <span className="bg-black text-white text-[12px] font-bold tracking-[0.12em] uppercase px-6 py-3 flex items-center gap-2 group-hover:bg-[#1a1a1a] transition-colors">
                RUN FREE AUDIT
              </span>
            </Link>

            {/* Secondary Action */}
            <Link href="#how-it-works"
              className="inline-flex items-stretch rounded-md overflow-hidden font-bold transition-all duration-150 hover:shadow-md group">
              <span className="bg-[#F3F4F6] px-3 flex items-center justify-center group-hover:bg-[#E5E7EB] transition-colors border border-[#E5E7EB] border-r-0">
                <Search className="w-4 h-4 text-black" />
              </span>
              <span className="bg-white text-black text-[12px] font-bold tracking-[0.1em] uppercase px-6 py-3 flex items-center border border-[#E5E7EB] border-l-0 group-hover:bg-[#F9FAFB] transition-colors">
                SEE HOW IT WORKS
              </span>
            </Link>
          </motion.div>
        </div>

        {/* ── RIGHT: Staggered Stripes ── */}
        <motion.div
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="hidden lg:flex flex-col absolute top-[-100px] -right-[10%] h-[700px] w-[30%] xl:w-[35%] opacity-80 pointer-events-none"
        >
          {stripeOffsets.map((offset, i) => (
            <div
              key={`right-${i}`}
              className="stripe-hover-effect"
              style={{
                width: "120%",
                height: "50px",
                background: "linear-gradient(to right, #2563EB 0%, #04cfff 60%, #caff3d 85%, transparent 100%)",
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
                  <div className="absolute left-0 top-[20%] bottom-[20%] w-px bg-gray-100" />
                )}
                <div className="text-[28px] font-extrabold text-[#000000] leading-none mb-2" style={{ fontFamily: "var(--font-heading)" }}>{s.value}</div>
                <div className="text-[13px] text-[#4B5563]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-20 pb-4 bg-white" id="domains">
        <div className="max-w-[1280px] mx-auto">

          {/* Label */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 text-[13px] font-bold tracking-[0.15em] uppercase text-[#000000]">
              <Shield className="w-4 h-4" /> THE PROBLEM
            </span>
          </div>

          {/* Heading with blue accents */}
          <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold text-[#000000] text-center leading-[1.2] max-w-[900px] mx-auto mb-10 px-6">
            AI bias is invisible. Until it isn&apos;t.{" "}
            <span className="text-[#1D5FDB]">Hiring</span>,{" "}
            <span className="text-[#1D5FDB]">Lending</span> or{" "}
            <span className="text-[#1D5FDB]">Healthcare</span>
          </h2>

          {/* Horizontal rule */}
          <hr className="border-t border-[#E5E7EB] mx-20 mb-0" />

          {/* Row 1: First 3 domains */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-[#EAEAEA] mx-8 md:mx-20">
            {domains.slice(0, 3).map((d, idx) => {
              const gradients = [
                { bar: "linear-gradient(180deg,#A6FFE1,#DCFFE2 60.1%)", iconBg: "bg-gray-50", iconColor: "#3DC784" },
                { bar: "linear-gradient(180deg,#A9DFFF,#E8FBF9 60.1%)", iconBg: "bg-gray-50", iconColor: "#0057ff" },
                { bar: "linear-gradient(180deg,#FFC8BC 39.9%,#FFEECD)",  iconBg: "bg-red-50",  iconColor: "#F23E11" },
              ];
              const g = gradients[idx];
              return (
                <div key={d.title} className={`flex w-full h-[250px] lg:h-[300px] pl-8 ${idx < 2 ? "border-r" : ""} border-[#EAEAEA]`}>
                  <div className="flex flex-col gap-10 w-full py-8">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${g.iconBg} border border-[#E5E7EB]`}>
                          <span style={{ color: g.iconColor }}>{d.icon}</span>
                        </div>
                        {d.isNew && (
                          <span className="text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full bg-[#caff3d]/20 text-[#000000] border border-[#caff3d]/40">New</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col justify-between font-sans gap-2 w-fit h-fit">
                        <h3 className="text-[17px] font-bold text-[#000000] leading-tight">{d.title}</h3>
                        <div className="text-[13px] text-[#4B5563] leading-[1.6] max-w-[240px]">{d.body}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-6 h-full flex-shrink-0">
                    <div className="flex flex-col h-[60%]" style={{ backgroundImage: g.bar }} />
                    <div className="flex flex-col h-[40%]" style={{ backgroundImage: g.bar, opacity: 0.5 }} />
                  </div>
                </div>
              );
            })}
          </div>


          {/* Row 2: Next 3 domains */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-[#EAEAEA] mx-8 md:mx-20 mt-0">
            {domains.slice(3, 6).map((d, idx) => {
              const gradients = [
                { bar: "linear-gradient(180deg,#F23E11,#FAA4DF)",    iconBg: "bg-red-50",    iconColor: "#F23E11" },
                { bar: "linear-gradient(180deg,#FEB73E,#FFF9D4)",    iconBg: "bg-amber-50",  iconColor: "#ff8c42" },
                { bar: "linear-gradient(180deg,#CFB6FF 39.9%,#FFD37F)", iconBg: "bg-purple-50", iconColor: "#9a77f8" },
              ];
              const g = gradients[idx];
              return (
                <div key={d.title} className={`flex w-full h-[250px] lg:h-[300px] pl-8 ${idx < 2 ? "border-r" : ""} border-[#EAEAEA]`}>
                  <div className="flex flex-col gap-10 w-full py-8">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${g.iconBg} border border-[#E5E7EB]`}>
                          <span style={{ color: g.iconColor }}>{d.icon}</span>
                        </div>
                        {d.isNew && (
                          <span className="text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full bg-[#caff3d]/20 text-[#000000] border border-[#caff3d]/40">New</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col justify-between font-sans gap-2 w-fit h-fit">
                        <h3 className="text-[17px] font-bold text-[#000000] leading-tight">{d.title}</h3>
                        <div className="text-[13px] text-[#4B5563] leading-[1.6] max-w-[240px]">{d.body}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-6 h-full flex-shrink-0">
                    <div className="flex flex-col h-[60%]" style={{ backgroundImage: g.bar }} />
                    <div className="flex flex-col h-[40%]" style={{ backgroundImage: g.bar, opacity: 0.5 }} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ═══ SECTION BREAK ═══ */}
      <div className="w-full max-w-[1280px] mx-auto bg-white hidden md:block">
        <hr className="border-t border-[#E5E7EB] mx-8 md:mx-20 m-0" />
      </div>

      {/* ═══ SECTION 3: HOW IT WORKS — Refold Continuous Sticky Scroll ═══ */}
      <section className="bg-white" id="how-it-works">
        <HiwScroll />

        {/* Header row — bordered like refold */}
        <div className="border-b border-[#EAEAEA] flex items-center px-6 sm:px-32">
          <div className="flex border-l border-r w-full justify-center border-[#EAEAEA] py-16">
            <div className="flex flex-col gap-4 items-center">
              <span className="section-label inline-block">How It Works</span>
              <h2 className="text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#000000] text-center">
                Three steps to fairness
              </h2>
            </div>
          </div>
        </div>

        {/* Main grid row */}
        <div className="border-b border-[#EAEAEA] flex items-start px-6 sm:px-32">
          <div className="grid grid-cols-1 xl:grid-cols-[41%_59%] w-full relative border-l border-r border-[#EAEAEA]">

            {/* LEFT — Continuous stacked steps (no gap) */}
            <div>
              {/* Step 1: Upload */}
              <div
                className="hiw-step flex xl:h-[500px] flex-col sm:px-8 sm:py-4 p-0 gap-4 transition-all duration-700 ease-in-out bg-white border-[#EAEAEA] border-b"
                data-step="0"
              >
                <div className="flex flex-col sm:p-0 p-6 xl:gap-0 gap-10 sm:items-start items-center justify-between h-full py-8">
                  <div className="flex flex-col gap-6 w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-[44px] h-[44px] bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-center text-[#000000] shadow-sm flex-shrink-0">
                        <Upload className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold tracking-[0.2em] text-[#9CA3AF] mb-0.5">01</span>
                        <h3 className="text-[26px] font-extrabold text-[#000000] leading-none" style={{ fontFamily: "var(--font-heading)" }}>Upload</h3>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3.5">
                      <div className="flex flex-row items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB] mt-2 flex-shrink-0" />
                        <p className="text-[14px] text-[#64748B] leading-[1.65]">Drop a CSV or JSON of AI decisions. Hiring, lending, pricing — any domain. Supports up to 100,000 rows.</p>
                      </div>
                      <div className="flex flex-row items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB] mt-2 flex-shrink-0" />
                        <p className="text-[14px] text-[#64748B] leading-[1.65]">Your data stays in your browser. Nothing is uploaded to any server. Privacy-first architecture ensures zero data leakage.</p>
                      </div>
                    </div>
                  </div>
                  {/* Mobile gradient strip */}
                  <div className="h-[300px] relative w-full block xl:hidden mt-4 overflow-hidden">
                    <div className="h-full flex flex-row">
                      {[15,25,35,45,55,65].map((stop, i) => (
                        <div key={i} className="flex-1 h-full" style={{ background: `linear-gradient(rgb(202,255,61) 0%, rgb(4,207,255) ${stop}%, rgb(4,207,255) ${stop+10}%, rgb(202,255,61) 100%)` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Analyze */}
              <div
                className="hiw-step flex xl:h-[500px] flex-col sm:px-8 sm:py-4 p-0 gap-4 transition-all duration-700 ease-in-out bg-white border-[#EAEAEA] border-b"
                data-step="1"
              >
                <div className="flex flex-col sm:p-0 p-6 xl:gap-0 gap-10 sm:items-start items-center justify-between h-full py-8">
                  <div className="flex flex-col gap-6 w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-[44px] h-[44px] bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-center text-[#000000] shadow-sm flex-shrink-0">
                        <Cpu className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold tracking-[0.2em] text-[#9CA3AF] mb-0.5">02</span>
                        <h3 className="text-[26px] font-extrabold text-[#000000] leading-none" style={{ fontFamily: "var(--font-heading)" }}>Analyze</h3>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3.5">
                      <div className="flex flex-row items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB] mt-2 flex-shrink-0" />
                        <p className="text-[14px] text-[#64748B] leading-[1.65]">FairGuard computes 5 fairness metrics, detects proxy variables, and maps legal exposure across India DPDP Act, EU AI Act and US EEOC.</p>
                      </div>
                      <div className="flex flex-row items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB] mt-2 flex-shrink-0" />
                        <p className="text-[14px] text-[#64748B] leading-[1.65]">Generates a fairness score out of 100, identifies affected populations, and calculates potential liability in rupees, euros, and dollars.</p>
                      </div>
                      <div className="flex flex-row items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB] mt-2 flex-shrink-0" />
                        <p className="text-[14px] text-[#64748B] leading-[1.65]">Statistical significance testing ensures results are reliable, not noise. Confidence intervals are shown alongside every metric.</p>
                      </div>
                    </div>
                  </div>
                  {/* Mobile gradient strip */}
                  <div className="h-[300px] relative w-full block xl:hidden mt-4 overflow-hidden">
                    <div className="h-full flex flex-row">
                      {[15,25,35,45,55,65].map((stop, i) => (
                        <div key={i} className="flex-1 h-full" style={{ background: `linear-gradient(rgb(255,249,212) 0%, rgb(254,183,62) ${stop}%, rgb(254,183,62) ${stop+10}%, rgb(255,249,212) 100%)` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Act */}
              <div
                className="hiw-step flex xl:h-[500px] flex-col sm:px-8 sm:py-4 p-0 gap-4 transition-all duration-700 ease-in-out bg-[#F7F7F9] border-[#EAEAEA]"
                data-step="2"
              >
                <div className="flex flex-col sm:p-0 p-6 xl:gap-0 gap-10 sm:items-start items-center justify-between h-full py-8">
                  <div className="flex flex-col gap-6 w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-[44px] h-[44px] bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-center text-[#000000] shadow-sm flex-shrink-0">
                        <Scale className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold tracking-[0.2em] text-[#9CA3AF] mb-0.5">03</span>
                        <h3 className="text-[26px] font-extrabold text-[#000000] leading-none" style={{ fontFamily: "var(--font-heading)" }}>Act</h3>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3.5">
                      <div className="flex flex-row items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#caff3d] mt-2 flex-shrink-0" />
                        <p className="text-[14px] text-[#64748B] leading-[1.65]">Get plain-English explanations, a 6-axis Bias Fingerprint, and concrete remediation steps. Know exactly what to fix and how.</p>
                      </div>
                      <div className="flex flex-row items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#caff3d] mt-2 flex-shrink-0" />
                        <p className="text-[14px] text-[#64748B] leading-[1.65]">Send it to Gemini with different names representing different demographics. Then analyze what comes back for bias patterns.</p>
                      </div>
                      <div className="flex flex-row items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#caff3d] mt-2 flex-shrink-0" />
                        <p className="text-[14px] text-[#64748B] leading-[1.65]">Export your full audit report as a PDF, shareable link, or structured JSON for engineering teams.</p>
                      </div>
                    </div>
                  </div>
                  {/* Mobile gradient strip */}
                  <div className="h-[300px] relative w-full block xl:hidden mt-4 overflow-hidden">
                    <div className="h-full flex flex-row">
                      {[15,25,35,45,55,65].map((stop, i) => (
                        <div key={i} className="flex-1 h-full" style={{ background: `linear-gradient(rgb(4,207,255) 0%, rgb(0,87,255) ${stop}%, rgb(0,87,255) ${stop+10}%, rgb(4,207,255) 100%)` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — driven by HiwScroll JS — ONE sticky wrapper, panels absolute inside */}
            <div className="hidden xl:block relative" id="hiw-right-col">
              <div className="sticky top-[80px] h-[500px] relative" id="hiw-sticky-panel">
                {/* ── Panel 0: Upload — Lime→Cyan gradient + upload mockup ── */}
                <div className="hiw-image absolute inset-0 overflow-hidden" data-panel="0">
                  {/* Gradient strips */}
                  <div className="absolute inset-0 flex flex-row">
                    {[15,22,30,38,46,54].map((stop, i) => (
                      <div key={i} className="flex-1 h-full" style={{ background: `linear-gradient(rgb(220,255,226) 0%, rgb(166,255,225) ${stop}%, rgb(166,255,225) ${stop+10}%, rgb(220,255,226) 100%)` }} />
                    ))}
                  </div>
                  {/* Mockup overlay */}
                  <div className="absolute inset-0 flex items-center justify-center p-8 z-10">
                    <div className="w-full max-w-[420px] bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                      <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-5 py-3 flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <span className="w-[10px] h-[10px] rounded-full bg-[#FF5F57]" />
                          <span className="w-[10px] h-[10px] rounded-full bg-[#FFBD2E]" />
                          <span className="w-[10px] h-[10px] rounded-full bg-[#28C840]" />
                        </div>
                        <span className="flex-1 text-center text-[11px] text-[#4B5563]" style={{ fontFamily: "var(--font-geist-mono)" }}>fairguard.ai/audit</span>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="w-4 h-4 text-[#caff3d]" />
                          <span className="text-[14px] font-bold text-[#000000]">Audit Mode</span>
                        </div>
                        <div className="text-[11px] text-[#4B5563] mb-4">Upload any dataset → detect bias → understand legal risk</div>
                        <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl py-7 text-center bg-[#FAFAFA]">
                          <Upload className="w-7 h-7 text-[#D1D5DB] mx-auto mb-2" />
                          <div className="text-[13px] font-semibold text-[#4B5563] mb-1">Drag & drop a CSV or JSON file</div>
                          <div className="text-[10px] text-[#9CA3AF]">Up to 100,000 rows • Privacy-first</div>
                        </div>
                        <div className="flex justify-center gap-2 mt-3 flex-wrap">
                          {["Hiring Bias", "Lending", "Content Mod"].map(d => (
                            <span key={d} className="px-2.5 py-1 border border-[#E5E7EB] text-[10px] text-[#4B5563] cursor-pointer hover:border-[#caff3d] transition">{d}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Panel 1: Analyze — Amber gradient + fairness debt report ── */}
                <div className="hiw-image absolute inset-0 overflow-hidden" data-panel="1" style={{ opacity: 0 }}>
                  {/* Gradient strips */}
                  <div className="absolute inset-0 flex flex-row">
                    {[15,25,35,45,55,65].map((stop, i) => (
                      <div key={i} className="flex-1 h-full" style={{ background: `linear-gradient(rgb(232,251,249) 0%, rgb(169,223,255) ${stop}%, rgb(169,223,255) ${stop+10}%, rgb(232,251,249) 100%)` }} />
                    ))}
                  </div>
                  {/* Mockup overlay */}
                  <div className="absolute inset-0 flex items-center justify-center p-8 z-10">
                    <div className="w-full max-w-[380px] bg-[#0C0E12] rounded-2xl overflow-hidden border border-[#252932] shadow-[0_20px_60px_rgba(0,0,0,0.3)]" style={{ fontFamily: "var(--font-geist-mono)" }}>
                      <div className="bg-[#EF4444]/10 border-b border-[#EF4444]/20 px-5 py-3">
                        <span className="text-[11px] font-bold tracking-[0.08em] text-[#FCA5A5]">FAIRNESS DEBT REPORT</span>
                      </div>
                      <div className="px-5 py-4 border-b border-[#252932]">
                        <span className="block text-[9px] tracking-[0.15em] text-[#64748b] mb-1">FAIRNESS SCORE</span>
                        <span className="text-[32px] font-black text-[#ff6b7a] leading-none">43<span className="text-[14px] text-[#64748b]">/100</span></span>
                      </div>
                      <div className="px-5 py-3 border-b border-[#252932]">
                        <span className="block text-[9px] tracking-[0.15em] text-[#FCD34D] font-semibold mb-2">LEGAL EXPOSURE</span>
                        {[
                          { reg: "India DPDP Act", amount: "₹2.5 Cr", color: "#ff6b7a" },
                          { reg: "EU AI Act", amount: "€8M", color: "#ff6b7a" },
                          { reg: "US EEOC", amount: "$185K", color: "#FCD34D" },
                        ].map((r) => (
                          <div key={r.reg} className="flex justify-between items-center py-1.5 text-[12px] border-b border-[#252932] last:border-0">
                            <span className="text-[#9CA3AF]">{r.reg}</span>
                            <span className="font-extrabold" style={{ color: r.color }}>{r.amount}</span>
                          </div>
                        ))}
                      </div>
                      <div className="px-5 py-3 bg-[#04cfff]/10">
                        <span className="text-[11px] text-[#04cfff] font-semibold">Cost of fix = &lt;0.1% of legal risk</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Panel 2: Act — Blue→Cyan gradient + LLM probe code ── */}
                <div className="hiw-image absolute inset-0 overflow-hidden" data-panel="2" style={{ opacity: 0 }}>
                  {/* Gradient strips */}
                  <div className="absolute inset-0 flex flex-row">
                    {[15,22,30,38,46,54].map((stop, i) => (
                      <div key={i} className="flex-1 h-full" style={{ background: `linear-gradient(rgb(255,238,205) 0%, rgb(255,200,188) ${stop}%, rgb(255,200,188) ${stop+10}%, rgb(255,238,205) 100%)` }} />
                    ))}
                  </div>
                  {/* Mockup overlay */}
                  <div className="absolute inset-0 flex items-center justify-center p-8 z-10">
                    <div className="w-full max-w-[420px] bg-[#0C0E12] rounded-2xl overflow-hidden border border-[#252932] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                      <div className="px-4 py-3 bg-[#1C2029] border-b border-[#252932] flex justify-between items-center">
                        <span className="text-[11px] text-[#64748b]" style={{ fontFamily: "var(--font-geist-mono)" }}>llm_probe.py</span>
                        <span className="flex items-center gap-1.5 text-[10px] text-[#64748b]">
                          <span className="w-[6px] h-[6px] rounded-full bg-[#F59E0B] animate-pulse" /> Analyzing...
                        </span>
                      </div>
                      <div className="px-4 py-4 text-[11px] leading-[1.7] overflow-x-auto whitespace-pre" style={{ fontFamily: "var(--font-geist-mono)" }}
                        dangerouslySetInnerHTML={{ __html: `<span style="color:#64748b"># FairGuard LLM Probe</span>
<span style="color:#0057ff">template</span> = <span style="color:#04cfff">"Write a review for {name}"</span>
names = [<span style="color:#04cfff">"Brian"</span>, <span style="color:#04cfff">"Anjali"</span>, <span style="color:#04cfff">"Kwame"</span>]

<span style="display:block;background:rgba(4,207,255,0.1);padding:0 4px;margin:0 -4px;color:#0057ff">+ BIAS DETECTED: 2.4x gap in adjectives</span>
<span style="display:block;background:rgba(255,107,122,0.1);padding:0 4px;margin:0 -4px;color:#ff6b7a">- "Brian" -> "demonstrates strong leadership"</span>
<span style="display:block;background:rgba(255,107,122,0.1);padding:0 4px;margin:0 -4px;color:#ff6b7a">- "Anjali" -> "dedicated team player"</span>` }} />
                      <div className="border-t border-[#252932]">
                        <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-2 bg-[#1C2029] text-[9px] font-semibold tracking-[0.12em] uppercase text-[#64748b]">
                          <span>Name</span><span>Power Adj</span><span>Status</span>
                        </div>
                        {[
                          { name: "Brian", pct: "73%", color: "#ff6b7a" },
                          { name: "Anjali", pct: "31%", color: "#0057ff" },
                          { name: "Kwame", pct: "28%", color: "#0057ff" },
                        ].map((r) => (
                          <div key={r.name} className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-2 border-t border-[#252932] items-center text-[11px] text-[#9CA3AF]">
                            <span>{r.name}</span>
                            <span className="font-bold" style={{ color: r.color }}>{r.pct}</span>
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-[#ff6b7a]/10 text-[#ff6b7a]">Biased</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom spacer row like refold */}
        <div className="border-b border-[#EAEAEA] flex items-center px-6 sm:px-32">
          <div className="h-20 border-l border-r border-[#EAEAEA] w-full bg-white" />
        </div>

      </section>

      {/* ═══ SECTION 4: BIAS FINGERPRINT (DARK) ═══ */}
      <section className="relative py-28 bg-[#191b20] overflow-hidden">
        <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(216,255,112,0.06) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            {/* Left text */}
            <div>
              <span className="section-label-dark inline-block mb-5">Bias Fingerprint</span>
              <h2 className="text-[clamp(30px,3vw,44px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-white mb-5">
                Every biased system leaves a unique shape.
              </h2>
              <p className="text-[16px] text-[#9CA3AF] leading-[1.7] mb-9">
                FairGuard renders a 6-axis radar chart &mdash; your AI&apos;s Bias Fingerprint. Each axis measures a different dimension of fairness. The shape tells the story instantly.
              </p>

              <div className="space-y-3.5">
                {[
                  { color: "bg-[#ff6b7a]", name: "Demographic Parity", desc: "Equal outcomes across groups" },
                  { color: "bg-[#caff3d]", name: "Equalized Odds", desc: "Equal error rates across groups" },
                  { color: "bg-[#04cfff]", name: "Individual Fairness", desc: "Similar inputs \u2192 similar outputs" },
                  { color: "bg-[#caff3d]", name: "Intersectional Parity", desc: "Fairness at group intersections" },
                  { color: "bg-[#9a77f8]", name: "Proxy Resistance", desc: "No hidden proxy discrimination" },
                  { color: "bg-[#8B5CF6]", name: "Counterfactual Fairness", desc: "Protected change \u2192 same outcome" },
                ].map((axis) => (
                  <div key={axis.name} className="flex items-start gap-3.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${axis.color} mt-1.5 shrink-0`} />
                    <div>
                      <div className="text-[14px] font-semibold text-white">{axis.name}</div>
                      <div className="text-[12px] text-[#9CA3AF]">{axis.desc}</div>
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
            <h2 className="text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#000000] mb-4">
              Stress-test before your AI ships
            </h2>
            <p className="text-[16px] text-[#4B5563] leading-[1.65]">
              Generate synthetic candidates with identical qualifications but different demographics. Expose how your model discriminates.
            </p>
          </div>

          <div className="grid md:grid-cols-3 border border-[#EAEAEA]">
            {[
              { icon: <Zap className="w-5 h-5" />, title: "Synthetic Candidates", desc: "Gemini generates diverse profiles with controlled qualifications to isolate bias signals.", bar: "linear-gradient(180deg,#A9DFFF,#E8FBF9 60.1%)", iconBg: "bg-blue-50", iconColor: "#0057ff" },
              { icon: <BarChart3 className="w-5 h-5" />, title: "Disparate Impact Analysis", desc: "Computes the 4/5ths rule across every demographic axis with statistical significance.", bar: "linear-gradient(180deg,#A6FFE1,#DCFFE2 60.1%)", iconBg: "bg-green-50", iconColor: "#3DC784" },
              { icon: <AlertTriangle className="w-5 h-5" />, title: "Intersectional Testing", desc: "Finds bias at intersections — e.g., older women in rural areas rejected most.", bar: "linear-gradient(180deg,#FFC8BC 39.9%,#FFEECD)", iconBg: "bg-red-50", iconColor: "#F23E11" },
            ].map((f, idx) => (
              <div key={f.title} className={`flex h-[220px] pl-8 ${idx < 2 ? "border-r" : ""} border-[#EAEAEA]`}>
                <div className="flex flex-col gap-5 w-full py-8">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${f.iconBg} border border-[#E5E7EB] flex-shrink-0`}>
                    <span style={{ color: f.iconColor }}>{f.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#000000] mb-1.5" style={{ fontFamily: "var(--font-heading)" }}>{f.title}</h3>
                    <p className="text-[13px] text-[#4B5563] leading-[1.6] max-w-[240px]">{f.desc}</p>
                  </div>
                </div>
                <div className="flex flex-col w-5 h-full flex-shrink-0">
                  <div className="h-[60%]" style={{ backgroundImage: f.bar }} />
                  <div className="h-[40%]" style={{ backgroundImage: f.bar, opacity: 0.5 }} />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/stress"
              className="inline-flex items-stretch rounded-md overflow-hidden font-bold transition-all duration-150 hover:shadow-lg group">
              <span className="bg-[#caff3d] px-3 flex items-center justify-center group-hover:bg-[#d4ff5c] transition-colors">
                <Zap className="w-4 h-4 text-black" />
              </span>
              <span className="bg-black text-white text-[12px] font-bold tracking-[0.12em] uppercase px-6 py-3 flex items-center gap-2 group-hover:bg-[#1a1a1a] transition-colors">
                RUN STRESS TEST
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 8: FINAL CTA — Refold split layout ═══ */}
      <section className="relative bg-white overflow-hidden min-h-[380px] flex items-center">
        {/* Full-bleed Right Background */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[700px] w-[55%] hidden md:block">
          <motion.div 
            animate={{ x: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute inset-0 flex flex-col justify-center pointer-events-none w-[120%]"
            style={{ transformOrigin: "right" }}
          >
            {stripeOffsets.map((offset, i) => (
              <div
                key={`cta-${i}`}
                className="w-full shrink-0 stripe-hover-effect"
                style={{
                  height: "50px",
                  background: "linear-gradient(to right, #2563EB 0%, #04cfff 30%, #caff3d 45%, transparent 65%)",
                  transform: `translateX(${offset}px) scaleX(-1)`,
                }}
              />
            ))}
          </motion.div>
        </div>

        <div className="max-w-[1200px] w-full mx-auto px-6 md:px-12 grid md:grid-cols-2 relative z-10">
          {/* Left — Content */}
          <div className="py-20 md:py-24 pr-8 flex flex-col justify-center">
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="text-[clamp(30px,3.5vw,48px)] font-extrabold leading-[1.12] tracking-[-0.02em] text-[#000000] mb-5" style={{ fontFamily: "var(--font-heading)" }}>
              AI <span className="text-[#04cfff] italic">Fairness Audit</span> for{" "}
              <br className="hidden md:block" />
              Every System
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[16px] text-[#4B5563] leading-[1.7] mb-8 max-w-[460px]">
              FairGuard is the bias firewall for modern AI. Trained on real-world fairness patterns across hiring, lending, and content moderation, it detects discrimination in seconds instead of months.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex gap-3 flex-wrap">
              <Link href="/audit" className="inline-flex items-stretch rounded-md overflow-hidden font-bold transition-all duration-150 hover:shadow-lg group">
                <span className="bg-[#caff3d] px-3 flex items-center justify-center group-hover:bg-[#d4ff5c] transition-colors">
                  <ArrowRight className="w-4 h-4 text-black" />
                </span>
                <span className="bg-black text-white text-[12px] font-bold tracking-[0.12em] uppercase px-6 py-3 flex items-center gap-2 group-hover:bg-[#1a1a1a] transition-colors">
                  RUN FREE AUDIT
                </span>
              </Link>
              <Link href="#how-it-works" className="inline-flex items-stretch rounded-md overflow-hidden font-bold transition-all duration-150 hover:shadow-md group">
                <span className="bg-[#F3F4F6] px-3 flex items-center justify-center group-hover:bg-[#E5E7EB] transition-colors border border-[#E5E7EB] border-r-0">
                  <Search className="w-4 h-4 text-black" />
                </span>
                <span className="bg-white text-black text-[12px] font-bold tracking-[0.1em] uppercase px-6 py-3 flex items-center border border-[#E5E7EB] border-l-0 group-hover:bg-[#F9FAFB] transition-colors">
                  SEE HOW IT WORKS
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Right — Empty Grid Spacer */}
          <div className="hidden md:block"></div>
        </div>
      </section>

      {/* ═══ SECTION 9: FOOTER ═══ */}
      <footer className="bg-[#191b20] border-t border-[#3A3E49]">
        {/* Top nav row — bordered columns like refold */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#3A3E49]">
          {/* Brand column */}
          <div className="font-mono p-10 border-r border-[#3A3E49] col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex items-stretch rounded-md overflow-hidden">
                <div className="bg-[#caff3d] w-7 h-7 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-black" />
                </div>
                <div className="bg-white w-0.5" />
              </div>
              <span className="text-[15px] font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>FairGuard</span>
            </div>
            <p className="text-[13px] text-[#9CA3AF] leading-[1.65] max-w-[220px]">
              The bias firewall for AI. Find discrimination before it finds your users.
            </p>
          </div>

          {/* Tools */}
          <div className="font-mono p-10 border-r border-[#3A3E49]">
            <h4 className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#64748b] mb-6">TOOLS</h4>
            <div className="flex flex-col gap-4">
              <Link href="/audit" className="text-[14px] text-[#d1d5db] hover:text-white transition-colors">Bias Audit</Link>
              <Link href="/shield" className="text-[14px] text-[#d1d5db] hover:text-white transition-colors">Shield Mode</Link>
              <Link href="/stress" className="text-[14px] text-[#d1d5db] hover:text-white transition-colors">Stress Test</Link>
              <Link href="/history" className="text-[14px] text-[#d1d5db] hover:text-white transition-colors">Audit History</Link>
            </div>
          </div>

          {/* Resources */}
          <div className="font-mono p-10 border-r border-[#3A3E49]">
            <h4 className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#64748b] mb-6">RESOURCES</h4>
            <div className="flex flex-col gap-4">
              <Link href="#domains" className="text-[14px] text-[#d1d5db] hover:text-white transition-colors">Supported Domains</Link>
              <Link href="#how-it-works" className="text-[14px] text-[#d1d5db] hover:text-white transition-colors">How It Works</Link>
              <Link href="/audit" className="text-[14px] text-[#d1d5db] hover:text-white transition-colors">Run Free Audit</Link>
            </div>
          </div>

          {/* Legal */}
          <div className="font-mono p-10">
            <h4 className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#64748b] mb-6">LEGAL FRAMEWORKS</h4>
            <div className="flex flex-col gap-4">
              <span className="text-[14px] text-[#d1d5db]">EU AI Act</span>
              <span className="text-[14px] text-[#d1d5db]">India DPDP Act</span>
              <span className="text-[14px] text-[#d1d5db]">US EEOC Guidelines</span>
              <span className="text-[14px] text-[#d1d5db]">IEEE Ethics Standards</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-10 py-6 flex-wrap gap-3">
          <span className="text-[12px] text-[#64748b] font-mono">&copy; 2026 FairGuard. AI fairness, simplified.</span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#64748b]">
              Built for
              <span className="text-[#caff3d] font-semibold">Google Solution Challenge 2026</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#caff3d] animate-pulse" />
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