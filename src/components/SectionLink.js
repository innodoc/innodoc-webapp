import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Link from 'next/link'

import { childrenType, sectionTypeSparse } from '../lib/propTypes'
import sectionSelectors from '../store/selectors/section'

const SectionLink = ({ children, hash, section }) => {
  const { id, title } = section
  const linkProps = {
    href: {
      pathname: '/page',
      query: { sectionId: id },
    },
    as: {
      pathname: `/page/${id}`,
      hash: hash ? `#${hash}` : undefined,
    },
  }

  const newChildren = children
    ? React.cloneElement(children, { title })
    : <a>{title}</a>
  return (
    <Link {...linkProps}>
      {newChildren}
    </Link>
  )
}

SectionLink.defaultProps = {
  children: null,
  hash: null,
}

SectionLink.propTypes = {
  children: childrenType,
  hash: PropTypes.string,
  section: sectionTypeSparse.isRequired,
}

const makeMapStateToProps = () => {
  const getSectionLink = sectionSelectors.makeGetSectionLink()
  return (state, props) => getSectionLink(state, props)
}

export { makeMapStateToProps, SectionLink as SectionLinkBare } // for testing
export default connect(makeMapStateToProps)(SectionLink)
