import { isCourseSectionRouteInfo } from '@innodoc/shared-core/typeguards'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import getSectionsApi from '@innodoc/shared-store/slices/content/sections'
import { PageHeader } from '@innodoc/ui-design-system/misc'
import { formatSectionTitle } from '@innodoc/ui-design-system/utils'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { useSelector, useSelectSection } from '@innodoc/ui-shared/store-hooks'
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

  const routeManager = useRouteManager()
  const sections = getSectionsApi(routeManager)
  // oxlint-disable-next-line react/react-compiler -- `sections` is cached via `??=` in `getSectionsApi`, hook ref is stable
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
