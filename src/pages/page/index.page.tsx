import { Typography } from '@mui/material'

import { RootState } from '@/store/makeStore'
import { selectPageById } from '@/store/selectors/content'
import { Page } from '@/types/api'
import { useSelector } from '@/ui/hooks/store'

function ContentPage({ pageId }: ContentPageProps) {
  const selectPage = (state: RootState) => selectPageById(state, pageId)
  const page = useSelector(selectPage)

  if (page === undefined) {
    return null
  }

  return <Typography variant="h2">{page.title}</Typography>
}

type ContentPageProps = {
  pageId: Page['id']
}

export { ContentPage as Page }
