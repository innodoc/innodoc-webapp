import { Page as ErrorPage } from '#renderer/_error.page'
import useSelectCurrentCourse from '#store/hooks/useSelectCurrentCourse'
import useSelectSection from '#store/hooks/useSelectSection'
import { useGetSectionContentQuery } from '#store/slices/entities/sections'
import { selectLocale } from '#store/slices/uiSlice'
import type { TranslatedCourse } from '#types/entities/course'
import type { TranslatedSection } from '#types/entities/section'
import Breadcrumbs from '#ui/components/Breadcrumbs/Breadcrumbs'
import InlineError from '#ui/components/common/error/InlineError'
import PageHeader from '#ui/components/common/PageHeader'
import RootNode from '#ui/components/content/mdast/RootNode'
import SubsectionList from '#ui/components/content/SubsectionList'
import { useSelector } from '#ui/hooks/store'
import { formatSectionTitle } from '#utils/content'

function Content({ course, section }: ContentProps) {
  const locale = useSelector(selectLocale)
  const {
    data: rootNode,
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

  if (isLoading === undefined || rootNode === undefined) {
    return null
  }

  return (
    <>
      <Breadcrumbs />
      <PageHeader>{formatSectionTitle(section)}</PageHeader>
      <SubsectionList sectionId={section.id} />
      <RootNode node={rootNode} />
    </>
  )
}

interface ContentProps {
  course: TranslatedCourse
  section: TranslatedSection
}

function ContentSection({ sectionPath }: ContentSectionProps) {
  const { course } = useSelectCurrentCourse()
  const { section } = useSelectSection(sectionPath)

  if (course === undefined) return <InlineError>No course found</InlineError>
  if (section === undefined) return <ErrorPage is404 />

  return <Content course={course} section={section} />
}

interface ContentSectionProps {
  sectionPath: string
}

export { ContentSection as Page }
