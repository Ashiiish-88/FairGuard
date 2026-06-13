import { NextResponse } from "next/server";
import { getGroundedComplianceNews } from "@/lib/gemini";

export async function POST(request) {
  try {
    const { domain, regulations } = await request.json();
    const news = await getGroundedComplianceNews(domain, regulations || []);
    return NextResponse.json({ status: "success", ...news });
  } catch (e) {
    return NextResponse.json(
      { error: `Regulatory news fetch failed: ${e.message}` },
      { status: 500 }
    );
  }
}
