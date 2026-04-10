import { NextResponse } from "next/server";
import { generateSyntheticCandidates, runBiasedModel } from "@/lib/gemini";
import { disparateImpactRatio, demographicParityDiff, intersectionalAnalysis } from "@/lib/bias-engine";
import { explainBias } from "@/lib/gemini";

export async function POST(request) {
  try {
    const { decision_type = "hiring", candidate_count = 200, demographic_axes = ["gender", "age_group"] } = await request.json();

    // Step 1: Generate synthetic candidates
    const candidates = await generateSyntheticCandidates(decision_type, candidate_count, demographic_axes);

    // Step 2: Run through biased model
    const results = runBiasedModel(candidates);

    // Step 3: Analyze results
    const analysis = { per_demographic: {} };

    for (const axis of demographic_axes) {
      if (!results[0]?.[axis]) continue;
      const di = disparateImpactRatio(results, "decision_numeric", axis, 1);
      const dpd = demographicParityDiff(results, "decision_numeric", axis, 1);

      const groupCounts = {};
      for (const r of results) {
        const g = String(r[axis]);
        groupCounts[g] = (groupCounts[g] || 0) + 1;
      }

      analysis.per_demographic[axis] = { disparate_impact: di, demographic_parity: dpd, group_counts: groupCounts };
    }

    if (demographic_axes.length >= 2) {
      analysis.intersectional = intersectionalAnalysis(results, "decision_numeric", demographic_axes, 1);
    }

    const overallRate = results.filter(r => r.decision_numeric === 1).length / results.length;
    analysis.summary = {
      total_candidates: results.length,
      overall_approval_rate: Math.round(overallRate * 10000) / 10000,
      bias_detected: Object.values(analysis.per_demographic).some(v => v.disparate_impact?.violation),
    };

    // Step 4: Get Gemini explanation
    let explanation;
    try {
      explanation = await explainBias(analysis);
    } catch {
      explanation = { summary: "Stress test complete — bias detected.", explanation: "Review the per-demographic metrics." };
    }

    return NextResponse.json({
      status: "success",
      candidates_sample: results.slice(0, 20),
      analysis,
      explanation,
    });
  } catch (e) {
    return NextResponse.json({ error: `Stress test failed: ${e.message}` }, { status: 500 });
  }
}
