/**
 * Certificate Generation Route
 * ==============================
 * POST: Generates a tamper-evident bias certificate when fairness score ≥ 70.
 * Stores in Firestore with SHA-256 hash chain.
 */

import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import crypto from "crypto";
import { initFirebaseAdmin } from "@/lib/firebase-admin";
import { getAIProvider } from "@/lib/gemini";
import { buildLegalComplianceMapping } from "@/lib/regulation-db";
import { gcpLog } from "@/lib/gcp-logger";

function generateCertId(domain) {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  const dom = (domain || "general").substr(0, 6).toUpperCase();
  return `FG-${year}-${random}-${dom}`;
}

export async function POST(request) {
  try {
    const {
      audit_results,
      organization_name,
      system_name,
      deployment_context,
      dataset_period,
      auditor_name,
      previous_cert_id = null,
    } = await request.json();

    const score = audit_results?.fairness_score?.score ?? 0;

    // Only issue if score >= 70
    if (score < 70) {
      return NextResponse.json({
        error: "Certificate not issued: fairness score below 70",
        score,
        threshold: 70,
      }, { status: 422 });
    }

    initFirebaseAdmin();

    let db;
    try {
      db = getFirestore();
    } catch (e) {
      // Firestore unavailable — return certificate without persistence
      const certId = generateCertId(deployment_context);
      const issuedAt = new Date().toISOString();
      const validUntil = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString();

      const metricsSnapshot = {
        score: audit_results.fairness_score?.score,
        grade: audit_results.fairness_score?.grade,
        domain: audit_results.domain?.domain,
        issued_at: issuedAt,
      };
      const resultsHash = crypto
        .createHash("sha256")
        .update(JSON.stringify(metricsSnapshot))
        .digest("hex");

      gcpLog.warn("Firebase", "getFirestore", "Firestore unavailable — issuing certificate in memory only", {
        error: e.message,
        certId,
      });

      const memCert = {
        certificate_id: certId,
        issued_at: issuedAt,
        valid_until: validUntil,
        organization_name: organization_name || "Organization",
        system_name: system_name || "AI System",
        deployment_context: deployment_context || audit_results.domain?.domain || "general",
        dataset_period: dataset_period || "Not specified",
        auditor_name: auditor_name || "FairGuard User",
        fairness_score: score,
        letter_grade: audit_results.fairness_score?.grade,
        dimensions_checked: Object.keys(audit_results.per_attribute || {}),
        results_hash: resultsHash,
        previous_audit_hash: null,
        status: "VALID",
        model_used: `Gemini 2.5 Flash (${getAIProvider()})`,
        legal_compliance_mapping: buildLegalComplianceMapping(audit_results),
      };

      return NextResponse.json({ status: "issued", storage: "memory", certificate: memCert });
    }

    // Get previous audit hash for chain
    let previousAuditHash = null;
    if (previous_cert_id) {
      try {
        const prevDoc = await db.collection("certificates").doc(previous_cert_id).get();
        if (prevDoc.exists) {
          previousAuditHash = crypto
            .createHash("sha256")
            .update(JSON.stringify(prevDoc.data()))
            .digest("hex");
        }
      } catch {
        // Previous cert lookup failed — continue without chain
      }
    }

    const certId = generateCertId(deployment_context);
    const issuedAt = new Date().toISOString();
    const validUntil = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString();

    // Build the metrics snapshot for hashing
    const metricsSnapshot = {
      score: audit_results.fairness_score?.score,
      grade: audit_results.fairness_score?.grade,
      di_ratio: Object.values(audit_results.per_attribute || {})[0]?.disparate_impact?.ratio,
      dp_diff: Object.values(audit_results.per_attribute || {})[0]?.demographic_parity?.difference,
      proxy_count: audit_results.proxies?.length ?? 0,
      domain: audit_results.domain?.domain,
      issued_at: issuedAt,
    };

    const resultsHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(metricsSnapshot))
      .digest("hex");

    const certificate = {
      certificate_id: certId,
      issued_at: issuedAt,
      valid_until: validUntil,
      organization_name: organization_name || "Organization",
      system_name: system_name || "AI System",
      deployment_context: deployment_context || audit_results.domain?.domain || "general",
      dataset_period: dataset_period || "Not specified",
      auditor_name: auditor_name || "FairGuard User",
      fairness_score: score,
      letter_grade: audit_results.fairness_score?.grade,
      dimensions_checked: Object.keys(audit_results.per_attribute || {}),
      di_ratio: metricsSnapshot.di_ratio,
      dp_diff: metricsSnapshot.dp_diff,
      proxy_contamination: (audit_results.proxies?.length ?? 0) === 0 ? "none" : `${audit_results.proxies.length} proxies detected`,
      model_used: `Gemini 2.5 Flash (${getAIProvider()})`,
      results_hash: resultsHash,
      previous_audit_hash: previousAuditHash,
      status: "VALID",
      legal_compliance_mapping: buildLegalComplianceMapping(audit_results),
    };

    try {
      await db.collection("certificates").doc(certId).set(certificate);
      gcpLog.info("Firebase", "Firestore.set", "Certificate persisted to Firestore", { certId });
    } catch (firestoreErr) {
      gcpLog.error("Firebase", "Firestore.set", firestoreErr, { certId, action: "certificate_persist_failed" });
      // Return the certificate anyway — persistence failure should not block issuance
    }

    return NextResponse.json({ status: "issued", certificate });
  } catch (e) {
    return NextResponse.json({ error: `Certificate generation failed: ${e.message}` }, { status: 500 });
  }
}
