import { type SyntheticEvent, useEffect, useRef, useState } from 'react'
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

  // Expand current and parents
  const expandedWithParents = getExpandedWithParents(currentSectionPath)

  const [expandedItems, setExpandedItems] = useState<string[]>(expandedWithParents)

  // Expand parents on section change
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
  }, [currentSectionPath, expandedItems, expandedWithParents, setExpandedItems])

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

  // Currently selected nodes
  const selectedItems = currentSectionPath === undefined ? emptySelected : [currentSectionPath]

  return { expandedItems, onItemExpansionToggle, selectedItems }
}

export default useManageExpanded
