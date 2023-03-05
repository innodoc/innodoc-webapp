import createCache from '@emotion/cache'
import { render as renderOrig, type RenderOptions } from '@testing-library/react'
import type { i18n as I18n } from 'i18next'
import I18NextFsBackend from 'i18next-fs-backend'
import { type ReactElement, type ReactNode } from 'react'

import {
  FRAGMENT_TYPE_FOOTER_A,
  FRAGMENT_TYPE_FOOTER_B,
  EMOTION_STYLE_KEY,
  DEFAULT_ROUTE_NAME,
} from '#constants'
import makeStore, { type Store } from '#store/makeStore'
import { changeRouteInfo } from '#store/slices/appSlice'
import courses from '#store/slices/entities/courses'
import fragments from '#store/slices/entities/fragments'
import pages from '#store/slices/entities/pages'
import sections from '#store/slices/entities/sections'
import type { ApiPage } from '#types/entities/page'
import type { ApiSection } from '#types/entities/section'
import PageShell from '#ui/components/PageShell/PageShell'
import getI18n from '#utils/getI18n'

import getCourses from '../mocks/getCourses'

let i18n: I18n
let store: Store
const locale = 'en'
const courseSlug = 'testcourse'

beforeEach(async () => {
  // window.match is not implemented in jsdom
  // https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  store = makeStore()
  store.dispatch(changeRouteInfo({ courseSlug, locale, routeName: DEFAULT_ROUTE_NAME }))
  await store.dispatch(courses.endpoints.getCourse.initiate({ courseSlug }))
  await store.dispatch(pages.endpoints.getCoursePages.initiate({ courseSlug }))
  await store.dispatch(sections.endpoints.getCourseSections.initiate({ courseSlug }))

  await store.dispatch(
    fragments.endpoints.getFragmentContent.initiate({
      courseSlug,
      fragmentType: FRAGMENT_TYPE_FOOTER_A,
      locale,
    })
  )
  await store.dispatch(
    fragments.endpoints.getFragmentContent.initiate({
      courseSlug,
      fragmentType: FRAGMENT_TYPE_FOOTER_B,
      locale,
    })
  )

  i18n = await getI18n(I18NextFsBackend, {}, 'cimode', courseSlug, store)
})

function TestPageShell({ children }: { children: ReactNode }) {
  return (
    <PageShell emotionCache={createCache({ key: EMOTION_STYLE_KEY })} i18n={i18n} store={store}>
      {children}
    </PageShell>
  )
}

function render(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return renderOrig(ui, { wrapper: TestPageShell, ...options })
}

async function loadPage(pageSlug: ApiPage['slug']) {
  store.dispatch(changeRouteInfo({ courseSlug, locale, routeName: 'app:page', pageSlug }))

  const courses = getCourses()
  const page = courses[0].pages.find((p) => p.data.slug === pageSlug)
  if (page === undefined) {
    throw new Error(`Could not find mock page ${pageSlug}`)
  }
  const { data: pageObj } = page
  await store.dispatch(
    pages.endpoints.getPageContent.initiate({ courseSlug, locale, pageSlug: pageObj.slug })
  )
}

async function loadSection(sectionPath: ApiSection['path']) {
  store.dispatch(changeRouteInfo({ courseSlug, locale, routeName: 'app:section', sectionPath }))

  const courses = getCourses()
  const section = courses[0].sections.find((s) => s.data.path === sectionPath)
  if (section === undefined) {
    throw new Error(`Could not find mock section ${sectionPath}`)
  }
  const { data: sectionObj } = section
  await store.dispatch(
    sections.endpoints.getSectionContent.initiate({
      courseSlug,
      locale,
      sectionPath: sectionObj.path,
    })
  )
}

export * from '@testing-library/react'
export { loadPage, loadSection, locale, render, store }
