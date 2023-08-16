import createCache, { type EmotionCache } from '@emotion/cache'
import createEmotionServer from '@emotion/server/create-instance'
import { getInitColorSchemeScript } from '@mui/material'
import I18NextFsBackend, { type FsBackendOptions } from 'i18next-fs-backend'
import path from 'path'
import { renderToStaticMarkup } from 'react-dom/server'
import { fileURLToPath } from 'url'
import type { RouteInfo } from '@innodoc/routes/types'
import type { Store } from '@innodoc/store/types'

import { EMOTION_STYLE_KEY } from '@innodoc/constants'
import getI18n from '@innodoc/i18n'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** Initialize i18next with filesystem backend */
export function initI18n(routeInfo: RouteInfo, store: Store) {
  // Determine locale paths
  let opts: FsBackendOptions
  if (import.meta.env.PROD) {
    opts = { loadPath: path.resolve(dirname, '..', 'locales', '{{lng}}', '{{ns}}.json') }
  } else {
    const rootDir = path.resolve(dirname, '..', '..', '..')
    const baseLocalesPath = path.join(rootDir, 'public', 'locales')
    opts = {
      loadPath: path.join(baseLocalesPath, '{{lng}}', '{{ns}}.json'),
      addPath: path.join(baseLocalesPath, '{{lng}}', '{{ns}}.missing.json'),
    }
  }

  // Create i18n instance
  return getI18n(I18NextFsBackend, opts, routeInfo.locale, routeInfo.courseSlug, store)
}

export function createEmotionCache() {
  return createCache({ key: EMOTION_STYLE_KEY })
}

export function emotionStyleTags(cache: EmotionCache, html: string) {
  const emotionServer = createEmotionServer(cache)
  const chunks = emotionServer.extractCriticalToChunks(html)
  return emotionServer.constructStyleTagsFromChunks(chunks) ?? ''
}

/**
 * Script that reads from localStorage and sets mode on html tag before page is
 * rendered (avoid color mode flicker)
 */
export function initColorSchemeScript() {
  return renderToStaticMarkup(getInitColorSchemeScript({ defaultMode: 'system' }))
}
