import { NextResponse } from "next/server";
import { generateRemediationCode } from "@/lib/gemini";

export async function POST(request) {
  try {
    const { metrics } = await request.json();
    const code = await generateRemediationCode(metrics);
    return NextResponse.json({ status: "success", code });
  } catch (e) {
    return NextResponse.json(
      { error: `Remediation code generation failed: ${e.message}` },
      { status: 500 }
    );
  }
}
