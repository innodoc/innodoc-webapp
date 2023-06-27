import { useMemo } from 'react'

import hastToReact from '#markdown/hastToReact'
import type { HastRoot } from '#markdown/markdownToHast/markdownToHast'
import type { RootState } from '#store/makeStore'
import { makeSelectHastRootByHash } from '#store/slices/hastSlice'
import { useSelector } from '#ui/hooks/store/store'

const emptyRoot: HastRoot = {
  children: [],
  type: 'root',
}

function HastNode({ hash }: HastNodeProps) {
  const selectHastRootByHash = useMemo(makeSelectHastRootByHash, [])
  const hastRootSelector = (state: RootState) => selectHastRootByHash(state, hash)
  const hast = useSelector(hastRootSelector)

  return hastToReact(hast ?? emptyRoot)
}

interface HastNodeProps {
  hash?: string
}

export default HastNode
