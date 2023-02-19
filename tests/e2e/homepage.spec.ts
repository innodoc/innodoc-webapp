import { test, expect } from '@playwright/test'

test('test home page', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL('/en/page/home')
  await expect(page).toHaveTitle(/Course for integration tests/)
  await expect(page.getByRole('heading', { name: 'home page' })).toBeVisible()
  await expect(page.getByText('This is the start of the journey.')).toBeVisible()

  const link = page.getByRole('link', { name: 'example link', exact: true })
  expect(await link.getAttribute('href')).toBe('https://www.example.com/')

  const linkRef = page.getByRole('link', { name: 'example link reference' })
  expect(await linkRef.getAttribute('href')).toBe('https://www.example.com/reference')
})
