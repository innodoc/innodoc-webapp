import path from 'node:path'
import { fileURLToPath } from 'node:url'

import createEmotionServer from '@emotion/server/create-instance'
import { getInitColorSchemeScript } from '@mui/material'
import I18NextFsBackend, { type FsBackendOptions } from 'i18next-fs-backend'
import { renderToStaticMarkup } from 'react-dom/server'
import type { EmotionCache } from '@emotion/cache'

import getI18n from '@innodoc/shared-core/i18n'
import type { AppRouteInfo } from '@innodoc/shared-core/routes'
import type { Store } from '@innodoc/ui-store/types'

import { getSupportedLocales } from '#renderer/common'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Initialize i18next with filesystem backend.
 *
 * @param routeInfo Current route info
 * @param store App store
 * @returns i18n instance
 */
function initI18n(routeInfo: AppRouteInfo, store: Store) {
  // Determine locale paths
  let opts: FsBackendOptions
  if (import.meta.env.PROD) {
    opts = { loadPath: path.resolve(dirname, '..', 'locales', '{{lng}}', '{{ns}}.json') }
  } else {
    const frontendRootDir = path.resolve(dirname, '..', '..', '..')
    const baseLocalesPath = path.join(frontendRootDir, 'public', 'locales')
    opts = {
      loadPath: path.join(baseLocalesPath, '{{lng}}', '{{ns}}.json'),
      addPath: path.join(baseLocalesPath, '{{lng}}', '{{ns}}.missing.json'),
    }
  }

  // Get course locales
  const locales = getSupportedLocales(store, routeInfo)

  // Create i18n instance
  return getI18n(I18NextFsBackend, opts, routeInfo.locale, locales)
}

function emotionStyleTags(cache: EmotionCache, html: string) {
  const emotionServer = createEmotionServer(cache)
  const chunks = emotionServer.extractCriticalToChunks(html)
  return emotionServer.constructStyleTagsFromChunks(chunks)
}

/**
 * Script that reads from localStorage and sets mode on html tag before page is
 * rendered (avoid color mode flicker)
 */
function initColorSchemeScript() {
  return renderToStaticMarkup(getInitColorSchemeScript({ defaultMode: 'system' }))
}

export { emotionStyleTags, initColorSchemeScript, initI18n }
