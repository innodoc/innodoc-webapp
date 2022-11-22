import ContentTree from '#ui/components/content/ast/ContentTree'
import type { ContentComponentProps } from '#ui/components/content/ast/types'

function Emph({ content }: ContentComponentProps<'Emph'>) {
  return (
    <em>
      <ContentTree content={content} />
    </em>
  )
}

export default Emph
