import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function Code({ content: [, content] }: ContentComponentProps<'Code'>) {
  return <code>{content}</code>
}

export default Code
