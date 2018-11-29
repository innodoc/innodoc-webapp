import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Icon from 'antd/lib/icon'

import { sectionType } from '../../../lib/propTypes'
import appSelectors from '../../../store/selectors/app'
import courseSelectors from '../../../store/selectors/course'
import sectionSelectors from '../../../store/selectors/section'
import SectionLink from '../../SectionLink'
import css from './style.sass'

const SectionNav = ({ currentLanguage, prev, next }) => (
  <React.Fragment>
    {
      prev ? (
        <SectionLink sectionId={prev.id}>
          <a title={prev.title[currentLanguage]} className={css.prev}>
            <Icon type="arrow-left" />
          </a>
        </SectionLink>
      ) : null
    }
    {
      next ? (
        <SectionLink sectionId={next.id}>
          <a title={next.title[currentLanguage]} className={css.next}>
            <Icon type="arrow-right" />
          </a>
        </SectionLink>
      ) : null
    }
  </React.Fragment>
)

SectionNav.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  prev: sectionType,
  next: sectionType,
}

SectionNav.defaultProps = {
  prev: undefined,
  next: undefined,
}

const mapStateToProps = (state) => {
  const course = courseSelectors.getCurrentCourse(state)
  const navSections = sectionSelectors.getNavSections(state, course.currentSectionId)
  return {
    ...navSections,
    currentLanguage: appSelectors.getLanguage(state),
  }
}

export { SectionNav } // for testing
export default connect(mapStateToProps)(SectionNav)
