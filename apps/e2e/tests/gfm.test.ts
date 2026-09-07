import { expect, test } from '@playwright/test'

const courseSlugMode = process.env.INNODOC_PUBLIC_COURSE_SLUG_MODE ?? 'SINGLE'

/** Slug of the course the mock API serves */
const courseSlug = 'test-course'

// The mock course home page carries a GFM pipe table and a strikethrough
// (packages/shared-fixtures/.../make-pages.ts). Asserting both render proves the
// full pipeline (markdown -> hast -> React) handles GFM, in mock mode with no DB.
const homePath = courseSlugMode === 'URL' ? `/en/${courseSlug}/page/home` : '/en/page/home'

test('GFM pipe table renders as a real table with header and body cells', async ({ page }) => {
  await page.goto(homePath)

  await expect(page.getByRole('table')).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'Value' })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'one', exact: true })).toBeVisible()
  await expect(page.getByRole('cell', { name: '1', exact: true })).toBeVisible()
})

test('GFM strikethrough renders as struck text in a del element', async ({ page }) => {
  await page.goto(homePath)

  const del = page.locator('del')
  await expect(del).toBeVisible()
  await expect(del).toHaveText('struck')
})
