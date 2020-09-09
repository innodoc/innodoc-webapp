import getConfig from 'next/config'

import { setServerConfiguration } from '@innodoc/client-store/src/actions/content'
import { languageDetected } from '@innodoc/client-store/src/actions/i18n'
import { userLoggedIn } from '@innodoc/client-store/src/actions/user'

import createHoc from './createHoc'

const {
  serverRuntimeConfig: { appRoot, contentRoot, staticRoot, sectionPathPrefix, pagePathPrefix },
} = getConfig()

const withServerVars = createHoc('withServerVars', async (ctx) => {
  const { dispatch } = ctx.store

  // Pass initial configuration from express app
  dispatch(
    setServerConfiguration(
      appRoot,
      contentRoot,
      staticRoot,
      ctx.req.csrfToken(),
      sectionPathPrefix,
      pagePathPrefix
    )
  )

  // Pass detected language to store
  if (ctx.req.i18n) {
    dispatch(languageDetected(ctx.req.i18n.language))
  }

  // Express/passport sets req.user on successful auth
  if (ctx.req.user) {
    dispatch(userLoggedIn(ctx.req.user.email))
  }
})

export default withServerVars
