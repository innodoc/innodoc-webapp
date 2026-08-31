import { expect, test } from 'vitest'
import theme from '@innodoc/ui-design-system/theme'
import { createTestHarness, screen, TEST_COURSE_SLUG } from '@innodoc/ui-test-utils'
import Footer from './Footer.js'

// The footer follows the same visibility rule as the app bar: its course links need a course, and
// the built-in index link would only compete with the course home page there. Its styled slots read
// the design system's palette, so it renders with the app's own theme.

test('Footer links the course routes and not the index inside a course', async () => {
  const harness = createTestHarness({ courseSlugMode: 'URL', theme })
  await harness.withCourse()

  harness.render(<Footer />)

  const tocLink = screen.getByText('pages.course.toc.title').closest('a')
  expect(tocLink?.getAttribute('href')).toBe(`/en/${TEST_COURSE_SLUG}/toc`)
  expect(screen.getByText('pages.course.glossary.title').closest('a')?.getAttribute('href')).toBe(
    `/en/${TEST_COURSE_SLUG}/glossary`,
  )
  expect(screen.queryByText('pages.builtin.home.title')).toBeNull()
})

test('Footer renders nothing outside a course', () => {
  const harness = createTestHarness({
    courseSlugMode: 'URL',
    routeInfo: { locale: 'en', name: 'app:index' },
    theme,
  })

  const { container } = harness.render(<Footer />)

  expect(container.innerHTML).toBe('')
})
