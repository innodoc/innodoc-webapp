import ContentTree from '#ui/components/content/ast/ContentTree'
import type { ContentComponentProps } from '#ui/components/content/ast/types'

function Plain({ content }: ContentComponentProps<'Plain'>) {
  return <ContentTree content={content} />
}

export default Plain
