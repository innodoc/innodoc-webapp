import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Breadcrumb as SemanticBreadcrumb, Segment } from 'semantic-ui-react'
import Link from 'next/link'

import contentSelectors from '../../../store/selectors/content'
import ContentFragment from '../ContentFragment'
import SectionLink from '../../SectionLink'
import css from './style.sass'

const Breadcrumb = ({ sections }) => {
  const breadcrumbSections = []
    .concat(...sections.map(e => [-1, e])) // put dividers between sections
    .map((section, idx, arr) => {
      const key = idx.toString() + 1 // +1 for the 'home' section

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

  // Add 'home' section
  breadcrumbSections.unshift((
    <SemanticBreadcrumb.Section key={0} active={false}>
      <Link href="/">
        <a>Home</a>
      </Link>
    </SemanticBreadcrumb.Section>
  ))

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
