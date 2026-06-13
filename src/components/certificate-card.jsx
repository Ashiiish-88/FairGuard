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



export default function CertificateCard({ auditResults }) {
  const [state, setState] = useState("form"); // "form" | "loading" | "issued" | "ineligible"
  const [cert, setCert] = useState(null);
  const [copied, setCopied] = useState(false);
  const [hashRevealed, setHashRevealed] = useState(false);
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

  const handleDownload = () => {
    const issuedDate = cert.issued_at ? new Date(cert.issued_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";
    const validDate  = cert.valid_until ? new Date(cert.valid_until).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";
    const score      = cert.fairness_score ?? 0;
    const grade      = cert.letter_grade ?? "—";

    const complianceRows = cert.legal_compliance_mapping
      ? Object.values(cert.legal_compliance_mapping).map(item => {
          const ok = item.satisfied || item.satisfied_label?.includes("✓");
          return `<tr>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:11px;font-weight:600;">${item.regulation}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:11px;color:${ok ? "#15803d" : "#dc2626"};font-weight:700;">${item.satisfied_label ?? ""}</td>
          </tr>`;
        }).join("")
      : "";

    const html = `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8" />
<title>FairGuard Certificate — ${cert.certificate_id}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Helvetica Neue", Arial, sans-serif; background: #fff; color: #111; }
  .page { max-width: 720px; margin: 0 auto; padding: 48px 40px; }
  .header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 3px solid #caff3d; }
  .header img { height: 100px; }
  .header-text { }
  .header-text h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
  .header-text p { font-size: 11px; color: #666; margin-top: 2px; text-transform: uppercase; letter-spacing: 1px; }
  .status-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 20px; border-radius: 100px; background: #f0fdf4; border: 2px solid #86efac; color: #15803d; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 28px; }
  .section { border-left: 4px solid #caff3d; padding: 16px 20px; margin-bottom: 20px; background: #fafafa; }
  .section h2 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #888; margin-bottom: 12px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .field label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #aaa; display: block; margin-bottom: 3px; }
  .field p { font-size: 13px; font-weight: 600; color: #111; }
  .score-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; background: #caff3d; border-radius: 6px; font-size: 18px; font-weight: 900; }
  table { width: 100%; border-collapse: collapse; margin-top: 4px; }
  .footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
  .footer p { font-size: 10px; color: #aaa; }
  .hash-row { font-family: monospace; font-size: 9px; color: #aaa; margin-top: 8px; word-break: break-all; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head><body>
<div class="page">
  <div class="header">
    <img src="${window.location.origin}/Navbar_Logo.svg" alt="FairGuard" />
    <div class="header-text">
      <h1>FairGuard Certificate of AI Fairness</h1>
      <p>Fair AI Certification · Independent Bias Audit</p>
    </div>
  </div>

  <div class="status-badge">✓ CERTIFIED FAIR AI</div>

  <div class="section">
    <h2>Certificate Details</h2>
    <div class="grid">
      <div class="field"><label>Certificate ID</label><p>${cert.certificate_id}</p></div>
      <div class="field"><label>Fairness Score</label><p><span class="score-badge">${score}/100</span> &nbsp; Grade ${grade}</p></div>
      <div class="field"><label>Organization</label><p>${cert.organization_name ?? "—"}</p></div>
      <div class="field"><label>AI System</label><p>${cert.system_name ?? "—"}</p></div>
      <div class="field"><label>Deployment Context</label><p>${cert.deployment_context ?? "—"}</p></div>
      <div class="field"><label>Auditor</label><p>${cert.auditor_name ?? "—"}</p></div>
      <div class="field"><label>Issued</label><p>${issuedDate}</p></div>
      <div class="field"><label>Valid Until</label><p>${validDate}</p></div>
    </div>
  </div>

  ${complianceRows ? `<div class="section">
    <h2>Legal Compliance</h2>
    <table>${complianceRows}</table>
  </div>` : ""}

  <div class="footer">
    <p>Verified at ${window.location.origin}/verify/${cert.certificate_id}</p>
    <p>AI Audit Model: ${cert.model_used ?? "Gemini 2.5 Flash"}</p>
  </div>
  <div class="hash-row">Verification fingerprint (SHA-256): ${cert.results_hash ?? "—"}</div>
</div>
</body></html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 500);
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
            <div className="relative border-b border-[#caff3d]/20 certificate-printable">
              {/* Left green stripe */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#caff3d]" />
              <div className="pl-6 pr-6 py-6">
                {/* FairGuard branding at top of cert */}
                <div className="flex items-center gap-2 mb-4">
                  <img src="/Navbar_Logo.svg" alt="FairGuard" className="h-24 w-auto" />
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">Fair AI Certification</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
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
                  <span className="font-mono text-xs text-muted-foreground">
                    Verification fingerprint:{" "}
                    {hashRevealed
                      ? <code className="break-all text-[10px]">{cert.results_hash}</code>
                      : <span className="tracking-widest text-[10px]">████████████████████████████████</span>
                    }
                  </span>
                  <button
                    onClick={() => setHashRevealed(!hashRevealed)}
                    className="ml-2 text-[#caff3d] hover:underline text-[10px] font-semibold flex-shrink-0"
                  >
                    {hashRevealed ? "Hide" : "Reveal"}
                  </button>
                </div>

                {/* Legal compliance checklist */}
                <div className="flex items-center gap-2 flex-wrap">
                  {cert.legal_compliance_mapping && Object.keys(cert.legal_compliance_mapping).length > 0 ? (
                    <div className="w-full space-y-1.5">
                      {Object.values(cert.legal_compliance_mapping).map((item, i) => {
                        const ok = item.satisfied || item.satisfied_label?.includes("✓") || item.satisfied_label?.includes("COMPLIANT") || item.satisfied_label?.includes("DOCUMENTED") || item.satisfied_label?.includes("COMPLETED") || item.satisfied_label?.includes("NO PROXY");
                        return (
                          <div key={i} className="flex items-center gap-2">
                            {ok ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                            )}
                            <span className="text-xs font-medium text-foreground">{item.regulation}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              ok ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                            }`}>{item.satisfied_label}</span>
                            {item.source_url && (
                              <a href={item.source_url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-[10px] text-[#0057ff] hover:underline ml-auto"
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    ["EU AI Act Art. 9", "GDPR Art. 22"].map(label => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-[#0057ff]/8 text-[#0057ff] border border-[#0057ff]/20"
                      >
                        <Scale className="w-3 h-3" />
                        {label}
                      </span>
                    ))
                  )}
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
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold
                               bg-black text-[#caff3d] hover:bg-[#1a1a1a]
                               transition-all duration-150"
                  >
                    <FileText className="w-3 h-3" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
