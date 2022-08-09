import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function SmallCaps({ content }: ContentComponentProps<'SmallCaps'>) {
  return (
    <sub>
      <ContentTree content={content} />
    </sub>
  )
}

export default SmallCaps
