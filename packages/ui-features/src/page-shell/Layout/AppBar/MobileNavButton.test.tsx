import { expect, test } from 'vitest'
import { createTestHarness, fireEvent, screen, TEST_COURSE_SLUG } from '@innodoc/ui-test-utils'
import MobileNavButton from './MobileNavButton.js'

// Same rule as the desktop `NavMenu`, in the drawer that small screens render instead.

function openNav() {
  fireEvent.click(screen.getByRole('button', { name: 'nav.openNav' }))
}

test('MobileNavButton links the index and no course route outside a course', () => {
  const harness = createTestHarness({
    courseSlugMode: 'URL',
    routeInfo: { locale: 'en', name: 'app:index' },
  })

  harness.render(<MobileNavButton />)
  openNav()

  expect(screen.getByText('pages.builtin.home.title')).toBeTruthy()
  expect(screen.queryByText('pages.course.progress.title')).toBeNull()
})

test('MobileNavButton links the course routes and not the index inside a course', async () => {
  const harness = createTestHarness({ courseSlugMode: 'URL' })
  await harness.withCourse()

  harness.render(<MobileNavButton />)
  openNav()

  const progressItem = screen.getByText('pages.course.progress.title')
  expect(progressItem.closest('a')?.getAttribute('href')).toBe(`/en/${TEST_COURSE_SLUG}/progress`)
  expect(screen.queryByText('pages.builtin.home.title')).toBeNull()
})
