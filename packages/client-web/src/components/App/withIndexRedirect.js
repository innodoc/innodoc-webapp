import React from 'react'

import { parseLink } from '@innodoc/client-misc/src/util'
import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'

import getLinkInfo from '../../getLinkInfo'
import { getDisplayName, getWrappedComponentProps } from './util'

const withIndexRedirect = (WrappedComponent) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const WithIndexRedirect = (props) => <WrappedComponent {...props} />

  WithIndexRedirect.getInitialProps = async (context) => {
    const { ctx } = context
    const wrappedComponentProps = await getWrappedComponentProps(
      WrappedComponent,
      context
    )

    if (ctx.store && ctx.res && ctx.asPath === '/') {
      const course = courseSelectors.getCurrentCourse(ctx.store.getState())

      let parsedHomeLink
      try {
        parsedHomeLink = parseLink(course.homeLink)
      } catch (e) {
        throw new Error(`Could not parse homeLink: ${course.homeLink}`)
      }
      const [contentType, contentId] = parsedHomeLink

      const { pagePathPrefix, sectionPathPrefix } = appSelectors.getApp(
        ctx.store.getState()
      )
      const pathPrefix =
        contentType === 'page' ? pagePathPrefix : sectionPathPrefix
      const linkInfo = getLinkInfo(pathPrefix, contentId)
      ctx.res.writeHead(301, { Location: linkInfo.as.pathname })
      ctx.res.end()
    }

    return wrappedComponentProps
  }

  WithIndexRedirect.displayName = getDisplayName(
    'WithIndexRedirect',
    WrappedComponent
  )
  return WithIndexRedirect
}

export default withIndexRedirect
