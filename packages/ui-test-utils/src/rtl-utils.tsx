import type { RenderOptions, RenderResult } from '@testing-library/react'
import type { ReactElement } from 'react'
import type React from 'react'
import { createTheme, ThemeProvider as CssVarsProvider, extendTheme } from '@mui/material/styles'
import { render } from '@testing-library/react'
import i18n from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { RouteManager } from '@innodoc/shared-core/routes'
import type { CourseRouteInfo } from '@innodoc/shared-core/types'
import makeStore from '@innodoc/shared-store'
import { changeRouteInfo } from '@innodoc/shared-store/slices/app'
import getCoursesApi from '@innodoc/shared-store/slices/content/courses'
import getPagesApi from '@innodoc/shared-store/slices/content/pages'
import getSectionsApi from '@innodoc/shared-store/slices/content/sections'

const theme = extendTheme(undefined, createTheme())

await i18n.use(initReactI18next).init({
  lng: 'ci',
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
})

const routeManager = new RouteManager({
  config: {
    courseSlugMode: 'SINGLE',
    defaultCourseSlug: 'test-course',
    pagePathPrefix: 'page',
    sectionPathPrefix: 'section',
  },
})

const store = makeStore({ routeManager })

const TestPageShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <CssVarsProvider theme={theme}>{children}</CssVarsProvider>
      </I18nextProvider>
    </ReduxProvider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult =>
  render(ui, { wrapper: TestPageShell, ...options })

async function populateStore() {
  const courseSlug = 'test-course'
  const routeInfo = {
    name: 'app:course:index',
    courseSlug,
    locale: 'en',
  } satisfies CourseRouteInfo<'app:course:index'>
  store.dispatch(changeRouteInfo(routeInfo))
  const coursesApi = getCoursesApi(routeManager)
  const pagesApi = getPagesApi(routeManager)
  const sectionsApi = getSectionsApi(routeManager)
  await store.dispatch(coursesApi.endpoints.getCourse.initiate({ courseSlug }))
  await store.dispatch(pagesApi.endpoints.getCoursePages.initiate({ courseSlug }))
  await store.dispatch(sectionsApi.endpoints.getCourseSections.initiate({ courseSlug }))
  // await fetchContent(store, getContent({ locale, path: FRAGMENT_TYPE_FOOTER_A }))
  // await fetchContent(store, getContent({ locale, path: FRAGMENT_TYPE_FOOTER_B }))
}

// oxlint-disable-next-line import/export
export * from '@testing-library/react'
export { populateStore, customRender as render }
