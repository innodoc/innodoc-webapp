import { render } from 'vike/abort'
import { dangerouslySkipEscape, escapeInject } from 'vike/server'
import type { FilledContext } from 'react-helmet-async'
import type { OnRenderHtmlAsync } from 'vike/types'

import renderPage from '@innodoc/ui'

import renderToHtml from './renderToHtml'
import { createEmotionCache, emotionStyleTags, initColorSchemeScript, initI18n } from './utils'

const onRenderHtml: OnRenderHtmlAsync = async function (
  pageContext,
): Promise<ReturnType<typeof escapeInject>> {
  const { Page, routeInfo, store } = pageContext

  const emotionCache = createEmotionCache()
  const i18n = await initI18n(routeInfo, store)

  // Initialize helmet context
  const helmetContext = {}

  if (!Page) {
    throw render(500, `No Page component found for ${routeInfo.name}`)
  }

  // Render page
  const pageHtml = await renderToHtml(
    renderPage(pageContext, Page, pageContext.store, emotionCache, i18n, helmetContext),
  )

  // Get document head tags
  const { helmet } = helmetContext as FilledContext

  return escapeInject`<!DOCTYPE html>
    <html ${dangerouslySkipEscape(helmet.htmlAttributes.toString())}>
      <head>
        ${dangerouslySkipEscape(helmet.title.toString())}
        ${dangerouslySkipEscape(helmet.meta.toString())}
        ${dangerouslySkipEscape(helmet.link.toString())}
        ${dangerouslySkipEscape(emotionStyleTags(emotionCache, pageHtml))}
      </head>
      <body ${dangerouslySkipEscape(helmet.bodyAttributes.toString())}>
        ${dangerouslySkipEscape(initColorSchemeScript())}
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}

export default onRenderHtml
