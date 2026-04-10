import { NextResponse } from "next/server";
import { runFullAnalysis } from "@/lib/bias-engine";

export async function POST(request) {
  try {
    const body = await request.json();
    const { data, outcome_column, protected_columns, positive_outcome = 1, qualification_column = null } = body;

    if (!data || !outcome_column || !protected_columns?.length) {
      return NextResponse.json({ error: "Missing required fields: data, outcome_column, protected_columns" }, { status: 400 });
    }

    const results = runFullAnalysis(data, outcome_column, protected_columns, positive_outcome, qualification_column);

    return NextResponse.json({ status: "success", results });
  } catch (e) {
    return NextResponse.json({ error: `Analysis failed: ${e.message}` }, { status: 400 });
  }
}
