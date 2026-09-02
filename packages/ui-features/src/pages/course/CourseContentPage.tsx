import { isCoursePageRouteInfo } from '@innodoc/shared-core/typeguards'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import getPagesApi from '@innodoc/shared-store/slices/content/pages'
import { PageHeader } from '@innodoc/ui-design-system/misc'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { useSelector, useSelectCurrentCourse, useSelectPage } from '@innodoc/ui-shared/store-hooks'
import ContentPage, { isContentNotYetTranslated } from './ContentPage.js'

function CourseContentPage() {
  const routeManager = useRouteManager()
  const pages = getPagesApi(routeManager)

  const routeInfo = useSelector(selectRouteInfo)
  const { locale } = routeInfo
  const { courseSlug, pageSlug } = isCoursePageRouteInfo(routeInfo)
    ? routeInfo
    : { courseSlug: undefined, pageSlug: undefined }
  const { page } = useSelectPage(pageSlug)
  const { course } = useSelectCurrentCourse()

  // oxlint-disable-next-line react/react-compiler -- `pages` is cached via `??=` in `getPagesApi`, hook ref is stable
  const { data, isError, isLoading, error } = pages.useGetPageContentQuery(
    {
      courseSlug: courseSlug ?? '',
      locale,
      pageSlug: pageSlug ?? '',
    },
    { skip: !courseSlug || !pageSlug },
  )

  // A declared locale whose content row is missing renders the same "not yet translated" state
  // the server renders for it; every other missing-content case keeps the error states below
  const notYetTranslated = isContentNotYetTranslated({ course, entity: page, locale, data, error })

  // TODO: isIconName
  // const iconName = isIconName(page.icon) ? page.icon : undefined

  return (
    <ContentPage
      contentHash={data?.hash}
      contentObj={page}
      contentType="page"
      isError={isError}
      isLoading={isLoading}
      notYetTranslated={notYetTranslated}
      contentIdValue={pageSlug}
    >
      {page ? <PageHeader iconName={page.icon ?? undefined}>{page.title}</PageHeader> : null}
    </ContentPage>
  )
}

export default CourseContentPage
