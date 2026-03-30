import { use } from 'react'

import { isCourseSectionRouteInfo } from '@innodoc/shared-core/typeguards'
import { PageHeader } from '@innodoc/ui-design-system/misc'
import { formatSectionTitle } from '@innodoc/ui-design-system/utils'
import { RouteManagerContext } from '@innodoc/ui-shared/contexts'
import { useSelector, useSelectSection } from '@innodoc/ui-store/hooks'
import { selectRouteInfo } from '@innodoc/ui-store/slices/app'
import getSectionsApi from '@innodoc/ui-store/slices/content/sections'

import ContentPage from '#pages/course/content'

import Breadcrumbs from './Breadcrumbs.js'
import SubsectionList from './SubsectionList.js'

function CourseSectionPage() {
  const routeInfo = useSelector(selectRouteInfo)
  const { locale } = routeInfo
  const { courseSlug, sectionPath } = isCourseSectionRouteInfo(routeInfo)
    ? routeInfo
    : { courseSlug: undefined, sectionPath: undefined }
  const { section } = useSelectSection(sectionPath)

  const routeManager = use(RouteManagerContext)
  const sections = getSectionsApi(routeManager)
  const { data, isError, isLoading } = sections.useGetSectionContentQuery(
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
