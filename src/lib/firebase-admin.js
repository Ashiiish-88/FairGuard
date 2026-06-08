/**
 * FairGuard Firebase Admin SDK (Server-Side)
 * ============================================
 * Separate from the client-side firebase.js.
 * Used by certificate routes and any server-side Firestore operations.
 *
 * Requires env vars:
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY
 */

import { initializeApp, getApps, cert } from "firebase-admin/app";

export function initFirebaseAdmin() {
  if (getApps().length > 0) return;

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("[FairGuard] Firebase Admin not configured — certificate features unavailable");
    // Initialize with default project ID at minimum for fallback
    if (projectId) {
      initializeApp({ projectId });
    }
    return;
  }

  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}
