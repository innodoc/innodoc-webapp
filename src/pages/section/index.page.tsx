import { selectRouteInfo } from '#store/slices/appSlice'
import { useGetSectionContentQuery } from '#store/slices/entities/sections'
import Breadcrumbs from '#ui/components/Breadcrumbs/Breadcrumbs'
import PageHeader from '#ui/components/common/PageHeader'
import SubsectionList from '#ui/components/content/SubsectionList'
import ContentPage from '#ui/components/PageShell/ContentPage'
import { useSelector } from '#ui/hooks/store/store'
import useSelectCurrentCourse from '#ui/hooks/store/useSelectCurrentCourse'
import useSelectSection from '#ui/hooks/store/useSelectSection'
import { formatSectionTitle } from '#utils/content'

function Page() {
  const { course } = useSelectCurrentCourse()
  const { courseSlug, locale, sectionPath } = useSelector(selectRouteInfo)
  const { section } = useSelectSection(sectionPath)

  const { data, isError, isLoading } = useGetSectionContentQuery(
    {
      courseSlug: course?.slug ?? '',
      locale,
      sectionPath: sectionPath ?? '',
    },
    { skip: course === undefined || courseSlug === null || sectionPath === undefined }
  )

  return (
    <ContentPage
      contentHash={data?.hash}
      contentObj={section}
      contentType="section"
      course={course}
      isError={isError}
      isLoading={isLoading}
      stringIdValue={sectionPath}
    >
      <Breadcrumbs />
      <PageHeader>{section !== undefined ? formatSectionTitle(section) : ''}</PageHeader>
      {section !== undefined ? <SubsectionList sectionId={section.id} /> : null}
    </ContentPage>
  )
}

export { Page }
