import { useSelector } from '@innodoc/hooks'
import { selectHastResultByHash } from '@innodoc/store/slices/hast'
import type { RootState } from '@innodoc/store/types'

import hastToReact from './hastToReact/hastToReact.js'
import MarkdownParserError from './MarkdownParserError.js'

function HastNode({ hash }: HastNodeProps) {
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
