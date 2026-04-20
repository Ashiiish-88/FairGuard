import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://53dd71d46740fc2468ba8bdbeaa5cf8a@o4509594454851584.ingest.us.sentry.io/4511252672544768",
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
});
