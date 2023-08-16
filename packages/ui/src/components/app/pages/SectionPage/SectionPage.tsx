import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetSectionContentQuery } from '@innodoc/store/slices/content/sections'
import { formatSectionTitle } from '@innodoc/utils/content'

import { PageHeader } from '#components/common'
import { ContentPage } from '#components/pages'
import { useSelectCurrentCourse, useSelector, useSelectSection } from '#hooks/store'

import Breadcrumbs from './Breadcrumbs'
import SubsectionList from './SubsectionList'

function SectionPage() {
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

export default SectionPage
