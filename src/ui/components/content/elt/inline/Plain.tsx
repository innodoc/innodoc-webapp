import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function Plain({ content }: ContentComponentProps<'Plain'>) {
  return <ContentTree content={content} />
}

export default Plain
