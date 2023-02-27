import { Trans } from 'react-i18next'

import { Page as ErrorPage } from '#renderer/_error.page'
import useSelectCurrentCourse from '#store/hooks/useSelectCurrentCourse'
import useSelectSection from '#store/hooks/useSelectSection'
import { selectRouteInfo } from '#store/slices/appSlice'
import { useGetSectionContentQuery } from '#store/slices/entities/sections'
import Breadcrumbs from '#ui/components/Breadcrumbs/Breadcrumbs'
import Code from '#ui/components/common/Code'
import LoadingSpinner from '#ui/components/common/LoadingSpinner'
import PageHeader from '#ui/components/common/PageHeader'
import MarkdownNode from '#ui/components/content/mdast/MarkdownNode'
import SubsectionList from '#ui/components/content/SubsectionList'
import { useSelector } from '#ui/hooks/store'
import { formatSectionTitle } from '#utils/content'

function Page() {
  const { course } = useSelectCurrentCourse()
  const { locale, sectionPath } = useSelector(selectRouteInfo)
  const { section } = useSelectSection(sectionPath)
  const skipContentFetch = course === undefined || section === undefined

  const {
    data: content,
    isError,
    isLoading,
  } = useGetSectionContentQuery(
    {
      courseId: course?.id ?? 0,
      locale,
      sectionId: section?.id ?? 0,
    },
    { skip: skipContentFetch }
  )

  if (course === undefined) return <ErrorPage is404 />
  if (sectionPath === undefined) return null
  if (isError) {
    return (
      <ErrorPage
        errorMsg={
          <Trans
            components={{ 1: <Code /> }}
            i18nKey="error.failedToLoadSection"
            values={{ sectionPath }}
          >
            {`Failed to load section: <1>{{ sectionPath }}</1>`}
          </Trans>
        }
      />
    )
  }
  if (isLoading || content === undefined) return <LoadingSpinner />
  if (section === undefined) return <ErrorPage is404 />

  return (
    <>
      <Breadcrumbs />
      <PageHeader>{formatSectionTitle(section)}</PageHeader>
      <SubsectionList sectionId={section.id} />
      <MarkdownNode content={content} />
    </>
  )
}

export { Page }
