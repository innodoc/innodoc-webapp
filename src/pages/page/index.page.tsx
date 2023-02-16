import { useTranslation } from 'react-i18next'

import { Page as ErrorPage } from '#renderer/_error.page'
import useSelectCurrentCourse from '#store/hooks/useSelectCurrentCourse'
import useSelectPage from '#store/hooks/useSelectPage'
import { useGetPageContentQuery } from '#store/slices/entities/pages'
import { selectCurrentPageSlug, selectLocale } from '#store/slices/uiSlice'
import type { TranslatedCourse } from '#types/entities/course'
import type { TranslatedPage } from '#types/entities/page'
import InlineError from '#ui/components/common/error/InlineError'
import PageHeader from '#ui/components/common/PageHeader'
import MarkdownNode from '#ui/components/content/mdast/MarkdownNode'
import { useSelector } from '#ui/hooks/store'

function Content({ course, page }: ContentProps) {
  const locale = useSelector(selectLocale)
  const {
    data: content,
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

  if (isLoading === undefined || content === undefined) {
    return null
  }

  return (
    <>
      <PageHeader iconName={page.icon}>{page.title}</PageHeader>
      <MarkdownNode content={content} />
    </>
  )
}

interface ContentProps {
  course: TranslatedCourse
  page: TranslatedPage
}

function ContentPage() {
  const { t } = useTranslation()
  const { course } = useSelectCurrentCourse()
  const pageSlug = useSelector(selectCurrentPageSlug)
  const { page } = useSelectPage(pageSlug)

  if (course === undefined) return <InlineError>{t('error.noCourse')}</InlineError>
  if (page === undefined) return pageSlug === null ? null : <ErrorPage is404 />

  return <Content course={course} page={page} />
}

export { ContentPage as Page }
