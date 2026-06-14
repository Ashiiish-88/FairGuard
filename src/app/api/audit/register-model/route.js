import { NextResponse } from "next/server";
import { registerBiasModel, getRegisteredModel, isRegistryAvailable } from "@/lib/vertex-registry";

export async function POST(request) {
  try {
    const { domain, fairnessScore } = await request.json();
    const result = await registerBiasModel({ domain, fairnessScore });
    return NextResponse.json({ status: "success", ...result });
  } catch (e) {
    return NextResponse.json(
      { error: `Model registration failed: ${e.message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!isRegistryAvailable()) {
      return NextResponse.json({ available: false, reason: "GCP credentials not configured" });
    }
    const model = await getRegisteredModel();
    return NextResponse.json({ available: true, ...model });
  } catch (e) {
    return NextResponse.json(
      { error: `Model registry check failed: ${e.message}` },
      { status: 500 }
    );
  }
}
