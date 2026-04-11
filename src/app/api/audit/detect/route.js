import { NextResponse } from "next/server";
import { autoDetectColumns, detectDomain } from "@/lib/bias-engine";

export async function POST(request) {
  try {
    const { data } = await request.json();
    if (!data?.length) return NextResponse.json({ error: "No data provided" }, { status: 400 });

    const sampleData = data.slice(0, 100);
    const detected = autoDetectColumns(sampleData);
    const domain = detectDomain(sampleData);

    return NextResponse.json({
      status: "success",
      detected,
      domain,
      total_columns: Object.keys(data[0]).length,
      total_rows: data.length,
    });
  } catch (e) {
    return NextResponse.json({ error: `Detection failed: ${e.message}` }, { status: 400 });
  }
}
