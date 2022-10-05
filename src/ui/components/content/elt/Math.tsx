import katex from 'katex'
import { useMemo } from 'react'

import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function Math({ content: [mathType, content] }: ContentComponentProps<'Math'>) {
  if (!['DisplayMath', 'InlineMath'].includes(mathType.t)) {
    throw new Error(`Invalid math type: ${mathType.t}`)
  }

  const displayMode = mathType.t === 'DisplayMath'

  const html = useMemo(
    () =>
      katex.renderToString(content, {
        displayMode,
        errorColor: '#cc0000',
        throwOnError: false,
      }),
    [content, displayMode]
  )

  const Component = displayMode ? 'div' : 'span'
  return <Component dangerouslySetInnerHTML={{ __html: html }} />
}

export default Math
