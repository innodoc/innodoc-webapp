import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import sectionSelectors from '@innodoc/client-store/src/selectors/section'
import css from './Toc.module.sss'

const ActiveSectionLabel = ({ sectionId }) => {
  const getSectionLink = useMemo(
    (state, sectionId_) => sectionSelectors.makeGetSectionLink(state, sectionId_),
    []
  )
  const { shortTitle, title } = useSelector((state) => getSectionLink(state, sectionId))
  return <span className={css.active}>{shortTitle || title}</span>
}

ActiveSectionLabel.propTypes = {
  sectionId: PropTypes.string.isRequired,
}

export default ActiveSectionLabel
