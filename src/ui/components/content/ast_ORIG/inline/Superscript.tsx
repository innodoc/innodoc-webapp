import ContentTree from '#ui/components/content/ast/ContentTree'
import type { ContentComponentProps } from '#ui/components/content/ast/types'

function Superscript({ content }: ContentComponentProps<'Superscript'>) {
  return (
    <sup>
      <ContentTree content={content} />
    </sup>
  )
}

export default Superscript
