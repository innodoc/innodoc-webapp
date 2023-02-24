import type { LanguageCode } from 'iso-639-1'
import { useTranslation } from 'react-i18next'

import { Page as ErrorPage } from '#renderer/_error.page'
import useSelectCurrentCourse from '#store/hooks/useSelectCurrentCourse'
import useSelectPage from '#store/hooks/useSelectPage'
import { selectRouteInfo } from '#store/slices/appSlice'
import { useGetPageContentQuery } from '#store/slices/entities/pages'
import type { TranslatedCourse } from '#types/entities/course'
import type { TranslatedPage } from '#types/entities/page'
import InlineError from '#ui/components/common/error/InlineError'
import PageHeader from '#ui/components/common/PageHeader'
import MarkdownNode from '#ui/components/content/mdast/MarkdownNode'
import { useSelector } from '#ui/hooks/store'

// TODO Refactor this into own component used by page/section

function Content({ course, locale, page }: ContentProps) {
  const {
    data: content,
    isError,
    isLoading,
  } = useGetPageContentQuery({
    courseId: course.id,
    locale,
    pageId: page.id,
  })

  if (isError === undefined) return <ErrorPage is404 />
  if (isLoading === undefined || content === undefined) return null

  return (
    <>
      <PageHeader iconName={page.icon}>{page.title}</PageHeader>
      <MarkdownNode content={content} />
    </>
  )
}

interface ContentProps {
  course: TranslatedCourse
  locale: LanguageCode
  page: TranslatedPage
}

function ContentPage() {
  const { t } = useTranslation()
  const { course } = useSelectCurrentCourse()
  const { locale, pageSlug } = useSelector(selectRouteInfo)
  const { page } = useSelectPage(pageSlug)

  if (course === undefined) return <InlineError>{t('error.noCourse')}</InlineError>
  if (page === undefined) return pageSlug === null ? null : <ErrorPage is404 />

  return <Content course={course} locale={locale} page={page} />
}

export { ContentPage as Page }
