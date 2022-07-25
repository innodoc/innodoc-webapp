import { useEffect, useRef } from 'react'

// Auto-expand current section subtree
const useAutoExpand = (currentSectionId, expandAll, expandedKeys, setExpandedKeys) => {
  // Only add current keys if section change happened, otherwise it would be impossible
  // to close a current subtree.
  const prevSectionId = useRef()

  useEffect(() => {
    if (!expandAll && currentSectionId && currentSectionId !== prevSectionId.current) {
      prevSectionId.current = currentSectionId

      // Add current and all its parent keys
      const currentSubtreeKeys = currentSectionId
        .split('/')
        .reduce((acc, id, idx) => [...acc, idx > 0 ? `${acc[idx - 1]}/${id}` : id], [])

      setExpandedKeys(new Set([...expandedKeys, ...currentSubtreeKeys]))
    }
  }, [currentSectionId, expandAll, expandedKeys, setExpandedKeys])
}

export default useAutoExpand
