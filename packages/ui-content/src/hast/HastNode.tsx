import type { ReactNode } from 'react'
import { selectHastResultByHash } from '@innodoc/shared-store/slices/hast'
import type { RootState } from '@innodoc/shared-store/types'
import { useSelector } from '@innodoc/ui-shared/store-hooks'
import hastToReact from './hast-to-react/hast-to-react.js'
import MarkdownParserError from './MarkdownParserError.js'

function HastNode({ hash }: HastNodeProps): ReactNode {
  const hastResultSelector = (state: RootState) => selectHastResultByHash(state, hash ?? '')
  const hastResult = useSelector(hastResultSelector)

  if (hastResult === undefined) {
    return null
  }

  if (hastResult.error !== undefined) {
    return <MarkdownParserError error={hastResult.error} />
  }

  if (hastResult.root !== undefined) {
    return hastToReact(hastResult.root)
  }

  return null
}

interface HastNodeProps {
  hash?: string
}

export default HastNode
