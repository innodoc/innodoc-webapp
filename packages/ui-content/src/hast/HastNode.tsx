import { type ReactNode, useMemo } from 'react'
import { selectHastResultByHash } from '@innodoc/shared-store/slices/hast'
import type { RootState } from '@innodoc/shared-store/types'
import { useSelector } from '@innodoc/ui-shared/store-hooks'
import hastToReact from './hast-to-react/hast-to-react.js'
import MarkdownParserError from './MarkdownParserError.js'

function HastNode({ hash }: HastNodeProps): ReactNode {
  const hastResultSelector = (state: RootState) => selectHastResultByHash(state, hash ?? '')
  const hastResult = useSelector(hastResultSelector)

  // Memoised on the store result: the AST -> React conversion is the largest un-memoised derivation
  // in the app, and its output feeds the whole content tree below. Do not key on the unified
  // processor - it is environment-bound (see hast-to-react.ts), the memo must key on data.
  const node = useMemo(() => {
    if (hastResult?.error !== undefined) {
      return <MarkdownParserError error={hastResult.error} />
    }
    if (hastResult?.root !== undefined) {
      return hastToReact(hastResult.root)
    }
    return null
  }, [hastResult])

  return node
}

interface HastNodeProps {
  hash?: string
}

export default HastNode
