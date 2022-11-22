import type { ContentComponentProps } from '#ui/components/content/ast/types'

function SoftBreak({}: ContentComponentProps<'SoftBreak'>) {
  return <>&shy;</>
}

export default SoftBreak
