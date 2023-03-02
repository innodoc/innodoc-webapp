import { Trans } from 'react-i18next'

import { Page as ErrorPage } from '#renderer/_error.page'
import { selectRouteInfo } from '#store/slices/appSlice'
import { useGetPageContentQuery } from '#store/slices/entities/pages'
import Code from '#ui/components/common/Code'
import LoadingSpinner from '#ui/components/common/LoadingSpinner'
import PageHeader from '#ui/components/common/PageHeader'
import MarkdownNode from '#ui/components/content/mdast/MarkdownNode'
import { useSelector } from '#ui/hooks/store'
import useSelectCurrentCourse from '#ui/hooks/useSelectCurrentCourse'
import useSelectPage from '#ui/hooks/useSelectPage'

function PagePage() {
  const { course } = useSelectCurrentCourse()
  const { courseSlug, locale, pageSlug } = useSelector(selectRouteInfo)
  const { page } = useSelectPage(pageSlug)
  const skipContentFetch = course === undefined || courseSlug === null || pageSlug === undefined

  const {
    data: content,
    isError,
    isLoading,
  } = useGetPageContentQuery(
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
  if (isLoading || content === undefined) {
    return <LoadingSpinner />
  }
  if (page === undefined) {
    return <ErrorPage is404 />
  }

  return (
    <>
      <PageHeader iconName={page.icon}>{page.title}</PageHeader>
      <MarkdownNode content={content} />
    </>
  )
}

export { PagePage as Page }
