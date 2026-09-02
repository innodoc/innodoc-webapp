import { expect, test, type Locator, type Page } from '@playwright/test'

const courseSlugMode = process.env.INNODOC_PUBLIC_COURSE_SLUG_MODE ?? 'SINGLE'

/** Slug of the course the mock API serves */
const courseSlug = 'test-course'

// What the course contributes to the URL: a path segment in URL mode, nothing in SINGLE mode, where
// the course comes from the configuration.
const course = courseSlugMode === 'URL' ? `/en/${courseSlug}` : '/en'

/** Course home page: the one page of the fixture course whose slug and title do not move */
const homePath = `${course}/page/home`

/** Table of contents: a course route that renders no Markdown of its own */
const tocPath = `${course}/toc`

// Opening the app can take several loads, see `openApp`; the journeys themselves are quick
test.describe.configure({ timeout: 90_000 })

// Everything that runs in the browser is a string: the test project is compiled for Node, without
// the DOM library, so `window` and `document` have no type to check here.
//
// `__doc` carries one identity per document. A surviving identity is the proof that a navigation was
// answered by the app itself: a reload, or a page restored from the back/forward cache, is a new (or
// rather another) document and stamps a different one.
const initScript = `
  window.__doc = String(Math.random())
  window.__popStates = 0
  addEventListener('popstate', () => {
    window.__popStates = (window.__popStates ?? 0) + 1
  })
`

/** Whether the app has taken the document over, i.e. React runs on the rendered tree */
const isHydrated = 'Object.keys(document.querySelector("#root") ?? {}).some((k) => k.startsWith("__reactContainer$"))'

/**
 * The app renders the route held in the store, not the address bar, so a route change is complete
 * only once both have moved. On back and forward the browser moves the address bar by itself and
 * reports it as a `popstate` event - never as a navigation the app performs - so nothing in the app
 * runs unless it listens for it. These tests pin that the store follows, and that it does so inside
 * the current document: answering a back press with a round trip to the server is a reload, not the
 * instant step back the app is built for.
 */
test.beforeEach(async ({ page }) => {
  await page.addInitScript({ content: initScript })

  await openApp(page, homePath)
})

/** Identity of the document under test */
const doc = (page: Page) => page.evaluate<string>('window.__doc ?? ""')

/** Number of `popstate` events the document under test has seen */
const popStates = (page: Page) => page.evaluate<number>('window.__popStates ?? 0')

/** Number of entries in the session history of the document under test */
const historyEntries = (page: Page) => page.evaluate<number>('history.length')

/** What the reader is looking at, which is what a back press has to restore */
const heading = (page: Page) => page.getByRole('heading', { level: 1 })

/** The text of that heading, to be compared across a navigation */
async function headingText(page: Page): Promise<string> {
  return (await heading(page).textContent()) ?? ''
}

/**
 * Load `path` and wait for the app to run it.
 *
 * The app renders on the server, so a document can be complete and still inert: while the dev server
 * drops module requests - HTTP/2 resets on `/@fs/` URLs - nothing hydrates, every link becomes a
 * round trip, and the browser answers history navigation alone. There would be nothing to test, and
 * a failed module request is only ever retried by loading the document again.
 */
async function openApp(page: Page, path: string, attempts = 8) {
  await page.goto(path)

  for (let attempt = 0; attempt < attempts; attempt++) {
    const hydrated = await page.waitForFunction(isHydrated, null, { timeout: 4000 }).then(
      () => true,
      () => false,
    )

    if (hydrated) {
      return
    }

    await page.reload()
  }

  throw new Error(
    `The app did not take over ${path}: its client modules never loaded, however often the document was opened again`,
  )
}

/** A link to a page of the course, as rendered */
interface PageLink {
  /** Path the link points at */
  href: string
  /** The link itself, for clicking */
  locator: Locator
}

/** The first rendered link to `href` that a reader can actually click */
async function linkTo(page: Page, href: string): Promise<PageLink> {
  const links = page.locator(`a[href="${href}"]`)
  const count = await links.count()

  for (let index = 0; index < count; index++) {
    const link = links.nth(index)

    if (await link.isVisible()) {
      return { href, locator: link }
    }
  }

  throw new Error(`No visible link to ${href}`)
}

/**
 * A visible link from the course home to one of the course's other pages, taken from the rendered
 * page rather than from a fixture: the slugs and titles of those pages are generated.
 */
async function linkToAnotherPage(page: Page): Promise<PageLink> {
  const links = page.locator('a[href*="/page/"]')
  const count = await links.count()

  for (let index = 0; index < count; index++) {
    const link = links.nth(index)
    const href = await link.getAttribute('href')

    if (href !== null && href !== homePath && (await link.isVisible())) {
      return { href, locator: link }
    }
  }

  throw new Error('The course home offers no visible link to another page')
}

/** Follow a link and wait for the app to show the page it names */
async function follow(page: Page, { href, locator }: PageLink) {
  await locator.click()

  await expect(page).toHaveURL(new RegExp(`${href}$`, 'u'))
}

test('back renders the page the user came from, in the same document', async ({ page }) => {
  await expect(heading(page)).toHaveText('Home page')
  const homeHeading = await headingText(page)
  const docBeforeClick = await doc(page)

  const otherPage = await linkToAnotherPage(page)
  await follow(page, otherPage)

  // Clicking a link is client-side navigation, which the history navigation under test is measured
  // against: the same document is still showing, now with the target page's heading in it
  expect(await doc(page)).toBe(docBeforeClick)
  await expect(heading(page)).not.toHaveText(homeHeading)
  const otherHeading = await headingText(page)
  const entries = await historyEntries(page)

  await page.goBack()

  await expect(page).toHaveURL(new RegExp(`${homePath}$`, 'u'))
  await expect(heading(page)).toHaveText(homeHeading)

  // The history navigation reached the app as a single popstate and the app answered it alone: the
  // same document, and no history entry written on the way. Moving the URL a second time here would
  // turn one back press into a step forward the user never asked for.
  expect(await popStates(page)).toBe(1)
  expect(await doc(page)).toBe(docBeforeClick)
  expect(await historyEntries(page)).toBe(entries)

  // And forward answers the other way round, still without leaving the document
  await page.goForward()

  await expect(page).toHaveURL(new RegExp(`${otherPage.href}$`, 'u'))
  await expect(heading(page)).toHaveText(otherHeading)
  expect(await popStates(page)).toBe(2)
  expect(await doc(page)).toBe(docBeforeClick)
})

test('back and forward cross between a page and a course route', async ({ page }) => {
  // Page and TOC render different components out of different data, which is where a view driven by
  // the store rather than by the URL shows: the target's component comes up before its route info has
  // landed, and the page it replaces is the one whose content is still in the store.
  const docBeforeClick = await doc(page)
  await follow(page, await linkTo(page, tocPath))

  const tocHeading = await headingText(page)

  await page.goBack()

  await expect(page).toHaveURL(new RegExp(`${homePath}$`, 'u'))
  await expect(heading(page)).toHaveText('Home page')
  expect(await doc(page)).toBe(docBeforeClick)

  await page.goForward()

  await expect(page).toHaveURL(new RegExp(`${tocPath}$`, 'u'))
  await expect(heading(page)).toHaveText(tocHeading)
  expect(await doc(page)).toBe(docBeforeClick)
})
