import { isCoursePageRouteInfo } from '@innodoc/shared-core/typeguards'
import { PageHeader } from '@innodoc/ui-design-system/misc'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { useSelector, useSelectPage } from '@innodoc/ui-store/hooks'
import { selectRouteInfo } from '@innodoc/ui-store/slices/app'
import getPagesApi from '@innodoc/ui-store/slices/content/pages'
import ContentPage from './ContentPage.js'

function CourseContentPage() {
  const routeManager = useRouteManager()
  const pages = getPagesApi(routeManager)

  const routeInfo = useSelector(selectRouteInfo)
  const { locale } = routeInfo
  const { courseSlug, pageSlug } = isCoursePageRouteInfo(routeInfo)
    ? routeInfo
    : { courseSlug: undefined, pageSlug: undefined }
  const { page } = useSelectPage(pageSlug)

  const { data, isError, isLoading } = pages.useGetPageContentQuery(
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
