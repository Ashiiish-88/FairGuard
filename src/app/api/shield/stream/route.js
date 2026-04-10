/**
 * Shield Mode — SSE (Server-Sent Events) Stream
 * Vercel-compatible real-time bias monitoring.
 */

import { disparateImpactRatio, demographicParityDiff } from "@/lib/bias-engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function generateDecisionBatch(batchIndex, batchSize = 20) {
  const decisions = [];
  for (let i = 0; i < batchSize; i++) {
    const globalIndex = batchIndex * batchSize + i;
    const gender = Math.random() < 0.55 ? "Male" : "Female";
    const ageGroup = ["18-25", "25-35", "35-45", "45+"][Math.floor(Math.random() * 4)];
    const qualification = Math.max(0, Math.min(100, 65 + (Math.random() - 0.5) * 30));

    // Realistic bias
    let biasFactor = 0;
    if (gender === "Female") biasFactor -= 12;
    if (ageGroup === "45+") biasFactor -= 15;
    if (gender === "Female" && ageGroup === "45+") biasFactor -= 8;

    // Bias spike in batches 75-100
    if (batchIndex >= 75 && batchIndex <= 100) {
      if (gender === "Female") biasFactor -= 10;
    }

    const effectiveScore = qualification + biasFactor;
    const hired = effectiveScore > 55 ? 1 : 0;

    decisions.push({
      id: globalIndex + 1,
      gender,
      age_group: ageGroup,
      qualification_score: Math.round(qualification * 10) / 10,
      decision: hired,
    });
  }
  return decisions;
}

export async function GET() {
  const encoder = new TextEncoder();
  let cancelled = false;

  const stream = new ReadableStream({
    async start(controller) {
      const window = [];
      const totalBatches = 150;

      for (let batch = 0; batch < totalBatches; batch++) {
        if (cancelled) break;

        const decisions = generateDecisionBatch(batch);
        window.push(...decisions);

        // Rolling window of last 500
        if (window.length > 500) window.splice(0, window.length - 500);

        // Calculate metrics
        const genderDI = disparateImpactRatio(window, "decision", "gender", 1);
        const genderDPD = demographicParityDiff(window, "decision", "gender", 1);
        const ageDI = disparateImpactRatio(window, "decision", "age_group", 1);

        const fairnessScore = Math.round(Math.min(100, Math.max(0, (genderDI.ratio ?? 1) * 100)) * 10) / 10;

        const alerts = [];
        if (fairnessScore < 70) {
          alerts.push({
            type: "THRESHOLD_BREACH",
            message: `Fairness score dropped to ${fairnessScore}/100 (threshold: 70)`,
            severity: fairnessScore < 50 ? "CRITICAL" : "WARNING",
          });
        }
        if (genderDI.violation) {
          const fRate = genderDI.rates?.Female ?? 0;
          const mRate = genderDI.rates?.Male ?? 0;
          alerts.push({
            type: "GENDER_BIAS",
            message: `Female approval (${(fRate * 100).toFixed(0)}%) significantly lower than male (${(mRate * 100).toFixed(0)}%)`,
            severity: "HIGH",
          });
        }

        const payload = {
          total_analyzed: (batch + 1) * 20,
          fairness_score: fairnessScore,
          gender_metrics: { disparate_impact: genderDI, demographic_parity: genderDPD },
          age_metrics: { disparate_impact: ageDI },
          rates: {
            overall_positive_rate: Math.round(window.filter(d => d.decision === 1).length / window.length * 10000) / 10000,
            gender_rates: genderDI.rates || {},
            age_rates: ageDI.rates || {},
          },
          alerts,
          window_size: window.length,
        };

        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        } catch {
          break;
        }

        // Pace: ~2 updates per second
        await new Promise(r => setTimeout(r, 500));
      }

      // Stream complete
      try {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: "complete", total_analyzed: totalBatches * 20 })}\n\n`));
        controller.close();
      } catch { /* client disconnected */ }
    },
    cancel() {
      cancelled = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
