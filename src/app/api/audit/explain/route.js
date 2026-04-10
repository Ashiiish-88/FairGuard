import { NextResponse } from "next/server";
import { explainBias } from "@/lib/gemini";

export async function POST(request) {
  try {
    const { metrics } = await request.json();
    const explanation = await explainBias(metrics);
    return NextResponse.json({ status: "success", explanation });
  } catch (e) {
    return NextResponse.json({ error: `Explanation failed: ${e.message}` }, { status: 500 });
  }
}
