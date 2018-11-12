import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import AntBreadcrumb from 'antd/lib/breadcrumb'
import Icon from 'antd/lib/icon'

import sectionSelectors from '../../../store/selectors/section'
import ContentFragment from '../ContentFragment'
import SectionLink from '../../SectionLink'
import css from './style.sass'

const Breadcrumb = ({ sections, t }) => {
  // TODO: use home link (#54)
  const breadcrumbItems = [(
    <AntBreadcrumb.Item key="root">
      <SectionLink sectionId="">
        <a title={t('content.home')}>
          <Icon type="home" />
        </a>
      </SectionLink>
    </AntBreadcrumb.Item>
  )].concat(
    sections.map(section => (
      <AntBreadcrumb.Item key={section.id}>
        <SectionLink sectionId={section.id}>
          <a>
            <ContentFragment content={section.title} />
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
  sections: PropTypes.arrayOf(PropTypes.any).isRequired,
  t: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  sections: sectionSelectors.getBreadcrumbSections(state),
})

export { Breadcrumb } // for testing
export default connect(mapStateToProps)(
  withNamespaces()(Breadcrumb)
)
