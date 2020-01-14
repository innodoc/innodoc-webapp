import { useEffect } from 'react'

const useAutoExpand = (
  currentSection,
  expandAll,
  expandedKeys,
  setExpandedKeys
) =>
  useEffect(() => {
    if (!expandAll && currentSection) {
      // current key and all parent keys
      const allKeys = currentSection
        .split('/')
        .reduce(
          (acc, id, idx) => [...acc, idx > 0 ? `${acc[idx - 1]}/${id}` : id],
          []
        )
      // add all keys
      let newExpandedKeys = [...expandedKeys]
      let changed = false
      allKeys.forEach((key) => {
        if (!expandedKeys.includes(key)) {
          changed = true
          newExpandedKeys = [...newExpandedKeys, key]
        }
      })
      if (changed) {
        setExpandedKeys(newExpandedKeys)
      }
    }
  }, [currentSection, expandAll, expandedKeys, setExpandedKeys])

export default useAutoExpand
