import { Page as ErrorPage } from '#renderer/_error.page'
import useSelectCurrentCourse from '#store/hooks/useSelectCurrentCourse'
import useSelectPage from '#store/hooks/useSelectPage'
import { useGetPageContentQuery } from '#store/slices/entities/pages'
import { selectLocale } from '#store/slices/uiSlice'
import type { TranslatedCourse } from '#types/entities/course'
import type { TranslatedPage } from '#types/entities/page'
import InlineError from '#ui/components/common/error/InlineError'
import PageHeader from '#ui/components/common/PageHeader'
import RootNode from '#ui/components/content/mdast/RootNode'
import { useSelector } from '#ui/hooks/store'

function Content({ course, page }: ContentProps) {
  const locale = useSelector(selectLocale)
  const {
    data: rootNode,
    isError,
    isLoading,
  } = useGetPageContentQuery({
    courseId: course.id,
    locale,
    pageId: page.id,
  })

  if (isError === undefined) {
    return <ErrorPage is404 />
  }

  if (isLoading === undefined || rootNode === undefined) {
    return null
  }

  return (
    <>
      <PageHeader iconName={page.icon}>{page.title}</PageHeader>
      <RootNode node={rootNode} />
    </>
  )
}

interface ContentProps {
  course: TranslatedCourse
  page: TranslatedPage
}

function ContentPage({ pageSlug }: ContentPageProps) {
  const { course } = useSelectCurrentCourse()
  const { page } = useSelectPage(pageSlug)

  if (course === undefined) return <InlineError>No course found</InlineError>
  if (page === undefined) return <ErrorPage is404 />

  return <Content course={course} page={page} />
}

interface ContentPageProps {
  pageSlug: TranslatedPage['slug']
}

export { ContentPage as Page }
