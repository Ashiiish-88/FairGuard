import { NextResponse } from "next/server";
import { saveAudit } from "@/lib/firebase";

export async function POST(request) {
  try {
    const { results } = await request.json();
    if (!results) return NextResponse.json({ error: "No results provided" }, { status: 400 });

    const saved = await saveAudit(results);
    return NextResponse.json({ status: "success", ...saved });
  } catch (e) {
    return NextResponse.json({ error: `Save failed: ${e.message}` }, { status: 500 });
  }
}
