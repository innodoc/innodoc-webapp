import type { ReactElement } from 'react'
import { expect, test } from 'vitest'
import { RouteManager } from '@innodoc/shared-core/routes'
import { RouteManagerProvider } from '@innodoc/ui-shared/contexts'
import { render } from '@innodoc/ui-test-utils'
import AppLink from './AppLink.js'

// URL mode (as in development): course routes carry a `courseSlug` that non-course routes do not
const urlRouteManager = new RouteManager({
  config: {
    courseSlugMode: 'URL',
    defaultCourseSlug: null,
    pagePathPrefix: 'page',
    sectionPathPrefix: 'section',
  },
})

function renderLink(routeInfo: unknown): ReactElement {
  return (
    <RouteManagerProvider routeManager={urlRouteManager}>
      <AppLink routeInfo={routeInfo}>label</AppLink>
    </RouteManagerProvider>
  )
}

test('AppLink links a locale switch given a complete route info', () => {
  const { getByText } = render(renderLink({ locale: 'de', name: 'app:user:login' }))

  expect(getByText('label').getAttribute('href')).toBe('/de/user/login')
})

test('AppLink renders nothing for a route info without a route name', () => {
  const { container } = render(renderLink({ locale: 'de' }))

  expect(container.innerHTML).toBe('')
})

test('AppLink drops a link that needs a missing course slug instead of throwing', () => {
  const { container } = render(renderLink({ name: 'app:course:progress' }))

  expect(container.innerHTML).toBe('')
})
