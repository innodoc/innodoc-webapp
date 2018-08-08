import React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'

import { selectors as contentSelectors } from '../../../store/reducers/content'
import { selectors as i18nSelectors } from '../../../store/reducers/i18n'
import { sectionType } from '../../../lib/propTypes'
import SectionLink from '../../SectionLink'
import css from './style.sass'

const SectionNav = ({ prevSection, nextSection }) => (
  <div>
    <SectionLink sectionId={prevSection.id}>
      <a title={prevSection.title} className={[css.sbtn, css.prev].join(' ')}>
        <Icon size="huge" name="angle left" />
      </a>
    </SectionLink>
    <SectionLink sectionId={nextSection.id}>
      <a title={nextSection.title} className={[css.sbtn, css.next].join(' ')}>
        <Icon size="huge" name="angle right" />
      </a>
    </SectionLink>
  </div>
)

// TODO: that is how it should look like after #29 is closed
// const mapStateToProps = (state) => {
//     prevSection: contentSelectors.getPrevSection(state),
//     nextSection: contentSelectors.getNextSection(state),
// }

const mapStateToProps = (state) => {
  const prevSectionId = contentSelectors.getPrevSectionId(
    state, i18nSelectors.getLanguage(state), contentSelectors.getCurrentSectionId(state))
  const nextSectionId = contentSelectors.getNextSectionId(
    state, i18nSelectors.getLanguage(state), contentSelectors.getCurrentSectionId(state))

  return {
    prevSection: {
      id: prevSectionId,
      title: contentSelectors.getSectionTitle(
        state, i18nSelectors.getLanguage(state), prevSectionId),
    },
    nextSection: {
      id: nextSectionId,
      title: contentSelectors.getSectionTitle(
        state, i18nSelectors.getLanguage(state), nextSectionId),
    },
  }
}

SectionNav.propTypes = {
  prevSection: sectionType,
  nextSection: sectionType,
}

SectionNav.defaultProps = {
  prevSection: undefined,
  nextSection: undefined,
}

export { SectionNav } // for testing
export default connect(mapStateToProps)(SectionNav)
