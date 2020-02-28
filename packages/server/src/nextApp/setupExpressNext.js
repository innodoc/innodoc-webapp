import nextI18NextMiddleware from 'next-i18next/middleware'

import nextI18next from '@innodoc/client-misc/src/i18n'
import { getContentPath, makeHandleCustomRoute } from './util'
import makePassConfigMiddleware from './makePassConfigMiddleware'

const setupExpressNext = (expressApp, nextApp, config) =>
  expressApp
    .use(nextI18NextMiddleware(nextI18next))
    .use(makePassConfigMiddleware(config))
    .get(
      getContentPath(process.env.SECTION_PATH_PREFIX),
      makeHandleCustomRoute(nextApp, '/section')
    )
    .get(
      getContentPath(process.env.PAGE_PATH_PREFIX),
      makeHandleCustomRoute(nextApp, '/page')
    )
    // everything else handled by next.js app
    .get('*', nextApp.getRequestHandler())

export default setupExpressNext
