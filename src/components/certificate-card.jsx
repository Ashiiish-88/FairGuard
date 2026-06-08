// components/certificate-card.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Shield,
  Copy,
  CheckCircle2,
  XCircle,
  Hash,
  Calendar,
  Building2,
  FileText,
  Loader2,
  Scale,
  ExternalLink,
} from "lucide-react";

const COMPLIANCE_BADGES = [
  { label: "EU AI Act Art. 9", description: "Bias testing documentation" },
  { label: "GDPR Art. 22", description: "Automated decision documentation" },
];

export default function CertificateCard({ auditResults }) {
  const [state, setState] = useState("form"); // "form" | "loading" | "issued" | "ineligible"
  const [cert, setCert] = useState(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    organization_name: "",
    system_name: "",
    deployment_context: auditResults?.domain?.domain || "general",
    dataset_period: "",
    auditor_name: "",
  });

  const score = auditResults?.fairness_score?.score ?? 0;
  const eligible = score >= 70;

  if (!eligible) {
    return (
      <div className="bg-card rounded-xl border-2 border-[#ff6b7a]/20 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#ff6b7a]/10 bg-[#ff6b7a]/5">
          <div className="w-7 h-7 rounded-lg bg-[#ff6b7a]/10 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-3.5 h-3.5 text-[#ff6b7a]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Certificate Not Available</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Fairness score must be 70+ to earn certification
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#ff6b7a]/10 text-[#ff6b7a] border border-[#ff6b7a]/25">
            {score}/100
          </span>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your system scored <span className="font-bold text-[#ff6b7a]">{score}/100</span> — certificate
            requires a minimum of <span className="font-bold text-foreground">70/100</span>.
            Improve your system&apos;s fairness to earn certification.
          </p>
        </div>
      </div>
    );
  }

  const generateCertificate = async () => {
    setState("loading");
    try {
      const res = await fetch("/api/certificate/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audit_results: auditResults,
          ...form,
        }),
      });
      const data = await res.json();
      if (data.certificate) {
        setCert(data.certificate);
        setState("issued");
      } else {
        setState("form");
      }
    } catch {
      setState("form");
    }
  };

  const copyVerifyUrl = () => {
    const url = `${window.location.origin}/verify/${cert?.certificate_id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-card rounded-xl border-2 border-[#caff3d]/20 overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Form state */}
        {state === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[#caff3d]/10 bg-[#caff3d]/5">
              <div className="w-7 h-7 rounded-lg bg-[#caff3d]/15 flex items-center justify-center flex-shrink-0">
                <Award className="w-3.5 h-3.5 text-[#65a30d]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Generate Fairness Certificate</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Score {score}/100 — eligible for certification
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#caff3d]/15 text-[#65a30d] border border-[#caff3d]/30">
                Eligible ✓
              </span>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Organization name</label>
                  <input
                    value={form.organization_name}
                    onChange={e => setForm(p => ({ ...p, organization_name: e.target.value }))}
                    placeholder="e.g., Acme Corp"
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#caff3d]/40 focus:border-[#caff3d] transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">System name</label>
                  <input
                    value={form.system_name}
                    onChange={e => setForm(p => ({ ...p, system_name: e.target.value }))}
                    placeholder="e.g., Resume Screening AI v2"
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#caff3d]/40 focus:border-[#caff3d] transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Dataset period</label>
                  <input
                    value={form.dataset_period}
                    onChange={e => setForm(p => ({ ...p, dataset_period: e.target.value }))}
                    placeholder="e.g., Jan 2025 – Jun 2025"
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#caff3d]/40 focus:border-[#caff3d] transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Auditor name</label>
                  <input
                    value={form.auditor_name}
                    onChange={e => setForm(p => ({ ...p, auditor_name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#caff3d]/40 focus:border-[#caff3d] transition-all"
                  />
                </div>
              </div>
              <button
                onClick={generateCertificate}
                className="flex items-stretch rounded-md overflow-hidden hover:shadow-md transition-shadow group"
              >
                <span className="bg-[#caff3d] px-3 flex items-center justify-center group-hover:bg-[#b8f020] transition-colors">
                  <Award className="w-3.5 h-3.5 text-black" />
                </span>
                <span className="bg-black text-white text-xs font-bold tracking-wider uppercase px-5 py-2.5 flex items-center gap-2 group-hover:bg-[#1a1a1a] transition-colors">
                  Generate Certificate
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading state */}
        {state === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3 py-12"
          >
            <Loader2 className="w-5 h-5 text-[#caff3d] animate-spin" />
            <span className="text-sm font-medium text-muted-foreground">Generating certificate...</span>
          </motion.div>
        )}

        {/* Issued state */}
        {state === "issued" && cert && (
          <motion.div
            key="issued"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Certificate header */}
            <div className="relative border-b border-[#caff3d]/20">
              {/* Left green stripe */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#caff3d]" />
              <div className="pl-6 pr-6 py-6">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-[#65a30d]" />
                  <h3 className="text-lg font-bold text-foreground tracking-tight">
                    FairGuard Certified — Fair AI
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Certificate ID: <code className="font-mono text-foreground">{cert.certificate_id}</code>
                </p>
              </div>
            </div>

            {/* Certificate fields */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#caff3d]" />
              <div className="px-6 py-5 grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Organization</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{cert.organization_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">System</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{cert.system_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Award className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Score / Grade</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">
                      {cert.fairness_score}/100 — Grade {cert.letter_grade}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Valid Until</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {new Date(cert.valid_until).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hash + compliance */}
            <div className="relative border-t border-border">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#caff3d]" />
              <div className="px-6 py-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <code className="text-[10px] font-mono text-muted-foreground break-all">
                    SHA-256: {cert.results_hash}
                  </code>
                </div>

                {/* Compliance badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {COMPLIANCE_BADGES.map(badge => (
                    <span
                      key={badge.label}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-[#0057ff]/8 text-[#0057ff] border border-[#0057ff]/20"
                      title={badge.description}
                    >
                      <Scale className="w-3 h-3" />
                      {badge.label}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={copyVerifyUrl}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold
                               border border-border bg-muted/50 hover:bg-muted text-foreground
                               transition-all duration-150"
                  >
                    {copied ? <CheckCircle2 className="w-3 h-3 text-[#caff3d]" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied!" : "Copy verify URL"}
                  </button>
                  <a
                    href={`/verify/${cert.certificate_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold
                               border border-border bg-muted/50 hover:bg-muted text-foreground
                               transition-all duration-150"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View public page
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
