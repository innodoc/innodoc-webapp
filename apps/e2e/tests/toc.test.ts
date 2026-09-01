import { expect, test } from '@playwright/test'

const courseSlugMode = process.env.INNODOC_PUBLIC_COURSE_SLUG_MODE ?? 'SINGLE'

/** Slug of the course the mock API serves */
const courseSlug = 'test-course'

/**
 * Where the TOC page lives. `toc` is a reserved segment of the course URL, so in URL mode it carries
 * the slug and a bare `/en/toc` is not a course route; in SINGLE mode the course comes from the
 * configuration, so the slug-free path is the real one.
 */
const tocPath = courseSlugMode === 'URL' ? `/en/${courseSlug}/toc` : '/en/toc'

// The table of contents is the deep-nesting view of the course: it must come up as the assembled
// tree, not as an empty list while a query spins nor as a flat list of top-level sections.
test('course TOC lists the section tree, five levels deep', async ({ page }) => {
  await page.goto(tocPath)

  // The list itself is hydrated from the sections query, so this waits for the data as well
  await expect(page.getByRole('link', { name: /^1\s/u })).toBeVisible()

  // `StaticToc` opens one <ul> per level: a five-level selector
  // matches only if every node of the deepest fixture branch renders inside its parents
  await expect(page.locator('main ul ul ul ul ul a').first()).toBeVisible()
})
