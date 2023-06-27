import { Trans } from 'react-i18next'

import { Page as ErrorPage } from '#renderer/_error.page'
import { selectRouteInfo } from '#store/slices/appSlice'
import { useGetPageContentQuery } from '#store/slices/entities/pages'
import Code from '#ui/components/common/Code'
import LoadingSpinner from '#ui/components/common/LoadingSpinner'
import PageHeader from '#ui/components/common/PageHeader'
import HastNode from '#ui/components/content/markdown/HastNode'
import { useSelector } from '#ui/hooks/store/store'
import useSelectCurrentCourse from '#ui/hooks/store/useSelectCurrentCourse'
import useSelectPage from '#ui/hooks/store/useSelectPage'

function Page() {
  const { course } = useSelectCurrentCourse()
  const { courseSlug, locale, pageSlug } = useSelector(selectRouteInfo)
  const { page } = useSelectPage(pageSlug)
  const skipContentFetch = course === undefined || courseSlug === null || pageSlug === undefined

  const { data, isError, isLoading } = useGetPageContentQuery(
    {
      courseSlug: course?.slug ?? '',
      locale,
      pageSlug: pageSlug ?? '',
    },
    { skip: skipContentFetch }
  )

  if (course === undefined) {
    return <ErrorPage is404 />
  }

  if (pageSlug === undefined) {
    return null
  }

  if (isError) {
    return (
      <ErrorPage
        errorMsg={
          <Trans
            components={{ 1: <Code /> }}
            i18nKey="error.failedToLoadPage"
            values={{ pageSlug }}
          >
            {`Failed to load page: <1>{{ pageSlug }}</1>`}
          </Trans>
        }
      />
    )
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (page === undefined) {
    return <ErrorPage is404 />
  }

  return (
    <>
      <PageHeader iconName={page.icon}>{page.title}</PageHeader>
      <HastNode hash={data?.hash} />
    </>
  )
}

export { Page }
