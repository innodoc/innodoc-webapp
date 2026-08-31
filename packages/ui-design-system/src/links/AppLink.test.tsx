import { expect, test } from 'vitest'
import { createTestHarness } from '@innodoc/ui-test-utils'
import AppLink from './AppLink.js'

// URL mode (as in development): course routes carry a `courseSlug` that the routes around them do
// not have, so their URLs cannot be generated from just any route.
const harness = createTestHarness({
  courseSlugMode: 'URL',
  routeInfo: { locale: 'en', name: 'app:index' },
})

test('AppLink links a route given a complete route info', () => {
  const { getByText } = harness.render(<AppLink routeInfo={{ locale: 'de', name: 'app:user:login' }}>label</AppLink>)

  expect(getByText('label').getAttribute('href')).toBe('/de/user/login')
})

test('AppLink renders nothing for a route info without a route name', () => {
  const { container } = harness.render(<AppLink routeInfo={{ locale: 'de' }}>label</AppLink>)

  expect(container.innerHTML).toBe('')
})

test('AppLink renders nothing for a course route it cannot build a URL for', () => {
  const { container } = harness.render(<AppLink routeInfo={{ name: 'app:course:progress' }}>label</AppLink>)

  expect(container.innerHTML).toBe('')
})
