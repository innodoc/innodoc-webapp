import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function Superscript({ content }: ContentComponentProps<'Superscript'>) {
  return (
    <sup>
      <ContentTree content={content} />
    </sup>
  )
}

export default Superscript
