import i18n from 'i18next'
import { expect, test } from 'vitest'
import makeCourses from '@innodoc/shared-fixtures/courses'
import getPagesApi from '@innodoc/shared-store/slices/content/pages'
import { createTestHarness, screen, TEST_COURSE_SLUG, waitFor } from '@innodoc/ui-test-utils'
import CourseContentPage from './CourseContentPage.js'

// The fixture course declares en and de; exactly one of its pages has no content row in `de`
const [course] = makeCourses()
if (!course) {
  throw new Error('Expected a fixture course')
}
const missingPage = course.pages.find((p) => p.content.en !== undefined && p.content.de === undefined)
if (!missingPage) {
  throw new Error('Expected a fixture page without German content')
}

const NOT_YET_TRANSLATED = 'This content has not been translated yet.'
i18n.addResource('ci', 'common', 'content.notYetTranslated', NOT_YET_TRANSLATED)

// The client's answer to a declared locale whose content row is missing must be the same
// "not yet translated" state the server renders: the content query 404s, the page exists in the
// course and the course declares the locale, so the error is a translation gap, not a failure.
test('a page without content in the declared locale renders the not-yet-translated state', async () => {
  const harness = createTestHarness({
    routeInfo: {
      courseSlug: TEST_COURSE_SLUG,
      locale: 'de',
      name: 'app:course:page',
      pageSlug: missingPage.data.slug,
    },
  })
  await harness.withCourse()
  harness.render(<CourseContentPage />)

  await waitFor(() => {
    expect(screen.getByText(NOT_YET_TRANSLATED)).toBeInTheDocument()
  })

  expect(screen.queryByText('404 Page Not Found')).not.toBeInTheDocument()
})

// A page the course does not list is a genuine not-found: it keeps the 404 error state.
test('a page the course does not list keeps the 404 error state', async () => {
  const harness = createTestHarness({
    routeInfo: {
      courseSlug: TEST_COURSE_SLUG,
      locale: 'de',
      name: 'app:course:page',
      pageSlug: 'does-not-exist',
    },
  })
  await harness.withCourse()
  harness.render(<CourseContentPage />)

  await waitFor(() => {
    expect(screen.getByText('404 Page Not Found')).toBeInTheDocument()
  })

  expect(screen.queryByText(NOT_YET_TRANSLATED)).not.toBeInTheDocument()
})

// A locale that has the content is untouched by the new state.
test('a page with content in the locale renders no not-yet-translated state', async () => {
  const harness = createTestHarness({
    routeInfo: {
      courseSlug: TEST_COURSE_SLUG,
      locale: 'de',
      name: 'app:course:page',
      pageSlug: 'home',
    },
  })
  await harness.withCourse()
  harness.render(<CourseContentPage />)

  // The test environment has no Markdown worker, so the content itself renders nothing; the
  // assertion is that the query fulfilled and the new state stayed away.
  const selectContent = getPagesApi(harness.routeManager).endpoints.getPageContent.select({
    courseSlug: TEST_COURSE_SLUG,
    locale: 'de',
    pageSlug: 'home',
  })
  await waitFor(() => {
    expect(selectContent(harness.store.getState()).status).toBe('fulfilled')
  })

  expect(screen.queryByText(NOT_YET_TRANSLATED)).not.toBeInTheDocument()
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
})
