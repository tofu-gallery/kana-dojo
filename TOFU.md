# KanaDojo on Tofu

KanaDojo is a Japanese study app by LingDojo: drills for hiragana and katakana,
kanji and vocabulary by JLPT level, timed and "zen" practice modes, kana charts,
a verb conjugation tool, progress and streak tracking, achievements, and more
than a hundred themes. Everything a learner does is kept in their own browser,
so a copy works for every visitor without accounts or a database.

This fork (`tofu-gallery/kana-dojo`) keeps `main` identical to upstream. The
`tofu` branch holds the small changes below, and the tag `pin/2026-10-23` marks
the commit the Tofu gallery copies.

## How Tofu runs it

| | |
| --- | --- |
| Framework preset | `nextjs` (Next.js 16.4.2, App Router). Ignore the root `Dockerfile`: it is upstream's local Docker set-up, not the way to host it. |
| Install | `npm ci` (the repository's own `package-lock.json`) |
| Build | `npm run build`, which runs `scripts/generate-commit-info.mjs`, then `next build`, then `next-sitemap` (postbuild). `vercel.json` sets the build command to `npm run clean:all && npm run build`. |
| Output | `.next` (a standard Next.js app, started with `next start`) |
| Environment variables | None are needed. |
| Database | None. Progress, streaks, achievements and settings live in each visitor's browser (localStorage and IndexedDB). The `supabase/` folder belongs to upstream's own bug-report pipeline, which a copy does not run. |

### Optional settings (a copy runs fine without any of them)

- `GOOGLE_TRANSLATE_API_KEY`, or `AZURE_TRANSLATOR_KEY` with
  `AZURE_TRANSLATOR_REGION` (and optionally `AZURE_TRANSLATOR_ENDPOINT`), or AWS
  credentials with `AWS_REGION`: turn on the Translator page (`/translate`).
  Without one, that page loads but each translation answers "Translation
  service configuration error". `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and
  `TURNSTILE_SECRET_KEY` add Cloudflare's bot check to that page.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: shared rate limits and
  the `/api/progress-sync` route. Without them rate limits are kept in memory and
  that route answers "Progress sync backend is not configured"; the app's own
  screens keep progress in the browser either way.
- `NEXT_PUBLIC_SITE_URL` and `SITE_URL`: the copy's own address for the
  breadcrumb structured data and the generated sitemap. Without them both name
  `https://kanadojo.com`.
- Everything else the code reads (`GITHUB_PAT`, `CRON_SECRET`, `SUPABASE_*`,
  `TALLY_*`, `DEEPSEEK_*`, `INDEXNOW_KEY`, the `trigger-*` and bug-report
  routes) is upstream's own operations tooling. Those routes refuse requests
  when their settings are missing; a copy should leave them unset.

## What we changed, and why

Every change removes advertising or tracking that would otherwise report a
copy's visitors to the upstream site's accounts. Each modified source file says
so at its top (GNU AGPL v3, section 5(a)).

- `app/layout.tsx`: removed the Google AdSense script (upstream's publisher
  account, loaded on every Vercel production deployment), Google Analytics,
  Vercel Web Analytics and Vercel Speed Insights, and the DNS-prefetch and
  preconnect hints for those services.
- `shared/ui-composite/Ads/AdSenseDisplay.tsx`: `isAdSenseEnabled` is always
  `false`, so no ad slot is ever rendered, even if upstream switches one of its
  ad placements back on later.
- `instrumentation-client.ts`: removed the Sentry browser SDK set-up, which sent
  errors, traces, logs and visitor details (`sendDefaultPii: true`) to the
  upstream Sentry project. The stale-chunk reload handler is unchanged.
- `instrumentation.ts`: removed the Sentry server and edge set-up and the
  server-side PostHog client. The `__posthogServer` global type stays so
  `shared/analytics/posthog-server.ts` still type-checks; its helpers are now
  no-ops.
- `sentry.server.config.ts`, `sentry.edge.config.ts`: emptied (they held the
  upstream Sentry DSN), and nothing imports them any more.
- `next.config.ts`: the config is no longer wrapped in `withSentryConfig`
  (upstream's Sentry org and project, source-map upload, and the `/monitoring`
  tunnel to Sentry).
- `vercel.json` (JSON has no comments, so it is recorded here): removed
  `ignoreCommand` (`scripts/vercel-ignore.sh` skips builds whose last commit is
  one of upstream's `chore(automation):` commits or touches only content files,
  which would make a copy's deploy silently do nothing) and the `crons` entry
  (it called upstream's bug-report processor every 20 minutes, which needs
  Supabase, GitHub and DeepSeek keys, and Vercel's Hobby plan refuses crons that
  run more than once a day). Everything else in the file is unchanged.
- `TOFU.md`: this file.

Nothing was removed from the repository, the dependency list and lockfile are
upstream's, and the name, logo, favicon, links and texts are untouched. Already
inert upstream code was left as it was: the Microsoft Clarity component (fully
commented out), the client-side PostHog block (commented out),
`core/analytics/GoogleAnalytics.tsx` (no longer imported), the Sentry example
page and API route (with no Sentry client they send nothing), and the ad
placements that upstream itself switched off.

## Upstream

- Repository: https://github.com/lingdojo/kana-dojo
- Branch and commit: `main` at `c34ad792c415b6ecb487d305a92aba3eea807dc6`
  (2026-10-23, "chore(automation): track PR author pendevster")
- Licence: GNU Affero General Public License v3.0, in `LICENSE.md`, unchanged.
  This fork, including the changes above, is under the same licence.

## Before offering it to users

- AGPL v3 section 13: a modified version run as a network service must offer
  its users the Corresponding Source of that version. The app's GitHub links
  point at upstream's repository; this version's source is
  https://github.com/tofu-gallery/kana-dojo at tag `pin/2026-10-23`. Whoever
  offers copies should make that source link available to the copy's visitors
  (for example on the gallery listing and in the copied project).
- The app loads theme wallpapers from upstream's asset host
  (`https://assets.kanadojo.com/wallpapers/`). Those images are not in the
  repository; if upstream moves them, the wallpaper themes lose their pictures
  and the rest of the app is unaffected.
- Upstream's own prompts stay as they are: a donation dialog (Ko-fi, for the
  LingDojo authors) appears on some page changes, the bottom bar links to
  upstream's Discord, GitHub and Ko-fi, and the bug buttons open upstream's
  Tally form.
- Pages name `https://kanadojo.com` as their canonical address, Open Graph URL
  and structured-data URL; upstream hard-codes these, so search engines treat
  a copy as a duplicate of kanadojo.com. `NEXT_PUBLIC_SITE_URL` and `SITE_URL`
  change only the breadcrumb data and the generated sitemap.
- `public/` keeps upstream's site-verification files (`ads.txt`, a Google
  verification page and an IndexNow key file). They load nothing and do
  nothing on another domain.
- Upstream's GitHub Actions workflows are in `.github/workflows`; they need
  upstream's secrets and should stay disabled on this fork.
- Upstream commits several times a day, mostly content updates under
  `community/`. Syncing `tofu` onto a newer `main` conflicts only when upstream
  edits one of the files listed above.

## Verification (2026-10-23, macOS, Node 22.22.3, npm 10.9.8)

- `HUSKY=0 PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci --no-audit --no-fund`:
  1,177 packages installed, exit 0 (the two variables only skip upstream's git
  hook set-up and Playwright's test browsers).
- `npm run build`: compiled, TypeScript passed, 422 static pages generated,
  sitemap written, exit 0.
- `npm run start -- -p 4417`, then `curl` for HTTP 200 on `/`, `/kana`,
  `/kanji`, `/vocabulary`, `/kana/train`, `/kanji/train`, `/vocabulary/train`,
  `/kana/train/timed`, `/preferences`, `/progress`, `/translate`, `/zen`,
  `/conjugate`, `/credits`, `/about`, `/manifest.json`, `/favicon.ico`,
  `/data-kanji/N5.json`, `/data-vocab/n5.json` and `/api/healthcheck`: all 200.
  `/monitoring` (the old Sentry tunnel) answers 404.
- Headless Chrome on `/`, `/kana`, `/kana/train`, `/kanji`, `/vocabulary` and
  `/preferences`: no page errors and no console errors; the only hosts
  contacted were the app itself and `assets.kanadojo.com` (wallpapers).
- No Sentry DSN, AdSense publisher ID, Google Tag Manager, Clarity or Vercel
  Insights code is in the built client bundles.

## Size

The tree at the pin is about 1,695 files and 46 MB unpacked (about 35 MB as a
gzipped archive), inside the importer's limits, so nothing was slimmed.
