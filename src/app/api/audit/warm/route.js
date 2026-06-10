/**
 * Warm Check Endpoint — /api/audit/warm
 * ========================================
 * Runs a single minimal probe to verify the AI API is live before demos.
 * Returns { status: "ok", provider, latency_ms } or { status: "error", error }.
 * Use this to show judges "API available" or "using pre-run results" indicator.
 */

import { NextResponse } from "next/server";
import { gcpLog } from "@/lib/gcp-logger";

export async function GET() {
  const start = Date.now();
  try {
    const { getModel, getAIProvider } = await import("@/lib/gemini");
    const model = await getModel();
    const result = await model.generateContent(
      "Reply with exactly the word: READY"
    );

    let text = "";
    try {
      text = result?.response?.text?.() || result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch {
      text = "READY"; // treat any successful response as ok
    }

    const latency = Date.now() - start;
    gcpLog.info("WarmCheck", "probe", "API warm check passed", { latency_ms: latency, provider: getAIProvider() });

    return NextResponse.json({
      status: "ok",
      provider: getAIProvider(),
      latency_ms: latency,
      response_preview: text.slice(0, 50),
    });
  } catch (e) {
    const latency = Date.now() - start;
    gcpLog.error("WarmCheck", "probe", e, { latency_ms: latency });
    return NextResponse.json({
      status: "error",
      error: e.message,
      latency_ms: latency,
    }, { status: 503 });
  }
}
