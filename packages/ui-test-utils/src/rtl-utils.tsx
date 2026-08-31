import type { Theme } from '@mui/material/styles'
import type { RenderOptions, RenderResult } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { createTheme, ThemeProvider as CssVarsProvider, extendTheme } from '@mui/material/styles'
import { render as rtlRender } from '@testing-library/react'
import i18n from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { RouteManager } from '@innodoc/shared-core/routes'
import type { CourseRouteInfo, CourseSlugMode, FrontendRouteInfo } from '@innodoc/shared-core/types'
import makeStore from '@innodoc/shared-store'
import { changeRouteInfo } from '@innodoc/shared-store/slices/app'
import getCoursesApi from '@innodoc/shared-store/slices/content/courses'
import getPagesApi from '@innodoc/shared-store/slices/content/pages'
import getSectionsApi from '@innodoc/shared-store/slices/content/sections'
import { RouteManagerProvider } from '@innodoc/ui-shared/contexts'

/** Course slug of the course the mock API serves */
const TEST_COURSE_SLUG = 'test-course'

/** Route info the harnesses start on: the fixture course index, in English */
const courseIndexRouteInfo = {
  courseSlug: TEST_COURSE_SLUG,
  locale: 'en',
  name: 'app:course:index',
} satisfies CourseRouteInfo<'app:course:index'>

/** Route manager configuration keys the harness controls */
type HarnessRouteConfig = ConstructorParameters<typeof RouteManager>[0]['config']

const theme = extendTheme(undefined, createTheme())

await i18n.use(initReactI18next).init({
  lng: 'ci',
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
})

interface TestHarnessOptions {
  /**
   * How URLs are built, mirroring the `INNODOC_COURSE_SLUG_MODE` of a deployment.
   *
   * `SINGLE` (the default, and what the test environment uses) hides the course in the URL, so every
   * route is generatable from the locale alone. `URL` puts the course slug in the path, which means
   * course routes can only be generated where a `courseSlug` is known - the mode components crash in
   * development when they ask for a course URL on a route outside a course.
   */
  courseSlugMode?: CourseSlugMode
  /**
   * Route the store starts on, `app:course:index` of the fixture course by default. Pass a route
   * without a course (e.g. `app:index`) to render components as a visitor who is not inside a course.
   */
  routeInfo?: FrontendRouteInfo
  /**
   * Theme to render with. Components reading the design system's palette augmentation (the page
   * shell's styled slots) need the app's own theme: `@innodoc/ui-design-system/theme`.
   */
  theme?: Theme
}

interface TestHarness {
  /**
   * Render `ui` wrapped in the providers an app route would give it (route manager, store, i18n,
   * theme).
   */
  render: (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => RenderResult
  /** Route manager built from {@link TestHarnessOptions.courseSlugMode} */
  routeManager: RouteManager
  /** Move the store to another route */
  setRoute: (routeInfo: FrontendRouteInfo) => void
  /** Store the components under test read */
  store: ReturnType<typeof makeStore>
  /**
   * Load the fixture course with its pages and sections into the store, the way a real page load
   * would before rendering the shell.
   */
  withCourse: (courseSlug?: string) => Promise<void>
}

/**
 * Build an isolated render harness: its own store and route manager, so several URL shapes can be
 * tested side by side without leaking into each other.
 *
 * @param options Harness options
 * @returns Harness to render components with
 */
function createTestHarness({
  courseSlugMode = 'SINGLE',
  routeInfo = courseIndexRouteInfo,
  theme: themeOption = theme,
}: TestHarnessOptions = {}): TestHarness {
  const config: HarnessRouteConfig = {
    // SINGLE mode has no slug in the URL, so the course has to be known from the configuration
    courseSlugMode,
    defaultCourseSlug: courseSlugMode === 'SINGLE' ? TEST_COURSE_SLUG : null,
    pagePathPrefix: 'page',
    sectionPathPrefix: 'section',
  }

  const routeManager = new RouteManager({ config })
  const store = makeStore()

  store.dispatch(changeRouteInfo(routeInfo))

  function Providers({ children }: { children: ReactNode }) {
    return (
      <RouteManagerProvider routeManager={routeManager}>
        <ReduxProvider store={store}>
          <I18nextProvider i18n={i18n}>
            <CssVarsProvider theme={themeOption}>{children}</CssVarsProvider>
          </I18nextProvider>
        </ReduxProvider>
      </RouteManagerProvider>
    )
  }

  async function withCourse(courseSlug = TEST_COURSE_SLUG) {
    const coursesApi = getCoursesApi(routeManager)
    const pagesApi = getPagesApi(routeManager)
    const sectionsApi = getSectionsApi(routeManager)

    await store.dispatch(coursesApi.endpoints.getCourse.initiate({ courseSlug }))
    await store.dispatch(pagesApi.endpoints.getCoursePages.initiate({ courseSlug }))
    await store.dispatch(sectionsApi.endpoints.getCourseSections.initiate({ courseSlug }))
  }

  return {
    render: (ui, options) => rtlRender(ui, { wrapper: Providers, ...options }),
    routeManager,
    setRoute: (next) => store.dispatch(changeRouteInfo(next)),
    store,
    withCourse,
  }
}

// oxlint-disable-next-line import/export -- the RTL re-exports are the query API of these tests
export * from '@testing-library/react'
export { courseIndexRouteInfo, createTestHarness, TEST_COURSE_SLUG }
export type { TestHarnessOptions }
