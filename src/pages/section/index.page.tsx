import { Page as ErrorPage } from '@/renderer/_error.page'
import { RootState } from '@/store/makeStore'
import { selectSectionByPath } from '@/store/selectors/content/section'
import { selectLocale } from '@/store/selectors/ui'
import { useGetSectionContentQuery } from '@/store/slices/contentApi'
import PageHeader from '@/ui/components/common/PageHeader'
import ContentTree from '@/ui/components/content/ContentTree'
import { useSelector } from '@/ui/hooks/store'
import { formatSectionNumber } from '@/utils/content'

function ContentSection({ sectionPath }: ContentSectionProps) {
  const selectSection = (state: RootState) => selectSectionByPath(state, sectionPath)
  const section = useSelector(selectSection)
  const locale = useSelector(selectLocale)
  const { data: content } = useGetSectionContentQuery({ locale, path: sectionPath })

  if (section === undefined || content === undefined) {
    return <ErrorPage is404 />
  }

  return (
    <>
      <PageHeader>
        {formatSectionNumber(section)} {section.title}
      </PageHeader>
      <ContentTree content={content} />
    </>
  )
}

type ContentSectionProps = {
  sectionPath: string
}

export { ContentSection as Page }
