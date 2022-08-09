import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function Subscript({ content }: ContentComponentProps<'Subscript'>) {
  return (
    <sub>
      <ContentTree content={content} />
    </sub>
  )
}

export default Subscript
