import { selectRouteInfo } from '#store/slices/appSlice'
import { useGetPageContentQuery } from '#store/slices/entities/pages'
import ContentPage from '#ui/components/app/ContentPage'
import PageHeader from '#ui/components/common/PageHeader'
import { useSelector } from '#ui/hooks/store/store'
import useSelectCurrentCourse from '#ui/hooks/store/useSelectCurrentCourse'
import useSelectPage from '#ui/hooks/store/useSelectPage'

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
