import createCache from '@emotion/cache'
import { render as renderOrig, type RenderOptions } from '@testing-library/react'
import type { i18n as I18n } from 'i18next'
import I18NextFsBackend from 'i18next-fs-backend'
import { type ReactElement, type ReactNode } from 'react'

import { FRAGMENT_TYPE_FOOTER_A, FRAGMENT_TYPE_FOOTER_B, EMOTION_STYLE_KEY } from '#constants'
import fetchContent from '#renderer/fetchContent'
import makeStore, { type Store } from '#store/makeStore'
import courses from '#store/slices/entities/courses'
import fragments from '#store/slices/entities/fragments'
import pages from '#store/slices/entities/pages'
import sections from '#store/slices/entities/sections'
import { changeCourseId } from '#store/slices/uiSlice'
import PageShell from '#ui/components/PageShell/PageShell'
import getI18n from '#utils/getI18n'

let i18n: I18n
let store: Store
const locale = 'en'

const { initiate: getContent } = fragments.endpoints.getFragmentContent

beforeEach(async () => {
  store = makeStore()
  const courseId = 0
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

export * from '@testing-library/react'
export { locale, render, store }
