import type { RootState } from '@innodoc/store/types'

import { selectHastResultByHash } from '@innodoc/store/slices/hast'

import { useSelector } from '#hooks/store'

import hastToReact from './hastToReact'
import MarkdownParserError from './MarkdownParserError'

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
