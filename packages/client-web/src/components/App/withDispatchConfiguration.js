import React from 'react'

import {
  loadManifest,
  setServerConfiguration,
} from '@innodoc/client-store/src/actions/content'
import { languageDetected } from '@innodoc/client-store/src/actions/i18n'
import { userLoggedIn } from '@innodoc/client-store/src/actions/user'

import { getDisplayName, getWrappedComponentProps } from './util'

const withDispatchConfiguration = (WrappedComponent) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const WithDispatchConfiguration = (props) => <WrappedComponent {...props} />

  WithDispatchConfiguration.getInitialProps = async (context) => {
    const { ctx } = context
    const wrappedComponentProps = await getWrappedComponentProps(
      WrappedComponent,
      context
    )

    // Only on server
    if (ctx.req && ctx.res) {
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

      // Load content manifest on start-up
      dispatch(loadManifest())
    }

    return wrappedComponentProps
  }

  WithDispatchConfiguration.displayName = getDisplayName(
    'WithDispatchConfiguration',
    WrappedComponent
  )
  return WithDispatchConfiguration
}

export default withDispatchConfiguration
