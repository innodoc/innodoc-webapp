import path from 'path'
import { fileURLToPath } from 'url'

import createCache from '@emotion/cache'
import createEmotionServer from '@emotion/server/create-instance'
import { getInitColorSchemeScript } from '@mui/material/styles'
import I18NextFsBackend from 'i18next-fs-backend'
import { renderToStaticMarkup } from 'react-dom/server'
import type { FilledContext } from 'react-helmet-async'
import { RenderErrorPage } from 'vite-plugin-ssr/RenderErrorPage'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'

// Material UI font
import '@fontsource/lato/400.css'
import '@fontsource/lato/400-italic.css'
import '@fontsource/lato/700.css'
import '@fontsource/lato/700-italic.css'

// KaTeX CSS
import 'katex/dist/katex.css'

import { EMOTION_STYLE_KEY, PASS_TO_CLIENT_PROPS } from '#constants'
import getRouteManager from '#routes/getRouteManager'
import makeStore from '#store/makeStore'
import { changeRouteInfo } from '#store/slices/appSlice'
import courses from '#store/slices/entities/courses'
import pages from '#store/slices/entities/pages'
import sections from '#store/slices/entities/sections'
import type { ApiCourse } from '#types/entities/course'
import type {
  PageContextUpdate,
  PageContextOnBeforeRender,
  PageContextRender,
} from '#types/pageContext'
import PageShell from '#ui/components/PageShell/PageShell'
import RouteTransition from '#ui/components/PageShell/RouteTransition'
import getI18n from '#utils/getI18n'
import renderToHtml from '#utils/ssr/renderToHtml'

const routeManager = getRouteManager()

function getI18nBackendOpts() {
  const dirname = path.dirname(fileURLToPath(import.meta.url))
  const baseLocalesPath = path.resolve(dirname, '..', '..', 'public', 'locales')
  return {
    loadPath: path.join(baseLocalesPath, '{{lng}}', '{{ns}}.json'),
    addPath: path.join(baseLocalesPath, '{{lng}}', '{{ns}}.missing.json'),
  }
}

async function render({
  Page,
  redirectTo,
  routeInfo,
  store,
}: PageContextRender): Promise<PageContextUpdate | ReturnType<typeof escapeInject>> {
  if (redirectTo !== undefined) {
    return { pageContext: { redirectTo } }
  }

  if (routeInfo.locale === undefined) {
    throw new Error('locale is undefined')
  }

  // Initialize emotion cache
  const emotionCache = createCache({ key: EMOTION_STYLE_KEY })

  // Initialize i18next
  const i18n = await getI18n(
    I18NextFsBackend,
    getI18nBackendOpts(),
    routeInfo.locale,
    routeInfo.courseSlug,
    store
  )

  // Initialize helmet context
  const helmetContext = {}

  // Render page
  const pageHtml = await renderToHtml(
    <PageShell emotionCache={emotionCache} helmetContext={helmetContext} i18n={i18n} store={store}>
      <RouteTransition>
        <Page />
      </RouteTransition>
    </PageShell>
  )

  // Get document head tags
  const { helmet } = helmetContext as FilledContext

  // Create emotion server
  const emotionServer = createEmotionServer(emotionCache)
  const chunks = emotionServer.extractCriticalToChunks(pageHtml)
  const emotionStyleTags = emotionServer.constructStyleTagsFromChunks(chunks)

  // Script that reads from localStorage and sets mode on html tag before
  // page is rendered (avoid color mode flicker)
  const initColorSchemeScript = renderToStaticMarkup(
    getInitColorSchemeScript({ defaultMode: 'system' })
  )

  return escapeInject`<!DOCTYPE html>
    <html ${dangerouslySkipEscape(helmet?.htmlAttributes?.toString() ?? '')}>
      <head>
        ${dangerouslySkipEscape(helmet?.title?.toString() ?? '')}
        ${dangerouslySkipEscape(helmet?.meta?.toString() ?? '')}
        ${dangerouslySkipEscape(helmet?.link?.toString() ?? '')}
        ${dangerouslySkipEscape(emotionStyleTags ?? '')}
      </head>
      <body ${dangerouslySkipEscape(helmet?.bodyAttributes?.toString() ?? '')}>
        ${dangerouslySkipEscape(initColorSchemeScript)}
        <div id="root">${dangerouslySkipEscape(pageHtml ?? '')}</div>
      </body>
    </html>`
}

async function onBeforeRender({
  needRedirect,
  routeInfo: routeInfoInput,
  routeParams,
  urlOriginal,
}: PageContextOnBeforeRender): Promise<PageContextUpdate> {
  let course: ApiCourse | undefined = undefined

  const pageContextUpdate = {
    // Merge info from route function
    routeInfo: { ...routeInfoInput, ...routeParams },

    // Initialize store
    store: makeStore(),
  }

  // Set current route info
  pageContextUpdate.store.dispatch(changeRouteInfo(pageContextUpdate.routeInfo))

  // Populate store with necessary data
  if (pageContextUpdate.routeInfo.courseSlug !== null) {
    const courseParam = { courseSlug: pageContextUpdate.routeInfo.courseSlug }

    // Load course
    await pageContextUpdate.store.dispatch(courses.endpoints.getCourse.initiate(courseParam))

    // Select course
    const selectCurrentCourse = courses.endpoints.getCourse.select(courseParam)
    const { data } = selectCurrentCourse(pageContextUpdate.store.getState())
    if (data === undefined) {
      throw RenderErrorPage({
        pageContext: {
          ...pageContextUpdate,
          errorMsg: `Course ${pageContextUpdate.routeInfo.courseSlug} not found`,
        },
      })
    }
    course = data

    // Assert we received locales from manifest
    if (course.locales.length < 1) {
      throw RenderErrorPage({
        pageContext: { ...pageContextUpdate, errorMsg: 'Course has no locales' },
      })
    }

    // Check if current locale is valid
    if (
      pageContextUpdate.routeInfo.locale &&
      !course.locales.includes(pageContextUpdate.routeInfo.locale)
    ) {
      const redirectTo = routeManager.generate({
        ...pageContextUpdate.routeInfo,
        locale: course.locales[0],
      })
      return { pageContext: { ...pageContextUpdate, redirectTo } }
    }
  }

  // Redirect to proper URL if info couldn't be extracted
  if (needRedirect) {
    const redirectTo = routeManager.generate(pageContextUpdate.routeInfo)
    return { pageContext: { ...pageContextUpdate, redirectTo } }
  }

  if (pageContextUpdate.routeInfo.courseSlug !== null) {
    const courseParam = { courseSlug: pageContextUpdate.routeInfo.courseSlug }

    // Load pages sections
    await pageContextUpdate.store.dispatch(pages.endpoints.getCoursePages.initiate(courseParam))
    await pageContextUpdate.store.dispatch(
      sections.endpoints.getCourseSections.initiate(courseParam)
    )

    // Load fragment content
    // TODO
    // await fetchContent(store, getContent({ locale, path: FRAGMENT_TYPE_FOOTER_A }))
    // await fetchContent(store, getContent({ locale, path: FRAGMENT_TYPE_FOOTER_B }))
  }

  // TODO: how to handle this correctly?
  if (urlOriginal === '/fake-404-url') {
    pageContextUpdate.routeInfo.locale = 'en'
  }

  return {
    pageContext: {
      ...pageContextUpdate,

      // Grab populated state
      preloadedState: pageContextUpdate.store.getState(),
    },
  }
}

export { getI18nBackendOpts, onBeforeRender, PASS_TO_CLIENT_PROPS as passToClient, render }
