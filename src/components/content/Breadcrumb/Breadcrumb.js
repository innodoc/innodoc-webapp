import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Breadcrumb as SemanticBreadcrumb, Segment } from 'semantic-ui-react'

import contentSelectors from '../../../store/selectors/content'
import ContentFragment from '../ContentFragment'
import SectionLink from '../../SectionLink'
import css from './style.sass'

const Breadcrumb = ({ sections }) => {
  const breadcrumbSections = []
    .concat(...sections.map(e => [-1, e])) // put dividers between sections
    .slice(1)
    .map((section, idx, arr) => {
      const key = idx.toString()

      if (section === -1) { // -1 means add a divider
        return (<SemanticBreadcrumb.Divider key={key} icon="right angle" />)
      }

      const isLastSection = idx === arr.length - 1
      let content = <ContentFragment content={section.title} />

      if (!isLastSection) {
        content = (
          <SectionLink sectionPath={section.path}>
            <a>
              {content}
            </a>
          </SectionLink>
        )
      }

      return (
        <SemanticBreadcrumb.Section key={key} active={isLastSection}>
          {content}
        </SemanticBreadcrumb.Section>
      )
    })

  return (
    <Segment basic className={css.breadcrumbSegment}>
      <SemanticBreadcrumb size="large">
        {breadcrumbSections}
      </SemanticBreadcrumb>
    </Segment>
  )
}

Breadcrumb.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.any).isRequired,
}

const mapStateToProps = state => ({
  sections: contentSelectors.getBreadcrumbSections(state),
})

export { Breadcrumb } // for testing
export default connect(mapStateToProps)(Breadcrumb)
