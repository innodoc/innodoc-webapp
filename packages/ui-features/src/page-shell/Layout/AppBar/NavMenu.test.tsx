import type { ReactNode } from 'react'
import { expect, test } from 'vitest'
import { RouteManager } from '@innodoc/shared-core/routes'
import { RouteManagerProvider } from '@innodoc/ui-shared/contexts'
import { render } from '@innodoc/ui-test-utils'
import MobileNavButton from './MobileNavButton.js'
import NavMenu from './NavMenu.js'

// URL mode (as in development): course routes need a `courseSlug`, which the store route info of a
// non-course route does not have. Links to course routes must not be rendered there.
const urlRouteManager = new RouteManager({
  config: {
    courseSlugMode: 'URL',
    defaultCourseSlug: null,
    pagePathPrefix: 'page',
    sectionPathPrefix: 'section',
  },
})

function Wrapper({ children }: { children: ReactNode }) {
  return <RouteManagerProvider routeManager={urlRouteManager}>{children}</RouteManagerProvider>
}

test('NavMenu renders its links on a route without a course', () => {
  const { container } = render(
    <Wrapper>
      <NavMenu />
    </Wrapper>,
  )

  expect(container.textContent).toContain('pages.builtin.home.title')
  expect(container.textContent).not.toContain('pages.course.progress.title')
})

test('MobileNavButton renders its links on a route without a course', () => {
  const { container } = render(
    <Wrapper>
      <MobileNavButton />
    </Wrapper>,
  )

  expect(container.querySelector('button')).not.toBeNull()
})
