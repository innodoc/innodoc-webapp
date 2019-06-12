import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AntBreadcrumb from 'antd/lib/breadcrumb'
import Icon from 'antd/lib/icon'

import { withTranslation } from '../../../lib/i18n'
import { sectionTypeSparse } from '../../../lib/propTypes'
import courseSelectors from '../../../store/selectors/course'
import sectionSelectors from '../../../store/selectors/section'
import SectionLink from '../../SectionLink'
import css from './style.sass'

const Breadcrumb = ({ homeLink, sections, t }) => {
  // links to parent sections, last is current section thus not a link
  const sectionLinks = sections.map((section, i) => (
    <AntBreadcrumb.Item key={section.id}>
      {
        i + 1 < sections.length
          ? <SectionLink sectionId={section.id} />
          : section.title
      }
    </AntBreadcrumb.Item>
  ))

  // prepend custom home link
  const breadcrumbItems = [(
    <AntBreadcrumb.Item key="root">
      <SectionLink sectionId={homeLink}>
        <a title={t('content.home')}>
          <Icon type="home" />
        </a>
      </SectionLink>
    </AntBreadcrumb.Item>
  )].concat(sectionLinks)

  return (
    <AntBreadcrumb separator=">" className={css.breadcrumb}>
      {breadcrumbItems}
    </AntBreadcrumb>
  )
}

Breadcrumb.propTypes = {
  homeLink: PropTypes.string,
  sections: PropTypes.arrayOf(sectionTypeSparse).isRequired,
  t: PropTypes.func.isRequired,
}

Breadcrumb.defaultProps = {
  homeLink: null,
}

const mapStateToProps = state => ({
  homeLink: courseSelectors.getCurrentCourse(state).homeLink,
  sections: sectionSelectors.getBreadcrumbSections(state),
})

export { Breadcrumb as BareBreadcrumb, mapStateToProps } // for testing
export default connect(mapStateToProps)(
  withTranslation()(Breadcrumb)
)
