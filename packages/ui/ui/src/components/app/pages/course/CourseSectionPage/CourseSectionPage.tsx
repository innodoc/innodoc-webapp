import { isCourseSectionRouteInfo } from '@innodoc/routes/typeGuards'
import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetSectionContentQuery } from '@innodoc/store/slices/content/sections'

import { PageHeader } from '#components/common/misc'
import ContentPage from '#components/pages/content'
import { useSelector } from '#hooks/redux'
import { useSelectSection } from '#hooks/select'
import { formatSectionTitle } from '#utils'

import Breadcrumbs from './Breadcrumbs.js'
import SubsectionList from './SubsectionList.js'

function CourseSectionPage() {
  const routeInfo = useSelector(selectRouteInfo)
  const { locale } = routeInfo
  const { courseSlug, sectionPath } = isCourseSectionRouteInfo(routeInfo)
    ? routeInfo
    : { courseSlug: undefined, sectionPath: undefined }
  const { section } = useSelectSection(sectionPath)

  const { data, isError, isLoading } = useGetSectionContentQuery(
    {
      courseSlug: courseSlug ?? '',
      locale,
      sectionPath: sectionPath ?? '',
    },
    { skip: !courseSlug || !sectionPath },
  )

  return (
    <ContentPage
      contentHash={data?.hash}
      contentObj={section}
      contentType="section"
      isError={isError}
      isLoading={isLoading}
      contentIdValue={sectionPath}
    >
      <Breadcrumbs />
      <PageHeader>{section === undefined ? '' : formatSectionTitle(section)}</PageHeader>
      {section === undefined ? null : <SubsectionList sectionId={section.id} />}
    </ContentPage>
  )
}

export default CourseSectionPage
