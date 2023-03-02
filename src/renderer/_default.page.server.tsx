import path from 'path'
import { fileURLToPath } from 'url'

import createCache from '@emotion/cache'
import createEmotionServer from '@emotion/server/create-instance'
import { getInitColorSchemeScript } from '@mui/material/styles'
import I18NextFsBackend from 'i18next-fs-backend'
import { renderToStaticMarkup } from 'react-dom/server'
import type { FilledContext } from 'react-helmet-async'
import { escapeInject, dangerouslySkipEscape, RenderErrorPage } from 'vite-plugin-ssr'

// Material UI font
import '@fontsource/lato/400.css'
import '@fontsource/lato/400-italic.css'
import '@fontsource/lato/700.css'
import '@fontsource/lato/700-italic.css'

// KaTeX CSS
import 'katex/dist/katex.min.css'

import { EMOTION_STYLE_KEY, PASS_TO_CLIENT_PROPS } from '#constants'
import getRouteManager from '#routes/getRouteManager'
import { getCourseIdBySlug } from '#server/database/queries/courses'
import makeStore from '#store/makeStore'
import { changeCourseId, changeRouteInfo, selectRouteInfo } from '#store/slices/appSlice'
import courses from '#store/slices/entities/courses'
import pages from '#store/slices/entities/pages'
import sections from '#store/slices/entities/sections'
import type {
  PageContextUpdate,
  PageContextOnBeforeRender,
  PageContextRender,
} from '#types/pageContext'
import PageShell from '#ui/components/PageShell/PageShell'
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
  courseId,
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
    courseId,
    store
  )

  // Initialize helmet context
  const helmetContext = {}

  // Render page
  const pageHtml = await renderToHtml(
    <PageShell emotionCache={emotionCache} helmetContext={helmetContext} i18n={i18n} store={store}>
      <Page />
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
  // Merge info from route function
  const routeInfo = { ...routeInfoInput, ...routeParams }

  // Initialize store
  const store = makeStore()

  // Set current route info
  store.dispatch(changeRouteInfo(routeInfo))

  // Fetch course ID by slug
  const { courseSlug } = selectRouteInfo(store.getState())
  const courseId = await getCourseIdBySlug(courseSlug)
  if (courseId === undefined) {
    throw RenderErrorPage({ pageContext: { is404: true } })
  }
  store.dispatch(changeCourseId(courseId))

  // Load course first as we might need it for later redirection
  await store.dispatch(courses.endpoints.getCourse.initiate({ courseId }))

  // Redirect to proper URL if info couldn't be extracted
  if (needRedirect) {
    const { routeName, ...routeArgs } = routeInfo
    return {
      pageContext: {
        courseId,
        redirectTo: routeManager.generate(routeName, routeArgs),
        routeInfo,
        store,
      },
    }
  }

  // Populate store with necessary data
  await store.dispatch(pages.endpoints.getCoursePages.initiate({ courseId }))
  await store.dispatch(sections.endpoints.getCourseSections.initiate({ courseId }))
  // await fetchContent(store, getContent({ locale, path: FRAGMENT_TYPE_FOOTER_A }))
  // await fetchContent(store, getContent({ locale, path: FRAGMENT_TYPE_FOOTER_B }))

  // Retrieve course from store
  const selectCurrentCourse = courses.endpoints.getCourse.select({ courseId })
  const { data: course } = selectCurrentCourse(store.getState())
  if (course === undefined) {
    throw new Error('No course loaded')
  }

  // Assert we received locales from manifest
  if (course.locales.length < 1) {
    throw RenderErrorPage({ pageContext: { errorMsg: 'Course has no locales' } })
  }

  // TODO: how to handle this correctly?
  if (urlOriginal === '/fake-404-url') {
    routeInfo.locale = 'en'
  }

  // Check if current locale is valid
  if (routeInfo.locale && !course.locales.includes(routeInfo.locale)) {
    // TODO: should redirect to default locale instead
    throw RenderErrorPage({ pageContext: { is404: true } })
  }

  // Grab populated state
  const preloadedState = store.getState()

  return {
    pageContext: {
      courseId,
      preloadedState,
      routeInfo,
      store,
    },
  }
}

export { getI18nBackendOpts, onBeforeRender, PASS_TO_CLIENT_PROPS as passToClient, render }
