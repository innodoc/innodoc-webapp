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

// import { FRAGMENT_TYPE_FOOTER_A, FRAGMENT_TYPE_FOOTER_B } from '#constants'
import { EMOTION_STYLE_KEY, passToClientProps } from '#constants'
import { getCourse } from '#server/database/queries/courses'
import makeStore from '#store/makeStore'
import { changeCourseId, changeRouteInfo } from '#store/slices/appSlice'
import courses from '#store/slices/entities/courses'
import pages from '#store/slices/entities/pages'
import sections from '#store/slices/entities/sections'
import type { PageContextServer } from '#types/pageContext'
import PageShell from '#ui/components/PageShell/PageShell'
import getI18n from '#utils/getI18n'
import { formatUrl, replacePathPrefixes } from '#utils/url'

// import fetchContent from './fetchContent'
import renderToHtml from './renderToHtml'

function getI18nBackendOpts() {
  const dirname = path.dirname(fileURLToPath(import.meta.url))
  const baseLocalesPath = path.resolve(dirname, '..', '..', 'public', 'locales')
  return {
    loadPath: path.join(baseLocalesPath, '{{lng}}', '{{ns}}.json'),
    addPath: path.join(baseLocalesPath, '{{lng}}', '{{ns}}.missing.json'),
  }
}

const passToClient = passToClientProps

async function render({ courseId, locale, Page, redirectTo, store }: PageContextServer) {
  // Honor redirection
  if (redirectTo !== undefined) return { pageContext: { redirectTo } }

  // Initialize emotion cache
  const emotionCache = createCache({ key: EMOTION_STYLE_KEY })

  // Initialize i18next
  const i18n = await getI18n(I18NextFsBackend, getI18nBackendOpts(), locale, courseId, store)

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

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { constructStyleTagsFromChunks, extractCriticalToChunks } =
    createEmotionServer(emotionCache)
  const emotionStyleTags = constructStyleTagsFromChunks(extractCriticalToChunks(pageHtml))

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
  courseSlug,
  locale,
  routeParams,
  urlPathname,
}: PageContextServer): Promise<{ pageContext: Partial<PageContextServer> }> {
  // Fetch course ID by slug
  // TODO add getCourseIdBySlug
  const courseBySlug = await getCourse({ courseSlug })
  if (courseBySlug === undefined) throw RenderErrorPage({ pageContext: { is404: true } })
  const { id: courseId } = courseBySlug

  // Initialize store
  const store = makeStore()

  // Seed initial data to store
  store.dispatch(changeCourseId(courseId))
  store.dispatch(changeRouteInfo(routeParams))

  // Populate store with necessary data
  await store.dispatch(courses.endpoints.getCourse.initiate({ courseId }))
  await store.dispatch(pages.endpoints.getCoursePages.initiate({ courseId }))
  await store.dispatch(sections.endpoints.getCourseSections.initiate({ courseId }))
  // (store, locale) => fetchContent(store, getContent({ locale, path: FRAGMENT_TYPE_FOOTER_A })),
  // (store, locale) => fetchContent(store, getContent({ locale, path: FRAGMENT_TYPE_FOOTER_B })),

  // Retrieve course from store
  const selectCurrentCourse = courses.endpoints.getCourse.select({ courseId })
  const { data: course } = selectCurrentCourse(store.getState())
  if (course === undefined) throw new Error(`No course loaded`)

  // Assert we received locales from manifest
  if (course.locales.length < 1) {
    throw RenderErrorPage({ pageContext: { errorMsg: 'Course has no locales' } })
  }

  // TODO: how to handle this correctly?
  if (urlPathname === '/fake-404-url') locale = 'en'

  // Check if current locale is valid
  if (!course.locales.includes(locale)) {
    // TODO: should redirect to default locale instead
    throw RenderErrorPage({ pageContext: { is404: true } })
  }

  // Redirect '/' to homeLink
  // TODO: handle redirect in index.page.tsx
  if (urlPathname === '/' && course.homeLink !== undefined) {
    return {
      pageContext: {
        redirectTo: formatUrl(replacePathPrefixes(course.homeLink), locale),
      },
    }
  }

  // Grab populated state
  const preloadedState = store.getState()

  return {
    pageContext: {
      courseId,
      preloadedState,
      store,
    },
  }
}

export { getI18nBackendOpts, onBeforeRender, passToClient, render }
