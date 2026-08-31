import { defineConfig, devices } from '@playwright/test'

// Dedicated port for the e2e server so it never collides with a regular dev
// server on INNODOC_PORT (3000). Override with INNODOC_E2E_PORT if needed,
// e.g. when running e2e in parallel worktrees.
const e2ePort = process.env.INNODOC_E2E_PORT ?? '3001'
const baseURL = `https://localhost:${e2ePort}`

// See https://playwright.dev/docs/test-configuration.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,

  // Fail on CI if test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    baseURL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Start the app in mock mode (no DB needed) before running the tests.
   * Same as running `pnpm dev:mock` from the repo root, but bound to the
   * dedicated e2e port. */
  webServer: {
    command: 'pnpm dev:mock',
    cwd: '..',
    url: baseURL,
    env: {
      INNODOC_PORT: e2ePort,
      // Keep the app's self-reported root URL in sync with the server
      INNODOC_APP_ROOT: `${baseURL}/`,
    },
    ignoreHTTPSErrors: true,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
