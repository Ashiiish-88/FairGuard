/**
 * Vertex AI Model Registry Integration
 * =====================================
 * Registers FairGuard's bias detection pipeline as a model in the
 * Vertex AI Model Registry for audit trail and versioning.
 *
 * Gracefully fails if credentials aren't present — this is a bonus
 * GCP integration point, not required for core functionality.
 */

import { gcpLog } from "@/lib/gcp-logger";

let _modelServiceClient = null;
let _registryAvailable = null; // null = unknown, true/false after first check

function cleanEnvValue(value) {
  if (!value) return "";
  let cleaned = value.trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) cleaned = cleaned.slice(1, -1);
  if (cleaned.startsWith("'") && cleaned.endsWith("'")) cleaned = cleaned.slice(1, -1);
  return cleaned;
}

async function getModelServiceClient() {
  if (_registryAvailable === false) return null;

  if (_modelServiceClient) return _modelServiceClient;

  const project = cleanEnvValue(process.env.GOOGLE_CLOUD_PROJECT);
  const location = cleanEnvValue(process.env.GOOGLE_CLOUD_LOCATION || "us-central1");
  const clientEmail = cleanEnvValue(process.env.GCP_CLIENT_EMAIL);
  const privateKey = cleanEnvValue(process.env.GCP_PRIVATE_KEY)?.replace(/\\n/g, "\n");

  if (!project || !clientEmail || !privateKey) {
    _registryAvailable = false;
    gcpLog.info("VertexAI", "model-registry", "Model Registry skipped — GCP credentials not configured");
    return null;
  }

  try {
    const { ModelServiceClient } = await import("@google-cloud/aiplatform");

    _modelServiceClient = new ModelServiceClient({
      apiEndpoint: `${location}-aiplatform.googleapis.com`,
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      projectId: project,
    });
    _registryAvailable = true;
    gcpLog.info("VertexAI", "model-registry", "Model Registry client initialized", { project, location });
    return _modelServiceClient;
  } catch (e) {
    _registryAvailable = false;
    gcpLog.error("VertexAI", "model-registry-init", e, { project });
    return null;
  }
}

/**
 * Register the FairGuard bias detection pipeline as a model in Vertex AI.
 * This creates a metadata-only model entry (no actual artifact upload).
 */
export async function registerBiasModel(auditMetadata = {}) {
  const client = await getModelServiceClient();
  if (!client) {
    return { registered: false, reason: "Model Registry not available" };
  }

  const project = cleanEnvValue(process.env.GOOGLE_CLOUD_PROJECT);
  const location = cleanEnvValue(process.env.GOOGLE_CLOUD_LOCATION || "us-central1");
  const parent = `projects/${project}/locations/${location}`;

  const model = {
    displayName: "fairguard-bias-detection-pipeline",
    description: "FairGuard AI Bias Detection Pipeline — automated fairness auditing with 5 statistical metrics, multi-model comparison, and legal compliance mapping. Built for Google Solution Challenge 2026.",
    versionDescription: `Audit run at ${new Date().toISOString()}. Domain: ${auditMetadata.domain || "general"}. Fairness Score: ${auditMetadata.fairnessScore || "N/A"}.`,
    labels: {
      "sdg-10": "reduced-inequalities",
      "sdg-16": "peace-justice-institutions",
      "solution-challenge": "2026",
      "domain": (auditMetadata.domain || "general").replace(/[^a-z0-9_-]/g, "_"),
    },
    // Metadata-only model — no containerSpec since this is a JS pipeline, not a served model
    metadataSchemaUri: "",
  };

  try {
    const [operation] = await client.uploadModel({ parent, model });
    const [response] = await operation.promise();

    gcpLog.info("VertexAI", "model-registry", "Model registered successfully", {
      modelName: response.model,
      domain: auditMetadata.domain,
    });

    return {
      registered: true,
      modelName: response.model,
      modelId: response.modelVersionId,
    };
  } catch (e) {
    // Don't fail the audit if registry fails
    gcpLog.error("VertexAI", "model-registry-upload", e, {
      domain: auditMetadata.domain,
    });
    return {
      registered: false,
      reason: e.message,
    };
  }
}

/**
 * Check if a model is already registered.
 */
export async function getRegisteredModel() {
  const client = await getModelServiceClient();
  if (!client) return null;

  const project = cleanEnvValue(process.env.GOOGLE_CLOUD_PROJECT);
  const location = cleanEnvValue(process.env.GOOGLE_CLOUD_LOCATION || "us-central1");
  const parent = `projects/${project}/locations/${location}`;

  try {
    const [models] = await client.listModels({
      parent,
      filter: 'display_name="fairguard-bias-detection-pipeline"',
    });

    if (models && models.length > 0) {
      return {
        exists: true,
        modelName: models[0].name,
        displayName: models[0].displayName,
        createTime: models[0].createTime,
        versionCount: models[0].versionId,
      };
    }
    return { exists: false };
  } catch (e) {
    gcpLog.error("VertexAI", "model-registry-list", e);
    return { exists: false, error: e.message };
  }
}

export function isRegistryAvailable() {
  return _registryAvailable !== false;
}
