import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Link from 'next/link'

import { childrenType } from '../lib/propTypes'
import { parseSectionId } from '../lib/util'
import appSelectors from '../store/selectors'
import sectionSelectors from '../store/selectors/section'

const SectionLink = ({
  children,
  content,
  hash,
  sectionId,
  title,
}) => {
  const linkProps = {
    href: {
      pathname: '/page',
      query: { sectionId },
    },
    as: {
      pathname: `/page/${sectionId}`,
      hash: hash ? `#${hash}` : undefined,
    },
  }
  const newChildren = children
    ? React.cloneElement(children, { title })
    : <a>{content}</a>
  return (
    <Link {...linkProps}>
      {newChildren}
    </Link>
  )
}

SectionLink.defaultProps = {
  children: null,
  hash: null,
  content: null,
  title: null,
}

SectionLink.propTypes = {
  children: childrenType,
  content: PropTypes.string,
  hash: PropTypes.string,
  sectionId: PropTypes.string.isRequired,
  title: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
  const { children, sectionId: sectionIdHash } = ownProps
  const [sectionId, hash] = parseSectionId(sectionIdHash)
  const ret = { hash, sectionId }
  try {
    const section = sectionSelectors.getSection(state, sectionId)
    const sectionTitle = section.title[appSelectors.getApp(state).language]
    if (children) {
      return { ...ret, title: sectionTitle }
    }
    return { ...ret, content: sectionTitle }
  } catch {
    return { ...ret, content: 'UNKNOWN SECTION ID' }
  }
}

export { mapStateToProps, SectionLink as SectionLinkBare } // for testing
export default connect(mapStateToProps)(SectionLink)
