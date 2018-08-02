import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'

import { selectors } from '../../../store/reducers/content'
import SectionLink from '../../SectionLink'
import css from './style.sass'

const SectionButton = ({ prev, prevSectionId, nextSectionId }) => {
  let iconName = ''
  let sectionId = ''
  switch (prev) {
    case true:
      sectionId = prevSectionId
      iconName = 'angle left'
      break
    case false:
      sectionId = nextSectionId
      iconName = 'angle right'
      break
    default:
      return null
  }

  // Don't render if there's no section to link to
  if (sectionId === undefined) {
    return null
  }

  return (
    <SectionLink sectionId={sectionId}>
      <a className={[css.sbtn, (prev ? css.prev : css.next)].join(' ')}>
        <Icon size="huge" name={iconName} />
      </a>
    </SectionLink>
  )
}

SectionButton.propTypes = {
  prev: PropTypes.bool,
  prevSectionId: PropTypes.string,
  nextSectionId: PropTypes.string,
}

SectionButton.defaultProps = {
  prev: false,
  prevSectionId: undefined,
  nextSectionId: undefined,
}

const mapStateToProps = state => (
  {
    prevSectionId: selectors.getPrevSectionId(state, selectors.getCurrentSectionId(state)),
    nextSectionId: selectors.getNextSectionId(state, selectors.getCurrentSectionId(state)),
  }
)

export default connect(mapStateToProps)(SectionButton)
