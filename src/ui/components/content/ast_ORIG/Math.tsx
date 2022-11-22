import katex from 'katex'
import { useMemo } from 'react'

import InlineError from '#ui/components/common/InlineError'
import type { ContentComponentProps } from '#ui/components/content/ast/types'

function MemoizedMath({ content, displayMode }: MemoizedMathProps) {
  const html = useMemo(
    () =>
      katex.renderToString(content, {
        displayMode,
        errorColor: '#cc0000',
        throwOnError: false,
      }),
    [content, displayMode]
  )

  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

type MemoizedMathProps = {
  content: string
  displayMode: boolean
}

function Math({ content: [mathType, content] }: ContentComponentProps<'Math'>) {
  if (!['DisplayMath', 'InlineMath'].includes(mathType.t)) {
    return <InlineError>Invalid math type: {mathType.t}</InlineError>
  }

  return <MemoizedMath content={content} displayMode={mathType.t === 'DisplayMath'} />
}

export default Math
