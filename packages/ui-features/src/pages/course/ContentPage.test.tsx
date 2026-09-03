import i18n from 'i18next'
import { expect, test } from 'vitest'
import { NOT_YET_TRANSLATED_CONTENT } from '@innodoc/shared-core/sentinels'
import type { TranslatedCourse, TranslatedPage, TranslatedSection } from '@innodoc/shared-core/types'
import theme from '@innodoc/ui-design-system/theme'
import { createTestHarness, screen } from '@innodoc/ui-test-utils'
import ContentPage, { isContentNotYetTranslated } from './ContentPage.js'

/**
 * The predicate only reads `course.locales` and the definedness of `entity`, so a minimal
 * explicitly typed input is enough and keeps the test independent of the fixture shape.
 */
const course = { locales: ['en', 'de'] } as unknown as TranslatedCourse
const page = { id: 1 } as unknown as TranslatedPage

// The shapes the predicate reads: a stale cache entry from another state and the content
// query's error shapes (the fetch error of fetchBaseQuery carries the HTTP status)
const staleData = { content: 'stale content from another state', hash: 'stale' }
const notFoundError = { status: 404 }
const networkError = { status: 'FETCH_ERROR' }

// The 404 of the content query is conclusive: even a stale data entry for the same key belongs
// to another state, so it must not mask the translation gap (the client's transition flake).
test('a 404 in a declared locale is a translation gap even with stale data in the cache', () => {
  expect(isContentNotYetTranslated({ course, entity: page, locale: 'de', data: staleData, error: notFoundError })).toBe(
    true,
  )
})

test('a 404 without cached data in a declared locale is a translation gap', () => {
  expect(isContentNotYetTranslated({ course, entity: page, locale: 'de', data: undefined, error: notFoundError })).toBe(
    true,
  )
})

// The server seeds this sentinel for a declared locale without a content row (SSR).
test('the not-yet-translated sentinel without an error is a translation gap', () => {
  expect(
    isContentNotYetTranslated({
      course,
      entity: page,
      locale: 'de',
      data: NOT_YET_TRANSLATED_CONTENT,
      error: undefined,
    }),
  ).toBe(true)
})

test('real content without an error is not a translation gap', () => {
  expect(isContentNotYetTranslated({ course, entity: page, locale: 'de', data: staleData, error: undefined })).toBe(
    false,
  )
})

// A transient failure keeps the error states of today.
test('a non-404 query error is not a translation gap', () => {
  expect(isContentNotYetTranslated({ course, entity: page, locale: 'de', data: undefined, error: networkError })).toBe(
    false,
  )
})

// A page the course does not list is a genuine not-found, whatever the error says.
test('a page the course does not list is not a translation gap', () => {
  expect(
    isContentNotYetTranslated({ course, entity: undefined, locale: 'de', data: undefined, error: notFoundError }),
  ).toBe(false)
})

// A locale the course does not declare redirects (SSR) or errors (client) - never the gap state.
test('a locale the course does not declare is not a translation gap', () => {
  const enOnlyCourse = { ...course, locales: ['en'] }
  expect(
    isContentNotYetTranslated({
      course: enOnlyCourse,
      entity: page,
      locale: 'de',
      data: undefined,
      error: notFoundError,
    }),
  ).toBe(false)
})

// The load-error message interpolates the content's id under the name the locale strings use
// (pageSlug/sectionPath); the user must see the id's value, never a raw `{{...}}` placeholder.
// The harness's i18n language follows the route's locale (default 'en'), so the strings the app
// serves from `apps/frontend/public/locales/en/common.json` are added for that language.
i18n.addResource('en', 'common', 'error.failedToLoadPage', 'Failed to load page: <1>{{pageSlug}}</1>')
i18n.addResource('en', 'common', 'error.failedToLoadSection', 'Failed to load section: <1>{{sectionPath}}</1>')

interface LoadErrorRenderInput {
  contentType: 'page' | 'section'
  contentIdValue: string
  contentObj: TranslatedPage | TranslatedSection
}

function renderLoadError({ contentType, contentIdValue, contentObj }: LoadErrorRenderInput) {
  // the error UI wraps the id in the design system's <Code>, which reads its palette augmentation
  const harness = createTestHarness({ theme })
  harness.render(
    <ContentPage
      contentHash="some-hash"
      contentIdValue={contentIdValue}
      contentObj={contentObj}
      contentType={contentType}
      isError
      isLoading={false}
      notYetTranslated={false}
    >
      {null}
    </ContentPage>,
  )
}

test('the page load error renders the page slug, not an uninterpolated placeholder', () => {
  renderLoadError({ contentType: 'page', contentIdValue: 'some-page-slug', contentObj: page })

  const alert = screen.getByRole('alert')
  expect(alert).toHaveTextContent('some-page-slug')
  expect(alert.textContent).not.toContain('{{')
})

test('the section load error renders the section path, not an uninterpolated placeholder', () => {
  const section = { id: 1 } as unknown as TranslatedSection
  renderLoadError({ contentType: 'section', contentIdValue: '1.2', contentObj: section })

  const alert = screen.getByRole('alert')
  expect(alert).toHaveTextContent('1.2')
  expect(alert.textContent).not.toContain('{{')
})
