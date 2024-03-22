import {
  createTheme,
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from '@mui/material'
import { render } from '@testing-library/react'
import i18n from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import type { RenderOptions, RenderResult } from '@testing-library/react'
import type { ReactElement } from 'react'
import type React from 'react'
import type { PageContext } from 'vike/types'

import { VikePageContextProvider } from '@innodoc/contexts'
import makeStore from '@innodoc/store'
import { changeRouteInfo } from '@innodoc/store/slices/app'
import courses from '@innodoc/store/slices/content/courses'
import pages from '@innodoc/store/slices/content/pages'
import sections from '@innodoc/store/slices/content/sections'
import type { CourseRouteInfo } from '@innodoc/routes/types/routeInfos'

const theme = extendTheme(undefined, createTheme())

await i18n.use(initReactI18next).init({
  lng: 'ci',
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
})

const store = makeStore()

const TestPageShell = ({ children }: { children: React.ReactNode }) => {
  const pageContext = {
    Page: () => null,
    exports: {},
    exportsAll: {},
    routeParams: {},
    data: undefined,
    config: {},
    configEntries: {},
    urlOriginal: '',
    urlPathname: '',
    urlParsed: {
      origin: null,
      pathname: '',
      pathnameOriginal: '',
      search: {},
      searchAll: {},
      searchOriginal: null,
      searchString: null,
      hash: '',
      hashOriginal: null,
      hashString: null,
    },
    is404: false,
    isClientSideNavigation: false,
    url: '',
    pageExports: {},
  } satisfies PageContext

  return (
    <VikePageContextProvider pageContext={pageContext}>
      <ReduxProvider store={store}>
        <I18nextProvider i18n={i18n}>
          <CssVarsProvider theme={theme}>{children}</CssVarsProvider>
        </I18nextProvider>
      </ReduxProvider>
    </VikePageContextProvider>
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
  await store.dispatch(courses.endpoints.getCourse.initiate({ courseSlug }))
  await store.dispatch(pages.endpoints.getCoursePages.initiate({ courseSlug }))
  await store.dispatch(sections.endpoints.getCourseSections.initiate({ courseSlug }))
  // await fetchContent(store, getContent({ locale, path: FRAGMENT_TYPE_FOOTER_A }))
  // await fetchContent(store, getContent({ locale, path: FRAGMENT_TYPE_FOOTER_B }))
}

export * from '@testing-library/react'
export { populateStore, customRender as render }
