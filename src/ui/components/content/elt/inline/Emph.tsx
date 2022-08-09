import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function Emph({ content }: ContentComponentProps<'Emph'>) {
  return (
    <em>
      <ContentTree content={content} />
    </em>
  )
}

export default Emph
