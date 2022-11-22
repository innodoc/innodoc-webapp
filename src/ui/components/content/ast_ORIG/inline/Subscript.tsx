import ContentTree from '#ui/components/content/ast/ContentTree'
import type { ContentComponentProps } from '#ui/components/content/ast/types'

function Subscript({ content }: ContentComponentProps<'Subscript'>) {
  return (
    <sub>
      <ContentTree content={content} />
    </sub>
  )
}

export default Subscript
