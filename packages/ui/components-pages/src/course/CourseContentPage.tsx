import { PageHeader } from '@innodoc/components-common/misc'
import { useSelector, useSelectPage } from '@innodoc/hooks'
import { isCoursePageRouteInfo } from '@innodoc/routes/typeGuards'
import { selectRouteInfo } from '@innodoc/store/slices/app'
import { useGetPageContentQuery } from '@innodoc/store/slices/content/pages'

import ContentPage from './ContentPage.js'

function CourseContentPage() {
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

  // TODO: isIconName
  // const iconName = isIconName(page.icon) ? page.icon : undefined

  return (
    <ContentPage
      contentHash={data?.hash}
      contentObj={page}
      contentType="page"
      isError={isError}
      isLoading={isLoading}
      contentIdValue={pageSlug}
    >
      {page ? <PageHeader iconName={page.icon ?? undefined}>{page.title}</PageHeader> : null}
    </ContentPage>
  )
}

export default CourseContentPage
