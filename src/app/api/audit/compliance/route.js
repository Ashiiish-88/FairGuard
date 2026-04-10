import { NextResponse } from "next/server";
import { checkCompliance } from "@/lib/gemini";

export async function POST(request) {
  try {
    const { metrics } = await request.json();
    const compliance = await checkCompliance(metrics);
    return NextResponse.json({ status: "success", compliance });
  } catch (e) {
    return NextResponse.json({ error: `Compliance check failed: ${e.message}` }, { status: 500 });
  }
}
