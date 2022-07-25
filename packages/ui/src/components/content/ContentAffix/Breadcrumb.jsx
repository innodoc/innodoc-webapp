import { HomeOutlined } from '@ant-design/icons'
import { Breadcrumb as AntBreadcrumb } from 'antd'
import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'

import { getCurrentCourse } from '@innodoc/store/selectors/course'
import { getBreadcrumbSections } from '@innodoc/store/selectors/section'

import ContentLink from '../links/ContentLink.jsx'
import SectionLink from '../links/SectionLink.js'

function Breadcrumb() {
  const { t } = useTranslation()
  const { homeLink } = useSelector(getCurrentCourse)
  const sections = useSelector(getBreadcrumbSections)

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
