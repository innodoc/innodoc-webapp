import { type SyntheticEvent, useEffect, useRef, useState } from 'react'

import { useSelector } from '@innodoc/ui-store/hooks'
import { isCourseSectionRouteInfo } from '@innodoc/shared-core/routes/typeguards'
import { selectRouteInfo } from '@innodoc/ui-store/slices/app'

/** Return array of expanded section paths/node IDs (including parents) */
function getExpandedWithParents(sectionPath?: string) {
  if (sectionPath === undefined) {
    return []
  }
  const parts = sectionPath.split('/')
  const parents = parts.slice(0, -1).map((_, idx) => parts.slice(0, idx + 1).join('/'))
  return [...parents, sectionPath]
}

const emptySelected: string[] = []

function useManageExpanded() {
  const routeInfo = useSelector(selectRouteInfo)
  const currentSectionPath = isCourseSectionRouteInfo(routeInfo) ? routeInfo.sectionPath : undefined

  // Only add current keys if section change happened, otherwise it would be impossible
  // to close a current subtree.
  const prevSectionPath = useRef<string | null>(null)

  // Expand current and parents
  const expandedWithParents = getExpandedWithParents(currentSectionPath)

  const [expanded, setExpanded] = useState<string[]>(expandedWithParents)

  // Expand parents on section change
  useEffect(() => {
    if (currentSectionPath && currentSectionPath !== prevSectionPath.current) {
      prevSectionPath.current = currentSectionPath

      setExpanded((prevExpanded) =>
        expandedWithParents.reduce(
          (acc, sectionPath) => (acc.includes(sectionPath) ? acc : [...acc, sectionPath]),
          prevExpanded,
        ),
      )
    }
  }, [currentSectionPath, expanded, expandedWithParents, setExpanded])

  // Called when tree item expand button is clicked
  const onNodeToggle = (ev: SyntheticEvent, nodeIds: string[]) => {
    setExpanded([...nodeIds])
  }

  // Currently selected nodes
  const selected = currentSectionPath === undefined ? emptySelected : [currentSectionPath]

  return { expanded, onNodeToggle, selected }
}

export default useManageExpanded
