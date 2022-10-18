import ContentTree from '@/ui/components/content/ast/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/ast/types'

function Strong({ content }: ContentComponentProps<'Strong'>) {
  return (
    <strong>
      <ContentTree content={content} />
    </strong>
  )
}

export default Strong
