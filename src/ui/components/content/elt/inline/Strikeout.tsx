import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function Strikeout({ content }: ContentComponentProps<'Strikeout'>) {
  return (
    <s>
      <ContentTree content={content} />
    </s>
  )
}

export default Strikeout
