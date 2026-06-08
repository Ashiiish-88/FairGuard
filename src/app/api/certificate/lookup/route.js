/**
 * Certificate Lookup Route
 * =========================
 * GET: Public — looks up certificate by ID from Firestore.
 * No auth required — anyone can verify.
 */

import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initFirebaseAdmin } from "@/lib/firebase-admin";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Certificate ID required" }, { status: 400 });

  try {
    initFirebaseAdmin();
    const db = getFirestore();
    const doc = await db.collection("certificates").doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    const data = doc.data();

    // Check expiry
    if (data.valid_until && new Date(data.valid_until) < new Date()) {
      data.status = "EXPIRED";
    }

    return NextResponse.json({ certificate: data });
  } catch (e) {
    return NextResponse.json({ error: `Lookup failed: ${e.message}` }, { status: 500 });
  }
}
