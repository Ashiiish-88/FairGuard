/**
 * BigQuery Sync Route (Additive — never fails hard)
 * ===================================================
 * POST: Writes audit summary to BigQuery for trend analysis.
 * Silently skips if GOOGLE_CLOUD_PROJECT or BIGQUERY_DATASET is not set.
 *
 * BigQuery table schema:
 *   audit_id STRING, timestamp TIMESTAMP, domain STRING,
 *   fairness_score FLOAT64, letter_grade STRING,
 *   has_critical_bias BOOL, proxy_count INT64, row_count INT64,
 *   org_id STRING (null if no auth)
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  // Silently skip if BigQuery not configured
  const projectId = process.env.GOOGLE_CLOUD_PROJECT?.trim();
  const datasetId = (process.env.BIGQUERY_DATASET || "fairguard_analytics").trim();

  if (!projectId) {
    return NextResponse.json({
      status: "skipped",
      reason: "BigQuery not configured — set GOOGLE_CLOUD_PROJECT and BIGQUERY_DATASET",
    });
  }

  try {
    const body = await request.json();
    const { audit_summary } = body;

    if (!audit_summary) {
      return NextResponse.json({ status: "skipped", reason: "no_data" });
    }

    // Dynamic import — only loads if @google-cloud/bigquery is installed
    const { BigQuery } = await import("@google-cloud/bigquery");
    const bigquery = new BigQuery({ projectId });

    const row = {
      audit_id:         audit_summary.id || audit_summary.audit_id || `fg-${Date.now()}`,
      timestamp:        new Date().toISOString(),
      domain:           audit_summary.domain           || "unknown",
      fairness_score:   audit_summary.fairness_score   ?? audit_summary.score   ?? 0,
      letter_grade:     audit_summary.grade            || "F",
      has_critical_bias: (audit_summary.fairness_score ?? audit_summary.score ?? 100) < 50,
      proxy_count:      audit_summary.proxy_count      ?? 0,
      row_count:        audit_summary.dataset_rows     ?? audit_summary.total_rows ?? 0,
      org_id:           audit_summary.org_id           || null,
    };

    await bigquery
      .dataset(datasetId)
      .table("audit_events")
      .insert([row]);

    return NextResponse.json({ status: "synced", row });
  } catch (e) {
    // NEVER fail hard — BigQuery is additive, Firestore is the source of truth
    console.warn("[FairGuard] BigQuery sync skipped (non-blocking):", e.message);
    return NextResponse.json({
      status: "failed",
      reason: e.message,
      note: "This is non-blocking. History saved to Firestore successfully.",
    });
  }
}
