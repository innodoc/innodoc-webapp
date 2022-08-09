import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function Span({ content: [, content] }: ContentComponentProps<'Span'>) {
  // TODO: support InputHint, Question, index terms, color style
  return (
    <span>
      <ContentTree content={content} />
    </span>
  )
}

export default Span
