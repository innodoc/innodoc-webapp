import createCache from '@emotion/cache'
import { render as renderOrig, type RenderOptions } from '@testing-library/react'
import type { i18n as I18n } from 'i18next'
import I18NextFsBackend from 'i18next-fs-backend'
import { type ReactElement, type ReactNode } from 'react'

import { FRAGMENT_TYPE_FOOTER_A, FRAGMENT_TYPE_FOOTER_B, EMOTION_STYLE_KEY } from '#constants'
import makeStore, { type Store } from '#store/makeStore'
import {
  changeCourseId,
  changeCurrentPageSlug,
  changeCurrentSectionPath,
} from '#store/slices/appSlice'
import courses from '#store/slices/entities/courses'
import fragments from '#store/slices/entities/fragments'
import pages from '#store/slices/entities/pages'
import sections from '#store/slices/entities/sections'
import type { ApiPage } from '#types/entities/page'
import type { ApiSection } from '#types/entities/section'
import PageShell from '#ui/components/PageShell/PageShell'
import getI18n from '#utils/getI18n'
import fetchContent from '#utils/ssr/fetchContent'

import getData from '../mocks/getData'

let i18n: I18n
let store: Store
const locale = 'en'
const courseId = 0

const { initiate: getContent } = fragments.endpoints.getFragmentContent

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
  await store.dispatch(courses.endpoints.getCourse.initiate({ courseId }))
  store.dispatch(changeCourseId(courseId))
  await store.dispatch(pages.endpoints.getCoursePages.initiate({ courseId }))
  await store.dispatch(sections.endpoints.getCourseSections.initiate({ courseId }))
  await fetchContent(
    store,
    getContent({ courseId: 0, locale, fragmentType: FRAGMENT_TYPE_FOOTER_A })
  )
  await fetchContent(
    store,
    getContent({ courseId: 0, locale, fragmentType: FRAGMENT_TYPE_FOOTER_B })
  )
  i18n = await getI18n(I18NextFsBackend, {}, 'cimode', 0, store)
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
  const courses = getData()
  const page = Object.entries(courses[0].pages).find(([, [p]]) => p.slug === pageSlug)
  if (page === undefined) throw new Error(`Could not find mock page ${pageSlug}`)
  const pageObj = page[1][0]
  await fetchContent(
    store,
    pages.endpoints.getPageContent.initiate({ courseId, locale, pageId: pageObj.id })
  )
  store.dispatch(changeCurrentPageSlug(pageObj.slug))
}

async function loadSection(sectionPath: ApiSection['path']) {
  const courses = getData()
  const section = Object.entries(courses[0].sections).find(([, [s]]) => s.path === sectionPath)
  if (section === undefined) throw new Error(`Could not find mock section ${sectionPath}`)
  const sectionObj = section[1][0]
  await fetchContent(
    store,
    sections.endpoints.getSectionContent.initiate({
      courseId,
      locale,
      sectionId: section[1][0].id,
    })
  )
  store.dispatch(changeCurrentSectionPath(sectionObj.path))
}

export * from '@testing-library/react'
export { loadPage, loadSection, locale, render, store }
