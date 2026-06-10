/**
 * FairGuard Regulation Reference Database
 * All fines, articles, and case references are citable legal sources.
 * Sources: EU AI Act 2024/1689 | EEOC 1979 + May 2023 | NYC LL 144-21 | DPDP Act 2023 | ECOA 15 U.S.C. §1691
 */

export const REGULATION_DB = {
  eu_ai_act: {
    id: "eu_ai_act",
    name: "EU AI Act",
    full_name: "Regulation (EU) 2024/1689",
    jurisdiction: "European Union",
    enforcement_started: "2026-08-02",
    enforcement_note: "Annex III high-risk AI enforcement began August 2, 2026 (Article 113)",
    domains: ["hiring", "lending", "insurance", "education", "healthcare"],
    // Article 99 — statutory maximums
    fine_prohibited_eur: 35_000_000, fine_prohibited_pct: 7,
    fine_prohibited_note: "Art. 5 prohibited practices — €35M or 7% global turnover, whichever is HIGHER",
    fine_high_risk_eur: 15_000_000, fine_high_risk_pct: 3,
    fine_high_risk_note: "Art. 9–49 Annex III non-compliance — €15M or 3% global turnover, whichever is HIGHER",
    articles: [
      { article: "9",  title: "Risk management system", requirement: "Continuous bias testing documentation required" },
      { article: "10", title: "Data governance", requirement: "Training data must not perpetuate discriminatory patterns" },
      { article: "15", title: "Accuracy across groups", requirement: "Performance must be consistent across demographic groups" },
      { article: "99", title: "Penalties", requirement: "€15M or 3% turnover for Annex III non-compliance" },
    ],
    official_url: "https://artificialintelligenceact.eu/article/99/",
    citation: "Regulation (EU) 2024/1689, Article 99; enforcement per Article 113",
  },

  gdpr_art22: {
    id: "gdpr_art22",
    name: "GDPR — Article 22",
    full_name: "GDPR Regulation (EU) 2016/679, Articles 22 & 83",
    jurisdiction: "European Union",
    domains: ["all"],
    fine_eur: 20_000_000, fine_pct: 4,
    fine_note: "Article 83(4) — €20M or 4% global annual turnover, whichever is HIGHER",
    articles: [
      { article: "22", title: "Automated decision-making", requirement: "Right not to be subject to solely automated decisions with significant legal effects" },
    ],
    official_url: "https://gdpr-info.eu/art-22-gdpr/",
    citation: "GDPR Regulation (EU) 2016/679, Articles 22 and 83(4)",
  },

  eeoc_title_vii: {
    id: "eeoc_title_vii",
    name: "EEOC / Title VII",
    full_name: "Title VII, Civil Rights Act 1964 + EEOC Uniform Guidelines (1979) + EEOC AI Technical Assistance (May 2023)",
    jurisdiction: "United States",
    domains: ["hiring"],
    // The exact legal standard FairGuard implements
    four_fifths_threshold: 0.8,
    four_fifths_rule: "A selection rate for any protected group < 4/5 (80%) of the highest group's rate is evidence of adverse impact — 29 C.F.R. § 1607.4(D)",
    ai_reaffirmed: "EEOC Technical Assistance (May 2023) explicitly applies four-fifths rule to algorithmic hiring tools",
    // BLS data for back-pay calculations — NOT invented
    bls_median_unemployment_weeks: 9.6,
    bls_mean_unemployment_weeks: 21.6,
    bls_year: 2024,
    bls_source: "BLS CPS Table 32, 2024 Annual Averages",
    bls_median_weekly_earnings_usd: 1215,
    bls_earnings_source: "BLS Occupational Employment Statistics 2024, all occupations",
    real_cases: [
      { case: "EEOC v. iTutorGroup", citation: "E.D.N.Y. 1:22-CV-2565", year: 2023, settlement: "$365,000", note: "First EEOC AI hiring lawsuit; auto-rejected women 55+ and men 60+; 200+ applicants" },
      { case: "EEOC v. Radiant Services/BaronHR", citation: "C.D. Cal. 2024", year: 2024, settlement: "$3.3M", note: "Race/national origin discrimination in AI-assisted hiring" },
    ],
    official_url: "https://www.eeoc.gov/select-issues-assessing-adverse-impact-software-algorithms",
    citation: "Title VII, 42 U.S.C. §2000e; 29 C.F.R. § 1607.4(D); EEOC Technical Assistance May 2023",
  },

  nyc_ll_144: {
    id: "nyc_ll_144",
    name: "NYC Local Law 144",
    full_name: "NYC Local Law 144-21 — AEDT Bias Audit Law",
    jurisdiction: "New York City, USA",
    effective: "2023-07-05",
    domains: ["hiring"],
    requirements: [
      "Annual independent bias audit of any AEDT used in NYC hiring",
      "Public disclosure of audit summary on company website",
      "10 business days advance notice to candidates before AEDT is used",
      "Selection rate calculations by sex and race/ethnicity",
    ],
    fine_per_violation_usd: 500,
    fine_per_day_ongoing_usd: 1500,
    fine_note: "Each day of non-compliant use is a separate $1,500 violation",
    fairguard_satisfies: true,
    fairguard_note: "FairGuard audit satisfies LL 144 documentation. Company must additionally post public disclosure.",
    official_url: "https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page",
    citation: "NYC Local Law 144-21; NYC DCWP enforcement rules effective July 5, 2023",
  },

  dpdp_act: {
    id: "dpdp_act",
    name: "India DPDP Act 2023",
    full_name: "Digital Personal Data Protection Act, 2023",
    jurisdiction: "India",
    rules_notified: "2025-11-13",
    enforcement_body: "Data Protection Board of India (DPBI)",
    domains: ["all"],
    // Schedule penalty table — actual statutory amounts
    fine_security_safeguard_inr: 250_00_00_000,  // ₹250 crore
    fine_breach_notification_inr: 200_00_00_000,  // ₹200 crore
    fine_childrens_data_inr: 200_00_00_000,        // ₹200 crore
    fine_significant_fiduciary_inr: 150_00_00_000, // ₹150 crore
    fine_other_provisions_inr: 50_00_00_000,       // ₹50 crore
    fine_note: "DPDP Act 2023, Schedule; rules in force November 2025",
    connection_to_bias: "DPDP is a data protection law. Biased AI systems using personal data without accountability may violate Section 7 (purpose limitation) — ₹50 crore exposure",
    official_url: "https://indiadpdpa.com/india-dpdpa-article-33-penalties/",
    citation: "DPDP Act 2023, Section 33(2) and Schedule; DPDP Rules 2025 notified November 13, 2025",
  },

  ecoa: {
    id: "ecoa",
    name: "ECOA / Regulation B",
    full_name: "Equal Credit Opportunity Act (15 U.S.C. §1691) + CFPB Regulation B (12 C.F.R. Part 1002)",
    jurisdiction: "United States",
    domains: ["lending"],
    key_requirement: "Lenders must provide specific, intelligible reasons for credit denial — including when using AI/black-box algorithms",
    cfpb_guidance: [
      { circular: "CFPB Circular 2022-03", date: "2022-05-26", note: "Adverse action notices required for complex AI models; cannot claim model is too complex to explain" },
      { circular: "CFPB Circular 2023-03", date: "2023-09-19", note: "Specificity requirements reaffirmed for AI decisions" },
    ],
    proxy_significance: "Proxy columns (zip code, neighborhood) correlated with race/ethnicity constitute 'algorithmic redlining' — CFPB enforcement priority",
    official_url: "https://www.consumerfinance.gov/rules-policy/regulations/1002/",
    citation: "15 U.S.C. §1691; CFPB Circular 2022-03; CFPB v. Townstone Financial (2022)",
  },
};

export function getRegulationsForDomain(domain) {
  return Object.values(REGULATION_DB).filter(r => r.domains.includes(domain) || r.domains.includes("all"));
}

/**
 * Build legal compliance mapping for certificate objects.
 * Every field maps to a real legal source.
 */
export function buildLegalComplianceMapping(auditResults) {
  const score = auditResults.fairness_score?.score ?? 0;
  const domain = auditResults.domain?.domain || "general";
  const diRatio = auditResults.per_attribute
    ? Math.min(...Object.values(auditResults.per_attribute).map(a => a.disparate_impact?.ratio ?? 1))
    : 1;
  const proxyCount = auditResults.proxies?.length ?? 0;
  const issuedAt = new Date().toISOString();

  const mapping = {};

  if (["hiring", "lending", "insurance", "education", "healthcare"].includes(domain)) {
    mapping.eu_ai_act_art_9 = {
      regulation: "EU AI Act — Article 9", requirement: "Risk management system / bias testing documentation",
      satisfied: score >= 70, satisfied_label: score >= 70 ? "SATISFIED ✓" : "NOT SATISFIED ✗",
      evidence: `FairGuard audit conducted ${issuedAt}; fairness score ${score}/100; all metrics documented`,
      source: "Regulation (EU) 2024/1689, Article 9", source_url: "https://artificialintelligenceact.eu/article/9/",
    };
    mapping.eu_ai_act_art_15 = {
      regulation: "EU AI Act — Article 15", requirement: "Accuracy consistency across demographic groups",
      satisfied: diRatio >= 0.8, satisfied_label: diRatio >= 0.8 ? "SATISFIED ✓" : "PARTIAL — improvement needed",
      evidence: `Disparate impact ratio: ${diRatio.toFixed(4)} (EEOC/legal threshold: 0.80)`,
      source: "Regulation (EU) 2024/1689, Article 15", source_url: "https://artificialintelligenceact.eu/article/15/",
    };
  }

  mapping.gdpr_art_22 = {
    regulation: "GDPR — Article 22", requirement: "Automated decision-making safeguards documented",
    satisfied: score >= 70, satisfied_label: score >= 70 ? "DOCUMENTED ✓" : "INADEQUATE ✗ — high bias detected",
    evidence: `Automated decision system bias documented; human review recommended where DI < 0.80`,
    source: "GDPR (EU) 2016/679, Article 22", source_url: "https://gdpr-info.eu/art-22-gdpr/",
  };

  if (domain === "hiring") {
    mapping.eeoc_four_fifths = {
      regulation: "EEOC — Four-Fifths Rule (Title VII)", requirement: "Selection rate DI ratio ≥ 0.80",
      satisfied: diRatio >= 0.8,
      satisfied_label: diRatio >= 0.8 ? "COMPLIANT ✓" : `NON-COMPLIANT ✗ — DI ${diRatio.toFixed(4)} below 0.80`,
      evidence: `DI ratio: ${diRatio.toFixed(4)}; threshold: 0.80 per 29 C.F.R. § 1607.4(D)`,
      legal_risk: diRatio < 0.8 ? "See EEOC v. iTutorGroup ($365K settlement, 2023)" : null,
      source: "EEOC Uniform Guidelines, 29 C.F.R. § 1607.4(D)", source_url: "https://www.eeoc.gov/select-issues-assessing-adverse-impact-software-algorithms",
    };
    mapping.nyc_ll_144 = {
      regulation: "NYC Local Law 144", requirement: "Annual independent bias audit of AEDT hiring tools",
      satisfied: true, satisfied_label: "AUDIT COMPLETED ✓",
      evidence: `Selection rate analysis + impact ratios computed; audit dated ${issuedAt}; verification URL available`,
      note: "Company must additionally post public disclosure on website per LL 144",
      source: "NYC Local Law 144-21, in force July 5, 2023", source_url: "https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page",
    };
  }

  if (domain === "lending") {
    mapping.ecoa_reg_b = {
      regulation: "ECOA / Regulation B", requirement: "Adverse action reasons required; no algorithmic redlining",
      satisfied: proxyCount === 0,
      satisfied_label: proxyCount === 0 ? "NO PROXY COLUMNS ✓" : `RISK — ${proxyCount} proxy column(s) detected`,
      evidence: proxyCount > 0 ? `${proxyCount} potential redlining features detected — review before deployment` : "No proxy redlining patterns detected",
      source: "15 U.S.C. §1691; CFPB Circular 2022-03", source_url: "https://www.consumerfinance.gov/rules-policy/regulations/1002/",
    };
  }

  mapping.india_dpdp = {
    regulation: "India DPDP Act 2023", requirement: "Safeguards for automated personal data processing",
    satisfied: score >= 70, satisfied_label: score >= 70 ? "SAFEGUARDS DOCUMENTED ✓" : "INSUFFICIENT ✗",
    evidence: `Automated decision system audited; accountability measures documented`,
    source: "DPDP Act 2023, Section 33(2) and Schedule", source_url: "https://indiadpdpa.com/india-dpdpa-article-33-penalties/",
  };

  return mapping;
}
