import { MenuList } from '@mui/material'
import i18n from 'i18next'
import { expect, test, vi } from 'vitest'
import getCoursesApi from '@innodoc/shared-store/slices/content/courses'
import { cleanup, createTestHarness, screen, TEST_COURSE_SLUG } from '@innodoc/ui-test-utils'
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

  // The harness loads no UI bundle resources, so every label falls back to its ISO 639-1 name.
  expect(items.map((item) => item.textContent)).toEqual(['English', 'German'])
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

// The fixture course only offers the fixture locales; add one the UI bundles do not cover.
async function harnessWithCourseLocaleGap() {
  const harness = createTestHarness({
    courseSlugMode: 'URL',
    routeInfo: { courseSlug: TEST_COURSE_SLUG, locale: 'de', name: 'app:course:progress' },
  })
  await harness.withCourse()

  const coursesApi = getCoursesApi(harness.routeManager)
  const queryState = coursesApi.endpoints.getCourse.select({ courseSlug: TEST_COURSE_SLUG })(harness.store.getState())
  if (queryState.data === undefined) {
    throw new Error('The fixture course is missing from the query cache')
  }
  // The upsert runs a forced query with a fake queryFn; awaiting the dispatch settles the
  // cache before the component under test renders.
  await harness.store.dispatch(
    coursesApi.util.upsertQueryData(
      'getCourse',
      { courseSlug: TEST_COURSE_SLUG },
      {
        ...queryState.data,
        locales: ['de', 'en', 'fr'],
      },
    ),
  )

  return harness
}

// The harness' i18next instance loads no resources. Load the `languages` keys the app's UI
// bundles carry, scoped to the active test, so the fallback resolution can be asserted against
// real keys. The harness' default namespace is `common` (mirroring the app's `initI18n`), so the
// keys are registered there.
//
// The runtime `ResourceStore` exposes these bundle-level APIs, but the shipped i18next 26 d.ts
// does not, so the minimal shape used here is stated explicitly.
interface ResourceStoreLike {
  addResourceBundle(lng: string, ns: string, resources: Record<string, unknown>, deep?: boolean): unknown
  removeResourceBundle(lng: string, ns: string): unknown
}

async function withUiLanguageKeys(test: () => Promise<void>) {
  const resourceStore = i18n.services.resourceStore as unknown as ResourceStoreLike
  for (const lng of ['de', 'en'] as const) {
    resourceStore.addResourceBundle(lng, 'common', { languages: { de: 'Deutsch', en: 'English' } }, true)
  }
  try {
    await test()
  } finally {
    for (const lng of ['de', 'en'] as const) {
      resourceStore.removeResourceBundle(lng, 'common')
    }
    await i18n.changeLanguage('ci')
  }
}

test('MenuItemsLanguages labels every course locale from the UI bundle or its ISO 639-1 name', async () => {
  const harness = await harnessWithCourseLocaleGap()

  await withUiLanguageKeys(async () => {
    for (const lng of ['de', 'en'] as const) {
      await i18n.changeLanguage(lng)
      harness.render(
        <MenuList>
          <MenuItemsLanguages />
        </MenuList>,
      )

      const items = screen.getAllByRole('menuitem')
      // `de` and `en` resolve from the UI bundle keys; `fr` has none and falls back to its
      // ISO 639-1 name - no raw key in either UI language.
      expect(items.map((item) => item.textContent)).toEqual(['Deutsch', 'English', 'French'])
      cleanup()
    }
  })
})

test('MenuItemsLanguages warns in development about a course locale missing from the UI bundle', async () => {
  const harness = await harnessWithCourseLocaleGap()

  await withUiLanguageKeys(async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(vi.fn())
    await i18n.changeLanguage('en')
    try {
      harness.render(
        <MenuList>
          <MenuItemsLanguages />
        </MenuList>,
      )

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn.mock.calls[0]?.[0]).toContain('languages.fr')
    } finally {
      warn.mockRestore()
    }
  })
})

// The dev/prod gate is `import.meta.env.DEV` in MenuItemsLanguages: the development warning
// above proves the missing-key path, and the same code path stays silent in production builds
// because the `import.meta.env.DEV` condition is false there (Vitest cannot flip Vite's mode
// constants per test, so the prod side is pinned by the gate itself).
