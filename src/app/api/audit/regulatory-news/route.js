import { NextResponse } from "next/server";
import { getRegulationsForDomain, REGULATION_DB } from "@/lib/regulation-db";

export async function POST(request) {
  try {
    const { domain } = await request.json();

    const regs = getRegulationsForDomain(domain || "general");

    // Format regulations into the news/summary shape the component expects
    const news = regs.map((reg) => ({
      headline: `${reg.full_name || reg.name} — Compliance Requirements`,
      summary: [
        reg.enforcement_note || reg.fine_note || reg.fine_high_risk_note || "",
        ...(reg.articles?.slice(0, 2).map(a => `Art. ${a.article}: ${a.requirement}`) ?? []),
      ].filter(Boolean).join(" · "),
      source: reg.name,
      date: reg.enforcement_started || reg.effective || reg.rules_notified || "In force",
      regulation: reg.name,
      relevance: reg.citation || `Applies to: ${reg.domains?.join(", ")}`,
      url: reg.official_url,
    }));

    const summary = `The following regulations apply to AI systems in the ${domain || "general"} domain: ${regs.map(r => r.name).join(", ")}. FairGuard's audit checks all applicable fairness thresholds and documents compliance evidence for each regulation.`;

    return NextResponse.json({ status: "success", news, summary, grounded: false, fromDb: true });
  } catch (e) {
    return NextResponse.json(
      { error: `Regulatory news fetch failed: ${e.message}` },
      { status: 500 }
    );
  }
}

