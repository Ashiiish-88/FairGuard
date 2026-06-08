import { NextResponse } from "next/server";
import { saveAudit } from "@/lib/firebase";

export async function POST(request) {
  try {
    const { results } = await request.json();
    if (!results) return NextResponse.json({ error: "No results provided" }, { status: 400 });

    const saved = await saveAudit(results);

    // Fire-and-forget BigQuery sync — never blocks the save
    const origin = request.headers.get("origin") || request.headers.get("host") || "";
    const baseUrl = origin.startsWith("http") ? origin : `https://${origin}`;
    fetch(`${baseUrl}/api/history/bigquery-sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audit_summary: {
          id: saved.id,
          domain: results.domain?.domain,
          fairness_score: results.fairness_score?.score,
          grade: results.fairness_score?.grade,
          proxy_count: results.proxies?.length ?? 0,
          dataset_rows: results.dataset_info?.total_rows ?? 0,
        },
      }),
    }).catch(() => {}); // Silent — never block the save

    return NextResponse.json({ status: "success", ...saved });
  } catch (e) {
    return NextResponse.json({ error: `Save failed: ${e.message}` }, { status: 500 });
  }
}
