import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function Cite({ content: [, content] }: ContentComponentProps<'Cite'>) {
  return <ContentTree content={content} />
}

export default Cite
