import ContentTree from '#ui/components/content/ast/ContentTree'
import type { ContentComponentProps } from '#ui/components/content/ast/types'

function Note({ content }: ContentComponentProps<'Note'>) {
  // TODO: support footnotes?
  return <ContentTree content={content} />
}

export default Note
