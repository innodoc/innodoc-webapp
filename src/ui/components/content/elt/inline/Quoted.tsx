import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function Quoted({ content: [{ t: quoteType }, content] }: ContentComponentProps<'Quoted'>) {
  return (
    <>
      {quoteType === 'SingleQuote' ? <>&lsquo;</> : <>&ldquo;</>}
      <ContentTree content={content} />
      {quoteType === 'SingleQuote' ? <>&rsquo;</> : <>&rdquo;</>}
    </>
  )
}

export default Quoted
