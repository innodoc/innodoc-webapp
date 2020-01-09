import React from 'react'
import { useSelector } from 'react-redux'
import { Breadcrumb as AntBreadcrumb, Icon } from 'antd'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import courseSelectors from '@innodoc/client-store/src/selectors/course'
import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import { SectionLink, InternalLink } from '../links'

const Breadcrumb = () => {
  const { t } = useTranslation()
  const { homeLink } = useSelector(courseSelectors.getCurrentCourse)
  const sections = useSelector(sectionSelectors.getBreadcrumbSections)

  // links to parent sections, last is current section thus not a link
  const sectionLinks = sections.map((section, i) => (
    <AntBreadcrumb.Item key={section.id}>
      {i + 1 < sections.length ? (
        <SectionLink contentId={section.id} />
      ) : (
        section.title
      )}
    </AntBreadcrumb.Item>
  ))

  // prepend custom home link

  const breadcrumbItems = [
    <AntBreadcrumb.Item key="root">
      <InternalLink href={homeLink}>
        <a title={t('content.home')}>
          <Icon type="home" />
        </a>
      </InternalLink>
    </AntBreadcrumb.Item>,
  ].concat(sectionLinks)

  return <AntBreadcrumb separator=">">{breadcrumbItems}</AntBreadcrumb>
}

export default Breadcrumb
