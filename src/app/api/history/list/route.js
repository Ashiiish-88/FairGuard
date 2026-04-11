import { NextResponse } from "next/server";
import { listAudits } from "@/lib/firebase";

export async function GET() {
  try {
    const result = await listAudits(20);
    return NextResponse.json({ status: "success", ...result });
  } catch (e) {
    return NextResponse.json({ error: `List failed: ${e.message}` }, { status: 500 });
  }
}
