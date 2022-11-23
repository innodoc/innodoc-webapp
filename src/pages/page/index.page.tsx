import { Page as ErrorPage } from '#renderer/_error.page'
import type { RootState } from '#store/makeStore'
import { selectCurrentCourse } from '#store/selectors/content/course'
import { selectPageByName } from '#store/selectors/content/page'
import { selectLocale } from '#store/selectors/ui'
import { useGetPageContentQuery } from '#store/slices/contentApi'
import type { Page } from '#types/api'
import PageHeader from '#ui/components/common/PageHeader'
import RootNode from '#ui/components/content/mdast/RootNode'
import { useSelector } from '#ui/hooks/store'

function ContentPage({ pageName }: ContentPageProps) {
  const selectPage = (state: RootState) => selectPageByName(state, pageName)
  const course = useSelector(selectCurrentCourse)
  const page = useSelector(selectPage)
  const locale = useSelector(selectLocale)
  const { data: rootNode } = useGetPageContentQuery(
    { courseName: course?.name, locale, pageName },
    { skip: course === undefined }
  )

  if (page === undefined || rootNode === undefined) {
    return <ErrorPage is404 />
  }

  return (
    <>
      <PageHeader iconName={page.icon}>{page.title}</PageHeader>
      <RootNode node={rootNode} />
    </>
  )
}

type ContentPageProps = {
  pageName: Page['name']
}

export { ContentPage as Page }
