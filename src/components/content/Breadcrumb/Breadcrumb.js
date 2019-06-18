import React from 'react'
import { useSelector } from 'react-redux'
import AntBreadcrumb from 'antd/lib/breadcrumb'
import Icon from 'antd/lib/icon'

import { useTranslation } from '../../../lib/i18n'
import courseSelectors from '../../../store/selectors/course'
import sectionSelectors from '../../../store/selectors/section'
import SectionLink from '../../SectionLink'
import css from './style.sass'

const Breadcrumb = () => {
  const { t } = useTranslation()
  const { homeLink } = useSelector(courseSelectors.getCurrentCourse)
  const sections = useSelector(sectionSelectors.getBreadcrumbSections)

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

export default Breadcrumb
