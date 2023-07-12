import type { FilledContext } from 'react-helmet-async'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'

import type { PageContextUpdate, PageContextRender } from '#types/pageContext'
import PageShell from '#ui/components/app/PageShell/PageShell'
import RouteTransition from '#ui/components/app/RouteTransition'

import renderToHtml from './renderToHtml'
import { createEmotionCache, emotionStyleTags, initColorSchemeScript, initI18n } from './utils'

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

  const emotionCache = createEmotionCache()
  const i18n = await initI18n(routeInfo, store)

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

  return escapeInject`<!DOCTYPE html>
    <html ${dangerouslySkipEscape(helmet?.htmlAttributes?.toString() ?? '')}>
      <head>
        ${dangerouslySkipEscape(helmet?.title?.toString() ?? '')}
        ${dangerouslySkipEscape(helmet?.meta?.toString() ?? '')}
        ${dangerouslySkipEscape(helmet?.link?.toString() ?? '')}
        ${dangerouslySkipEscape(emotionStyleTags(emotionCache, pageHtml))}
      </head>
      <body ${dangerouslySkipEscape(helmet?.bodyAttributes?.toString() ?? '')}>
        ${dangerouslySkipEscape(initColorSchemeScript())}
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}

export default render
