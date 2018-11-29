import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import AntBreadcrumb from 'antd/lib/breadcrumb'
import Icon from 'antd/lib/icon'

import courseSelectors from '../../../store/selectors/course'
import sectionSelectors from '../../../store/selectors/section'
import ContentFragment from '../ContentFragment'
import SectionLink from '../../SectionLink'
import css from './style.sass'

const Breadcrumb = ({ homeLink, sections, t }) => {
  const breadcrumbItems = [(
    <AntBreadcrumb.Item key="root">
      {
        homeLink
          ? (
            <SectionLink sectionId={homeLink}>
              <a title={t('content.home')}>
                <Icon type="home" />
              </a>
            </SectionLink>
          )
          : (
            <a title={t('content.home')}>
              <Icon type="home" />
            </a>
          )
      }
    </AntBreadcrumb.Item>
  )].concat(
    sections.map(section => (
      <AntBreadcrumb.Item key={section.id}>
        <SectionLink sectionId={section.id}>
          <a>
            {section.title}
          </a>
        </SectionLink>
      </AntBreadcrumb.Item>
    ))
  )
  return (
    <AntBreadcrumb separator=">" className={css.breadcrumb}>
      {breadcrumbItems}
    </AntBreadcrumb>
  )
}

Breadcrumb.propTypes = {
  homeLink: PropTypes.string,
  sections: PropTypes.arrayOf(PropTypes.any).isRequired,
  t: PropTypes.func.isRequired,
}

Breadcrumb.defaultProps = {
  homeLink: null,
}

const mapStateToProps = state => ({
  homeLink: courseSelectors.getCurrentCourse(state).homeLink,
  sections: sectionSelectors.getBreadcrumbSections(state),
})

export { Breadcrumb } // for testing
export default connect(mapStateToProps)(
  withNamespaces()(Breadcrumb)
)
