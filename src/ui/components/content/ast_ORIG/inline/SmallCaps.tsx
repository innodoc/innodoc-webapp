import ContentTree from '#ui/components/content/ast/ContentTree'
import type { ContentComponentProps } from '#ui/components/content/ast/types'

function SmallCaps({ content }: ContentComponentProps<'SmallCaps'>) {
  return (
    <sub>
      <ContentTree content={content} />
    </sub>
  )
}

export default SmallCaps
