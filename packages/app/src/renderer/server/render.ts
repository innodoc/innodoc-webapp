import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr/server'
import type { PageContextRender, PageContextUpdate } from '@innodoc/server/types'
import type { FilledContext } from 'react-helmet-async'

import renderPage from '@innodoc/ui'

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
  const pageHtml = await renderToHtml(renderPage(Page, emotionCache, i18n, store, helmetContext))

  // Get document head tags
  const { helmet } = helmetContext as FilledContext

  return escapeInject`<!DOCTYPE html>
    <html ${dangerouslySkipEscape(helmet.htmlAttributes.toString() ?? '')}>
      <head>
        ${dangerouslySkipEscape(helmet.title.toString() ?? '')}
        ${dangerouslySkipEscape(helmet.meta.toString() ?? '')}
        ${dangerouslySkipEscape(helmet.link.toString() ?? '')}
        ${dangerouslySkipEscape(emotionStyleTags(emotionCache, pageHtml))}
      </head>
      <body ${dangerouslySkipEscape(helmet.bodyAttributes.toString() ?? '')}>
        ${dangerouslySkipEscape(initColorSchemeScript())}
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}

export default render
