/**
 * FairGuard GCP Structured Error Logger
 * Provides structured logging for all external GCP service calls.
 * In production, logs appear as structured JSON in Cloud Logging.
 */

const SEVERITY = { DEBUG: "DEBUG", INFO: "INFO", WARNING: "WARNING", ERROR: "ERROR", CRITICAL: "CRITICAL" };

function emitLog(severity, service, operation, message, extra = {}) {
  const isProduction = process.env.NODE_ENV === "production";
  const entry = {
    severity, timestamp: new Date().toISOString(),
    service: `[GCP][${service}]`, operation,
    message: String(message), ...extra,
    ...(process.env.GOOGLE_CLOUD_PROJECT ? { gcpProject: process.env.GOOGLE_CLOUD_PROJECT } : {}),
  };
  if (isProduction) {
    process.stdout.write(JSON.stringify(entry) + "\n");
  } else {
    const prefix = `[FairGuard][GCP][${service}] ${operation}`;
    const extraStr = Object.keys(extra).length > 0 ? ` | ${JSON.stringify(extra)}` : "";
    if (severity === SEVERITY.ERROR || severity === SEVERITY.CRITICAL) console.error(`❌ ${prefix}: ${message}${extraStr}`);
    else if (severity === SEVERITY.WARNING) console.warn(`⚠️  ${prefix}: ${message}${extraStr}`);
    else console.info(`ℹ️  ${prefix}: ${message}${extraStr}`);
  }
}

export const gcpLog = {
  debug:    (svc, op, msg, ctx = {}) => emitLog(SEVERITY.DEBUG,    svc, op, msg, ctx),
  info:     (svc, op, msg, ctx = {}) => emitLog(SEVERITY.INFO,     svc, op, msg, ctx),
  warn:     (svc, op, msg, ctx = {}) => emitLog(SEVERITY.WARNING,  svc, op, msg, ctx),
  error:    (svc, op, err, ctx = {}) => {
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack?.split("\n").slice(0, 4).join(" | ") : undefined;
    emitLog(SEVERITY.ERROR, svc, op, msg, { ...ctx, ...(stack ? { stack } : {}) });
  },
  critical: (svc, op, err, ctx = {}) => {
    const msg = err instanceof Error ? err.message : String(err);
    emitLog(SEVERITY.CRITICAL, svc, op, msg, { ...ctx, alert: "CRITICAL — check GCP service health" });
  },
  fallback: (from, to, reason) => emitLog(SEVERITY.WARNING, from, "fallback_activated", reason, { fallback_target: to }),
};
