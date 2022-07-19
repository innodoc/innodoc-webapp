import { useSelector } from 'react-redux'
import { Breadcrumb as AntBreadcrumb } from 'antd'
import { HomeOutlined } from '@ant-design/icons'

import { useTranslation } from 'next-i18next'
import courseSelectors from '@innodoc/store/src/selectors/course'
import sectionSelectors from '@innodoc/store/src/selectors/section'

import { SectionLink, ContentLink } from '../links'

const Breadcrumb = () => {
  const { t } = useTranslation()
  const { homeLink } = useSelector(courseSelectors.getCurrentCourse)
  const sections = useSelector(sectionSelectors.getBreadcrumbSections)

  // links to parent sections, last is current section thus not a link
  const sectionLinks = sections.map((section, i) => (
    <AntBreadcrumb.Item key={section.id}>
      {i + 1 < sections.length ? (
        <SectionLink contentId={section.id} preferShortTitle />
      ) : (
        section.title
      )}
    </AntBreadcrumb.Item>
  ))

  // prepend custom home link

  const breadcrumbItems = [
    <AntBreadcrumb.Item key="root">
      <ContentLink href={homeLink}>
        <a title={t('content.home')}>
          <HomeOutlined />
        </a>
      </ContentLink>
    </AntBreadcrumb.Item>,
  ].concat(sectionLinks)

  return <AntBreadcrumb separator=">">{breadcrumbItems}</AntBreadcrumb>
}

export default Breadcrumb
