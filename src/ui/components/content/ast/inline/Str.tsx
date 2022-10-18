import type { ContentComponentProps } from '@/ui/components/content/ast/types'

function Str({ content }: ContentComponentProps<'Str'>) {
  return <>{content}</>
}

export default Str
