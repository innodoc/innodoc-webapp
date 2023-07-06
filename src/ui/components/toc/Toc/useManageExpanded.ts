import { type SyntheticEvent, useCallback, useEffect, useRef, useState, useMemo } from 'react'

import { selectRouteInfo } from '#store/slices/appSlice'
import { useSelector } from '#ui/hooks/store/store'

/** Return array of expanded section paths/node IDs (including parents) */
function getExpandedWithParents(sectionPath?: string) {
  if (sectionPath === undefined) {
    return []
  }
  const parts = sectionPath.split('/')
  const parents = parts
    .slice(0, parts.length - 1)
    .map((_, idx) => parts.slice(0, idx + 1).join('/'))
  return [...parents, sectionPath]
}

const emptySelected: string[] = []

function useManageExpanded() {
  const { sectionPath: currentSectionPath } = useSelector(selectRouteInfo)

  // Only add current keys if section change happened, otherwise it would be impossible
  // to close a current subtree.
  const prevSectionPath = useRef<string | null>(null)

  // Expand current and parents
  const expandedWithParents = useMemo(
    () => getExpandedWithParents(currentSectionPath),
    [currentSectionPath]
  )

  const [expanded, setExpanded] = useState<string[]>(expandedWithParents)

  // Expand parents on section change
  useEffect(() => {
    if (currentSectionPath && currentSectionPath !== prevSectionPath.current) {
      prevSectionPath.current = currentSectionPath

      setExpanded((prevExpanded) =>
        expandedWithParents.reduce(
          (acc, sectionPath) => (acc.includes(sectionPath) ? acc : [...acc, sectionPath]),
          prevExpanded
        )
      )
    }
  }, [currentSectionPath, expanded, expandedWithParents, setExpanded])

  // Called when tree item expand button is clicked
  const onNodeToggle = useCallback((ev: SyntheticEvent, nodeIds: string[]) => {
    setExpanded([...nodeIds])
  }, [])

  // Currently selected nodes
  const selected = currentSectionPath !== undefined ? [currentSectionPath] : emptySelected

  return { expanded, onNodeToggle, selected }
}

export default useManageExpanded
