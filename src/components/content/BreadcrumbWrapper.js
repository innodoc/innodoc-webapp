import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Breadcrumb } from 'semantic-ui-react'

import { selectors } from '../../store/reducers/content'
import ContentFragment from './ContentFragment'
import SectionLink from '../SectionLink'

const BreadcrumbWrapper = ({ sections }) => {
  const breadcrumbSections = []
    .concat(...sections.map(e => [-1, e]))
    .slice(1)
    .map((section, idx, arr) => {
      if (section === -1) {
        const divProps = {
          key: idx.toString(),
        }

        if (idx === arr.length - 2) {
          divProps.icon = 'right angle'
        }

        return (<Breadcrumb.Divider {...divProps} />)
      }

      const breadcrumbSectionProps = {
        key: idx.toString(),
      }

      if (idx === arr.length - 1) {
        breadcrumbSectionProps.active = true
      } else {
        breadcrumbSectionProps.link = true
      }

      return (
        <Breadcrumb.Section {...breadcrumbSectionProps}>
          <SectionLink sectionId={section.id}>
            <a>
              <ContentFragment content={section.title} />
            </a>
          </SectionLink>
        </Breadcrumb.Section>
      )
    })

  return (
    <Breadcrumb>
      {breadcrumbSections}
    </Breadcrumb>
  )
}
BreadcrumbWrapper.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.any).isRequired,
}

const mapStateToProps = state => ({ sections: selectors.getCurrentBreadcrumbSections(state) })

export default connect(mapStateToProps)(BreadcrumbWrapper)
