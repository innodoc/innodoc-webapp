import { defineConfig, devices } from '@playwright/test'

// Dedicated port for the e2e server so it never collides with a regular dev
// server on INNODOC_PORT (3000). Override with INNODOC_E2E_PORT if needed,
// e.g. when running e2e in parallel worktrees.
const e2ePort = process.env.INNODOC_E2E_PORT ?? '3001'
const baseURL = `https://localhost:${e2ePort}`

// Which URL scheme the app runs under. The course slug mode changes where a course sits in the URL,
// which is what the smoke tests assert, so the suite runs against each mode: pass
// `INNODOC_PUBLIC_COURSE_SLUG_MODE=URL` in the environment to run it against URL mode.
const courseSlugMode = process.env.INNODOC_PUBLIC_COURSE_SLUG_MODE ?? 'SINGLE'

/** Slug of the course the mock API serves */
const courseSlug = 'test-course'

// See https://playwright.dev/docs/test-configuration.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,

  // Fail on CI if test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI. Locally the cap is the point: the dev server is a single
  // Node process, and every worker's page load opens the whole module graph as concurrent HTTP/2
  // streams on it. Beyond ~8 concurrent loads its response latency tail grows until the specs'
  // 5s URL assertions stall (the URL-stall flake family). Measured wall time is flat (~21s) from
  // 12 workers down to 4, so the cap costs nothing here and buys margin against sibling load.
  workers: process.env.CI ? 1 : 8,

  reporter: 'html',

  use: {
    baseURL,
    // The dev server serves a self-signed certificate (mkcert locally, a throwaway one in CI)
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },

  projects: [
    {
      // Warm up a cold dev server before the real specs. The webServer readiness above proves the
      // API answers, not that the client bundle serves: on the first boot Vite transforms the
      // module graph on demand, and page loads in that window lose module requests (HTTP/2 resets)
      // and never fully hydrate, so the first client-side navigation in the real specs degrades
      // into a full page load. One warm page load makes the transform caches hot.
      name: 'setup',
      testMatch: /global\.setup\.ts/u,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],

  /* Start the app in mock mode (no DB needed) before running the tests.
   * Same as running `pnpm dev:mock` from the repo root, but bound to the
   * dedicated e2e port. */
  webServer: {
    command: 'pnpm dev:mock',
    cwd: '..',
    // Readiness of the server, not of the app: an HTML route answers 500 once rendering breaks, and
    // waiting for that here would time out instead of letting the tests report what is broken.
    url: `${baseURL}/api/course/${courseSlug}`,
    env: {
      INNODOC_PORT: e2ePort,
      // Keep the app's self-reported root URL in sync with the server
      INNODOC_PUBLIC_APP_ROOT: `${baseURL}/`,
      INNODOC_PUBLIC_COURSE_SLUG_MODE: courseSlugMode,
    },
    ignoreHTTPSErrors: true,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
