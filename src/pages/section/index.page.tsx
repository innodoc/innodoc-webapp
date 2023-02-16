import { useTranslation } from 'react-i18next'

import { Page as ErrorPage } from '#renderer/_error.page'
import useSelectCurrentCourse from '#store/hooks/useSelectCurrentCourse'
import useSelectSection from '#store/hooks/useSelectSection'
import { useGetSectionContentQuery } from '#store/slices/entities/sections'
import { selectCurrentSectionPath, selectLocale } from '#store/slices/uiSlice'
import type { TranslatedCourse } from '#types/entities/course'
import type { TranslatedSection } from '#types/entities/section'
import Breadcrumbs from '#ui/components/Breadcrumbs/Breadcrumbs'
import InlineError from '#ui/components/common/error/InlineError'
import PageHeader from '#ui/components/common/PageHeader'
import MarkdownNode from '#ui/components/content/mdast/MarkdownNode'
import SubsectionList from '#ui/components/content/SubsectionList'
import { useSelector } from '#ui/hooks/store'
import { formatSectionTitle } from '#utils/content'

function Content({ course, section }: ContentProps) {
  const locale = useSelector(selectLocale)
  const {
    data: content,
    isError,
    isLoading,
  } = useGetSectionContentQuery({
    courseId: course.id,
    locale,
    sectionId: section.id,
  })

  if (isError === undefined) {
    return <ErrorPage is404 />
  }

  if (isLoading === undefined || content === undefined) {
    return null
  }

  return (
    <>
      <Breadcrumbs />
      <PageHeader>{formatSectionTitle(section)}</PageHeader>
      <SubsectionList sectionId={section.id} />
      <MarkdownNode content={content} />
    </>
  )
}

interface ContentProps {
  course: TranslatedCourse
  section: TranslatedSection
}

function ContentSection() {
  const { t } = useTranslation()
  const { course } = useSelectCurrentCourse()
  const sectionPath = useSelector(selectCurrentSectionPath)
  const { section } = useSelectSection(sectionPath)

  if (course === undefined) return <InlineError>{t('error.noCourse')}</InlineError>
  if (section === undefined) return sectionPath === null ? null : <ErrorPage is404 />

  return <Content course={course} section={section} />
}

export { ContentSection as Page }
