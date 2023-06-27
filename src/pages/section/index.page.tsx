import { Trans } from 'react-i18next'

import { Page as ErrorPage } from '#renderer/_error.page'
import { selectRouteInfo } from '#store/slices/appSlice'
import { useGetSectionContentQuery } from '#store/slices/entities/sections'
import Breadcrumbs from '#ui/components/Breadcrumbs/Breadcrumbs'
import Code from '#ui/components/common/Code'
import LoadingSpinner from '#ui/components/common/LoadingSpinner'
import PageHeader from '#ui/components/common/PageHeader'
import HastNode from '#ui/components/content/markdown/HastNode'
import SubsectionList from '#ui/components/content/SubsectionList'
import { useSelector } from '#ui/hooks/store/store'
import useSelectCurrentCourse from '#ui/hooks/store/useSelectCurrentCourse'
import useSelectSection from '#ui/hooks/store/useSelectSection'
import { formatSectionTitle } from '#utils/content'

function Page() {
  const { course } = useSelectCurrentCourse()
  const { courseSlug, locale, sectionPath } = useSelector(selectRouteInfo)
  const { section } = useSelectSection(sectionPath)
  const skipContentFetch = course === undefined || courseSlug === null || sectionPath === undefined

  const { data, isError, isLoading } = useGetSectionContentQuery(
    {
      courseSlug: course?.slug ?? '',
      locale,
      sectionPath: sectionPath ?? '',
    },
    { skip: skipContentFetch }
  )

  if (course === undefined) {
    return <ErrorPage is404 />
  }

  if (sectionPath === undefined) {
    return null
  }

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

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (section === undefined) {
    return <ErrorPage is404 />
  }

  return (
    <>
      <Breadcrumbs />
      <PageHeader>{formatSectionTitle(section)}</PageHeader>
      <SubsectionList sectionId={section.id} />
      <HastNode hash={data?.hash} />
    </>
  )
}

export { Page }
