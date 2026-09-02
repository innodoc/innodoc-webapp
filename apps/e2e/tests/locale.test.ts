import type { APIResponse, Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

const courseSlugMode = process.env.INNODOC_PUBLIC_COURSE_SLUG_MODE ?? 'SINGLE'

/** Slug of the course the mock API serves */
const courseSlug = 'test-course'

interface LocaleCase {
  /** Label of the drawer button that opens the navigation, in this locale */
  navigation: string
  /** Path of the course home page */
  path: string
  /** `Accept-Language` of a browser that prefers this locale */
  acceptLanguage: string
}

/** The fixture course is translated into these two, and each has a page `home` */
const cases: Record<'de' | 'en', LocaleCase> = {
  de: {
    acceptLanguage: 'de-DE,de;q=0.9',
    navigation: 'Navigation öffnen',
    path: courseSlugMode === 'URL' ? `/de/${courseSlug}/page/home` : '/de/page/home',
  },
  en: {
    acceptLanguage: 'en-US,en;q=0.9',
    navigation: 'Open navigation',
    path: courseSlugMode === 'URL' ? `/en/${courseSlug}/page/home` : '/en/page/home',
  },
}

// The dev server has to transform the whole module graph before the app hydrates
test.describe.configure({ timeout: 120_000 })

// Everything that runs in the browser is a string: the test project is compiled for Node, without
// the DOM library, so `window` has no type to check here.
const isHydrated = 'Object.keys(document.querySelector("#root") ?? {}).some((k) => k.startsWith("__reactContainer$"))'

/** Path of the `Location` header a redirect response carries (the server sends it relative) */
const locationPath = (response: APIResponse): string => {
  const location = response.headers().location

  if (!location) {
    throw new Error(`Expected a Location header, got: ${JSON.stringify(response.headers())}`)
  }

  return new URL(location, 'https://localhost').pathname
}

/**
 * Load `path` and wait until React has taken the document over.
 *
 * The dev server drops module requests under load (see `smoke.test.ts`), and a document whose
 * modules never loaded never hydrates. Load again until the app runs.
 */
async function openApp(page: Page, path: string) {
  await page.goto(path)

  for (let attempt = 0; attempt < 8; attempt++) {
    const hydrated = await page.waitForFunction(isHydrated, null, { timeout: 8000 }).then(
      () => true,
      () => false,
    )

    if (hydrated) {
      return
    }

    await page.reload()
  }

  throw new Error(`The app did not take over ${path}: its client modules never loaded`)
}

/**
 * The href of the first visible course page link other than `excludedHref`, or null.
 *
 * String form of `evaluate`, like `isHydrated` above: this project compiles for Node, without the
 * DOM library
 */
const firstVisiblePageLink = (excludedHref: string) =>
  `Array.from(document.querySelectorAll('a[href*="/page/"]')).find((a) =>
    a.getAttribute('href') !== ${JSON.stringify(excludedHref)} && !!a.offsetParent
  )?.getAttribute('href') ?? null`

/** The href of the first visible in-app link to a course page other than `excludedHref` */
async function linkToAnotherCoursePage(page: Page, excludedHref: string): Promise<string> {
  // The footer's page list is loaded by the client after hydration, so wait for it
  const handle = await page.waitForFunction(firstVisiblePageLink(excludedHref), { timeout: 30_000 })
  return (await handle.jsonValue()) as string
}

/**
 * The language of a document is decided by its URL.
 *
 * The server used to take it from the browser instead (`Accept-Language`, `?lng=`, cookie), while
 * `<html lang>`, the content and the state handed to the client all followed the URL. Whenever the
 * two disagreed, hydration replaced the UI strings of the markup with the other language, and React
 * reported a mismatch and threw the tree away to re-render it.
 */
for (const [locale, expected] of Object.entries(cases) as [keyof typeof cases, LocaleCase][]) {
  const other = locale === 'de' ? cases.en : cases.de

  // Checked on the markup alone: no client code runs here, so this says what the server decided. The
  // request is made to look like the other locale's browser, so URL and detection cannot agree by
  // accident.
  test(`SSR of the ${locale} page renders its UI in ${locale}, not in the browser's language`, async ({ request }) => {
    const response = await request.get(expected.path, { headers: { 'Accept-Language': other.acceptLanguage } })

    expect(response.status()).toBe(200)

    const html = await response.text()

    expect(html).toContain(`lang="${locale}"`)
    expect(html).toContain(`aria-label="${expected.navigation}"`)
    expect(html).not.toContain(`aria-label="${other.navigation}"`)

    // The header describes the document, so it must not stay on the detected language
    expect(response.headers()['content-language']).toBe(locale)
  })

  // The same page in a browser that prefers the other language: the markup and the hydrated app
  // agree, so React keeps the tree it was given. This is the symptom that was reported.
  test(`the ${locale} page hydrates in a browser preferring ${other === cases.en ? 'English' : 'German'}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ locale: other.acceptLanguage.split(',')[0] })
    const page = await context.newPage()

    const errors: string[] = []
    // React reports a failed hydration as an uncaught error, which Playwright delivers as `pageerror`
    // rather than as console output, so both are collected
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text())
      }
    })
    page.on('pageerror', (error) => errors.push(error.message))

    try {
      // The dev server drops module requests under load (see `smoke.test.ts`), and a document whose
      // modules never loaded never hydrates: without hydration there is nothing to mismatch, so the
      // assertions below would pass on a page that never came alive. Load again until React takes
      // over.
      await page.goto(expected.path)

      for (let attempt = 0; attempt < 8; attempt++) {
        const hydrated = await page.waitForFunction(isHydrated, null, { timeout: 8000 }).then(
          () => true,
          () => false,
        )

        if (hydrated) {
          break
        }

        if (attempt === 7) {
          throw new Error(`The app did not take over ${expected.path}: its client modules never loaded`)
        }

        await page.reload()
      }

      const hydrationErrors = errors.filter((error) => /hydrat/iu.test(error))
      expect(hydrationErrors, `console errors: ${errors.join('\n')}`).toHaveLength(0)

      // And what the markup carries stays in the language of the URL. The drawer button is hidden at
      // desktop width, so it is looked up by attribute rather than by role, which skips hidden nodes.
      await expect(page.locator(`[aria-label="${expected.navigation}"]`)).toBeAttached()
    } finally {
      await context.close()
    }
  })
}

// The root redirect is the one place detection still steers a document, and it must follow the
// browser's stated preference alone: a `?lng=` param and a stale `i18next` cookie used to out-vote
// `Accept-Language`. Neither may, and detection stays read-only - no cookie is ever written.
test('the root redirect follows Accept-Language, ignoring ?lng= and the i18next cookie', async ({ request }) => {
  // A browser that prefers German asks for English through the query-string back door
  const byQuery = await request.get('/?lng=en', {
    maxRedirects: 0,
    headers: { 'Accept-Language': 'de-DE,de;q=0.9' },
  })

  expect(byQuery.status()).toBe(302)
  expect(locationPath(byQuery)).toMatch(/^\/de\//u)
  expect(byQuery.headers()['set-cookie']).toBeUndefined()

  // A browser that prefers English carries a stale German cookie
  const byCookie = await request.get('/', {
    maxRedirects: 0,
    headers: { 'Accept-Language': 'en-US,en;q=0.9', cookie: 'i18next=de' },
  })

  expect(byCookie.status()).toBe(302)
  expect(locationPath(byCookie)).toMatch(/^\/en\//u)
  expect(byCookie.headers()['set-cookie']).toBeUndefined()

  // Detection never steers a deep link: an ISO 639-1 code the course does not offer is corrected
  // downstream to the course's first locale (the fixture course declares `en` first) - even for a
  // browser that prefers the other published locale. If detection still reached deep links, a
  // German browser would land in `/de`. (A tag outside the ISO 639-1 domain is not a route at all
  // now, which is pinned on its own below.)
  const deepLink = await request.get('/fr', {
    maxRedirects: 0,
    headers: { 'Accept-Language': 'de-DE,de;q=0.9' },
  })

  expect(deepLink.status()).toBe(302)
  expect(locationPath(deepLink)).toBe('/en')

  // A locale outside the ISO 639-1 domain is not a route: the deep link 404s instead of being
  // corrected or rendered, and nothing is written to the browser.
  const notARoute = await request.get('/xx', {
    maxRedirects: 0,
    headers: { 'Accept-Language': 'de-DE,de;q=0.9' },
  })

  expect(notARoute.status()).toBe(404)
  expect(notARoute.headers()['set-cookie']).toBeUndefined()
})

// A valid ISO 639-1 code without a UI bundle: the document renders in the default locale, and the
// tag, the header and the rendered strings must all carry that one language - the URL's locale
// must not leak into `<html lang>` or into the state the client hydrates with.
test('SSR of an unpublished-locale page carries one language in tag, header, and strings', async ({ request }) => {
  const response = await request.get('/fr/user/login', { headers: { 'Accept-Language': 'de-DE,de;q=0.9' } })

  expect(response.status()).toBe(200)

  const html = await response.text()

  expect(html).toContain('lang="en"')
  expect(html).toContain('aria-label="Open navigation"')
  expect(html).not.toContain('aria-label="Navigation öffnen"')

  // The header describes the document, so it must not stay on the detected language
  expect(response.headers()['content-language']).toBe('en')
})

// The same page, hydrated, in a browser that prefers the other published locale: the client
// mirrors the server's resolution, so nothing it carries - tag, strings, i18next - switches away
// from the language the document was served in, and React keeps the tree it was given.
test('an unpublished-locale page hydrates without switching language', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'de-DE' })
  const page = await context.newPage()

  const errors: string[] = []
  // React reports a failed hydration as an uncaught error, which Playwright delivers as `pageerror`
  // rather than as console output, so both are collected
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text())
    }
  })
  page.on('pageerror', (error) => errors.push(error.message))

  try {
    // The dev server drops module requests under load (see `smoke.test.ts`), and a document whose
    // modules never loaded never hydrates: without hydration there is nothing to mismatch, so the
    // assertions below would pass on a page that never came alive. Load again until React takes
    // over.
    await page.goto('/fr/user/login')

    for (let attempt = 0; attempt < 8; attempt++) {
      const hydrated = await page.waitForFunction(isHydrated, null, { timeout: 8000 }).then(
        () => true,
        () => false,
      )

      if (hydrated) {
        break
      }

      if (attempt === 7) {
        throw new Error('The app did not take over /fr/user/login: its client modules never loaded')
      }

      await page.reload()
    }

    const hydrationErrors = errors.filter((error) => /hydrat/iu.test(error))
    expect(hydrationErrors, `console errors: ${errors.join('\n')}`).toHaveLength(0)

    // The tag stays on the document's language, and so does what the hydrated app renders. The
    // drawer button is hidden at desktop width, so it is looked up by attribute rather than by
    // role, which skips hidden nodes. (String form of `evaluate`, like `isHydrated` above: this
    // project compiles for Node, without the DOM library.)
    expect(await page.evaluate('document.documentElement.lang')).toBe('en')
    await expect(page.locator('[aria-label="Open navigation"]')).toBeAttached()
  } finally {
    await context.close()
  }
})

// A client navigation to a course locale the course does not offer must land where a full load
// would: a full load of such a URL is the SSR 302 to the course's first locale, so the app
// resolves the same canonical route client-side, and the dead URL must not survive in the
// history.
//
// An in-app click cannot reach such a URL by construction: the UI only links to locales the
// course offers (the language menu is driven by `course.locales`, every other link uses the
// current locale). The way a user meets a dead-locale URL client-side is through the browser's
// history - a stale entry - so this test moves the browser to it with exactly the browser's own
// mechanics: a new history entry, plus the popstate event that back and forward report.
test("a history navigation to a course locale the course does not offer lands on the course's first locale", async ({
  page,
}) => {
  await openApp(page, cases.de.path)

  // A real in-app click first, so the back below has a genuine page to restore
  const entriesBeforeClick = await page.evaluate<number>('history.length')
  const otherPath = await linkToAnotherCoursePage(page, cases.de.path)
  await page.locator(`a[href="${otherPath}"]`).first().click()
  await expect(page).toHaveURL(new RegExp(`${otherPath}$`, 'u'))
  // The click pushed one entry (the fresh tab's first entry is the browser's own business)
  const entries = await page.evaluate<number>('history.length')
  expect(entries).toBe(entriesBeforeClick + 1)

  // The browser lands on the /fr variant of the page the app is showing, as a stale history entry.
  // String form of `evaluate`, like `isHydrated` above: this project compiles for Node, without
  // the DOM library
  const deadPath = otherPath.replace(/^\/de\//u, '/fr/')
  await page.evaluate(`window.history.pushState(null, "", ${JSON.stringify(deadPath)})`)
  // The dead entry exists for now; the app's answer to the popstate below must not add one
  const deadEntries = await page.evaluate<number>('history.length')
  await page.evaluate('window.dispatchEvent(new PopStateEvent("popstate"))')

  // The app resolves the dead locale to the course's first locale (the fixture course declares
  // `en` first) and rewrites the entry in place, with the canonical page's content
  const canonicalPath = otherPath.replace(/^\/de\//u, '/en/')
  await expect(page).toHaveURL(new RegExp(`${canonicalPath}$`, 'u'), { timeout: 60_000 })
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  // The dead entry was rewritten, not pushed behind: the app wrote no new entry, so the dead URL
  // no longer names any entry in the history
  expect(await page.evaluate<number>('history.length')).toBe(deadEntries)

  // And a real back press restores the page the user came from, not the broken URL
  await page.goBack()
  await expect(page).toHaveURL(new RegExp(`${otherPath}$`, 'u'))
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

// The same correction when the course record is not in the cache yet: the boot route names no
// course, so the course never enters the cache (a full load of the dead-locale URL would 302,
// having fetched the course itself). The app fetches the course during the client navigation and
// resolves the same canonical route - the dead URL must still not survive in the history, and the
// answer must stay in the same document.
test("a client navigation to a dead-locale URL of an uncached course lands on the course's first locale", async ({
  page,
}) => {
  // Boot outside a course, stamped: a course route would have fetched the course into the cache,
  // and a reload would stamp a different document. String form of `evaluate`, like `isHydrated`
  // above: this project compiles for Node, without the DOM library
  await page.addInitScript('window.__doc = String(Math.random())')
  const loginPath = '/en/user/login'
  await openApp(page, loginPath)
  const docBefore = await page.evaluate<string>('window.__doc ?? ""')
  expect(docBefore).not.toBe('')

  // The browser lands on the /fr variant of the course home, as a stale history entry - the
  // browser's own mechanics: a new entry, plus the popstate that back and forward report
  const deadPath = courseSlugMode === 'URL' ? `/fr/${courseSlug}/page/home` : '/fr/page/home'
  const entriesBeforePush = await page.evaluate<number>('history.length')
  await page.evaluate(`window.history.pushState(null, "", ${JSON.stringify(deadPath)})`)
  const deadEntries = await page.evaluate<number>('history.length')
  expect(deadEntries).toBe(entriesBeforePush + 1)
  await page.evaluate('window.dispatchEvent(new PopStateEvent("popstate"))')

  // The app fetched the course, resolved the dead locale to the course's first locale (the fixture
  // course declares `en` first), and rewrote the entry in place - in the same document, with the
  // canonical page's content
  const canonicalPath = courseSlugMode === 'URL' ? `/en/${courseSlug}/page/home` : '/en/page/home'
  await expect(page).toHaveURL(new RegExp(`${canonicalPath}$`, 'u'), { timeout: 60_000 })
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(await page.evaluate<string>('window.__doc ?? ""')).toBe(docBefore)
  // The dead entry was rewritten, not pushed behind: the app wrote no new entry, so the dead URL
  // no longer names any entry in the history
  expect(await page.evaluate<number>('history.length')).toBe(deadEntries)

  // And a real back press restores the page the user came from, not the broken URL
  await page.goBack()
  await expect(page).toHaveURL(new RegExp(`${loginPath}$`, 'u'))
})
