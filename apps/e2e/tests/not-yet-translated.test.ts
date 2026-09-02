import { expect, test, type Page } from '@playwright/test'

const courseSlugMode = process.env.INNODOC_PUBLIC_COURSE_SLUG_MODE ?? 'SINGLE'

/** Slug of the course the mock API serves */
const courseSlug = 'test-course'

// The course root in German, where the fixture page without a German content row lives
const course = courseSlugMode === 'URL' ? `/de/${courseSlug}` : '/de'

// The dev server has to transform the whole module graph before the app hydrates
test.describe.configure({ timeout: 120_000 })

// Everything that runs in the browser is a string: the test project is compiled for Node, without
// the DOM library, so `window` has no type to check here.
const isHydrated = 'Object.keys(document.querySelector("#root") ?? {}).some((k) => k.startsWith("__reactContainer$"))'

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

// A full load of the missing-locale page is the server's job (pinned in the backend and frontend
// SSR tests); this is the client's: navigating in the app to a declared locale whose content row
// is missing must render the same "not yet translated" state - the localized UI string inside
// the normal page shell, in the language of the URL - and not an error.
test('client navigation to a page without content in the declared locale renders the not-yet-translated state', async ({
  page,
  request,
}) => {
  // The fixture course declares en and de; find the one page that has no content row in de
  const pagesResponse = await request.get(`/api/course/${courseSlug}/pages`)
  const pages = (await pagesResponse.json()) as { slug: string }[]
  const missing = await Promise.all(
    pages.map(async (p) => {
      const response = await request.get(`/api/course/${courseSlug}/pages/de/${p.slug}`)
      return response.status() === 404 ? p.slug : null
    }),
  )
  const missingSlug = missing.find((slug) => slug !== null)
  if (!missingSlug) {
    throw new Error('Expected a fixture page without German content')
  }

  const href = `${course}/page/${missingSlug}`
  await openApp(page, `${course}/page/home`)

  // The footer lists the page; the in-app click is the navigation the user performs
  await page.locator(`a[href="${href}"]`).first().click()
  await expect(page).toHaveURL(new RegExp(`${href}$`, 'u'))

  await expect(page.getByText('Dieser Inhalt wurde noch nicht übersetzt.')).toBeVisible()

  // The document stays in the language of the URL, and the shell keeps working: navigation and
  // the language menu are part of the page the reader landed on
  expect(await page.evaluate('document.documentElement.lang')).toBe('de')
  await expect(page.locator('[aria-label="Navigation öffnen"]')).toBeAttached()
})
