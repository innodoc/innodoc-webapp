import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import sectionSelectors from '@innodoc/client-store/src/selectors/section'

const ActiveSectionLabel = ({ sectionId }) => {
  const getSectionLink = useMemo(sectionSelectors.makeGetSectionLink, [])
  const { title } = useSelector((state) => getSectionLink(state, sectionId))
  return <span>{title}</span>
}

ActiveSectionLabel.propTypes = {
  sectionId: PropTypes.string.isRequired,
}

export default ActiveSectionLabel
