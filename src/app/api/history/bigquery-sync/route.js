/**
 * BigQuery Sync Route (Additive — never fails hard)
 * ===================================================
 * POST: Writes audit summary to BigQuery for trend analysis.
 * Silently skips if BigQuery is not configured.
 */

import { NextResponse } from "next/server";

export async function POST(request) {
  // Check if BigQuery is configured
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;
  const dataset = process.env.BIGQUERY_DATASET || "fairguard_analytics";

  if (!projectId) {
    return NextResponse.json({ status: "skipped", reason: "no_bigquery_config" });
  }

  try {
    const { audit_summary } = await request.json();
    if (!audit_summary) {
      return NextResponse.json({ status: "skipped", reason: "no_data" });
    }

    // Dynamic import — @google-cloud/bigquery is optional
    const { BigQuery } = await import("@google-cloud/bigquery");
    const bigquery = new BigQuery({ projectId });

    const row = {
      audit_id: audit_summary.id || `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      domain: audit_summary.domain || "general",
      fairness_score: audit_summary.fairness_score ?? 0,
      letter_grade: audit_summary.grade || "—",
      has_critical_bias: (audit_summary.fairness_score ?? 100) < 50,
      proxy_count: audit_summary.proxy_count ?? 0,
      row_count: audit_summary.dataset_rows ?? 0,
      org_id: audit_summary.org_id || null,
    };

    await bigquery
      .dataset(dataset)
      .table("audit_events")
      .insert([row]);

    return NextResponse.json({ status: "synced" });
  } catch (e) {
    // NEVER fail hard — BigQuery is additive
    console.warn("[FairGuard] BigQuery sync skipped:", e.message);
    return NextResponse.json({ status: "skipped", reason: e.message });
  }
}
