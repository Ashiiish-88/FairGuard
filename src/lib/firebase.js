/**
 * FairGuard Firebase Client
 * ==========================
 * Firestore integration for audit history persistence.
 * Falls back to in-memory storage if Firebase not configured.
 *
 * PRIVACY: Only aggregate metrics stored. NEVER stores raw data.
 */

// In-memory fallback store (used when Firebase not configured)
const memoryStore = [];

let db = null;
let firebaseInitialized = false;

async function getDb() {
  if (firebaseInitialized) return db;
  firebaseInitialized = true;

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!apiKey || !projectId || apiKey === "...") {
    console.log("[FairGuard] Firebase not configured — using in-memory audit storage");
    return null;
  }

  try {
    const { initializeApp } = await import("firebase/app");
    const { getFirestore } = await import("firebase/firestore");

    const app = initializeApp({
      apiKey,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
      projectId,
    });

    db = getFirestore(app);
    console.log("[FairGuard] Firebase connected");
    return db;
  } catch (e) {
    console.warn("[FairGuard] Firebase init failed:", e.message);
    return null;
  }
}

/**
 * Save audit results to Firestore (or memory fallback).
 * Only stores aggregate metrics — never raw data.
 */
export async function saveAudit(auditData) {
  const record = {
    id: crypto.randomUUID ? crypto.randomUUID() : `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    domain: auditData.domain?.domain || "general",
    domain_label: auditData.domain?.label || "General",
    domain_icon: auditData.domain?.icon || "📊",
    fairness_score: auditData.fairness_score?.score ?? 0,
    grade: auditData.fairness_score?.grade || "—",
    label: auditData.fairness_score?.label || "—",
    dataset_rows: auditData.dataset_info?.total_rows ?? 0,
    dataset_columns: auditData.dataset_info?.total_columns ?? 0,
    protected_attributes: Object.keys(auditData.per_attribute || {}),
    flags: extractFlags(auditData),
    fingerprint: auditData.fingerprint?.axes || [],
    debt_risk_level: auditData.fairness_debt?.risk_level || "LOW",
    debt_total_inr: auditData.fairness_debt?.total_exposure?.inr || 0,
    debt_total_usd: auditData.fairness_debt?.total_exposure?.usd || 0,
    debt_total_eur: auditData.fairness_debt?.total_exposure?.eur || 0,
    affected_people: auditData.fairness_debt?.affected_people_estimate || 0,
  };

  const firestore = await getDb();

  if (!firestore) {
    // In-memory fallback
    memoryStore.unshift(record);
    if (memoryStore.length > 50) memoryStore.pop();
    return { success: true, id: record.id, storage: "memory" };
  }

  try {
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
    const docRef = await addDoc(collection(firestore, "audits"), {
      ...record,
      timestamp: serverTimestamp(),
    });
    return { success: true, id: docRef.id, storage: "firestore" };
  } catch (e) {
    // Fallback to memory on failure
    memoryStore.unshift(record);
    return { success: true, id: record.id, storage: "memory", note: e.message };
  }
}

/**
 * List past audits (from Firestore or memory fallback).
 */
export async function listAudits(limit = 20) {
  const firestore = await getDb();

  if (!firestore) {
    return { audits: memoryStore.slice(0, limit), storage: "memory" };
  }

  try {
    const { collection, query, orderBy, getDocs, limit: fsLimit } = await import("firebase/firestore");
    const q = query(collection(firestore, "audits"), orderBy("timestamp", "desc"), fsLimit(limit));
    const snap = await getDocs(q);
    const audits = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { audits, storage: "firestore" };
  } catch (e) {
    return { audits: memoryStore.slice(0, limit), storage: "memory", note: e.message };
  }
}

/**
 * Extract human-readable flags from analysis results.
 */
function extractFlags(results) {
  const flags = [];

  // Check for disparate impact violations
  for (const [attr, data] of Object.entries(results.per_attribute || {})) {
    if (data.disparate_impact?.violation) {
      flags.push(`${attr}_bias`);
    }
  }

  // Check for proxy features
  if (results.proxies?.length > 0) {
    flags.push("proxy_detection");
  }

  // Check for intersectional gaps
  const worstGap = results.intersectional?.worst_group?.gap_from_average ?? 0;
  if (worstGap > 0.15) {
    flags.push("intersectional_gap");
  }

  return flags;
}
