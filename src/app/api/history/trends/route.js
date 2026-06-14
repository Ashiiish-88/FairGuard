/**
 * BigQuery Trends Route
 * =====================
 * GET: Returns audit score trends from BigQuery for chart rendering.
 * Gracefully skips and returns empty data when BigQuery is not configured.
 *
 * Returns:
 *   { available: bool, trends: [{ timestamp, domain, fairness_score, letter_grade }] }
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT?.trim();
  const datasetId = (process.env.BIGQUERY_DATASET || "fairguard_analytics").trim();

  // Gracefully skip if BigQuery not configured
  if (!projectId) {
    return NextResponse.json({
      available: false,
      reason: "BigQuery not configured",
      trends: [],
    });
  }

  try {
    const { BigQuery } = await import("@google-cloud/bigquery");
    const bigquery = new BigQuery({ projectId });

    // Query last 30 audit events for trend analysis
    const query = `
      SELECT
        timestamp,
        domain,
        fairness_score,
        letter_grade,
        has_critical_bias,
        proxy_count,
        row_count
      FROM \`${projectId}.${datasetId}.audit_events\`
      ORDER BY timestamp DESC
      LIMIT 30
    `;

    const [rows] = await bigquery.query({ query });

    // Compute domain-level averages for the trend summary
    const domainSummary = {};
    for (const row of rows) {
      const d = row.domain || "general";
      if (!domainSummary[d]) domainSummary[d] = { total: 0, count: 0 };
      domainSummary[d].total += row.fairness_score ?? 0;
      domainSummary[d].count++;
    }
    for (const d of Object.keys(domainSummary)) {
      domainSummary[d].avg = Math.round(domainSummary[d].total / domainSummary[d].count);
    }

    return NextResponse.json({
      available: true,
      total_records: rows.length,
      trends: rows.map(r => ({
        timestamp: r.timestamp?.value || r.timestamp,
        domain: r.domain,
        fairness_score: r.fairness_score,
        letter_grade: r.letter_grade,
        has_critical_bias: r.has_critical_bias,
      })),
      domain_summary: domainSummary,
    });
  } catch (e) {
    // Non-blocking — BigQuery unavailable, history page works without it
    console.warn("[FairGuard] BigQuery trends unavailable:", e.message);
    return NextResponse.json({
      available: false,
      reason: e.message,
      trends: [],
    });
  }
}
