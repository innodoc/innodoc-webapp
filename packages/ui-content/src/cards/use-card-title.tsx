import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef } from 'react'
import { isCourseSectionRouteInfo } from '@innodoc/shared-core/typeguards'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import { getSectionNumberFromOrder } from '@innodoc/ui-design-system/utils'
import { useSelector, useSelectSection } from '@innodoc/ui-shared/store-hooks'

/** Provide consistent auto-incrementing numbering for cards within a document */
const CardTitleContext = createContext((id: string | undefined, title: string) => title)

type Titles = Record<string, string>

function CardTitleProvider({ children }: NumberingProviderProperties) {
  const titlesRef = useRef<Titles>({})
  const routeInfo = useSelector(selectRouteInfo)
  const sectionPath = isCourseSectionRouteInfo(routeInfo) ? routeInfo.sectionPath : undefined
  const { section } = useSelectSection(sectionPath)
  const sectionNumber = section ? getSectionNumberFromOrder(section) : 0

  // Reset number on each render
  useEffect(() => {
    titlesRef.current = {}
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
      const ids = Object.keys(titlesRef.current)
      if (!ids.includes(id)) {
        const cardTitle = `${title} ${String(sectionNumber)}.${String(ids.length + 1)}`
        titlesRef.current[id] = cardTitle
      }

      return titlesRef.current[id] ?? ''
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
