import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://53dd71d46740fc2468ba8bdbeaa5cf8a@o4509594454851584.ingest.us.sentry.io/4511252672544768",

  // 1. Capture 100% of Performance traces (lower this in high-traffic production)
  tracesSampleRate: 1.0,
  
  // 2. Capture IP Address, User Agents, OS and identifying details explicitly!
  sendDefaultPii: true,

  // 3. Replay sessions (literally watch users interact with your app)
  replaysSessionSampleRate: 1.0, // Watch 100% of normal sessions (set to 0.1 in prod)
  replaysOnErrorSampleRate: 1.0, // Watch 100% of sessions with an error

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,  // Do not blur text on screen
      blockAllMedia: false, // Do not blur images
    }),
    Sentry.browserTracingIntegration(),
  ],
});
