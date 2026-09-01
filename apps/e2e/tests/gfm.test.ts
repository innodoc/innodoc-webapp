import { expect, test } from '@playwright/test'

// The mock course home page carries a GFM pipe table and a strikethrough
// (packages/shared-fixtures/.../make-pages.ts). Asserting both render proves the
// full pipeline (markdown -> hast -> React) handles GFM, in mock mode with no DB.
const homePath = '/en/page/home'

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
