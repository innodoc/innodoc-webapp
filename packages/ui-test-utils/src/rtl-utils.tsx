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

import { PageContextProvider } from '@innodoc/ui-shared/contexts'
import makeStore from '@innodoc/ui-store'
import { changeRouteInfo } from '@innodoc/ui-store/slices/app'
import courses from '@innodoc/ui-store/slices/content/courses'
import pages from '@innodoc/ui-store/slices/content/pages'
import sections from '@innodoc/ui-store/slices/content/sections'
import type { CourseRouteInfo } from '@innodoc/shared-core/types'
import type { PageContext } from '@innodoc/ui-shared/contexts'

const theme = extendTheme(undefined, createTheme())

await i18n.use(initReactI18next).init({
  lng: 'ci',
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
})

const store = makeStore()

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
    href: '',
    protocol: 'https',
    hostname: 'localhost',
    port: 8080,
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
  // source: {},
  // sources: {},
  // from: {
  //   configsStandard: {},
  //   configsCumulative: {},
  //   configsComputed: {},
  // },
  // } satisfies PageContext
}

const TestPageShell = ({ children }: { children: React.ReactNode }) => {
  // FIXME: properly create PageContext?
  return (
    <PageContextProvider pageContext={pageContext as PageContext}>
      <ReduxProvider store={store}>
        <I18nextProvider i18n={i18n}>
          <CssVarsProvider theme={theme}>{children}</CssVarsProvider>
        </I18nextProvider>
      </ReduxProvider>
    </PageContextProvider>
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

// eslint-disable-next-line import-x/export
export * from '@testing-library/react'
// eslint-disable-next-line import-x/export
export { populateStore, customRender as render }
