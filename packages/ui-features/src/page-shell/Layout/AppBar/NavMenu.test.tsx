import { expect, test } from 'vitest'
import { createTestHarness, TEST_COURSE_SLUG } from '@innodoc/ui-test-utils'
import NavMenu from './NavMenu.js'

// URL mode (as in development) is where the two link sets cannot both be rendered: a course link
// needs a `courseSlug`, which the routes around a course do not have. Asking for that URL throws,
// and a throw while the app shell renders used to leave the visitor with an empty page.

test('NavMenu links the index and no course route outside a course', () => {
  const harness = createTestHarness({
    courseSlugMode: 'URL',
    routeInfo: { locale: 'en', name: 'app:index' },
  })

  const { getByText, queryByText } = harness.render(<NavMenu />)

  expect(getByText('pages.builtin.home.title')).toBeTruthy()
  expect(queryByText('pages.course.progress.title')).toBeNull()
})

test('NavMenu links the course routes and not the index inside a course', async () => {
  const harness = createTestHarness({ courseSlugMode: 'URL' })
  await harness.withCourse()

  const { getByText, queryByText } = harness.render(<NavMenu />)

  expect(getByText('pages.course.progress.title')).toBeTruthy()
  expect(queryByText('pages.builtin.home.title')).toBeNull()

  const progressLink = getByText('pages.course.progress.title').closest('a')
  expect(progressLink?.getAttribute('href')).toBe(`/en/${TEST_COURSE_SLUG}/progress`)
})
