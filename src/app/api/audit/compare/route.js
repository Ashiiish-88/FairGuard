/**
 * Audit Compare Route
 * =====================
 * POST: Runs two datasets through the same analysis pipeline,
 * compares results side by side. Shows which groups improved or regressed.
 */

import { NextResponse } from "next/server";
import { runFullAnalysis } from "@/lib/bias-engine";

export async function POST(request) {
  try {
    const {
      dataset_a, dataset_b,
      outcome_column, protected_columns,
      positive_outcome = "1",
      qualification_column = null,
      label_a = "Version A",
      label_b = "Version B",
    } = await request.json();

    if (!dataset_a || !dataset_b) {
      return NextResponse.json({ error: "Both datasets required" }, { status: 400 });
    }

    if (!outcome_column || !protected_columns?.length) {
      return NextResponse.json({ error: "outcome_column and protected_columns required" }, { status: 400 });
    }

    const resultsA = runFullAnalysis(dataset_a, outcome_column, protected_columns, positive_outcome, qualification_column);
    const resultsB = runFullAnalysis(dataset_b, outcome_column, protected_columns, positive_outcome, qualification_column);

    // Build diff
    const diff = {
      score_delta: Math.round((resultsB.fairness_score?.score - resultsA.fairness_score?.score) * 10) / 10,
      per_attribute_diff: {},
      proxy_diff: {
        added: (resultsB.proxies || []).filter(pb => !(resultsA.proxies || []).some(pa => pa.feature === pb.feature)),
        removed: (resultsA.proxies || []).filter(pa => !(resultsB.proxies || []).some(pb => pa.feature === pb.feature)),
      },
    };

    // Per-attribute comparison
    const allAttrs = new Set([
      ...Object.keys(resultsA.per_attribute || {}),
      ...Object.keys(resultsB.per_attribute || {}),
    ]);

    for (const attr of allAttrs) {
      const a = resultsA.per_attribute?.[attr];
      const b = resultsB.per_attribute?.[attr];
      if (!a || !b) continue;

      const diDelta = Math.round(((b.disparate_impact?.ratio ?? 0) - (a.disparate_impact?.ratio ?? 0)) * 10000) / 10000;
      const dpdDelta = Math.round(((b.demographic_parity?.difference ?? 0) - (a.demographic_parity?.difference ?? 0)) * 10000) / 10000;

      // Per-group rate changes
      const groupChanges = {};
      const allGroups = new Set([
        ...Object.keys(a.disparate_impact?.rates || {}),
        ...Object.keys(b.disparate_impact?.rates || {}),
      ]);
      for (const group of allGroups) {
        const rateA = a.disparate_impact?.rates?.[group] ?? 0;
        const rateB = b.disparate_impact?.rates?.[group] ?? 0;
        groupChanges[group] = {
          rate_a: rateA,
          rate_b: rateB,
          delta: Math.round((rateB - rateA) * 10000) / 10000,
          direction: rateB > rateA ? "improved" : rateB < rateA ? "regressed" : "unchanged",
        };
      }

      diff.per_attribute_diff[attr] = {
        di_delta: diDelta,
        dpd_delta: dpdDelta,
        di_direction: diDelta > 0.01 ? "improved" : diDelta < -0.01 ? "regressed" : "unchanged",
        group_changes: groupChanges,
        verdict: diDelta > 0.05 ? "IMPROVED" : diDelta < -0.05 ? "REGRESSED" : "UNCHANGED",
      };
    }

    // Summary
    const improvements = Object.values(diff.per_attribute_diff).filter(d => d.verdict === "IMPROVED").length;
    const regressions = Object.values(diff.per_attribute_diff).filter(d => d.verdict === "REGRESSED").length;
    diff.summary = {
      attributes_improved: improvements,
      attributes_regressed: regressions,
      overall_verdict: diff.score_delta > 5 ? "NET IMPROVEMENT" : diff.score_delta < -5 ? "NET REGRESSION" : "MIXED",
      headline: regressions > 0
        ? `${improvements} dimension(s) improved, but ${regressions} dimension(s) got WORSE. Review regressions before deploying.`
        : improvements > 0
          ? `All ${improvements} dimension(s) improved. Model update shows clear fairness progress.`
          : "Minimal change in bias across model versions.",
    };

    return NextResponse.json({
      status: "success",
      label_a, label_b,
      results_a: resultsA,
      results_b: resultsB,
      diff,
    });
  } catch (e) {
    return NextResponse.json({ error: `Compare failed: ${e.message}` }, { status: 500 });
  }
}
