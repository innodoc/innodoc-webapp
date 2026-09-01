import { type SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react'
import { isCourseSectionRouteInfo } from '@innodoc/shared-core/typeguards'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import { useSelector } from '@innodoc/ui-shared/store-hooks'

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

  // Stable reference for an unchanged path, so the effect below only fires on real section changes
  const expandedWithParents = useMemo(() => getExpandedWithParents(currentSectionPath), [currentSectionPath])

  const [expandedItems, setExpandedItems] = useState<string[]>(expandedWithParents)

  // Expand parents on section change. `expandedItems` is deliberately not a dependency: the
  // updater form of `setExpandedItems` already reads the previous state, and an unstable dep
  // here would re-run the effect after every render, only stopped by the `prevSectionPath` guard.
  useEffect(() => {
    if (currentSectionPath && currentSectionPath !== prevSectionPath.current) {
      prevSectionPath.current = currentSectionPath

      setExpandedItems((prevExpanded) => {
        const newExpanded: string[] = [...prevExpanded]

        for (const sectionPath of expandedWithParents) {
          if (!newExpanded.includes(sectionPath)) {
            newExpanded.push(sectionPath)
          }
        }

        return newExpanded
      })
    }
  }, [currentSectionPath, expandedWithParents])

  // Called when tree item expand button is clicked
  const onItemExpansionToggle = (ev: SyntheticEvent | null, itemId: string, isExpanded: boolean) => {
    setExpandedItems((prev) => {
      if (isExpanded) {
        const pos = prev.indexOf(itemId)
        return pos === -1 ? [...prev, itemId] : prev
      }
      return prev.filter((id) => id !== itemId)
    })
  }

  // Currently selected nodes; stable reference while the path is unchanged, so the tree view
  // can skip re-renders from this prop
  const selectedItems = useMemo(
    () => (currentSectionPath === undefined ? emptySelected : [currentSectionPath]),
    [currentSectionPath],
  )

  return { expandedItems, onItemExpansionToggle, selectedItems }
}

export default useManageExpanded
