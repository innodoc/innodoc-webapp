import { test } from '@playwright/test'

const courseSlugMode = process.env.INNODOC_PUBLIC_COURSE_SLUG_MODE ?? 'SINGLE'

/** Slug of the course the mock API serves */
const courseSlug = 'test-course'

// Where the course sits in the URL depends on the mode
const course = courseSlugMode === 'URL' ? `/en/${courseSlug}` : '/en'

/** Course home page: the page the real specs open first */
const homePath = `${course}/page/home`

/** Whether the client bundle has loaded and the app has started taking over the rendered tree */
const isHydrated = 'Object.keys(document.querySelector("#root") ?? {}).some((k) => k.startsWith("__reactContainer$"))'

// A cold first load retries for up to 8 attempts of 4s hydration waits each, well past the 30s default
test.setTimeout(90_000)

/**
 * Warm up a cold dev server before the real specs run.
 *
 * On the first boot, Vite transforms the whole client module graph on demand, and the transforms
 * keep Node's event loop busy while a page load opens the module graph as ~200 concurrent streams.
 * In that window module requests fail (HTTP/2 resets, see `maxSessionMemory` in
 * `apps/backend/src/plugins/env/dev.ts`), the app never takes the document over, and the first
 * client-side navigation in the real specs degrades into a full page load. Opening the same page
 * the specs open - and retrying until the app has taken over - makes the transform caches hot, so
 * the specs only ever see a warm server.
 *
 * The real specs keep asserting everything this one does not: this only warms the server, it never
 * stands in for them.
 */
test('the app takes over the first page load', async ({ page }) => {
  // Opening the app can take several loads while the dev server is still cold
  await page.goto(homePath)

  for (let attempt = 0; attempt < 8; attempt++) {
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
    `The app did not take over ${homePath}: its client modules never loaded, however often the document was opened again`,
  )
})
