// app/verify/[id]/page.js
"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Shield,
  XCircle,
  AlertTriangle,
  Hash,
  Calendar,
  Building2,
  FileText,
  Award,
  Scale,
  Loader2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Link2,
} from "lucide-react";



export default function VerifyPage({ params }) {
  const { id } = use(params);
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/certificate/lookup?id=${encodeURIComponent(id)}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setCert(data.certificate);
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-[#caff3d] animate-spin" />
          <span className="text-sm font-medium text-muted-foreground">Verifying certificate...</span>
        </div>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6">
          <div className="bg-card rounded-xl border-2 border-[#ff6b7a]/20 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-[#ff6b7a]/10 bg-[#ff6b7a]/5">
              <XCircle className="w-6 h-6 text-[#ff6b7a]" />
              <div>
                <h1 className="text-lg font-bold text-foreground">Certificate Not Found</h1>
                <p className="text-xs text-muted-foreground mt-0.5">ID: {id}</p>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-muted-foreground">
                {error || "This certificate ID does not exist or has been revoked."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isValid = cert.status === "VALID";
  const isExpired = cert.status === "EXPIRED";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Status banner */}
        <div className={[
          "rounded-xl border-2 p-6 mb-8 text-center",
          isValid
            ? "border-[#caff3d]/30 bg-[#caff3d]/5"
            : isExpired
            ? "border-[#ff8c42]/30 bg-[#ff8c42]/5"
            : "border-[#ff6b7a]/30 bg-[#ff6b7a]/5",
        ].join(" ")}>
          <div className="flex items-center justify-center gap-2 mb-2">
            {isValid ? (
              <Shield className="w-8 h-8 text-[#65a30d]" />
            ) : isExpired ? (
              <Clock className="w-8 h-8 text-[#ff8c42]" />
            ) : (
              <XCircle className="w-8 h-8 text-[#ff6b7a]" />
            )}
          </div>
          <h1 className={[
            "text-2xl font-bold tracking-tight",
            isValid ? "text-[#65a30d]" : isExpired ? "text-[#ff8c42]" : "text-[#ff6b7a]",
          ].join(" ")}>
            {isValid ? "CERTIFIED FAIR AI" : isExpired ? "CERTIFICATE EXPIRED" : "CERTIFICATE INVALID"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isValid ? "This AI system has been independently audited for fairness" : `Certificate status: ${cert.status}`}
          </p>
        </div>

        {/* Certificate body */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Left green stripe decoration */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#caff3d]" />

            <div className="pl-6 pr-6 py-5 space-y-5">

              {/* Certificate ID */}
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-[#65a30d]" />
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Certificate ID</p>
                  <p className="text-lg font-bold font-mono text-foreground">{cert.certificate_id}</p>
                </div>
              </div>

              {/* Fields grid */}
              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
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
                  <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Fairness Score</p>
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
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Issued</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {new Date(cert.issued_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Context</p>
                    <p className="text-sm font-medium text-foreground mt-0.5 capitalize">{cert.deployment_context}</p>
                  </div>
                </div>
              </div>

              {/* Dimensions + proxy */}
              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Dimensions checked:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {(cert.dimensions_checked || []).map(d => (
                      <span key={d} className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted border border-border text-foreground">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
                {cert.proxy_contamination && (
                  <p className="text-xs text-muted-foreground">
                    Proxy contamination: <span className="font-medium text-foreground">{cert.proxy_contamination}</span>
                  </p>
                )}
              </div>

              {/* Hash */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Results Hash (SHA-256)</span>
                </div>
                <code className="text-[10px] font-mono text-muted-foreground break-all block bg-muted/50 px-3 py-2 rounded-md border border-border">
                  {cert.results_hash}
                </code>
              </div>

              {/* Audit chain */}
              {cert.previous_audit_hash && (
                <div className="flex items-center gap-2">
                  <Link2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Audit chain: previous hash{" "}
                    <code className="font-mono text-[10px]">{cert.previous_audit_hash.slice(0, 16)}...</code>
                  </span>
                </div>
              )}

              {/* Legal compliance checklist from mapping */}
              {cert.legal_compliance_mapping && Object.keys(cert.legal_compliance_mapping).length > 0 ? (
                <div className="pt-4 border-t border-border">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    Legal Compliance Checklist
                  </p>
                  <div className="space-y-2">
                    {Object.values(cert.legal_compliance_mapping).map((item, i) => {
                      const satisfied = item.satisfied || item.satisfied_label?.includes("✓") || item.satisfied_label?.includes("COMPLIANT") || item.satisfied_label?.includes("DOCUMENTED") || item.satisfied_label?.includes("COMPLETED") || item.satisfied_label?.includes("NO PROXY");
                      return (
                        <div key={i} className={`p-3 rounded-lg border ${
                          satisfied ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"
                        }`}>
                          <div className="flex items-start gap-2">
                            {satisfied ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-semibold text-foreground">{item.regulation}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                  satisfied ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                                }`}>{item.satisfied_label}</span>
                              </div>
                              {item.requirement && (
                                <p className="text-[10px] text-muted-foreground mt-0.5">{item.requirement}</p>
                              )}
                              {item.evidence && (
                                <p className="text-[10px] text-muted-foreground/80 mt-1 italic">{item.evidence}</p>
                              )}
                              {item.legal_risk && (
                                <p className="text-[10px] text-orange-400 mt-1">⚠️ {item.legal_risk}</p>
                              )}
                              {item.source_url && (
                                <a
                                  href={item.source_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] text-[#0057ff] hover:underline mt-1"
                                >
                                  {item.source}
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Fallback: static badges */
                <div className="pt-4 border-t border-border">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">
                    Compliance Standards Met
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {["EU AI Act Art. 9", "GDPR Art. 22"].map(label => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-[#0057ff]/8 text-[#0057ff] border border-[#0057ff]/20"
                      >
                        <Scale className="w-3 h-3" />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Model used */}
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Audited using: <span className="font-medium text-foreground">{cert.model_used || "Gemini 2.5 Flash"}</span>
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            Verified by FairGuard — The AI Bias Observatory
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0057ff] mt-2 hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            fairguard.vercel.app
          </Link>
        </div>
      </div>
    </div>
  );
}
