// instrumentation.ts
//
// Modified by Tofu (tofu-gallery/kana-dojo) on 2026-10-23: removed the Sentry
// server/edge set-up (upstream's Sentry project) and the server-side PostHog
// client, so a copy of KanaDojo sends no error reports or analytics anywhere.
// See TOFU.md.

/**
 * Next.js server-side instrumentation entry point.
 *
 * The global below is kept only so `@/shared/analytics/posthog-server` still
 * type-checks: nothing assigns it any more, so every capture helper there is a
 * silent no-op.
 */

declare global {
  var __posthogServer: import('posthog-node').PostHog | undefined;
}

export async function register(): Promise<void> {}
