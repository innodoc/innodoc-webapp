import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { makeGetSectionLink } from '@innodoc/store/selectors/section'

import css from './Toc.module.sss'

function ActiveSectionLabel({ sectionId }) {
  const getSectionLink = useMemo((state, sectionId_) => makeGetSectionLink(state, sectionId_), [])
  const { shortTitle, title } = useSelector((state) => getSectionLink(state, sectionId))
  return <span className={css.active}>{shortTitle || title}</span>
}

ActiveSectionLabel.propTypes = {
  sectionId: PropTypes.string.isRequired,
}

export default ActiveSectionLabel
