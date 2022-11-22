import ContentTree from '#ui/components/content/ast/ContentTree'
import type { ContentComponentProps } from '#ui/components/content/ast/types'

function Cite({ content: [, content] }: ContentComponentProps<'Cite'>) {
  return <ContentTree content={content} />
}

export default Cite
