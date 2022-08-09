import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function Note({ content }: ContentComponentProps<'Note'>) {
  // TODO: support footnotes?
  return <ContentTree content={content} />
}

export default Note
