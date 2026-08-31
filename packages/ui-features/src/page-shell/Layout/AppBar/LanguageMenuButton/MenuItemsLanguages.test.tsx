import { MenuList } from '@mui/material'
import { expect, test } from 'vitest'
import { createTestHarness, screen, TEST_COURSE_SLUG } from '@innodoc/ui-test-utils'
import MenuItemsLanguages from './MenuItemsLanguages.js'

// Each item has to link the *current course route* in its own locale. Handing `AppLink` a route info
// of `{ locale }` rendered no item at all: without a route name it is not a route, and the link
// components the course routes delegate to rebuild the URL from the store, locale included.

test('MenuItemsLanguages links every locale of the course on the current route', async () => {
  const harness = createTestHarness({
    courseSlugMode: 'URL',
    routeInfo: { courseSlug: TEST_COURSE_SLUG, locale: 'en', name: 'app:course:progress' },
  })
  await harness.withCourse()

  harness.render(
    <MenuList>
      <MenuItemsLanguages />
    </MenuList>,
  )

  const items = screen.getAllByRole('menuitem')

  expect(items.map((item) => item.textContent)).toEqual(['languages.en', 'languages.de'])
  expect(items.map((item) => item.getAttribute('href'))).toEqual([
    `/en/${TEST_COURSE_SLUG}/progress`,
    `/de/${TEST_COURSE_SLUG}/progress`,
  ])
})

test('MenuItemsLanguages renders nothing without a course', () => {
  const harness = createTestHarness({
    courseSlugMode: 'URL',
    routeInfo: { locale: 'en', name: 'app:index' },
  })

  harness.render(
    <MenuList>
      <MenuItemsLanguages />
    </MenuList>,
  )

  expect(screen.queryAllByRole('menuitem')).toHaveLength(0)
})
