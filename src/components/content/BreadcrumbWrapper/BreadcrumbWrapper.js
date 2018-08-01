import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Breadcrumb, Segment } from 'semantic-ui-react'

import { selectors as contentSelectors } from '../../../store/reducers/content'
import { selectors as i18nSelectors } from '../../../store/reducers/i18n'
import ContentFragment from '../ContentFragment'
import SectionLink from '../../SectionLink'
import css from './style.sass'

const BreadcrumbWrapper = ({ sections }) => {
  const breadcrumbSections = []
    .concat(...sections.map(e => [-1, e])) // put dividers between sections
    .slice(1)
    .map((section, idx, arr) => {
      const key = idx.toString()

      if (section === -1) { // -1 means add a divider
        return (<Breadcrumb.Divider key={key} icon="right angle" />)
      }

      const isLastSection = idx === arr.length - 1
      let content = <ContentFragment content={section.title} />

      if (!isLastSection) {
        content = (
          <SectionLink sectionId={section.id}>
            <a>
              {content}
            </a>
          </SectionLink>
        )
      }

      return (
        <Breadcrumb.Section key={key} active={isLastSection}>
          {content}
        </Breadcrumb.Section>
      )
    })

  return (
    <Segment basic className={css.breadcrumbSegment}>
      <Breadcrumb size="large">
        {breadcrumbSections}
      </Breadcrumb>
    </Segment>
  )
}

BreadcrumbWrapper.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.any).isRequired,
}

const mapStateToProps = state => ({
  sections: contentSelectors.getCurrentBreadcrumbSections(state, i18nSelectors.getLanguage(state)),
})

export { BreadcrumbWrapper } // for testing
export default connect(mapStateToProps)(BreadcrumbWrapper)
