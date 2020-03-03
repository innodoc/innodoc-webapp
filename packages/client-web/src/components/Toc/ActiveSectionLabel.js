import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import sectionSelectors from '@innodoc/client-store/src/selectors/section'
import css from './style.sss'

const ActiveSectionLabel = ({ sectionId }) => {
  const getSectionLink = useMemo(sectionSelectors.makeGetSectionLink, [])
  const { title } = useSelector((state) => getSectionLink(state, sectionId))
  return <span className={css.active}>{title}</span>
}

ActiveSectionLabel.propTypes = {
  sectionId: PropTypes.string.isRequired,
}

export default ActiveSectionLabel
