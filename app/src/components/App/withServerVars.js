import getConfig from 'next/config'

import { setServerConfiguration } from '@innodoc/store/src/actions/content'
import { languageDetected } from '@innodoc/store/src/actions/i18n'
import { userLoggedIn } from '@innodoc/store/src/actions/user'

import createHoc from './createHoc'

const {
  serverRuntimeConfig: {
    appRoot,
    contentRoot,
    discourseUrl,
    ftSearch,
    staticRoot,
    sectionPathPrefix,
    pagePathPrefix,
    pdfFilename,
  },
} = getConfig()

const withServerVars = createHoc('withServerVars', async ({ req }, { dispatch }) => {
  // Pass initial configuration from express app
  dispatch(
    setServerConfiguration(
      appRoot,
      contentRoot,
      discourseUrl,
      ftSearch,
      staticRoot,
      req.csrfToken(),
      sectionPathPrefix,
      pagePathPrefix,
      pdfFilename
    )
  )
  // Pass detected language to store
  if (req.i18n) {
    dispatch(languageDetected(req.i18n.language))
  }
  // Express/passport sets req.user on successful auth
  if (req.user) {
    dispatch(userLoggedIn(req.user.email))
  }
})

export default withServerVars
