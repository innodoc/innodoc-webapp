import { useEffect } from 'react'

const useAutoExpand = (currentSectionId, expandAll, expandedKeys, setExpandedKeys) =>
  useEffect(() => {
    if (!expandAll && currentSectionId) {
      // current key and all parent keys
      const allKeys = currentSectionId
        .split('/')
        .reduce((acc, id, idx) => [...acc, idx > 0 ? `${acc[idx - 1]}/${id}` : id], [])
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
  }, [currentSectionId, expandAll, expandedKeys, setExpandedKeys])

export default useAutoExpand
