import { expect, test } from 'vitest'
import { RouteManager } from '@innodoc/shared-core/routes'
import { RouteManagerProvider } from '@innodoc/ui-shared/contexts'
import { populateStore, render } from '@innodoc/ui-test-utils'
import LocaleLink from './LocaleLink.js'

// URL mode (as in development): course routes carry a `courseSlug`, other routes do not
const urlRouteManager = new RouteManager({
  config: {
    courseSlugMode: 'URL',
    defaultCourseSlug: null,
    pagePathPrefix: 'page',
    sectionPathPrefix: 'section',
  },
})

test('LocaleLink switches the locale of a route without a course slug', () => {
  const { getByText } = render(
    <RouteManagerProvider routeManager={urlRouteManager}>
      <LocaleLink locale="de">DE</LocaleLink>
    </RouteManagerProvider>,
  )

  expect(getByText('DE').getAttribute('href')).toBe('/de')
})

test('LocaleLink keeps the course route when switching the locale', async () => {
  // Populates the store route info with `app:course:index` of the fixture course
  await populateStore()

  const { getByText } = render(
    <RouteManagerProvider routeManager={urlRouteManager}>
      <LocaleLink locale="de">DE</LocaleLink>
    </RouteManagerProvider>,
  )

  expect(getByText('DE').getAttribute('href')).toBe('/de/test-course')
})
