import { isCourseSectionRouteInfo } from '@innodoc/shared-core/typeguards'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import getSectionsApi from '@innodoc/shared-store/slices/content/sections'
import { PageHeader } from '@innodoc/ui-design-system/misc'
import { formatSectionTitle } from '@innodoc/ui-design-system/utils'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { useSelector, useSelectCurrentCourse, useSelectSection } from '@innodoc/ui-shared/store-hooks'
import ContentPage, { isContentNotYetTranslated } from '#pages/course/content'
import Breadcrumbs from './Breadcrumbs.js'
import SubsectionList from './SubsectionList.js'

function CourseSectionPage() {
  const routeInfo = useSelector(selectRouteInfo)
  const { locale } = routeInfo
  const { courseSlug, sectionPath } = isCourseSectionRouteInfo(routeInfo)
    ? routeInfo
    : { courseSlug: undefined, sectionPath: undefined }
  const { section } = useSelectSection(sectionPath)
  const { course } = useSelectCurrentCourse()

  const routeManager = useRouteManager()
  const sections = getSectionsApi(routeManager)
  // oxlint-disable-next-line react/react-compiler -- `sections` is cached via `??=` in `getSectionsApi`, hook ref is stable
  const { data, isError, isLoading, error } = sections.useGetSectionContentQuery(
    {
      courseSlug: courseSlug ?? '',
      locale,
      sectionPath: sectionPath ?? '',
    },
    { skip: !courseSlug || !sectionPath },
  )

  // A declared locale whose content row is missing renders the same "not yet translated" state
  // the server renders for it; every other missing-content case keeps the error states below
  const notYetTranslated = isContentNotYetTranslated({ course, entity: section, locale, data, error })

  return (
    <ContentPage
      contentHash={data?.hash}
      contentObj={section}
      contentType="section"
      isError={isError}
      isLoading={isLoading}
      notYetTranslated={notYetTranslated}
      contentIdValue={sectionPath}
    >
      <Breadcrumbs />
      <PageHeader>{section === undefined ? '' : formatSectionTitle(section)}</PageHeader>
      {section === undefined ? null : <SubsectionList sectionId={section.id} />}
    </ContentPage>
  )
}

export default CourseSectionPage
