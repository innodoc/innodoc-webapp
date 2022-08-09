import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function Strong({ content }: ContentComponentProps<'Strong'>) {
  return (
    <strong>
      <ContentTree content={content} />
    </strong>
  )
}

export default Strong
