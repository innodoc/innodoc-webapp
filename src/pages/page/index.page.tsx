import { RootState } from '@/store/makeStore'
import { selectPageById } from '@/store/selectors/content'
import { selectLocale } from '@/store/selectors/ui'
import { useGetPageContentQuery } from '@/store/slices/contentApi'
import { Page } from '@/types/api'
import PageHeader from '@/ui/components/common/PageHeader'
import ContentTree from '@/ui/components/content/ContentTree'
import { useSelector } from '@/ui/hooks/store'

function ContentPage({ pageId }: ContentPageProps) {
  const selectPage = (state: RootState) => selectPageById(state, pageId)
  const page = useSelector(selectPage)
  const locale = useSelector(selectLocale)
  const { data: content } = useGetPageContentQuery({ locale, id: pageId })

  if (page === undefined || content === undefined) {
    return null
  }

  return (
    <>
      <PageHeader iconName={page.icon}>{page.title}</PageHeader>
      <ContentTree content={content} />
    </>
  )
}

type ContentPageProps = {
  pageId: Page['id']
}

export { ContentPage as Page }
