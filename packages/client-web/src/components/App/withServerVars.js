import { setServerConfiguration } from '@innodoc/client-store/src/actions/content'
import { languageDetected } from '@innodoc/client-store/src/actions/i18n'
import { userLoggedIn } from '@innodoc/client-store/src/actions/user'

import createHoc from './createHoc'

const withServerVars = createHoc('withServerVars', async (ctx) => {
  const { dispatch } = ctx.store

  // Pass initial configuration from express app
  dispatch(
    setServerConfiguration(
      ctx.res.locals.appRoot,
      ctx.res.locals.contentRoot,
      ctx.res.locals.staticRoot,
      ctx.req.csrfToken(),
      ctx.res.locals.sectionPathPrefix,
      ctx.res.locals.pagePathPrefix
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
