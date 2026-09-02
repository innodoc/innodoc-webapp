import { expect, test } from '@playwright/test'

const courseSlugMode = process.env.INNODOC_PUBLIC_COURSE_SLUG_MODE ?? 'SINGLE'

/** Slug of the course the mock API serves */
const courseSlug = 'test-course'

interface UrlScheme {
  /** Path to open to reach the course home */
  entry: string
  /** Path the course home ends on */
  home: string
  /** Path the landing page ends on */
  landing: string
}

// Where the course sits in the URL decides the journey. In URL mode the slug is a path segment and
// the landing page is the built-in index; in SINGLE mode the course comes from the configuration and
// the landing page redirects into it.
const scheme: UrlScheme =
  courseSlugMode === 'URL'
    ? { entry: `/en/${courseSlug}`, home: `/en/${courseSlug}/page/home`, landing: '/en' }
    : { entry: '/en', home: '/en/page/home', landing: '/en/page/home' }

// If the server, the SSR rendering, or the fixture data break, this fails.
test('landing page renders the app', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(new RegExp(`${scheme.landing}$`, 'u'))
  await expect(page.getByRole('banner')).toBeVisible()
})

test('course home renders its content', async ({ page }) => {
  await page.goto(scheme.entry)

  await expect(page).toHaveURL(new RegExp(`${scheme.home}$`, 'u'))
  await expect(page).toHaveTitle('Course for testing')
  await expect(page.getByRole('heading', { name: 'Home page' })).toBeVisible()
})

// Regression guard: the dev server speaks HTTP/2, and a page load opens the whole module graph as
// concurrent streams while Vite transforms keep the event loop busy. When the session's memory use
// exceeds Node's `maxSessionMemory` cap, Node resets new streams with ENHANCE_YOUR_CALM, the browser
// fails those module requests with `ERR_HTTP2_PROTOCOL_ERROR`, and the app stays stuck on the SSR
// DOM (no hydration). The cap must stay above the peak of a dev page load - see the option in
// `apps/backend/src/plugins/env/dev.ts`.
test('dev server module graph loads without HTTP/2 protocol errors', async ({ page }) => {
  const failures = new Set<string>()

  page.on('requestfailed', (request) => {
    failures.add(request.failure()?.errorText ?? 'unknown error')
  })

  await page.goto(scheme.entry, { waitUntil: 'networkidle' })

  const protocolErrors = [...failures].filter((failure) => failure.includes('ERR_HTTP2_PROTOCOL_ERROR'))

  expect(protocolErrors, `module requests failed with: ${[...failures].join(', ')}`).toHaveLength(0)
})

// Regression guard: a nav link whose URL could not be generated threw while the app shell rendered,
// and the request answered 200 with an empty body - a white screen. The routes around a course are
// where that happened, in the mode where a course URL needs a slug those very routes lack.
for (const path of ['/en', '/en/user/login', '/en/user/sign-up', '/en/user/forgot-password']) {
  test(`route ${path} serves a rendered app shell`, async ({ request }) => {
    const response = await request.get(path)

    expect(response.status()).toBe(200)

    const body = await response.text()

    expect(body).toContain('id="root"')
    // The app bar: proof that the shell rendered, not just an empty mount point
    expect(body).toContain('<header')
  })
}
