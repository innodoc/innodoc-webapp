import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef } from 'react'

import { useSelector, useSelectSection } from '@innodoc/hooks'
import { isCourseSectionRouteInfo } from '@innodoc/routes/typeGuards'
import { selectRouteInfo } from '@innodoc/store/slices/app'
import { getSectionNumberFromOrder } from '@innodoc/components-common/utils'

/** Provide consistent auto-incrementing numbering for cards within a document */
const CardTitleContext = createContext((id: string | undefined, title: string) => title)

type Titles = Record<string, string>

function CardTitleProvider({ children }: NumberingProviderProperties) {
  const titles = useRef<Titles>({})
  const routeInfo = useSelector(selectRouteInfo)
  const sectionPath = isCourseSectionRouteInfo(routeInfo) ? routeInfo.sectionPath : undefined
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
  const formatTitle = useMemo(
    () => (id: string | undefined, title: string) => {
      if (id === undefined) {
        return title
      }
      const ids = Object.keys(titles.current)
      if (!ids.includes(id)) {
        const cardTitle = `${title} ${sectionNumber}.${ids.length + 1}`
        titles.current[id] = cardTitle
      }

      return titles.current[id] ?? ''
    },
    [sectionNumber],
  )

  return <CardTitleContext.Provider value={formatTitle}>{children}</CardTitleContext.Provider>
}

interface NumberingProviderProperties {
  children: ReactNode
}

/** Utility for consistent card title numbering within a document */
function useCardTitle(id: string | undefined, title: string) {
  const formatTitle = useContext(CardTitleContext)
  return formatTitle(id, title)
}

export { CardTitleProvider }
export default useCardTitle
