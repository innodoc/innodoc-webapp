import hastToReact from '#markdown/hastToReact/hastToReact'
import type { RootState } from '#store/makeStore'
import { selectHastResultByHash } from '#store/slices/hastSlice'
import { useSelector } from '#ui/hooks/store/store'

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
