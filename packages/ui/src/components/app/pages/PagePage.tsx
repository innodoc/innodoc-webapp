import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetPageContentQuery } from '@innodoc/store/slices/content/pages'

import { PageHeader } from '#components/common/misc'
import { useSelector } from '#hooks/redux'
import { useSelectCurrentCourse, useSelectPage } from '#hooks/select'

import ContentPage from './ContentPage'

function PagePage() {
  const { course } = useSelectCurrentCourse()
  const { courseSlug, locale, pageSlug } = useSelector(selectRouteInfo)
  const { page } = useSelectPage(pageSlug)

  const { data, isError, isLoading } = useGetPageContentQuery(
    {
      courseSlug: course?.slug ?? '',
      locale,
      pageSlug: pageSlug ?? '',
    },
    { skip: course === undefined || courseSlug === null || pageSlug === undefined }
  )

  return (
    <ContentPage
      contentHash={data?.hash}
      contentObj={page}
      contentType="page"
      course={course}
      isError={isError}
      isLoading={isLoading}
      stringIdValue={pageSlug}
    >
      {page !== undefined ? <PageHeader iconName={page.icon}>{page.title}</PageHeader> : null}
    </ContentPage>
  )
}

export default PagePage
