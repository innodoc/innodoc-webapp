import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Link from 'next/link'

import { childrenType } from '../lib/propTypes'
import sectionSelectors from '../store/selectors/section'

const SectionLink = ({ children, sectionId: sectionIdHash }) => {
  const getSectionLink = useMemo(sectionSelectors.makeGetSectionLink, [])
  const { hash, section } = useSelector(state => getSectionLink(state, sectionIdHash))
  const { id, title } = section
  const linkProps = {
    href: {
      pathname: '/page',
      query: { sectionId: id },
    },
    as: { pathname: `/page/${id}` },
  }
  if (hash) {
    linkProps.as.hash = `#${hash}`
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
}

SectionLink.propTypes = {
  children: childrenType,
  sectionId: PropTypes.string.isRequired,
}

export default SectionLink
