import ContentTree from '#ui/components/content/ast/ContentTree'
import type { ContentComponentProps } from '#ui/components/content/ast/types'

function Strikeout({ content }: ContentComponentProps<'Strikeout'>) {
  return (
    <s>
      <ContentTree content={content} />
    </s>
  )
}

export default Strikeout
