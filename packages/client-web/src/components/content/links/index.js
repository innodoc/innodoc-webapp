import React from 'react'
import PropTypes from 'prop-types'

import { parseLink } from '@innodoc/client-misc/src/util'
import { childrenType } from '@innodoc/client-misc/src/propTypes'
import pageSelectors from '@innodoc/client-store/src/selectors/page'
import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import makeContentLink from './makeContentLink'

const PageLink = makeContentLink(pageSelectors.makeGetPageLink, 'page')
const SectionLink = makeContentLink(sectionSelectors.makeGetSectionLink, 'section')

// takes href like '/section/...' or '/page/...'
const InternalLink = ({ children, href }) => {
  let contentType
  let contentId
  try {
    [contentType, contentId] = parseLink(href)
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <span>
          <span>
            Unhandled internal link:
            {' '}
            {href}
          </span>
          {' '}
          {children}
        </span>
      )
    }
    return children
  }
  const LinkComponent = contentType === 'page' ? PageLink : SectionLink
  return (
    <LinkComponent contentId={contentId}>
      {children}
    </LinkComponent>
  )
}

InternalLink.defaultProps = {
  children: null,
}

InternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: childrenType,
}

export { InternalLink, PageLink, SectionLink }
