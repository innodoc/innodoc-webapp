import createCache from '@emotion/cache'
import { render } from 'vike/abort'
import { dangerouslySkipEscape, escapeInject } from 'vike/server'
import type { FilledContext } from 'react-helmet-async'
import type { PageContextServer } from 'vike/types'

import { EMOTION_STYLE_KEY } from '@innodoc/constants'
import makeStore from '@innodoc/store'
import renderPage from '@innodoc/ui'

import renderToHtml from './renderToHtml'
import { emotionStyleTags, initColorSchemeScript, initI18n } from './utils'

interface OnRenderHtmlPageContext extends Omit<PageContextServer, 'store'> {
  store?: PageContextServer['store']
}

async function onRenderHtml(pageContextIn: OnRenderHtmlPageContext) {
  const { Page, routeInfo, store: storeIn } = pageContextIn

  // store might not be present if previous steps failed
  const store = storeIn ? storeIn : makeStore()
  const pageContext = { ...pageContextIn, store }

  const emotionCache = createCache({ key: EMOTION_STYLE_KEY })
  const i18n = await initI18n(routeInfo, store)

  // Initialize helmet context
  const helmetContext = {}

  if (!Page) {
    throw render(500, `No Page component found for ${routeInfo.name}`)
  }

  // Render page
  const pageHtml = await renderToHtml(renderPage(pageContext, Page, emotionCache, i18n, store, helmetContext))

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
