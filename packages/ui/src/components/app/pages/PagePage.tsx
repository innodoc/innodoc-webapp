import { isCoursePageRouteInfo } from '@innodoc/routes/typeGuards'
import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetPageContentQuery } from '@innodoc/store/slices/content/pages'

import { PageHeader } from '#components/common/misc'
import { useSelector } from '#hooks/redux'
import { useSelectPage } from '#hooks/select'

import ContentPage from './ContentPage'

function PagePage() {
  const routeInfo = useSelector(selectRouteInfo)
  const { locale } = routeInfo
  const { courseSlug, pageSlug } = isCoursePageRouteInfo(routeInfo)
    ? routeInfo
    : { courseSlug: undefined, pageSlug: undefined }
  const { page } = useSelectPage(pageSlug)

  const { data, isError, isLoading } = useGetPageContentQuery(
    {
      courseSlug: courseSlug ?? '',
      locale,
      pageSlug: pageSlug ?? '',
    },
    { skip: !courseSlug || !pageSlug },
  )

  return (
    <ContentPage
      contentHash={data?.hash}
      contentObj={page}
      contentType="page"
      isError={isError}
      isLoading={isLoading}
      contentIdValue={pageSlug}
    >
      {page ? <PageHeader iconName={page.icon}>{page.title}</PageHeader> : null}
    </ContentPage>
  )
}

export default PagePage
