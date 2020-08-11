import { setServerConfiguration } from '@innodoc/client-store/src/actions/content'
import { languageDetected } from '@innodoc/client-store/src/actions/i18n'
import { userLoggedIn } from '@innodoc/client-store/src/actions/user'

import createHoc from './createHoc'

const withDispatchConfiguration = createHoc('WithDispatchConfiguration', async (ctx) => {
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

  // Server verified access token
  if (ctx.res.locals.loggedInEmail) {
    dispatch(userLoggedIn(ctx.res.locals.loggedInEmail))
  }
})

export default withDispatchConfiguration
