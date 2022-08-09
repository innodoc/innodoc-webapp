import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function Str({ content }: ContentComponentProps<'Str'>) {
  return <>{content}</>
}

export default Str
