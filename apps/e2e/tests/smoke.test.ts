import { expect, test } from '@playwright/test'

// The landing page redirects to the default course, which redirects to its first page.
// If the server, SSR rendering, or fixture data break, this fails.
test('landing page renders the course home', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/\/en\/page\/home$/u)
  await expect(page).toHaveTitle('Course for testing')
  await expect(page.getByRole('heading', { name: 'Home page' })).toBeVisible()
})
