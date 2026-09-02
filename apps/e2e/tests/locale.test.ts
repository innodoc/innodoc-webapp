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
