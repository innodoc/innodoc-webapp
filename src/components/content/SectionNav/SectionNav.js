import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Icon from 'antd/lib/icon'

import { sectionType } from '../../../lib/propTypes'
import { astToString } from '../../../lib/util'
import sectionSelectors from '../../../store/orm/selectors/section'
import contentSelectors from '../../../store/selectors/content'
import i18nSelectors from '../../../store/selectors/i18n'
import SectionLink from '../../SectionLink'
import css from './style.sass'

const SectionNav = ({ currentLanguage, prev, next }) => (
  <React.Fragment>
    {
      prev ? (
        <SectionLink sectionPath={prev.id}>
          <a title={astToString(prev.title[currentLanguage])} className={css.prev}>
            <Icon type="left" />
          </a>
        </SectionLink>
      ) : null
    }
    {
      next ? (
        <SectionLink sectionPath={next.id}>
          <a title={astToString(next.title[currentLanguage])} className={css.next}>
            <Icon type="right" />
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
  const navSections = sectionSelectors.getNavSections(
    state, contentSelectors.getCurrentSectionPath(state))
  return {
    ...navSections,
    currentLanguage: i18nSelectors.getLanguage(state),
  }
}

export { SectionNav } // for testing
export default connect(mapStateToProps)(SectionNav)
