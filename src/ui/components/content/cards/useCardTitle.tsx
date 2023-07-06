import { createContext, type ReactNode, useContext, useEffect, useRef } from 'react'

import { selectRouteInfo } from '#store/slices/appSlice'
import { useSelector } from '#ui/hooks/store/store'
import useSelectSection from '#ui/hooks/store/useSelectSection'
import { getSectionNumberFromOrder } from '#utils/content'

/** Provide consistent auto-incrementing numbering for cards within a document */
const CardTitleContext = createContext((id: string | undefined, title: string) => title)

interface Titles {
  [id: string]: string
}

export function CardTitleProvider({ children }: NumberingProviderProps) {
  const titles = useRef<Titles>({})
  const { sectionPath } = useSelector(selectRouteInfo)
  const { section } = useSelectSection(sectionPath)
  const sectionNumber = section ? getSectionNumberFromOrder(section) : 0

  // Reset number on each render
  useEffect(() => {
    titles.current = {}
  }, [children])

  // TODO: format number x.y.z
  // with x = 1st level section number
  // with y = 2nd level section number
  // with z = sequential number for whole subtree
  const formatTitle = (id: string | undefined, title: string) => {
    if (id === undefined) {
      return title
    }
    const ids = Object.keys(titles.current)
    if (!ids.includes(id)) {
      const cardTitle = `${title} ${sectionNumber}.${ids.length + 1}`
      titles.current[id] = cardTitle
    }

    return titles.current[id]
  }

  return <CardTitleContext.Provider value={formatTitle}>{children}</CardTitleContext.Provider>
}

interface NumberingProviderProps {
  children: ReactNode
}

/** Utility for consistent card title numbering within a document */
function useCardTitle(id: string | undefined, title: string) {
  const formatTitle = useContext(CardTitleContext)
  return formatTitle(id, title)
}

export default useCardTitle
